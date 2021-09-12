let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false, // 66
  space:false, //32
  e:false,
  l:false
}
let key;
let doneAction = false;
// keyUp()
//
// track keyup events

let keyUp=(e)=>{
  e = e.keyCode;
  setKey(e,false);
  if(e==32) inputs.space = false;
}

let setKey=(e,b)=>{
  for(let i in inputs)
  if(i.toUpperCase().charCodeAt(0)==e) inputs[i]=b;
}

// keydown()
//
// track key down events

let keyDown=(e)=>{
  key = e.keyCode;
  setKey(key,true);
  if(key==32){
    if(!inputs.space&&gamestate=="game") SpacePressInGameState();
    inputs.space=true;
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
  if(inputs.w) player.plusThrottle();
  else player.minusThrottle();

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


// planetInputs()
//
// handle inputs for when player is on a planet
let planetInputs=()=>{

  // look out for animation changes
  let running = player.running;
  player.running = false;

  // if inputs pressed, move player
  if(inputs.d) moveX(1);
  if(inputs.a) moveX(-1);
  if(inputs.w) moveY(-1);
  if(inputs.s) moveY(1);

  // update animation
  if(running!=player.running){
    switch(player.running){
      case false: Dude.setFrames(poses[0]); break;
      case "left": Dude.setFrames(poses[1]); Dude.left=true; break;
      case "right": Dude.setFrames(poses[1]); Dude.left=false; break;
      case "down": Dude.setFrames(poses[2]); break;
      case "up": Dude.setFrames(poses[3]); break;
    }
  }

  // enable hopping ON vessel when in range
  // (actually happens in keyDown)
  if(dist(player,addV(Dude,nP))<HopDistance)
  canEnter = true;

  // look through all features
  nP.features.forEach(f=>{
    // if collider enabled
    if(f.talker&&dist(Dude,xy(f.x,f.y+60))<f.talkrange)
    availableText = f;

  });
}







// board()
//
// hop on board
let board=()=>{
  setV(Dude,zero);
  player.throttle=0;
  Dude.visible = false;
  player.boarded = true;
  Dude.planetMode=undefined;
}

// SpacePressInGameState()
//
// do various things by pressing space
// while game is in normal mode

let SpacePressInGameState =()=>{


  if(!player.landed && !availableText2) StopPlayer();
  // 1. BOARD VESSEL

  // if vessel is in range
  // and boarding is enabled
  if(canBoard()){
    // update dude
    board();

    nP.removeDude();
    // update camera target
    camera.targetIsVessel();
    // player controls vessel now

    // close active text box
    availableText2 = undefined;
  }


  // 2. READ availableText2 TEXT BOX
  // (quest popup text)

  // if there is available text
  else if (availableText2){
    // read next text
    textCounter++;
    // close if end reached
    if(textCounter==availableText2.length)
    availableText2 = undefined;
  }

  // 3. READ availableText TEXT BOX
  // (text that appears when u interact w something)

  // if there is available text
  else if(availableText){

    // display text box:
    if(!player.reading){
      player.reading = true;
      if(availableText==Mom) UpdateMomText();
      if(availableText==Grandpa) UpdateGPText();
      if(availableText==Shop) UpdateShopText();

      textCounter =0;
    }

    // show next phrase:
    else {
      textCounter++;
      // do action if last frame is reached and there is
      // a follow-up action available
      if(!availableText.text){
        textCounter=0;
        player.reading=false;
        return;
      }

      if(
        textCounter>=availableText.text.length-1
        &&availableText.firstReadAction
      )

      if(!doneAction){
        doneAction=true;
        availableText.firstReadAction();

      }

      // remove text box
      if(!availableText||textCounter==availableText.text.length){
        //if(availableText.shop&&knownLanguages.includes(nP.language)) ShowShop(availableText.shop);
        availableText = undefined;
        player.reading = false;
      }
    }
  }
}
