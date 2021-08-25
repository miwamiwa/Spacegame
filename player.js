const PlayerAcceleration = 0.05;
const PlayerDeceleration = 0.2; // rate at which player.throttle recedes to 0.
const PlayerRotateRate = 0.1;
const AccelerationLimit = 3;
const SpeedLimit = 80;
const PlayerWalkVelocity = 3;

const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
const DudeSize = 50;

const RadarMin = 200;
const RadarMax = 20000;


let canExit = false; // trigger exit vehicle prompt
let canEnter = false;

const TextBox = {
  x:100,
  y:100
}

// ui stuff
const TopText = {x: 4, y: 10};
const FailTextList = ["Ouch!","Don't scratch the car. -Mom.","Oof."];

let playerDirX =0;
let playerDirY =0;
let availableText;
let availableText2;
let textCounter=0;

let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false // 66
}

function setupPlayer(){
  player = new Vessel(0,0,PlayerSize,VesselAnimation);



  player.radar = true;
  player.radarMinRange = RadarMin;
  player.radarMaxRange = RadarMax;
  player.dude = new AnimObject(PlayerStartX,PlayerStartY,DudeSize,PlayerAnimation);
  player.children.push(player.dude);
  player.reading = false;

  // start player on planet
  player.boarded = false;
  player.dude.visible = true;


  player.walkVel = PlayerWalkVelocity;
  player.bypassCamConstraint = true;
  player.animRate = 10;
  player.running = false;

  console.log(player)


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

function keyDown(e){
  switch(e.keyCode){
    case 87: inputs.w = true; break; // w
    case 65: inputs.a = true; break; //a
    case 83: inputs.s = true; break; //s
    case 68: inputs.d = true; break; //d

    //case 90: soundCheck(); break;
    //case 88: soundCheck2(); break;
  //  case 67: soundCheck3(); break;
  //  case 86: soundCheck4(); break;

    // press b to interact with obejcts
    case 66: inputs.b = true;

    if(canEnter){
      if(canBoard){
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

function keyUp(e){
  switch(e.keyCode){
    case 87: inputs.w = false; break; // w
    case 65: inputs.a = false; break; //a
    case 83: inputs.s = false; break; //s
    case 68: inputs.d = false; break; //d
    case 66: inputs.b = false; break; // b
  }
}

const HopDistance = 60;  // dist travelled when hopping off ship
function HandlePlayerInputs(){

  canExit = false;
  canEnter = false;
  // w or s?
  //if(inputs.w) player.plusThrottle(PlayerAcceleration);
  //if(inputs.s) player.minusThrottle(PlayerAcceleration);

  // press w to toggle throttle
  if(player.boarded){
    if(inputs.w) player.plusThrottle(PlayerAcceleration);
    else player.minusThrottle(PlayerDeceleration);

    if(inputs.a) player.rotate(PlayerRotateRate);
    if(inputs.d) player.rotate(-PlayerRotateRate);

    if(rightPlanetsEnabled && planetsIFoundCrackersOn.length>1)
      triggerCrackerInvestigation();

    if(player.landed){

      canExit = true;
      // hop off the vessel
      if(inputs.s&&!player.crashed){
        player.boarded = false;
        player.dude.visible = true;
        camera.targetIsDude();

        let p = player.nearestPlanet;
        let x = p.rPos();
        let y = p.rPos();
        let pos = {x:p.x+p.rPos(),y:p.y+p.rPos()};

        console.log(p.x,p.y,player.x,player.y)
        while (dist(pos,player)>25){
          x = p.rPos();
          y = p.rPos();
          pos = {x:p.x+x,y:p.y+y};
        }

        let dir = directionFromObjectToObject(player.nearestPlanet,player);
        player.dude.x =  (p.x-player.x)+x;
        player.dude.y =  (p.y-player.y)+y;
      }
    }
  }

  // WHILE NOT BOARDED (ON PLANET)
  else {

    let lastx =player.dude.x;
    let lasty =player.dude.y;

    let running = player.running;
    player.running = false;

    if(inputs.d) movePlayerOnPlanetX(1);
    if(inputs.a) movePlayerOnPlanetX(-1);
    if(inputs.w) movePlayerOnPlanetY(-1);
    if(inputs.s) movePlayerOnPlanetY(1);



    if(running!=player.running){
      switch(player.running){
        case false: player.dude.setFrames(PlayerAnimation); break;
        case "left": player.dude.setFrames(PlayerWalkLeft); break;
        case "right": player.dude.setFrames(PlayerWalkRight); break;
        case "down": player.dude.setFrames(PlayerWalkDown); break;
        case "up": player.dude.setFrames(PlayerWalkUp); break;
      }
    }

    // hop ON vessel when in range
    if(dist({x:0,y:0},player.dude)<HopDistance){
      canEnter = true;

    }

  }

}


function movePlayerOnPlanetX(delta){

  if(delta==1) player.running = "right";
  else player.running = "left";

  let newval = player.dude.x + player.walkVel * delta;

  let p = {
    x: player.x + player.dude.halfsize + newval,
    y: player.y+ player.dude.halfsize+player.dude.y
  };

  if(CheckCollisionsOnPlanet(p)) return;


  if(dist(p, player.nearestPlanet) < player.nearestPlanet.radius)
    player.dude.x = newval;
}

function movePlayerOnPlanetY(delta){

  if(delta==1) player.running="down";
  else player.running="up";

  let newval = player.dude.y + player.walkVel * delta;

  let p = {
    x: player.x + player.dude.halfsize + player.dude.x,
    y: player.y + player.dude.halfsize + newval
  };

  if(CheckCollisionsOnPlanet(p)) return;


  if(dist(p, player.nearestPlanet) < player.nearestPlanet.radius)
    player.dude.y = newval;

}

function CheckCollisionsOnPlanet(p){
  let r = false;
  let lastAvailTxt = availableText;
  availableText = undefined;

  player.nearestPlanet.features.forEach(f=>{
    if(f.collider){
      let p2 = {
        x: f.x + player.nearestPlanet.x,
        y: f.y + player.nearestPlanet.y
      }
      let d = dist(p,p2);

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

let crashtext;

function updatePlayerUi(){
  mCtx.fillStyle = "white";

  // if we crashed
  if(player.crashed)
  mCtx.fillText(crashtext,TopText.x,TopText.y);

  // if we're aboard the space chips
  else if(player.boarded)
  mCtx.fillText(`You're aboard the greenmobile:
    vX : ${flo(player.lastvx)}
    vY : ${flo(player.lastvy)}
    throttle: ${flo(10*player.throttle)/10}
    bearing: ${flo(radians_to_degrees(player.bearing))}`, TopText.x, TopText.y);

  // if we're on a planet
  else
    mCtx.fillText(`Planet ${player.nearestPlanet.name}.`,TopText.x,TopText.y);

  //
  playerDirX = player.vx / abs(player.vx);
  playerDirY = player.vy / abs(player.vy);


  if(availableText!=undefined){

    mCtx.fillStyle = "white";
    mCtx.fillText("press b to interact", middle.x, middle.y);

    if(player.reading){
      mCtx.fillStyle = "black";
      mCtx.fillRect(TextBox.x,TextBox.y, 300, 40);
      mCtx.fillStyle = "white";

      let i=0;
      availableText.text[textCounter].split("\n").forEach(line=>{
        mCtx.fillText(line, TextBox.x + 10, TextBox.y+17 + i);
        i+= 10;
      });

    }

  }

  if(availableText2!=undefined && !player.boarded){

    mCtx.fillStyle = "white";
    mCtx.fillText("press b", middle.x, middle.y);

      mCtx.fillStyle = "black";
      mCtx.fillRect(TextBox.x,TextBox.y, 300, 40);
      mCtx.fillStyle = "white";

      let i=0;
      availableText2[textCounter].split("\n").forEach(line=>{
        mCtx.fillText(line, TextBox.x + 10, TextBox.y+17 + i);
        i+= 10;
      });



  }

  if(canExit){
    let t = "press s to exit. hold w to launch."
    mCtx.fillStyle = "white";
    mCtx.fillText(t, middle.x + 50, middle.y);


  }

  if(canEnter&&canBoard){

    mCtx.fillStyle = "white";
    mCtx.fillText("press b to board", middle.x, middle.y);

  }

  if(!HelpOff&&player.boarded&&!player.landed){
    mCtx.fillStyle = "white";
    mCtx.fillText("w to throttle. a,d to steer.", middle.x + 50, middle.y);
  }
}



function RandomFailText(){
  return RandomFromArray(FailTextList);
}
