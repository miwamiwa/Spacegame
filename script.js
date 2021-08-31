// game objects
let player;
let camera;
let planets = [];
let gamestate = "startscreen";
let genplanets = [];
// counter
let intro = 0; // intro text counter


// start gameon page load
window.onload =()=>{
  loadImages();
  setupCanvas();
  setInterval(run,40);
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
  runStartScreen(200,middle.y);

  // run game
  else if(gamestate=="game")
  runGame();

  // run "focused mode"
  else if(gamestate=="focused")
  focusedMode(200,middle.y);

  mCtx.restore();
}

// bg ()
//
// draw background

let bg=()=>{
  fill(bgFill);
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
}

// focusedMode()
//
// draw only an empty background, some text and the player.

let focusedMode=(x,y)=>{

  camera.update();
  player.update();

  drawText(IntroText[intro],x,y);
  drawText("press space to continue",x,y+14,grey);
}


// runStartScreen()
//
//
let runStartScreen=(x,y)=>{

  drawText("space game",x,y);
  drawText("press space to start",x,y+14,grey);

  if(inputs.space) startGame();
}



// startGame()
//
//
let startGame=()=>{
  gamestate = "focused"
  startSound();
  setupPlayer();
  setupStars();
  camera = new Camera(player);
  setupPlanets();
  player.nearestPlanet = HomePlanet;
  playerLanded()
}



// runGame()
//
//
let runGame=()=>{

  playerCurrentSpeed = dist(zero,{x:player.vx,y:player.vy});
  trackQuests();
  updateStars();

  player.displayRadar();
  updateAll(planets);

  HandlePlayerInputs();
  updateAutopilot();

  player.update();
  resetPlayerOnCrash();

  camera.update();
  updatePlayerUi();

  SplitText(inventoryString, 5, 200);

  let x = Math.round(player.x/FarRange);
  let y = Math.round(player.y/FarRange);
  let index = x+","+y;
  if(index!="0,0"&&index!="1,0"&&!genplanets.includes(index)){
    planets.push(new Planet(x*FarRange+rand(-5000,5000),y*FarRange+rand(-5000,5000),true));
    genplanets.push(index);
  }


}
