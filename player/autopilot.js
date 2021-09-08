let autopilotActive = false;
let autopilotPhase;
let slowframes;



let StopPlayer =()=>{
  if(!autopilotActive){
    player.targetbearing=undefined;
    //console.log("autopilot active")
    autopilotPhase=0;
    autopilotActive = true;
  }
}



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
