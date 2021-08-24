// tools.js
// where generally useful functions go
// so as to avoid cluttering script.js


// updateall()
//
// update all elements in a list
function updateAll(input){
  input.forEach(el=>el.update());
}

// movetowards()
//
// move "moveme" towards target a a given velocity
// objects must have x,y position
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
