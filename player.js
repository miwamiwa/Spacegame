const PlayerAcceleration = 0.05;
const PlayerDeceleration = 0.2; // rate at which player.throttle recedes to 0.
const PlayerRotateRate = 0.1;
const AccelerationLimit = 3;
const SpeedLimit = 80;
const PlayerWalkVelocity = 4;

const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
const DudeSize = 50;

const RadarMin = 200;
const RadarMax = 20000;


// text box default size
const TextBox = {
  x:100,
  y:100
}

// ui stuff
const TopText = {x: 4, y: 10};
const FailTextList = ["Ouch!","Don't scratch the car. -Mom.","Oof."];


const HopDistance = 60;  // dist travelled when hopping off ship


let canExit = false; // trigger exit vehicle prompt
let canEnter = false;

let playerDirX =0;
let playerDirY =0;
let availableText;
let availableText2;
let textCounter=0;

// text displayed on crash
let crashtext;



function setupPlayer(){

  player = new Vessel(0,0,PlayerSize,VesselAnimation);
  player.radar = true;
  player.dude = new AnimObject(PlayerStartX,PlayerStartY,DudeSize,PlayerAnimation);
  player.children.push(player.dude);
  player.reading = false;

  // start player on planet
  player.boarded = false;
  player.dude.visible = true;
  player.bypassCamConstraint = true;
  player.animRate = 10;
  player.running = false;
}


function resetPlayerOnCrash(){
  if(player.crashed){
    if(player.counter-player.crashFrame>CrashAnimLength){
      player.resetPos(PlayerStartX,PlayerStartY);
      player.setFrames(VesselAnimation);
      player.crashed = false;
      player.landed = false;
      player.boarded = true;
      player.dude.visible = false;
    }
  }
}


let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false, // 66
  space:false, //32
  e:false
}

function keyUp(e){
  switch(e.keyCode){
    case 87: inputs.w = false; break; // w
    case 65: inputs.a = false; break; //a
    case 83: inputs.s = false; break; //s
    case 68: inputs.d = false; break; //d
    case 66: inputs.b = false; break; // b
    case 32: inputs.space = false; break;
    case 69: inputs.e = false; break;
  }
}

function keyDown(e){
  switch(e.keyCode){
    case 87: inputs.w = true; break; // w
    case 65: inputs.a = true; break; //a
    case 83: inputs.s = true; break; //s
    case 68: inputs.d = true; break; //d
    case 32: inputs.space =true;

    if(gamestate=="focused"){
      intro++;
      if(intro==IntroText.length) gamestate="game";
    }
    break;
    case 69: inputs.e = true; break;

    // press b to interact with obejcts
    case 66: inputs.b = true;

    // BOARD VESSEL HOP ON
    if(canEnter){
      if(canBoard){
        availableText2 = undefined;
        player.dude.x =0;
        player.dude.y =0;
        camera.targetIsVessel();
        player.boarded = true;
        player.dude.visible = false;
      }
    }
    else if (availableText2!=undefined){

      textCounter++;
      if(textCounter==availableText2.length)
        closeTextBox();
    }
    else if(availableText!=undefined){
      // show window
      if(!player.reading){
        player.reading = true;
        textCounter =0;
      }
      // show next phrase
      else {

        textCounter++;
        // do action if last frame is reached and there is
        // a follow-up action
        if(textCounter==availableText.text.length-1
          &&availableText.firstReadAction!=undefined)
          availableText.firstReadAction();
        // quit
        if(textCounter==availableText.text.length)
          player.reading = false;

      }
    }
    break; // b
  }
}




function HandlePlayerInputs(){

  if(gamestate=="game"){

    canExit = false;
    canEnter = false;

    if(player.boarded)
      inputsForPlayerInVessel();

    // WHILE NOT BOARDED (ON PLANET)
    else
      inputsForPlayerOnPlanet();

  }



}


function inputsForPlayerInVessel(){

  // press w to toggle throttle
  if(inputs.w) player.plusThrottle(PlayerAcceleration);
  else player.minusThrottle(PlayerDeceleration);

  if(inputs.a) player.rotate(PlayerRotateRate);
  if(inputs.d) player.rotate(-PlayerRotateRate);

  if(rightPlanetsEnabled && planetsIFoundCrackersOn.length>1){
    //console.log("ca continue")
    triggerCrackerInvestigation();
  }


  if(player.landed){

    canExit = true;

    // press e to hop off the vessel
    if(inputs.e&&!player.crashed){
      player.boarded = false;
      player.dude.visible = true;
      camera.targetIsDude();

      let p = player.nearestPlanet;
      let pos = p.randomSurfacePosition(1,true);

      while (dist(pos,player)>25)
        pos = p.randomSurfacePosition(1,true);

      // position relative to player instead of the planet
      player.dude.x =  (p.x-player.x)+x;
      player.dude.y =  (p.y-player.y)+y;
    }
  }
}


