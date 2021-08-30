let Dude;
let canExit = false; // trigger exit vehicle prompt
let canEnter = true; // are we in range of the ship?
let canBoard = true;
let talkedToMomOnce = true;
let muffinType;
let talkedToMysteryDudeOnce = false;
let mysteryDudeGone = false;
let availableText;
let availableText2;
let textCounter=0;
let crashtext; // text displayed on crash
let inventory = [];
let inventoryString = "";
let stopSpeed =0;

// setupPlayer()
//
// create player and spaceship on load

let setupPlayer=()=>{
  // space ship
  player = new Vessel(0,0,PlayerSize,VesselAnimation);
  // player character
  Dude = new AnimObject(PlayerStartX,PlayerStartY,DudeSize,PlayerAnimation);

  // setup player
  player.radar = true;
  player.dude = Dude;
  player.reading = false;
  player.boarded = false;
  Dude.visible = true;
  player.animRate = 10;
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
      player.setFrames(VesselAnimation);
      player.crashed = false;
      player.landed = false;
      player.boarded = true;
      Dude.visible = false;
    }
  }
}


// HandlePlayerInputs()
//
// handle key inputs on or off planet
let HandlePlayerInputs=()=>{

  if(gamestate=="game"){
    canExit = false;
    canEnter = false;

    // if boarded
    if(player.boarded)
      vesselInputs();

    // if not boarded
    else planetInputs();
  }
}


// vesselInputs()
//
//
let vesselInputs=()=>{
  if(autopilotActive) return;
  // press w to toggle throttle
  if(inputs.w) player.plusThrottle(PlayerAcceleration);
  else player.minusThrottle(PlayerDeceleration);

  // press a/d to rotate
  if(inputs.a) player.rotate(PlayerRotateRate);
  if(inputs.d) player.rotate(-PlayerRotateRate);

  // when landed,
  if(player.landed){
    // enable help text
    canExit = true;
    // press e to exit vessel
    if(inputs.e&&!player.crashed)
      playerLanded();
  }
}

// playerLanded()
//
// triggered on key press.
// remove dude from vessel and add to planet
let playerLanded=()=>{
  // unboard
  player.boarded = false;
  Dude.visible = true;

  // switch camera target to dude
  camera.targetIsDude();

  // move dude to planet
  Dude.planetMode = true;
  let p = player.nearestPlanet;
  p.features.push(Dude);
  let pos = p.findAvailableSpot(100);
  Dude.x =  pos.x;
  Dude.y =  pos.y;
}



// planetInputs()
//
// handle inputs for when player is on a planet
let planetInputs=()=>{

  // look out for animation changes
  let running = player.running;
  player.running = false;

  // if inputs pressed, move player
  if(inputs.d) movePlayerOnPlanetX(1);
  if(inputs.a) movePlayerOnPlanetX(-1);
  if(inputs.w) movePlayerOnPlanetY(-1);
  if(inputs.s) movePlayerOnPlanetY(1);

  // update animation
  if(running!=player.running){
    switch(player.running){
      case false: Dude.setFrames(PlayerAnimation); break;
      case "left": Dude.setFrames(PlayerWalkLeft); break;
      case "right": Dude.setFrames(PlayerWalkRight); break;
      case "down": Dude.setFrames(PlayerWalkDown); break;
      case "up": Dude.setFrames(PlayerWalkUp); break;
    }
  }

  // enable hopping ON vessel when in range
  // (actually happens in keyDown)
  let p = player.nearestPlanet;
  if(dist(player,{x:Dude.x+p.x,y:Dude.y+p.y})<HopDistance)
    canEnter = true;

    // look through all features
    player.nearestPlanet.features.forEach(f=>{
      // if collider enabled
      if(f.talker){
        let d = dist({x:Dude.x+Dude.half,y:Dude.y+Dude.half},{x:f.x,y:f.y+f.half});
        // if feature is in talk range,
        // configure text interaction
        if(d<f.talkrange)
          availableText = f;
      }
    });
}


// movePlayerOnPlanetX()
//
// move player horizontally on a planet

let movePlayerOnPlanetX=(delta)=>{
  // set animation
  if(delta==1) player.running = "right";
  else player.running = "left";
  // move
  moveIt( PlayerWalkVelocity * delta, 0);
}

// movePlayerOnPlanetY();
//
// move player vertically on a planet

let movePlayerOnPlanetY=(delta)=>{
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

  // calculate next position
  let p = {
    x: Dude.x + deltaX,
    y: Dude.y + deltaY
  };

  // if next position collides with something,
  // return before moving
  if(CheckCollisionsOnPlanet(p)) return;

  // if collisions with planet edges also checks out
  if(dist(p, {x:0,y:0}) < player.nearestPlanet.radius){
    // then move player
    if(deltaX!=0) Dude.x += deltaX;
    else Dude.y += deltaY;
  }

  // re-sort planet features
  player.nearestPlanet.sortFeatures();
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
  player.nearestPlanet.features.forEach(f=>{
    // if collider enabled
    if(f.collider){
      let d = dist(p,{x:f.x,y:f.y});
      // if feature is in talk range,
      // configure text interaction
      if(d<f.talkrange)
        availableText = f;
      // if collided with collider
      if(d<f.collidersize)
         r= true;
    }
  });

  // reset text counter if in range of
  // a new talkable element
  if(lastAvailTxt!=availableText)
    textCounter =0;

  return r;
}

// updatePlayerUi()
//
// show UI on top of the screen,
// show tips beside player where there is an interaction available
// or show tip when there is help text
// also show cracker counter at the bottom of the screen

