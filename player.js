const PlayerAcceleration = 0.05;
const PlayerRotateRate = 0.1;
const SpeedLimit = 200;
const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
let playerDirX =0;
let playerDirY =0;

let inputs = {
  w:false,
  a:false,
  s:false,
  d:false
}

function setupPlayer(){
  player = new Vessel(PlayerStartX,PlayerStartY,PlayerSize,VesselAnimation);
  player.radar = true;
  player.radarMinRange = 200;
  player.radarMaxRange = 20000;
}


function resetPlayerOnCrash(){
  if(player.crashed){
    if(player.counter-player.crashFrame>CrashAnimLength){
      player.resetPos(PlayerStartX,PlayerStartY);
      player.setFrames(VesselAnimation);
    }
  }
}

function keyDown(e){
  switch(e.keyCode){
    case 87: inputs.w = true; break; // w
    case 65: inputs.a = true; break; //a
    case 83: inputs.s = true; break; //s
    case 68: inputs.d = true; break; //d
  }
}

function keyUp(e){
  switch(e.keyCode){
    case 87: inputs.w = false; break; // w
    case 65: inputs.a = false; break; //a
    case 83: inputs.s = false; break; //s
    case 68: inputs.d = false; break; //d
  }
}

function HandlePlayerInputs(){
  //if(inputs.w) player.plusThrottle(PlayerAcceleration);
  //if(inputs.s) player.minusThrottle(PlayerAcceleration);
  if(inputs.w) player.plusThrottle(PlayerAcceleration);
  else player.minusThrottle(PlayerAcceleration);

  if(inputs.a) player.rotate(PlayerRotateRate);
  if(inputs.d) player.rotate(-PlayerRotateRate);
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
