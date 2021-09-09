// game objects
let player;
let camera;
let planets = [];
let gamestate = "startscreen";
let genplanets = [];
let lastavail;
let scount=0;
let toddQuest = false;

// start gameon page load
window.onload =()=>{
  //startSound()
  loadImages();
  setupCanvas();
  setInterval(run,40);
}



// startGame()
//
//

let startGame=()=>{

  startSound();
  setupPlayer();
  setupStars();
  camera = new Camera(player);
  setupPlanets();
  nP = HomePlanet;
  playerLanded()

  camera.update();
  player.update();

  gamestate="game";

  // woosh sound
  setInterval(()=>{
    if(player.throttle>0)
    play(40,
      0.2,0.1,0.65,0.1,
      10,noisey,
      player.throttle*4,
      'lowpass',100+player.throttle*1000,2);
  }, woosh);
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
    new Planet(x*FarRange+9*roughly(0),y*FarRange+9*roughly(0),true);
    genplanets.push(index);
  }

  if(availableText==undefined){
    doneAction=false;
    player.reading=false;
  }

//  if(player.landed) console.log("water: "+nP.posIsInWater(Dude))
}


// runStartScreen()
//
//

let runStartScreen=(x,y)=>{

  for(let i=0; i<9; i++){
    hue(i*20);
    image(fire1_png,180+i*50,y+90+Math.sin(i+scount)*5,50,100)
    image(vessel_png,180+i*50,y,100,200);
  }

  drawText("press space to start",x+130,y+260);

  scount+=.1;
  if(inputs.space) startGame();
}



// bg ()
//
// draw background

let bg=()=> frect(zero,mainCanvas.width,mainCanvas.height,bgFill);
