let canExit = false; // trigger exit vehicle prompt
let canEnter = true; // are we in range of the ship?
let talkedToMomOnce = true;
let crashtext; // text displayed on crash
let availableText;
let availableText2;
let Dude;
let textCounter=0;
let playerCurrentSpeed =0;
let inventory = [];
let inventoryString = "";
let nP;
let knownLanguages=["Onian"];

// setupPlayer()
//
// create player and spaceship on load

let setupPlayer=()=>{
  // space ship
  player = new Vessel(0,0,PlayerSize,VesselAnimation);
  // player character
  Dude = new AnimObject(PlayerStartX,PlayerStartY,DudeSize,poses[0]);

  // setup player
  player.radar = true;
  Dude.hue=5;
  player.reading = false;
  player.animRate = 20;
  player.running = false;
}


// resetPlayerOnCrash()
//
//
let resetPlayerOnCrash=()=>{
  if(player.crashed){
    // when animation end is reached
    if(player.counter-player.crashFrame>CrashAnimLength){
      // reset player
      player.resetPos(PlayerStartX,PlayerStartY);
      // replace crash animation
      player.setFrames(VesselAnimation);
      player.crashed = false;
      player.landed = false;
      board();
    }
  }
}




// playerLanded()
//
// triggered on key press.
// remove dude from vessel and add to planet
let playerLanded=()=>{
  // unboard
  player.boarded = false;
  // switch camera target to dude
  camera.targetIsDude();
  // move dude to planet
  Dude.visible = true;
  Dude.planetMode = true;

  let pos;
  let d=0;
  nP.addFeature(Dude,100);
  while(d>160||d<55){
    pos=nP.findAvailableSpot(80,(nP.r-25)/nP.r);
    setV(Dude,pos);
    d=dist(player,addV(nP,Dude));
  }
}






// moveX()
//
// move player horizontally on a planet

let moveX=(delta)=>{
  // set animation
  if(delta==1) player.running = "right";
  else player.running = "left";
  // move
  moveIt( PlayerWalkVelocity * delta, 0);
}

// moveY();
//
// move player vertically on a planet

let moveY=(delta)=>{
  // set animation
  if(delta==1) player.running="down";
  else player.running="up";
  // move
  moveIt(0,PlayerWalkVelocity * delta);
}


// moveIt()
//
// handle any movement constraints,
// then move player

let moveIt =(deltaX,deltaY)=>{
  if(gamestate=="focused") return;

  // check if next position collides with something
  let p = addV(Dude,xy(deltaX,deltaY));
  if(CheckCollisionsOnPlanet(p)) return;

  // if collisions with planet edges also checks out
  if(dist(p, zero) < nP.r){
    // then move player
    if(deltaX!=0) Dude.x += deltaX;
    else Dude.y += deltaY;
  }

  // re-sort planet features
  nP.sortFeatures();
  ActiveShop=undefined;
}


// CheckCollisionsOnPlanet()
//
// check if any of a planet's features has a
// collider that collides with the player's projected
// next position

let CheckCollisionsOnPlanet=(p)=>{
  let r = false;
  let lastAvailTxt = availableText;
  availableText = undefined;

  // look through all features
  nP.features.forEach(f=>{
    // if collider enabled
    if(f.collider){
      let d = dist(p,f);
      // if feature is in talk range,
      // configure text interaction
      if(d<f.talkrange&&(f.text||f.tradeTxt))
      availableText = f;
      // if collided with collider
      if(d<=f.collidersize)
      r= true;
    }
  });

  // reset text counter if in range of
  // a new talkable element
  if(lastAvailTxt!=availableText)
  textCounter =0;

  return r;
}


let canBoard=()=>canEnter&&talkedToMomOnce;
