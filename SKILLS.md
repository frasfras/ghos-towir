---
name: Dark Mode Toggle
description: Add professional dark mode toggle to HTML websites with smooth transitions and localStorage persistence
version: 1.0.0
---

# Dark Mode Toggle Skill

## Overview
This Skill provides a standardized implementation for adding dark mode functionality to HTML websites. Use this when users request dark mode, theme toggles, or light/dark switching capabilities.

## When to Use This Skill
- User asks to "add dark mode"
- User wants a "theme toggle" or "light/dark switch"
- User mentions making the site "dark mode compatible"

## Implementation Pattern

### HTML Structure
Add this toggle button to the body element:
```html
<button id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
```

### CSS Variables and Theming
Implement using CSS custom properties:
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --card-bg: #f5f5f5;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --card-bg: #2d2d2d;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

#theme-toggle {
  position: fixed;
  top: 40px;
  right: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 50%;
  background: var(--card-bg);
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

#theme-toggle:hover {
  transform: scale(1.1);
}
```

### JavaScript Logic
Implement with localStorage persistence:
```javascript
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

// Toggle functionality
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.getAttribute('data-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});
```

## Quality Checklist
- Toggle button visible in middle
- Smooth transition between themes (0.3s)
- Theme preference persists across page reloads
- Emoji icon updates based on current theme
- All existing elements adapt to theme variables
- Accessible with keyboard navigation

# LEADERBOARD