let updatePlayerUi=()=>{

  // top of the screen
  showTopText();
  // bottom
  //showCrackerCounter();

  // interaction text box and hints
  showInteractionText();
  // quest text box and hints
  showQuestText();

  // show other hints:

  // when boarded and on ground
  if(canExit&&!player.crashed)
    drawText("press e to exit. hold w to launch.", middle.x + 100, middle.y + 50);
  // when able to board
  if(canEnter&&canBoard)
    drawText("press space to board");
  // when in flight
  if(!HelpOff&&player.boarded&&!player.landed){
    drawText("w to throttle. a,d to steer.", middle.x + 100, middle.y + 50)
    drawText("l to stop", middle.x + 100, middle.y + 64)
  }



}

// showCrackerCounter()
//
// show cracker counter at bottom of the screen
/*
let showCrackerCounter=()=>{
  if(crackersFound>0)
    drawText(`crackers found: `+crackersFound,middle.x - 50, mainCanvas.height - 16);
}
*/
// showTopText()
//
// show text at the top of the screen.

let showTopText=()=>{
  // if we crashed, Top text becomes crash text
  if(player.crashed)
    drawText(crashtext,TopText.x,TopText.y);

  // if we're aboard the space chips
  else if(player.boarded)
  drawText(`You're aboard the greenmobile:
    vX : ${flo(player.lastvx)}
    vY : ${flo(player.lastvy)}
    throttle: ${flo(10*player.throttle)/10}
    bearing: ${flo(radians_to_degrees(player.bearing))}
    actual_direction: ${angleFromDirection(-player.vx,-player.vy)}`, TopText.x, TopText.y);

  // if we're on a planet
  else
    drawText(`Planet ${player.nearestPlanet.name}.`,TopText.x,TopText.y);
}

// showInteractionText()
//
// show text box while interacting with an object,
// and show tip for interacting with text box

let showInteractionText=()=>{
  // if text available
  if(availableText!=undefined){
    // display hint
    drawText("press space to interact");

    // display text
    if(player.reading)
      showTextArray(availableText.text);
  }
}

// showInteractionText()
//
// show text box for quest text,
// and show tip for interacting with text box

let showQuestText=()=>{
  // if text available
  if(availableText2!=undefined){
    // obscure background during
    // "investigation" part
    if(availableText2[textCounter]==InvestigationText[6]
      ||availableText2[textCounter]==InvestigationText[8])
      bg();

    // display hint
    drawText("press space");
    // display text
    showTextArray(availableText2);
  }
}

// showTextArray()
//
// split text into multiple lines,
// and display text box

let showTextArray=(txtarr,x,y)=>{
  mCtx.fillStyle = "black";
  mCtx.fillRect(TextBox.x,TextBox.y, 300, 40);

  if(txtarr!=undefined)
  SplitText(txtarr[textCounter],TextBox.x+5,TextBox.y+12);
}

let SplitText=(text,x,y)=>{
  let i=0;
  text.split("\n").forEach(line=>{
    drawText(line, x, y + i);
    i+= 10;
  });
}

// drawText()
//
// display text on canvas

let drawText=(txt,x,y,color)=>{
  if(color==undefined) color = "white";
  if(x==undefined){
    x=middle.x;
    y=middle.y;
  }
  mCtx.fillStyle=color;
  mCtx.fillText(txt,x,y)
}


let AddToInventory =(item)=>{
  if(inventory[item]==undefined)
    inventory[item] = 1;
  else inventory[item] ++;

  inventoryString = "inventory";
  for(let i in inventory)
    if(inventory[i]>0)
    inventoryString += "\n"+i+": "+inventory[i];

}

let autopilotActive = false;
let autopilotPhase;

let LandPlayer =()=>{
  if(!autopilotActive){
    player.targetbearing=undefined;
    console.log("autopilot active")
    autopilotPhase="start";
    autopilotActive = true;
  }
}

let angleFromDirection=(dx,dy)=>
  Math.acos( (0*dx+1*dy)/ (Math.sqrt(Math.pow(0,2)+Math.pow(1,2))*Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))) )

let updateAutopilot=()=>{

  if(autopilotActive){
    if(autopilotPhase=="start"){

      if(player.throttle>0)
        player.minusThrottle(PlayerDeceleration);
      else {
        autopilotPhase="turn1";
        player.targetbearing = angleFromDirection(-player.vx,-player.vy);
        if(player.vx>0) player.targetbearing *=-1;
      }
    }
    else if(autopilotPhase=="turn1"){
      if (reachTargetRotation())
        autopilotPhase="slow";
    }
    else if(autopilotPhase=="slow"){
        player.plusThrottle(PlayerAcceleration);
        let currentSpeed = dist({x:0,y:0},{x:player.vx,y:player.vy});
        // account for deceleration time
        let decel=0;
        stopspeed =PlayerDeceleration;
        while(decel<player.throttle){
          decel+=PlayerDeceleration;
          stopSpeed+=decel;
        }

        if(currentSpeed<10){
          if(currentSpeed<Math.max(stopSpeed,2))
            autopilotPhase="slow2"
        }
    }
    else if(autopilotPhase=="slow2"){
      if(player.throttle>0)
        player.minusThrottle(PlayerDeceleration);
      else autopilotPhase="stop"
    }

    else if(autopilotPhase=="stop"){
      autopilotActive = false;
      player.vx/=2;
      player.vy/=2;
    }
  }
}

let reachTargetRotation=()=>{

  if(player.bearing-PlayerRotateRate>player.targetbearing)
    player.rotate(PlayerRotateRate);
  else if(player.bearing+PlayerRotateRate<player.targetbearing)
    player.rotate(-PlayerRotateRate);
    else return true;

  return false;
}
