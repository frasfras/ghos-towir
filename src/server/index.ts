import express from "express";
import {
  InitResponse,
  IncrementResponse,
  DecrementResponse,
  SaveScoreRequest,
  SaveScoreResponse,
  LeaderboardResponse,
  LeaderboardEntry,
} from "../shared/types/api";
import {
  createServer,
  context,
  getServerPort,
  reddit,
  redis,
} from "@devvit/web/server";
import { createPost } from "./core/post";

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

router.get<
  { postId: string },
  InitResponse | { status: string; message: string }
>("/api/init", async (_req, res): Promise<void> => {
  const { postId } = context;

  if (!postId) {
    console.error("API Init Error: postId not found in devvit context");
    res.status(400).json({
      status: "error",
      message: "postId is required but missing from context",
    });
    return;
  }

  try {
    const [count, username] = await Promise.all([
      redis.get("count"),
      reddit.getCurrentUsername(),
    ]);

    res.json({
      type: "init",
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? "anonymous",
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = "Unknown error during initialization";
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    res.status(400).json({ status: "error", message: errorMessage });
  }
});

router.post<
  { postId: string },
  IncrementResponse | { status: string; message: string },
  unknown
>("/api/increment", async (_req, res): Promise<void> => {
  const { postId } = context;
  if (!postId) {
    res.status(400).json({
      status: "error",
      message: "postId is required",
    });
    return;
  }

  res.json({
    count: await redis.incrBy("count", 1),
    postId,
    type: "increment",
  });
});

router.post<
  { postId: string },
  DecrementResponse | { status: string; message: string },
  unknown
>("/api/decrement", async (_req, res): Promise<void> => {
  const { postId } = context;
  if (!postId) {
    res.status(400).json({
      status: "error",
      message: "postId is required",
    });
    return;
  }

  res.json({
    count: await redis.incrBy("count", -1),
    postId,
    type: "decrement",
  });
});

// Helper function to get today's date key for daily leaderboards
function getTodayKey(): string {
  const today = new Date();
  return `leaderboard:${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

router.post<
  {},
  SaveScoreResponse | { status: string; message: string },
  SaveScoreRequest
>("/api/save-score", async (req, res): Promise<void> => {
  try {
    const { score } = req.body;
    const username = await reddit.getCurrentUsername();
    
    if (!username) {
      res.status(400).json({
        status: "error",
        message: "User not authenticated",
      });
      return;
    }

    if (typeof score !== 'number' || score < 0) {
      res.status(400).json({
        status: "error",
        message: "Invalid score",
      });
      return;
    }

    const todayKey = getTodayKey();
    const timestamp = Date.now();
    
    // Create a unique member key with username and timestamp to allow multiple entries per user
    const memberKey = `${username}:${timestamp}`;
    
    // Add to sorted set with score as the sort value using correct Devvit API
    await redis.zAdd(todayKey, { member: memberKey, score: score });
    
    // Set expiration for 7 days to clean up old leaderboards
    await redis.expire(todayKey, 7 * 24 * 60 * 60);
    
    // Get user's rank by getting all scores and finding position
    const allScores = await redis.zRange(todayKey, 0, -1, { by: 'rank' });
    const userRank = allScores.findIndex(entry => entry.member === memberKey) + 1;
    
    res.json({
      type: "save-score",
      success: true,
      rank: userRank > 0 ? userRank : undefined,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to save score",
    });
  }
});

router.get<
  {},
  LeaderboardResponse | { status: string; message: string }
>("/api/leaderboard", async (_req, res): Promise<void> => {
  try {
    const todayKey = getTodayKey();
    
    // Get top 10 scores in descending order (highest first)
    // Using rank-based range to get top entries
    const results = await redis.zRange(todayKey, -10, -1, { by: 'rank' });
    
    const entries: LeaderboardEntry[] = [];
    
    // Parse the results and reverse to get highest scores first
    results.reverse().forEach(result => {
      try {
        const [username, timestampStr] = result.member.split(':');
        const timestamp = parseInt(timestampStr) || Date.now();
        
        entries.push({
          username,
          score: result.score,
          timestamp,
        });
      } catch (parseError) {
        console.error("Error parsing leaderboard entry:", parseError);
      }
    });
    
    res.json({
      type: "leaderboard",
      entries,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch leaderboard",
    });
  }
});

router.post("/internal/on-app-install", async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: "success",
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: "error",
      message: "Failed to create post",
    });
  }
});

router.post("/internal/menu/post-create", async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: "error",
      message: "Failed to create post",
    });
  }
});

app.use(router);

const server = createServer(app);
server.on("error", (err) => console.error(`server error; ${err.stack}`));
server.listen(getServerPort());
