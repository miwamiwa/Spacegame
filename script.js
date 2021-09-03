// game objects
let player;
let camera;
let planets = [];
let gamestate = "startscreen";
let genplanets = [];



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

  mCtx.restore();

  if(gamestate=="focused"){
    camera.update();
    player.update();

    gamestate="game";
  }

}

// bg ()
//
// draw background

let bg=()=>{
  fill(bgFill);
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
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
  //startSound();
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

  playerCurrentSpeed = dist(zero,vxy(player));

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

  // quest tracking
  if(player.boarded && rightPlanetsEnabled && planetsIFoundCrackersOn.length>1)
    triggerCrackerInvestigation();

  // add random planets
  let x = Math.round(player.x/FarRange);
  let y = Math.round(player.y/FarRange);
  let index = x+","+y;
  if(index!="0,0"&&index!="1,0"&&!genplanets.includes(index)){
    new Planet(x*FarRange+5*roughly(0),y*FarRange+5*roughly(0),true);
    genplanets.push(index);
  }
}
