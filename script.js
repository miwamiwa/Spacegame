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

  // background
  mCtx.fillStyle = "#2a1f42";
  mCtx.fillRect(0,0,mainCanvas.width,mainCanvas.height);

  updateStars();

  // update planets
  updateAll(planets);

  // update player
  HandlePlayerInputs();
  player.update();
  resetPlayerOnCrash();
  camera.update();


  updatePlayerUi();
  player.displayRadar();
}

function updateAll(input){
  for(let i=0; i<input.length; i++){
    input[i].update();
  }
}


function moveTowards(moveme, target, vel){
  let reachedX = false;
  let reachedY = false;

  if(moveme.x + vel < target.x) moveme.x += vel;
  else if(moveme.x - vel > target.x) moveme.x -= vel;
  else reachedX = true;

  if(moveme.y + vel < target.y) moveme.y += vel;
  else if (moveme.y - vel > target.y) moveme.y -= vel;
  else reachedY = true;

  return reachedX && reachedY;
}

function rand (min,max){
  // 0 args
  if(min==undefined&&max==undefined)
    return Math.random();
  // 1 arg (min=max)
  else if(max==undefined)
    return rand()*min;
  // 2 args
  else return min + rand() * (max-min);
}

function dist(obj1,obj2){
  return Math.sqrt( Math.pow(obj1.x-obj2.x,2) + Math.pow(obj1.y-obj2.y,2));
}

function flo(input){
  return Math.floor(input);
}

function radians_to_degrees(radians){
  return radians * (180/PI);
}

function directionFromObjectToObject(o1, o2){
  let dx = o1.x - o2.x;
  let dy = o1.y - o2.y;
  let t = dx + dy;
  return {x: dx/t, y:dy/t};
}
