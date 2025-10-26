// Dark Mode Toggle Functionality
(function() {
    'use strict';
    
    function initDarkMode() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }
        
        // Get current theme from localStorage or default to dark (since game was originally dark)
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Set global theme variable
        window.CURRENT_THEME = currentTheme;
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        
        // Update canvas background if it exists
        updateCanvasBackground(currentTheme);
        
        // Toggle functionality
        themeToggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
            
            // Update canvas background
            updateCanvasBackground(newTheme);
            
            // Trigger custom event for game to respond to theme change
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: newTheme } 
            }));
        });
    }
    
    function updateCanvasBackground(theme) {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            // The canvas background is handled by CSS variables now
            // But we can also update the canvas context if needed
            const ctx = canvas.getContext('2d');
            if (ctx && window.s_oStage) {
                // If the game stage exists, we might want to update it
                // This depends on how the game handles background colors
            }
        }
        
        // Update global theme variable for the game to use
        window.CURRENT_THEME = theme;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }
})();