// game objects
let player;
let camera;
let planets = [];
let gamestate = "startscreen";
let genplanets = [];
let lastavail;


// start gameon page load
window.onload =()=>{
  startSound()
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
  //image({img:vessel_png},middle.x,middle.y,200);

  if(inputs.space) startGame();
}



// startGame()
//
//
let startGame=()=>{

  //startSound();
  setupPlayer();
  setupStars();
  camera = new Camera(player);
  setupPlanets();
  nP = HomePlanet;
  playerLanded()

  camera.update();
  player.update();

  gamestate="game";

  setInterval(()=>{
    if(player.throttle>0)
    play(40,
      0.2,0.1,0.65,0.1,
      10,noisey,
      player.throttle*4,
      'lowpass',100+player.throttle*1000,2);
  }, woosh);


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


  if(ActiveShop)
    RunShop();

  // add random planets
  let x = Math.round(player.x/FarRange)
  let y = Math.round(player.y/FarRange)
  let index = x+","+y;
  if(index!="0,0"&&!genplanets.includes(index)){
    new Planet(x*FarRange+5*roughly(0),y*FarRange+5*roughly(0),true);
    genplanets.push(index);
  }

  if(availableText==undefined) doneAction=false;
}
