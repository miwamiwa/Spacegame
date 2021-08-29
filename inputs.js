let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false, // 66
  space:false, //32
  e:false
}

// keyUp()
//
// track keyup events

let keyUp=(e)=>{
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

// keydown()
//
// track key down events

let keyDown=(e)=>{
  switch(e.keyCode){
    case 87: inputs.w = true; break; // w
    case 65: inputs.a = true; break; //a
    case 83: inputs.s = true; break; //s
    case 68: inputs.d = true; break; //d
    case 69: inputs.e = true; break;
    case 66: inputs.b = true; break; // b

    // THE SPACE BUTTON
    case 32: inputs.space =true;

    if(gamestate=="focused")
    SpacePressInFocusState();

    else if(gamestate=="game")
    SpacePressInGameState();

    break;
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


// SpacePressInGameState()
//
// do various things by pressing space
// while game is in normal mode

let SpacePressInGameState =()=>{

  // 1. BOARD VESSEL

  // if vessel is in range
  // and boarding is enabled
  if(canEnter&&canBoard){
    // update dude
    Dude.x =0;
    Dude.y =0;
    Dude.visible = false;
    player.dude = Dude;
    player.nearestPlanet.removeDude();
    // update camera target
    camera.targetIsVessel();
    // player controls vessel now
    player.boarded = true;
    Dude.planetMode=undefined;
    // close active text box
    availableText2 = undefined;
  }


  // 2. READ availableText2 TEXT BOX
  // (quest popup text)

  // if there is available text
  else if (availableText2!=undefined){
    // read next text
    textCounter++;
    // close if end reached
    if(textCounter==availableText2.length)
      closeTextBox();
  }

  // 3. READ availableText TEXT BOX
  // (text that appears when u interact w something)

  // if there is available text
  else if(availableText!=undefined){

    // display text box:
    if(!player.reading){
      player.reading = true;
      if(availableText==HomeObject) homeObjectText();
      textCounter =0;
    }

    // show next phrase:
    else {
      textCounter++;
      // do action if last frame is reached and there is
      // a follow-up action available
      if(textCounter==availableText.text.length-1
        &&availableText.firstReadAction!=undefined)
        availableText.firstReadAction();
        // remove text box
        if(textCounter==availableText.text.length){
          availableText = undefined;
          player.reading = false;
        }


      }
    }
  }
