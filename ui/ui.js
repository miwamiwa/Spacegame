// updatePlayerUi()
//
// called in rungame()

let updatePlayerUi=()=>{

  // top of the screen
  showTopText();
  // bottom
  //showCrackerCounter();

  // interaction text box and hints
  showInteractionText();
  // quest text box and hints
  showQuestText();

  // show other hints:
  let x= middle.x +60;
  let y=middle.y -40;
  // when boarded and on ground
  if(canExit&&!player.crashed)
  drawText("press e to exit. hold w to launch.", x,y);
  // when able to board
  if(canBoard())
  drawText("press space to board");
  // when in flight
  /*
  if(!HelpOff&&player.boarded&&!player.landed){
  drawText("FLIGHT CONTROLS:", x,y-font)
  drawText("W to throttle. A and D to steer.", x,y)
  drawText("SPACE to stop", x,y+font)
}
*/

drawText("Known languages: "+knownLanguages.join(", "), 10, 590);

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
    bearing: ${flo(radians_to_degrees(player.bearing))}°
    throttle: ${flo(10*player.throttle)/10}`,TopText.x,TopText.y);

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
    // obscure background during
    // "investigation" part
    //if(availableText2[textCounter]==InvestigationText[6]
    //  ||availableText2[textCounter]==InvestigationText[8])
    //  bg();

    // display hint
    drawText("press space");
    // display text
    showTextArray(availableText2);
  }
}