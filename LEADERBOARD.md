---
name: LEADERBOARD
description: Add professional LEADERBOARD to HTML websites with 
#  localStorage persistence
version: 1.0.0
---

# Dark Mode Toggle Skill

## Overview
This Skill provides a standardized implementation for creating dynamic leaderboards in web applications. Use this when users request ranking systems, score tracking.

## When to Use This Skill
- User asks to "create a leaderboard"
- User wants a "ranking system" or "score tracker"
- User mentions displaying "top players" or "high scores"

## Implementation Pattern

### HTML Structure
Add leaderboard container with entry elements:

```html
<div id="leaderboard-container">
  <div class="leaderboard-header">
    <h1>Leaderboard</h1>
    <button id="reset-btn" class="reset-button">Reset</button>
  </div>
  <div id="leaderboard" class="leaderboard">
    <div class="leaderboard-header-row">
      <div class="rank">Rank</div>
      <div class="name">Name</div>
      <div class="score">Score</div>
    </div>
    <div id="leaderboard-entries"></div>
  </div>
  <div class="add-entry">
    <input type="text" id="player-name" placeholder="Player name">
    <input type="number" id="player-score" placeholder="Score">
    <button id="add-btn" class="add-button">Add Entry</button>
  </div>
</div>
```

### CSS Variables and Theming
Implement using CSS custom properties:
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --accent: #3b82f6;
  --card-bg: #f5f5f5;
  --border-color: #e5e7eb;
}

#leaderboard-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.leaderboard {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--card-bg);
  margin-bottom: 20px;
}

.leaderboard-header-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  padding: 12px 16px;
  background: var(--accent);
  color: white;
  font-weight: 600;
  gap: 16px;
}

.leaderboard-entry {
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  gap: 16px;
  transition: background-color 0.2s ease;
}

.leaderboard-entry:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.leaderboard-entry:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.01);
}

.rank {
  font-weight: 600;
  color: var(--accent);
  text-align: center;
}

.score {
  text-align: right;
  font-weight: 500;
}

.add-entry {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.add-entry input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.add-button, .reset-button {
  padding: 10px 20px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.add-button:hover, .reset-button:hover {
  background-color: #2563eb;
}

.reset-button {
  padding: 8px 16px;
  font-size: 14px;
}
```

### JavaScript Logic
Implement with Redis persistence:
```javascript
Add/Update a Player's Score
Use zAdd to add or update a player's score in the sorted set. The key should include the current day to ensure scores are tracked per day (e.g., leaderboard:2024-06-07).

const today = new Date().toISOString().slice(0, 10); // e.g., "2024-06-07"
const leaderboardKey = `leaderboard:${today}`;

await context.redis.zAdd(
  leaderboardKey,
  { member: username, score: playerScore }
);
Replace username and playerScore with the actual values for the player.

2. Get the Top 10 Scores
Use zRange with the by: 'score' option and reverse the order to get the highest scores first. Since Redis sorted sets are sorted in ascending order by default, you may need to fetch the last 10 and reverse them in your code.

const topScores = await context.redis.zRange(
  leaderboardKey,
  -10, // start from the 10th from the end
  -1,  // to the last element
  { by: 'score' }
);

// Reverse to show highest first
topScores.reverse();

topScores.forEach((entry, index) => {
  console.log(`#${index + 1}: ${entry.member} - ${entry.score}`);
});
This will print the top 10 players and their scores for the current day.

3. Example Combined
async function updateAndShowLeaderboard(context, username, playerScore) {
  const today = new Date().toISOString().slice(0, 10);
  const leaderboardKey = `leaderboard:${today}`;

  // Add or update the player's score
  await context.redis.zAdd(
    leaderboardKey,
    { member: username, score: playerScore }
  );

  // Get the top 10 scores (highest first)
  let topScores = await context.redis.zRange(
    leaderboardKey,
    -10,
    -1,
    { by: 'score' }
  );
  topScores = topScores.reverse();

  // Display leaderboard
  topScores.forEach((entry, index) => {
    console.log(`#${index + 1}: ${entry.member} - ${entry.score}`);
  });
}

// class Leaderboard {
//   constructor() {
//     this.entries = this.loadFromStorage() || [];
//     this.addBtn = document.getElementById('add-btn');
//     this.resetBtn = document.getElementById('reset-btn');
//     this.nameInput = document.getElementById('player-name');
//     this.scoreInput = document.getElementById('player-score');
    
//     this.addBtn.addEventListener('click', () => this.addEntry());
//     this.resetBtn.addEventListener('click', () => this.reset());
//     this.nameInput.addEventListener('keypress', (e) => {
//       if (e.key === 'Enter') this.addEntry();
//     });
    
//     this.render();
//   }
  
//   addEntry() {
//     const name = this.nameInput.value.trim();
//     const score = parseInt(this.scoreInput.value);
    
//     if (!name || isNaN(score)) {
//       alert('Please enter a valid name and score');
//       return;
//     }
    
//     this.entries.push({ name, score });
//     this.entries.sort((a, b) => b.score - a.score);
//     this.saveToStorage();
//     this.render();
//     this.nameInput.value = '';
//     this.scoreInput.value = '';
//   }
  
//   render() {
//     const container = document.getElementById('leaderboard-entries');
//     container.innerHTML = this.entries.map((entry, index) => `
//       <div class="leaderboard-entry">
//         <div class="rank">#${index + 1}</div>
//         <div class="name">${entry.name}</div>
//         <div class="score">${entry.score.toLocaleString()}</div>
//       </div>
//     `).join('');
//   }
  
//   reset() {
//     if (confirm('Clear all entries?')) {
//       this.entries = [];
//       this.saveToStorage();
//       this.render();
//     }
//   }
  
//   saveToStorage() {
//     localStorage.setItem('leaderboard', JSON.stringify(this.entries));
//   }
  
//   loadFromStorage() {
//     const data = localStorage.getItem('leaderboard');
//     return data ? JSON.parse(data) : null;
//   }
// }

// new Leaderboard();
```

## Quality Checklist
-  button visible in menu 
- Leaderboard displays entries sorted by score (highest first)
- leaderboard visible when user clicks button
- Add new entries with name  or current user  
   const currentUserName = await context.reddit.getCurrentUsername() ??'defaultUsername';
    return currentUserName;


