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

let correct=(a)=>{
  while(a<0)a+=TWO_PI;
  return a%TWO_PI;
}

let minus=(a1,a2)=>
  Math.min(correct(a1,a2),correct(a2,a1));


let updateAutopilot=()=>{

  if(player.landed){
    autopilotActive=false;
    preventCrash=false;
    return;
  }

  let aToPEdge = Math.atan(closestPlanet.r/dist(player,closestPlanet));
  let aPVel = angleFromDirection(vxy(player));
  let aToP = angleFromDirection(directionFromObjectToObject(player,closestPlanet))
  if(player.x>closestPlanet.x) aToP *=-1;
  if(player.vx>0) aPVel *=-1;
  //aPVel -=PI;
//  let b = minus(correct(aPVel),correct(aToP))<correct(aToPEdge);
//  if(minus(correct(aPVel),correct(aToP))<correct(aToPEdge))
//    console.log("Baboom")

  //console.log(correct(aPVel),correct(aToP),correct(aToPEdge),minus(correct(aPVel),correct(aToP)))

  //else  if(aPVel<0) aPVel += PI
  if(player.x<closestPlanet.x&&aToP<0) aToP += PI

  aPVel-=PI
  while(aPVel<0) aPVel += TWO_PI;
  while(aToP<0) aToP += TWO_PI;
  while(aPVel>TWO_PI) aPVel -= TWO_PI;
  while(aToP>TWO_PI) aToP -= TWO_PI;
  let b = abs(aPVel-aToP)<abs(aToPEdge);
  //console.log("collision course: "+b);

  if(
    !autopilotActive
    &&b
    &&playerCurrentSpeed>player.crashThreshold
    &&closestPlanet.d2p<75*(playerCurrentSpeed)
  ){
    preventCrash=true;
    autopilotActive=true;
  }


  if(autopilotActive){


    if(preventCrash){
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

    else {
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
}

let reachTargetRotation=()=>{
  if(player.bearing-PlayerRotateRate2>player.targetbearing)
  player.rotate(PlayerRotateRate2);
  else if(player.bearing+PlayerRotateRate2<player.targetbearing)
  player.rotate(-PlayerRotateRate2);
  else return true;

  return false;
}