function inputsForPlayerOnPlanet(){

  // look out for animation changes
  let running = player.running;
  player.running = false;

  // walking inputs
  if(inputs.d) movePlayerOnPlanetX(1);
  if(inputs.a) movePlayerOnPlanetX(-1);
  if(inputs.w) movePlayerOnPlanetY(-1);
  if(inputs.s) movePlayerOnPlanetY(1);

  // update animation
  if(running!=player.running){
    switch(player.running){
      case false: player.dude.setFrames(PlayerAnimation); break;
      case "left": player.dude.setFrames(PlayerWalkLeft); break;
      case "right": player.dude.setFrames(PlayerWalkRight); break;
      case "down": player.dude.setFrames(PlayerWalkDown); break;
      case "up": player.dude.setFrames(PlayerWalkUp); break;
    }
  }

  // enable hopping ON vessel when in range
  // (actually happens in keyDown)
  if(dist({x:0,y:0},player.dude)<HopDistance)
    canEnter = true;
}


function movePlayerOnPlanetX(delta){

  // set animation
  if(delta==1) player.running = "right";
  else player.running = "left";

  moveIt( PlayerWalkVelocity * delta, 0);
}

function movePlayerOnPlanetY(delta){

  // set animation
  if(delta==1) player.running="down";
  else player.running="up";

  moveIt(0,PlayerWalkVelocity * delta);
}



function moveIt (deltaX,deltaY){
  if(gamestate=="focused") return;
  let p = {
    x: player.x + player.dude.x + deltaX,
    y: player.y + player.dude.y + deltaY
  };
  if(CheckCollisionsOnPlanet(p)) return;

  if(dist(p, player.nearestPlanet) < player.nearestPlanet.radius){
    if(deltaX!=0)
    player.dude.x += deltaX;
    else
    player.dude.y += deltaY;
  }
}



function CheckCollisionsOnPlanet(p){
  let r = false;
  let lastAvailTxt = availableText;
  availableText = undefined;

  player.nearestPlanet.features.forEach(f=>{
    if(f.collider){
      let d = dist(p,{
        x: f.x + player.nearestPlanet.x,
        y: f.y + player.nearestPlanet.y
      } );

      if(d<f.talkrange)
        availableText = f;

      if(d<f.collidersize)
         r= true;

    }
  });
  if(lastAvailTxt!=availableText)
    textCounter =0;

  return r;
}



function updatePlayerUi(){

  // if we crashed
  if(player.crashed)
  drawText(crashtext,TopText.x,TopText.y);

  // if we're aboard the space chips
  else if(player.boarded)
  drawText(`You're aboard the greenmobile:
    vX : ${flo(player.lastvx)}
    vY : ${flo(player.lastvy)}
    throttle: ${flo(10*player.throttle)/10}
    bearing: ${flo(radians_to_degrees(player.bearing))}`, TopText.x, TopText.y);

  // if we're on a planet
  else
    drawText(`Planet ${player.nearestPlanet.name}.`,TopText.x,TopText.y);

  //
  playerDirX = player.vx / abs(player.vx);
  playerDirY = player.vy / abs(player.vy);


  if(availableText!=undefined){
    drawText("press b to interact");

    if(player.reading)
      showTextArray(availableText.text);
  }

  if(availableText2!=undefined){

    drawText("press b");
    showTextArray(availableText2);

  }

  if(canExit&&!player.crashed)
  drawText("press e to exit. hold w to launch.", middle.x + 100, middle.y + 50);


  if(canEnter&&canBoard)
  drawText("press b to board");


  if(!HelpOff&&player.boarded&&!player.landed)
  drawText("w to throttle. a,d to steer.", middle.x + 100, middle.y + 50)

}


function showTextArray(txtarr){
  mCtx.fillStyle = "black";
  mCtx.fillRect(TextBox.x,TextBox.y, 300, 40);

  let i=0;
  if(txtarr!=undefined)
  txtarr[textCounter].split("\n").forEach(line=>{
    drawText(line, TextBox.x + 10, TextBox.y+17 + i);
    i+= 10;
  });
}

function drawText(txt,x,y,color){
  if(color==undefined) color = "white";
  if(x==undefined){
    x=middle.x;
    y=middle.y;
  }
  mCtx.fillStyle=color;
  mCtx.fillText(txt,x,y)
}



function RandomFailText(){
  return RandomFromArray(FailTextList);
}
