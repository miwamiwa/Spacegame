let popupText=(input)=>{
  textCounter=0;
  availableText=undefined;
  availableText2=input;
}

// updatePlayerUi()
//
// called in rungame()

let updatePlayerUi=()=>{

  // top of the screen
  showTopText();

  // interaction text box and hints
  showInteractionText();
  // quest text box and hints
  showQuestText();

  // show other hints:
  let t = "";
  let c;

  // when boarded and on ground
  if(canExit&&!player.crashed) t="press e to exit. hold w to launch.";
  if(canBoard()) t="press space to board";

  if(autopilotActive){
    t="autopilot active";
    if(preventCrash) t="crash prevention active";
    c="#daad";
  }

  drawText(t,middle.x+20,middle.y-80,c);
  drawText("Known languages: "+knownLanguages.join(", "), 10, 590);

  if(tradeWindow.open) displayCraftWindow();
}



// showTopText()
//
// show text at the top of the screen.

let showTopText=()=>{
  // if we crashed, Top text becomes crash text
  if(player.crashed)
  drawText(crashtext,TopText.x,TopText.y);

  // if we're aboard the space chips
  else if(player.boarded){
    drawText(`You're aboard the greenmobile.
    speed : ${flo(playerCurrentSpeed)}
    bearing: ${flo(radians_to_degrees(player.bearing))}°`,TopText.x,TopText.y);

    //console.log(player.crashThreshold,playerCurrentSpeed)
    if(playerCurrentSpeed>player.crashThreshold)
    drawText("Speed is unsafe for landing", TopText.x,TopText.y+font, "red");
    else drawText("Speed is safe for landing", TopText.x,TopText.y+font,"green");
  }

  // if we're on a planet
  else
  drawText(`Planet ${nP.name}.`,TopText.x,TopText.y);
}


// showInteractionText()
//
// show text box while interacting with an object,
// and show tip for interacting with text box

let showInteractionText=()=>{
  // if text available
  if(availableText){
    // display hint
    drawText("press space");
    //console.log("babomm")
    // display text
    if(player.reading)
    showTextArray(availableText.text,availableText.id!="tree");
  }
}



// showInteractionText()
//
// show text box for quest text,
// and show tip for interacting with text box

let showQuestText=()=>{
  // if text available
  if(availableText2!=undefined){

    // display hint
    drawText("press space");
    // display text
    showTextArray(availableText2);
  }
}
