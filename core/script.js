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

  updateEnemies();
  updateProjectiles();

  updatePlayerUi();





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

  if(autopilotActive) updateAutopilot();
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

let bg=()=>{
  if(camera==undefined||canvasSize==undefined){
    //frect(zero,mainCanvas.width,mainCanvas.height,bgFill);
    return;
  }

  //console.log(camera,ca)

  let scaling = 10;

  let canvas = subV(camera,multV(0.5,canvasSize));
  canvas.w = mainCanvas.width;
  canvas.h = mainCanvas.height;


  let source = {
    x:(canvas.x / scaling)/2 % bgPngWidth,
    y:(canvas.y / scaling)/2 % bgPngHeight,
    w:mainCanvas.width / scaling,
    h:mainCanvas.height / scaling
  }

  let image = {
    w:bgPngWidth,
    h:bgPngHeight
  }

  mCtx.save();

  // blur effect
  let opa = Math.max(0.2,1 - player.speed / 1.5 / speedLimit2);
  //console.log(opa)
  mCtx.filter = `brightness(0.4) opacity(${opa})`;


  // main background
  mCtx.drawImage(bgPng, source.x, source.y, source.w, source.h, 0,0, canvas.w, canvas.h);

  // add more on top
  if(source.y<0)
    mCtx.drawImage(bgPng, source.x, image.h + source.y, source.w, abs(source.y), 0,0, canvas.w, source.y * -scaling);

  // add more on left
  if(source.x<0)
    mCtx.drawImage(bgPng, image.w + source.x, source.y, abs(source.x), source.h, 0,0, source.x * -scaling, canvas.h);

  // add more on top-left
  if(source.x<0&&source.y<0)
    mCtx.drawImage(bgPng, image.w + source.x, image.h + source.y, abs(source.x), abs(source.y), 0,0, source.x * -scaling, source.y * -scaling);


  // add more to the right
  if(source.x + source.w > image.w){
    let resultingW = source.x + source.w - image.w;
    mCtx.drawImage(bgPng, 0, source.y, resultingW, source.h, scaling*(source.w - resultingW), 0, scaling * resultingW, canvas.h);
  }

  // add more below
  if(source.y + source.h > image.h){
    let resultingH = source.y + source.h - image.h;
    mCtx.drawImage(bgPng, source.x, 0, source.w, resultingH, 0, scaling*(source.h - resultingH), canvas.w, scaling * resultingH);
  }

  // add to bottom-right
  if(source.y + source.h > image.h && source.x + source.w > image.w){
    let resultingH = source.y + source.h - image.h;
    let resultingW = source.x + source.w - image.w;
    mCtx.drawImage(bgPng, source.x, source.y, resultingW, resultingH, scaling*(source.w - resultingW), scaling*(source.h - resultingH), scaling * resultingW, scaling * resultingH);
  }

  // add to bottom-left
  if(source.y + source.h > image.h && source.x<0){
    let resultingH = source.y + source.h - image.h;
    mCtx.drawImage(bgPng, image.w + source.x, 0, abs(source.x), resultingH, 0, scaling*(source.h - resultingH), source.x * -scaling, scaling * resultingH);
  }

  // add to top-right
  if(source.x + source.w > image.w && source.y<0){
    let resultingW = source.x + source.w - image.w;
    mCtx.drawImage(bgPng, 0, image.h + source.y, resultingW, abs(source.y), scaling*(source.w - resultingW), 0, scaling * resultingW, source.y * -scaling);
  }

  /*
  // add more below
  if(source.y>bgPngHeight - mainCanvas.height/scaling)
    mCtx.drawImage(bgPng, source.x, 0, mainCanvas.width/scaling, bgPngHeight - source.y, 0,mainCanvas.height - (bgPngHeight-source.y), mainCanvas.width, source.y);

  // add more on bottom right
  if(source.y>bgPngHeight - mainCanvas.height/scaling && source.x>bgPngWidth - mainCanvas.width/scaling)
    mCtx.drawImage(bgPng, source.x, source.y, bgPngWidth - source.x, bgPngHeight - source.y, bgPngWidth - source.x,bgPngHeight - source.y, source.x, source.y);
    */
  //console.log(source)
  mCtx.restore();
  //mCtx.drawImage(bgPng, source.x, source.y, mainCanvas.width/scaling, mainCanvas.height/scaling, 0, 0, mainCanvas.width, mainCanvas.height);
}
