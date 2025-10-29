var stage;
var canvas;
var WIDTH;
var HEIGHT;

// function init() {
    document.addEventListener("DOMContentLoaded", () => {
    // WIDTH = window.innerWidth;
    // HEIGHT = window.innerHeight;
    // stage = new createjs.Stage("canvas");
    canvas = document.getElementById("canvas");
    resizeCanvas();
    // canvas.width = WIDTH;
    // canvas.height = HEIGHT;

    window.oMain = new CMain({
        stack_velocity: 15, 
        audio_enable_on_startup:true, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
        fullscreen: false, 
        check_orientation:true,     
    })});

function resizeCanvas() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    // var canvas = document.getElementById("canvas");
    canvas.width = WIDTH/2;
    canvas.height = HEIGHT/2;
}    