import { context, reddit } from "@devvit/web/server";

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error("subredditName is required");
  }
  
  const today = new Date().toISOString().slice(0, 10); // e.g., "2024-06-07"
  
  return await reddit.submitCustomPost({
    splash: { // Splash Screen Configuration
      appDisplayName: 'ghost-tower ' , 
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Start playing!',
      description: '(' + today + ')' + ' careful materials might not be perfectly aligned',
      entryUri: 'index.html',
      heading: 'Ghost Tower! #' +  today.charAt(8) + today.charAt(9),
      appIconUri: 'default-icon.png',
      textColorHex: '#FFFFFF',
      // backgroundColorHex: '#000000',
    },
    postData: {
      gameState: 'initial',
      score: 0
    },
    subredditName: subredditName,
    title: "ghost-tower1",
  });
};
