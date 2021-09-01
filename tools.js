// tools.js
// where generally useful functions go
// so as to avoid cluttering script.js


// convert Hex color to an array of rgba values
let HexToRgba =(hexinput)=>{

  let hex = hexinput.replace("#","");

  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
    parseInt(hex.substring(6, 8), 16)
  ];
}

let fill =(f)=> mCtx.fillStyle=f;

// gradient()
//
// create a canvas ctx gradient
let gradient=(x1,y1,r1,x2,y2,r2,c2,c1)=>{

  let g = mCtx.createRadialGradient(x1,y1,r1,x2,y2,r2);
  if(c1!=undefined) g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

let sq=(i)=>Math.pow(i,2);

// vector operations

let addV=(v,v2)=>{
  return {x:v.x+v2.x,y:v.y+v2.y}
}

let subV=(v,v2)=>{
  return {x:v.x-v2.x,y:v.y-v2.y}
}

let setV=(v,v2)=>{
  v.x=v2.x;
  v.y=v2.y;
}

// drawCircle()
//
// draw a circle on the canvas
let drawCircle=(x,y,r,f)=>{
  fill(f);
  mCtx.beginPath();
  circ(x,y,r);
  mCtx.fill();
}

let circ =(x,y,r)=>
  mCtx.ellipse(x,y,r,r, 0,0, TWO_PI);

// rgba()
//
// convert array to rgba() string
let rgba =(r,g,b,a) =>`rgba(${r},${g},${b},${a})`;

// canv()
//
// make a canvas
let canv=()=> document.createElement("canvas");

let getCtx=(c)=>{
  let ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled= false;
  return ctx;
}

// hue()
//
// update ctx hue-rotate
let hue =(h)=>{
  if(h!=0)
  mCtx.filter = `hue-rotate(${h}deg)`;
}

// image()
//
// draw an image on the canvas
// args: image, x,y coordinates, halfsize, size
let image =(img,x,y,h,s)=> mCtx.drawImage(img.img, x-h,y-h, s, s);

// updateall()
//
// update all elements in a list
let updateAll=(input)=>
input.forEach(el=>el.update());



let displayShadow=(obj)=>{

  if(obj.active&&obj.img!=undefined){
    mCtx.save();
    mCtx.translate(obj.x,obj.y+obj.half);
    mCtx.transform(1,0.15,1.2,1,-5,-5);
    mCtx.filter = "brightness(0) opacity(0.2)"
    mCtx.drawImage(obj.img.img, -obj.half, -obj.size, obj.size, obj.size);
    mCtx.restore();
  }
}


let angleFromDirection=(d)=>
  Math.acos( -d.y/ Math.sqrt(sq(d.x)+sq(d.y)) );

let vxy=(i)=>{
  return {x:i.vx,y:i.vy}
}

// rand()
//
// get a random value
let rand =(min,max)=>{
  // 0 args: from 0 to 1
  if(min==undefined&&max==undefined)
  return Math.random();
  // 1 arg: from 0 to arg1
  else if(max==undefined)
  return rand()*min;
  // 2 args: from arg1 to arg2
  else return min + rand() * (max-min);
}


let roughly=(i)=>rand(i-1000,i+1000);

//dist()
//
// get absolute distance between 2 objects
let dist =(obj1,obj2)=>
Math.sqrt( sq(obj1.x-obj2.x) + sq(obj1.y-obj2.y));


// flo()
//
// floor()
let flo=(input)=> Math.floor(input);


// radians_to_degreens()
//
// copy-paste from somewhere on the internet
let radians_to_degrees=(radians)=> radians * (180/PI);


// directionfromobjecttoobject()
//
// distance between objects on x and y axis, normalized (dx+dy=1)
let directionFromObjectToObject=(o1, o2)=>{

  let dx = o1.x - o2.x;
  let dy = o1.y - o2.y;
  let t = abs(dx) + abs(dy);
  return {x:  dx/t, y:- dy/t};
}

let zero={x:0,y:0};

// abs()
//
// returns abs value
let abs=(i)=> Math.abs(i);

// RandomFromArray()
//
// return a random value from given array
let RandomFromArray=(array)=> array[flo(rand(array.length))]


let usedPlanetNames = [];

// RandomPlanetName()
//
// get a random planet name,
// add a random number if it's a name we already used.
let RandomPlanetName=()=>{
  name = RandomFromArray(PlanetNames);
  while(usedPlanetNames.includes(name))
  name += flo(rand(10));
  usedPlanetNames.push(name);
  return name;
}

let constrain=(input,min,max)=> Math.min(Math.max(input, min), max);
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
