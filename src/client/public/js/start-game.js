// public/game/start-game.js
document.addEventListener("DOMContentLoaded", () => {
  window.oMain = new CMain({
                    stack_velocity: 15, //SUBTRACT THIS SCORE EVERY FAILED LAUNCH
                    audio_enable_on_startup:true, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                    fullscreen: false, 
                    check_orientation:true,     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                    
                });
});
