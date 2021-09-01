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
  e = e.keyCode;
  setKey(e,true);
  if(e==76&&!player.landed) LandPlayer();
  if(e==32){
    inputs.space=true;
    if(gamestate=="focused") SpacePressInFocusState();
    else if(gamestate=="game") SpacePressInGameState();
  }
}

// SpacePressInFocusState()
//
// continue text / game by pressing space
// while game is in focus mode

let SpacePressInFocusState =()=>{
  // increment text
  intro++;
  // if text end reached, get back into Game state.
  // GAME START
  if(intro==IntroText.length){
    mutebass = false;
    gamestate="game";
  }
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

  // 1. BOARD VESSEL

  // if vessel is in range
  // and boarding is enabled
  if(canEnter&&canBoard&&talkedToMomOnce){
    // update dude
    board();

    player.nearestPlanet.removeDude();
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
      closeTextBox();
  }

  // 3. READ availableText TEXT BOX
  // (text that appears when u interact w something)

  // if there is available text
  else if(availableText){

    // display text box:
    if(!player.reading){
      player.reading = true;
      if(availableText==HomeObject) homeObjectText();
      if(availableText==RandomHome) mysteryHomeText();
      textCounter =0;
    }

    // show next phrase:
    else {
      textCounter++;
      // do action if last frame is reached and there is
      // a follow-up action available
      if(textCounter==availableText.text.length-1
        &&availableText.firstReadAction)
        availableText.firstReadAction();
        // remove text box
        if(textCounter==availableText.text.length){
          availableText = undefined;
          player.reading = false;
        }


      }
    }
  }
