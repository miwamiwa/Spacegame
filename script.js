window.onload = start;
const PI = Math.PI;
const TWO_PI = 2*Math.PI;
const Planet1Distance = 500;

let player;
let gameloop;
let camera;
let planets = [];


function start(){

  loadImages();
  setupCanvas();
  setupPlayer();
  setupStars();
  camera = new Camera(player);

  // place a planet below player
  planets.push(new Planet(player.x,player.y));
  planets[0].y += planets[0].radius + Planet1Distance;

  gameloop = setInterval(run,40);
}

function run(){

  mCtx.save();
  // background
  mCtx.fillStyle = "#2a1f42";
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);

  camera.rotateCam();

  updateStars();

  // update planets
  updateAll(planets);

  // update player
  HandlePlayerInputs();
  player.update();
  resetPlayerOnCrash();
  camera.update();

  mCtx.restore();

  updatePlayerUi();
  player.displayRadar();


}
