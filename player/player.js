
let canExit = false; // trigger exit vehicle prompt
let canEnter = true; // are we in range of the ship?

let talkedToMomOnce = true;

let crashtext; // text displayed on crash
let availableText;
let availableText2;

const woosh = 100;
let Dude;
let textCounter=0;
let stopSpeed =0;
let playerCurrentSpeed =0;
let inventory = [];
let inventoryString = "";
let nP;
let knownLanguages=["known languages","Onian"];

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

  // calculate next position
  let p = addV(Dude,xy(deltaX,deltaY));

  // if next position collides with something,
  // return before moving
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
      if(d<f.talkrange)
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
  let x= middle.x +60;
  let y=middle.y -40;
  // when boarded and on ground
  if(canExit&&!player.crashed)
  drawText("press e to exit. hold w to launch.", x,y);
  // when able to board
  if(canBoard())
  drawText("press space to board");
  // when in flight
  /*
  if(!HelpOff&&player.boarded&&!player.landed){
    drawText("FLIGHT CONTROLS:", x,y-font)
    drawText("W to throttle. A and D to steer.", x,y)
    drawText("SPACE to stop", x,y+font)
  }
  */

  SplitText(knownLanguages.join("\n"), 10, 500);

}

let canBoard=()=>canEnter&&talkedToMomOnce;

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
  else if(player.boarded){
    drawText(`You're aboard the greenmobile.
    speed : ${flo(playerCurrentSpeed)}
    bearing: ${flo(radians_to_degrees(player.bearing))}°
    throttle: ${flo(10*player.throttle)/10}`,TopText.x,TopText.y);

    //console.log(player.crashThreshold,playerCurrentSpeed)
    if(playerCurrentSpeed>player.crashThreshold)
    drawText("Speed is unsafe for landing", TopText.x,TopText.y+font, "red");
    else drawText("Speed is safe for landing", TopText.x,TopText.y+font,"green");

  }

  // if we're on a planet
  else
  drawText(`Planet ${nP.name}.`,TopText.x,TopText.y);



}

// showInteractionText()
//
// show text box while interacting with an object,
// and show tip for interacting with text box

let showInteractionText=()=>{
  // if text available
  if(availableText){
    // display hint
    drawText("press space");
    //console.log("babomm")
    // display text
    if(player.reading)
    showTextArray(availableText.text,availableText.id!="tree");
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
    //if(availableText2[textCounter]==InvestigationText[6]
    //  ||availableText2[textCounter]==InvestigationText[8])
    //  bg();

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

  let showTextArray=(txtarr,lang)=>{
    console.log(lang)
    fill(black);
    mCtx.fillRect(TextBox.x,TextBox.y, 320, 40);


    if(txtarr){
      let t = txtarr[textCounter];
      if(lang) t = translate(t);
      SplitText(t,TextBox.x+5,TextBox.y+17);
    }

  }

  let translate=(t)=>{
    //console.log("translate")
    if(!knownLanguages.includes(nP.language)){
      let str = "";
      for(let i=0; i<t.length; i++){
        let index = allLanguages.indexOf(nP.language)+2;
        str += String.fromCharCode(t.charCodeAt(i)+index*100);
      }
      return str;
    }
    return t;
  }

  let SplitText=(text,x,y,c,f)=>{
    if(!f) f=font
    let i=0;
    text.split("\n").forEach(line=>{
      drawText(line, x, y + i,c);
      i+= f;
    });
  }

  // drawText()
  //
  // display text on canvas

  let drawText=(txt,x,y,color)=>{
    if(!color) color = "white";
    if(!x){
      x=middle.x-50;
      y=middle.y-40;
    }
    fill(color);
    mCtx.fillText(txt,x,y)
  }




  let autopilotActive = false;
  let autopilotPhase;

  let StopPlayer =()=>{
    if(!autopilotActive){
      player.targetbearing=undefined;
      //console.log("autopilot active")
      autopilotPhase=0;
      autopilotActive = true;
    }
  }


  let slowframes;
  let updateAutopilot=()=>{

    if(autopilotActive){
      switch(autopilotPhase){

        case 0:
        if(player.throttle>0) player.minusThrottle();
        else {
          autopilotPhase++;
          slowframes = Math.sqrt(playerCurrentSpeed)*5.8;
          player.targetbearing = angleFromDirection(vxy(player));
          if(player.vx>0) player.targetbearing *=-1;
        }
        break;

        case 1:
        if (reachTargetRotation()){
          autopilotPhase++;
          player.bearing=player.targetbearing;
        }
        break;

        case 2:
        player.plusThrottle();
        slowframes--;
        if(slowframes<=0) autopilotPhase++;
        break;

        case 3:
        if(player.throttle>0) player.minusThrottle();
        else autopilotPhase++;
        break;

        case 4:
        autopilotActive = false;
        player.vx/=2;
        player.vy/=2;
        break;
      }
    }
  }

  let reachTargetRotation=()=>{
    if(player.bearing-PlayerRotateRate2>player.targetbearing)
    player.rotate(PlayerRotateRate2);
    else if(player.bearing+PlayerRotateRate2<player.targetbearing)
    player.rotate(-PlayerRotateRate2);
    else return true;

    return false;
  }
