let canExit = false; // trigger exit vehicle prompt
let canEnter = false; // are we in range of the ship?
let tradedOnce = false; // set to true to enable ship from the start
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
let directions = [];


let speedLimit2 = 100;
let speedLimit1 = 60;
let grampQuest = true;
let SpeedLimit = speedLimit1;

let teleportHome=()=>{
  player.resetPos(PlayerStartX,PlayerStartY);
  nP=HomePlanet;
  if(!player.boarded)HomePlanet.addFeature(Dude,100)
}

let removePlayerFromPlanet=()=>{
  if(nP){
    let i = nP.features.indexOf(Dude);
    if(i!=-1) nP.features.splice(i,1);
  }
}

let pIsDead=false;
let dedScreenCounter=0

let handlePlayerDied=()=>{
  if(!pIsDead){

    if(Dude.health<=0){

      pIsDead=true;
      dedScreenCounter=0
      setTimeout(()=>{
        pIsDead=false;
        removePlayerFromPlanet();
        flushEnemies();
        teleportHome();
        Dude.health=100;
      },1000)
    }

    if(player.health<=0){

      pIsDead=true;
      dedScreenCounter=0
      setTimeout(()=>{
        pIsDead=false;
        teleportHome();
        player.health=100;
      },1000)
    }
  }
  else {

    let char = dedScreenCounter
    if(char>9) char=String.fromCharCode(87+dedScreenCounter)

    mCtx.save();
    mCtx.font="Arial 50px"
    mCtx.fillStyle="#000"+char
    mCtx.fillRect(0,0,canvasSize.x,canvasSize.y)
    mCtx.fillStyle="white"
    mCtx.fillText("gg no re", 50, 50)
    mCtx.restore();
    dedScreenCounter=Math.min(dedScreenCounter+1,15)
  }
}

// setupPlayer()
//
// create player and spaceship on load

let setupPlayer=()=>{
  // space ship
  player = new Vessel(0,0,PlayerSize,VesselAnimation);
  player.name="my ship";
  player.health=100;
  attachHealthBar(player,1.0);
  refreshCharacterPanel();
  // player character
  Dude = new AnimObject(PlayerStartX,PlayerStartY,DudeSize,poses[0]);
  Dude.health=100;
  attachHealthBar(Dude,1.0);

  // setup player
  player.radar = true;
  Dude.hue=5;
  player.reading = false;
  player.animRate = 20;
  player.running = false;

  directions["left"] = xy(-1,0);
  directions["right"] = xy(1,0);
  directions["up"] = xy(0,-1);
  directions["down"] = xy(0,1);
  directions[false] = xy(1,0);

  directions["leftdown"] = xy(-1,1);
  directions["leftup"] = xy(-1,-1);
  directions["rightdown"] = xy(1,1);
  directions["rightup"] = xy(1,-1);

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
  player.throttle=0;
  player.vx=0;
  player.vy=0;
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

  if(nP.isBarren && !nP.cleared) trySpawnEnemy();
}






// moveX()
//
// move player horizontally on a planet

let moveX=(delta)=>{
  // set animation
  if(delta==1) player.running += "right";
  else player.running += "left";
  // move
  moveIt( PlayerWalkVelocity * delta * mainDelta, 0);

  availableText2=undefined;
}

// moveY();
//
// move player vertically on a planet

let moveY=(delta)=>{
  // set animation
  if(delta==1) player.running+="down";
  else player.running+="up";
  // move
  moveIt(0,PlayerWalkVelocity * delta * mainDelta);
  availableText2=undefined;
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

  if(nP.posIsInWater(p)){
    //deltaX/=2;
    //deltaY/=2;
  }

  // if collisions with planet edges also checks out
  if(dist(p, zero) < nP.r){
    // then move player
    if(deltaX!=0) Dude.x += deltaX;
    else Dude.y += deltaY;
  }

  // re-sort planet features
  nP.sortFeatures();
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

  //if(nP.posIsInWater(p))
  //  r=true;
  // reset text counter if in range of
  // a new talkable element
  if(lastAvailTxt!=availableText)
  textCounter =0;

  return r;
}


let canBoard=()=>canEnter&&tradedOnce;
