window.onload = start;
const PI = Math.PI;
const TWO_PI = 2*Math.PI;
const Planet1Distance = 1;
const IntroText = ["Welcome","To space game","woop woop"];
const grey = "#eee8";
const white = "#fffc";

let player;
let gameloop;
let camera;
let planets = [];
let gamestate = "startscreen";
let intro = -1;



function start(){

  loadImages();
  setupCanvas();

  gameloop = setInterval(run,40);
}





function run(){
  mCtx.save();
  // background
  mCtx.fillStyle = "#2a1f42";
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);

  // start screen
  if(gamestate=="startscreen")
    runStartScreen();

  // if game is running
  else if(gamestate=="game")
    runGame();

  else if(gamestate=="focused")
    focusedMode();

  mCtx.restore();
}


function focusedMode(){

  player.update();
  camera.update();

  let x = middle.x-90;
  let y = middle.y+50;
  drawText(IntroText[intro],x,y,white);
  y += 12;
  drawText("press space to continue",x,y,grey);

  inputsForPlayerOnPlanet()

  // (key input in player.js:keyDown)
}


// runStartScreen()
//
//
function runStartScreen (){


  let x = 200;
  let y = middle.y;
  drawText("space game",x, y,white)
  y+=12;
  drawText("press space to start",x,y,grey)
  y+=12;
  drawText("press c for controls",x,y,grey);

  if(inputs.space) startGame();
}



// startGame()
//
//
function startGame(){
  gamestate = "focused"
  startSound();
  intro =0;
  setupPlayer();
  setupStars();
  camera = new Camera(player);
  camera.targetIsDude();
  setupPlanets();
}



// runGame()
//
//
function runGame(){

  updateStars();

  player.displayRadar();
  updateAll(planets);

  HandlePlayerInputs();
  player.dude.preRot = -player.bearing;
  player.update();
  resetPlayerOnCrash();

  camera.update();
  updatePlayerUi();
}
