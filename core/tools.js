const Sharp = "#";
const Flat = "b";
const OneMinute = 60000;


let limit=(num,maxnum)=> Math.min(maxnum,num);

let removeLastChar=(str)=>{
  return str.substring(0,str.length-1);
}


let isString=(input)=>{
  return typeof input === 'string' || input instanceof String
}

let lastListElement=(list)=>{
  return list[list.length-1];
}

let chooseBetween=(input)=> input[randi(input.length)];

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

let range=(p,h,s)=>p>-h&&p<s+h;

let fill =(f)=> mCtx.fillStyle=f;

let frect=(p,w,h,f)=>{
  fill(f);
  mCtx.fillRect(p.x,p.y,w,h);
}


let transform=(pos,f,r)=>{
  mCtx.save();
  mCtx.translate(pos.x,pos.y);
  if(r) mCtx.rotate(r);
  f();
  mCtx.restore();
}


let plural=(t, num)=>{
  if(num==1) return t;

  let i=t.length;
  if(i>0){
    i--;
    if(t[i]=='y') t=t.substring(0,i)+"ies";
    else t += "s";
  }
  return t;
}

// gradient()
//
// create a canvas ctx gradient
/*
let gradient=(x1,y1,r1,x2,y2,r2,c2,c1)=>{

  let g = mCtx.createRadialGradient(x1,y1,r1,x2,y2,r2);
  if(c1!=undefined) g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}
*/

let sq=(i)=>Math.pow(i,2);

// vector operations

let addV=(v,v2)=>xy(v.x+v2.x,v.y+v2.y);
let subV=(v,v2)=>xy(v.x-v2.x,v.y-v2.y);
let multV=(i,v)=>xy(v.x*i,v.y*i);


let xy=(x,y)=>{
  return {x:x,y:y}
}

let setV=(v,v2)=>{
  v.x=v2.x;
  v.y=v2.y;
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

let scanv=()=>{
  let c=canv();
  c.width=100;
  c.height=100;
  return c;
}

let getCtx=(c)=>{
  let ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled= false;
  return ctx;
}

// hue()
//
// update ctx hue-rotate
let hue =(h)=>{
  if(h&&h!=0) mCtx.filter = `hue-rotate(${h}deg)`;
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

let vxy=(i)=> xy(i.vx,i.vy);




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
  return xy(dx/t,- dy/t);
}

let zero=xy(0,0);


// abs()
//
// returns abs value
let abs=(i)=> Math.abs(i);

let teach=(l)=>{
  availableText2=["I can teach you "+l];
  knownLanguages.push(l);
  refreshCharacterPanel();
}

let know=(l)=>knownLanguages.includes(l);





let usedPlanetNames = [];

let rBerry =()=>RandomFromArray(BerryNames);

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
