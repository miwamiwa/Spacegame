window.onload = start;
const PI = Math.PI;
const TWO_PI = 2*Math.PI;
const Planet1Distance = 1;

let player;
let gameloop;
let camera;
let planets = [];


function start(){

  //startSound();

  loadImages();

  createNewTreeType()
  setupCanvas();
  setupPlayer();
  console.log(player)
  setupStars();
  camera = new Camera(player);
  camera.targetIsDude();

  setupPlanets();

//  console.log("we got here")
  gameloop = setInterval(run,40);
}

function run(){
  //console.log("this is when run starts")
  mCtx.save();
  // background
  mCtx.fillStyle = "#2a1f42";
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);

  //camera.rotateCam();

  updateStars();

  player.displayRadar();

  // update planets
  updateAll(planets);



  // update player
  HandlePlayerInputs();


  player.dude.preRot = -player.bearing;

  //console.log(player)

  player.update();

  //console.log(player)
  resetPlayerOnCrash();


  camera.update();

  mCtx.restore();

  updatePlayerUi();



}
