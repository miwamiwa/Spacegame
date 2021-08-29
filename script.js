

let player;
let gameloop;
let camera;
let planets = [];
let gamestate = "startscreen";
let intro = -1;


// start gameon page load
window.onload = ()=>{
  loadImages();
  setupCanvas();
  gameloop = setInterval(run,40);
}


// run()
//
// main game loop
let run=()=>{
  mCtx.save();
  // background
  bg();

  // run start screen
  if(gamestate=="startscreen")
    runStartScreen();

  // run game
  else if(gamestate=="game")
    runGame();

  // run "focused mode"
  else if(gamestate=="focused")
    focusedMode();

  mCtx.restore();
}

// bg ()
//
// draw background

let bg=()=>{
  mCtx.fillStyle = "#2a1f42";
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
}

// focusedMode()
//
// draw only an empty background, some text and the player.

let focusedMode=()=>{

  player.update();
  camera.update();

  let x = middle.x-90;
  let y = middle.y+50;
  drawText(IntroText[intro],x,y,white);
  y += 12;
  drawText("press space to continue",x,y,grey);

}


// runStartScreen()
//
//
let runStartScreen=()=>{


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
let startGame=()=>{
  gamestate = "focused"
  //startSound();
  intro =0;
  setupPlayer();
  setupStars();
  camera = new Camera(player);
  camera.targetIsDude();
  setupPlanets();
  player.nearestPlanet = HomePlanet;
  playerLanded()
}



// runGame()
//
//
let runGame=()=>{

  trackQuests();
  updateStars();

  player.displayRadar();
  updateAll(planets);

  HandlePlayerInputs();

  player.update();
  resetPlayerOnCrash();

  camera.update();
  updatePlayerUi();
}
