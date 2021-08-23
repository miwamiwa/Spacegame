const PlayerAcceleration = 0.05;
const PlayerRotateRate = 0.1;
const SpeedLimit = 200;
const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
const PlayerWalkVelocity = 3;

let playerDirX =0;
let playerDirY =0;

let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false // 66
}

function setupPlayer(){
  player = new Vessel(PlayerStartX,PlayerStartY,PlayerSize,VesselAnimation);
  player.radar = true;
  player.radarMinRange = 200;
  player.radarMaxRange = 20000;
  player.dude = new AnimObject(0,0,40,PlayerAnimation);
  player.children.push(player.dude);
  player.boarded = true;
  player.walkVel = PlayerWalkVelocity;
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
    }
  }
}

function keyDown(e){
  switch(e.keyCode){
    case 87: inputs.w = true; break; // w
    case 65: inputs.a = true; break; //a
    case 83: inputs.s = true; break; //s
    case 68: inputs.d = true; break; //d
    case 66: inputs.b = true; break; // b
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

const HopDistance = 40;  // dist travelled when hopping off ship
function HandlePlayerInputs(){

  // w or s?
  //if(inputs.w) player.plusThrottle(PlayerAcceleration);
  //if(inputs.s) player.minusThrottle(PlayerAcceleration);

  // press w to toggle throttle
  if(player.boarded){
    if(inputs.w) player.plusThrottle(PlayerAcceleration);
    else player.minusThrottle(PlayerAcceleration);

    if(inputs.a) player.rotate(PlayerRotateRate);
    if(inputs.d) player.rotate(-PlayerRotateRate);

    if(player.landed){
      // hop off the vessel
      if(inputs.s&&!player.crashed){
        player.boarded = false;
        camera.targetIsDude();
        player.dude.y += HopDistance;
      }
    }
  }
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


    if(dist({x:0,y:HopDistance},player.dude)<40){

      // display some text to prompt boarding?

      if(inputs.b){
        // board back onto ship
        player.dude.x =0;
        player.dude.y =0;
        camera.targetIsVessel();
        player.boarded = true;
      }
    }

  }



}


function movePlayerOnPlanetX(delta){

  if(delta==1) player.running = "right";
  else player.running = "left";

  let newval = player.dude.x + player.walkVel * delta;
  let x = player.x + player.halfsize + newval;
  let y = player.y+ player.halfsize+player.dude.y;

  if(dist({x:x,y:y}, player.nearestPlanet) < player.nearestPlanet.radius)
    player.dude.x = newval;
}

function movePlayerOnPlanetY(delta){

  if(delta==1) player.running="down";
  else player.running="up";

  let newval = player.dude.y + player.walkVel * delta;
  let x = player.x + player.halfsize + player.dude.x;
  let y = player.y + player.halfsize + newval;

  if(dist({x:x,y:y}, player.nearestPlanet) < player.nearestPlanet.radius)
    player.dude.y = newval;

}


function updatePlayerUi(){
  mCtx.fillStyle = "white";
  mCtx.fillText(`Player:
    vX : ${flo(player.lastvx)}
    vY : ${flo(player.lastvy)}
    throttle: ${flo(10*player.throttle)/10}
    bearing: ${flo(radians_to_degrees(player.bearing))}`, 0, 10);

  //
  playerDirX = player.vx / Math.abs(player.vx);
  playerDirY = player.vy / Math.abs(player.vy);
}
