// game objects
let player;
let camera;
let planets = [];
let genplanets = [];
let closestPlanet;
let canShoot = false;
let enemiesCanShoot = false;

let CrashEnabled = false;
let SoundEnabled = false;


// current game screen
let gamestate = "startscreen";
// counter for start screen
let scount=0;
let frameCount =0;
let mainDelta =0;



// start game on page load
window.onload =()=>{
  //preloadMarkov();
  setupRNG();
  loadImages();
  setupCanvas();

  //setInterval(run,40);
  requestAnimationFrame(function(timestamp){
    starttime = timestamp || new Date().getTime() //if browser doesn't support requestAnimationFrame, generate our own timestamp using Date
    run(timestamp) // 400px over 1 second
});
}



// startGame()
//
//

let startGame=()=>{

  setupUI();
  setupTreeFamilies();
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
  reachPlanet(HomePlanet)
}

let starttime;
let lastTimestamp =0;
const expectedDelta = 40;


// run()
//
// main game loop

let run=(timestamp)=>{

  var timestamp = timestamp || new Date().getTime();
  //var runtime = timestamp - starttime;
  mainDelta = (timestamp - lastTimestamp)/expectedDelta;
  lastTimestamp=timestamp;
  //console.log(mainDelta,timestamp)

  mCtx.save();
  // background
  bg();

  // run start screen
  if(gamestate=="startscreen") runStartScreen(200,middle.y);
  // run game
  else if(gamestate=="game") runGame();

  uiUpdate();
  mCtx.restore();
  frameCount++;

  if(mainCanvasHovered&&frameCount%30==29){

    mapCamTarget = multV(mapScale,player);
    mapCamTarget = subV(mapCamTarget,multV(0.5,mapCanvasSize));
    updateMap();
  }


  requestAnimationFrame(function(timestamp){ // call requestAnimationFrame again with parameters
          run(timestamp);
  });
}



// runGame()
//
//

let runGame=()=>{

  planetMouseOverTarget=undefined;
  playerCurrentSpeed = dist(zero,vxy(player));

  updateStars();
  player.displayRadar();
  updateAll(planets);
  HandlePlayerInputs();
  displayProjectiles();

  camera.update();
  player.update();
  //camera.update();
  resetPlayerOnCrash();

  updatePlayerUi();



  updateEnemies();
  updateProjectiles();

  // add random planets
  let x = Math.round(player.x/FarRange)
  let y = Math.round(player.y/FarRange)
  let index = x+","+y;
  if(index!="0,0"&&!genplanets.includes(index)){
    let p=new Planet(x*FarRange+6*roughly(0),y*FarRange+6*roughly(0),true);
    //let max = ;
    p.setLang(allLanguages[Math.min(allLanguages.length,flo(0.3+rand((abs(x)+abs(y))/2.5)))]);
    p.populate();
    genplanets.push(index);
  }

  if(availableText==undefined){
    doneAction=false;
    player.reading=false;
  }
  updateAutopilot();
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

  // FOR DEBUG :
  startGame();
}



// bg ()
//
// draw background

let bg=()=> frect(zero,mainCanvas.width,mainCanvas.height,bgFill);
