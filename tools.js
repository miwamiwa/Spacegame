// tools.js
// where generally useful functions go
// so as to avoid cluttering script.js


// convert Hex color to an array of rgba values
function HexToRgba (hexinput){

  let result = [];
  let hex = hexinput.replace("#","");

  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
    parseInt(hex.substring(6, 8), 16)
  ];
}


function gradient(x1,y1,r1,x2,y2,r2,c2,c1){
  let g = mCtx.createRadialGradient(x1,y1,r1,x2,y2,r2);
  if(c1!=undefined)
    g.addColorStop(0, c1);

  g.addColorStop(1, c2);
  return g;
}


function drawCircle(x,y,r,fill){
  mCtx.fillStyle = fill;
  mCtx.beginPath();
  mCtx.ellipse(x,y,r,r, 0,0, TWO_PI);
  mCtx.fill();
}


// rgba()
// convert array to rgba() string
function rgba(r,g,b,a){
  return `rgba(${r},${g},${b},${a})`;
}
// canv()
//
// make a canvas
function canv(){
  return document.createElement("canvas");
}


// update ctx hue-rotate
function hue(h){
  if(h!=0)
    mCtx.filter = `hue-rotate(${h}deg)`;
}

function image(img,x,y,h,s){
  mCtx.drawImage(img.img, x-h,y-h , s, s);
}
// updateall()
//
// update all elements in a list
function updateAll(input){
  input.forEach(el=>el.update());
}

function displayShadow(obj){

  if(obj.active&&obj.img!=undefined){
    if(obj==Dude) console.log("yo dude")
  mCtx.save();
  mCtx.translate(obj.x,obj.y+obj.half);
  mCtx.transform(1,0.15,1.2,1,-5,-5);
  mCtx.filter = "brightness(0) opacity(0.2)"
  mCtx.drawImage(obj.img.img, -obj.half, -obj.size, obj.size, obj.size);
  mCtx.restore();
}
}
/*
// movetowards()
//
// move "moveme" towards target a a given velocity
// objects must have x,y position
function moveTowards(moveme, target, vel){
  let reachedX = false;
  let reachedY = false;

  console.log(moveme,target)
  if(moveme.x + vel < target.x) moveme.x += vel;
  else if(moveme.x - vel > target.x) moveme.x -= vel;
  else reachedX = true;

  if(moveme.y + vel < target.y) moveme.y += vel;
  else if (moveme.y - vel > target.y) moveme.y -= vel;
  else reachedY = true;

  return reachedX && reachedY;
}
*/

// rand()
//
// get a random value
function rand (min,max){
  // 0 args: from 0 to 1
  if(min==undefined&&max==undefined)
    return Math.random();
  // 1 arg: from 0 to arg1
  else if(max==undefined)
    return rand()*min;
  // 2 args: from arg1 to arg2
  else return min + rand() * (max-min);
}

//dist()
//
// get absolute distance between 2 objects
function dist(obj1,obj2){
  return Math.sqrt( Math.pow(obj1.x-obj2.x,2) + Math.pow(obj1.y-obj2.y,2));
}

// flo()
//
// floor()
function flo(input){
  return Math.floor(input);
}

// radians_to_degreens()
//
// copy-paste from somewhere on the internet
function radians_to_degrees(radians){
  return radians * (180/PI);
}

// directionfromobjecttoobject()
//
// distance between objects on x and y axis, normalized (dx+dy=1)
function directionFromObjectToObject(o1, o2){
  //console.log(o2.name)
//  console.log(o1.name,o2.name)
  let dx = o1.x - o2.x;
  let dy = o1.y - o2.y;
  let t = abs(dx) + abs(dy);
  return {x:  dx/t, y:- dy/t};
}

function abs(i){
  return Math.abs(i);
}


function RandomFromArray(array){
  return array[flo(rand(array.length))]
}


//https://www.fantasynamegenerators.com/planet_names.php
const PlanetNames = [
  "Nuchearus",
"Binvethea",
"Eccurn",
"Hinomia",
"Haotov",
"Peiyama",
"Strutacarro",
"Llenigawa",
"Garvis 5",
"Lloria ER2"
];


let usedPlanetNames = [];

function RandomPlanetName(){
  name = RandomFromArray(PlanetNames);
  while(usedPlanetNames.includes(name))
    name += flo(rand(10));
  usedPlanetNames.push(name);
  return name;
}

let constrain=(input,min,max)=> Math.min(Math.max(input, min), max);
