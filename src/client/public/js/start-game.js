// public/game/start-game.js
document.addEventListener("DOMContentLoaded", () => {
  window.oMain = new GTMain({
                    stack_velocity: 15, //SUBTRACT THIS SCORE EVERY FAILED LAUNCH
                    audio_enable_on_startup:true, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                    fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
                    check_orientation:true,     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                    
                });
});
