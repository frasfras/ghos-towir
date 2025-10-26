export type InitResponse = {
  type: "init";
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: "increment";
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: "decrement";
  postId: string;
  count: number;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  timestamp: number;
};

export type SaveScoreRequest = {
  score: number;
};

export type SaveScoreResponse = {
  type: "save-score";
  success: boolean;
  rank?: number;
};

export type LeaderboardResponse = {
  type: "leaderboard";
  entries: LeaderboardEntry[];
};
