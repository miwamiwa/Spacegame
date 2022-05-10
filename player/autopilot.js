let autopilotActive = false;
let autopilotPhase;
let slowframes;
let preventCrash=false;

let StopPlayer =()=>{
  if(!autopilotActive){
    player.targetbearing=undefined;
    //console.log("autopilot active")
    autopilotPhase=0;
    autopilotActive = true;
  }
}

// correct()
//
// "correct" an angle by fixing its value
// between 0 and TWO_PI
let correct=(a)=>{
  while(a<0)a+=TWO_PI;
  return a%TWO_PI;
}

// minus()
//
// subtract angles
let minus=(a1,a2)=>
Math.min(correct(a1,a2),correct(a2,a1));


let updateAutopilot=()=>{

  if(player.landed){
    autopilotActive=false;
    preventCrash=false;
    return;
  }

  /*
  planet edge
  |
  PLAYEr ---------- pLANET
  |
  planet edge
  */

  // angle between the line from player to planet center,
  // and the line from player to planet edge ??
  let aToPEdge = Math.atan(closestPlanet.r/dist(player,closestPlanet));
  // angle at which player is traveling
  let aPVel = angleFromDirection(vxy(player));
  // angle from player to planet ??
  let aToP = angleFromDirection(directionFromObjectToObject(player,closestPlanet));

  // mathemagically correct angle values
  if(player.x>closestPlanet.x) aToP *=-1; // reverse angle to planet if player on right side
  if(player.vx>0) aPVel *=-1; // reverse velocity if going right
  if(player.x<closestPlanet.x&&aToP<0) aToP += PI // idk LOL
  aPVel-=PI // uhmmm
  aPVel = correct(aPVel); //while(aPVel<0) aPVel += TWO_PI;
  aToP = correct(aToP); //while(aToP<0) aToP += TWO_PI;
  //while(aPVel>TWO_PI) aPVel -= TWO_PI;
  //while(aToP>TWO_PI) aToP -= TWO_PI;

  // finally, we can check if we're crashing into a planet:
  let b = abs(aPVel-aToP)<abs(aToPEdge);

  if(crashPreventionThresholdReached(b)){
    preventCrash=true;
    autopilotActive=true;
  }

  if(autopilotActive){
    if(preventCrash) runCrashPrevention(b);
    else runAutopilot();
  }
}

let crashPreventionThresholdReached=(b)=>{
  return !autopilotActive &&b
  &&playerCurrentSpeed>player.crashThreshold
  &&closestPlanet.d2p<25*(playerCurrentSpeed)
}


let runCrashPrevention=(b)=>{
  if(b){
    player.rotate(PlayerRotateRate2);
    player.plusThrottle();
  }
  else {
    player.minusThrottle();
    if(player.throttle==0){
      preventCrash=false;
      autopilotActive=false;
      StopPlayer();
    }
  }
}


let runAutopilot=()=>{

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

let reachTargetRotation=()=>{
  if(player.bearing-PlayerRotateRate2>player.targetbearing)
  player.rotate(PlayerRotateRate2);
  else if(player.bearing+PlayerRotateRate2<player.targetbearing)
  player.rotate(-PlayerRotateRate2);
  else return true;

  return false;
}
