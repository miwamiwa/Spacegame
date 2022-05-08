let characterUI;
let craftUI;
let tradeUI;
let mapUI;
let notesUI;
let aboutUI;

let setupUI=()=>{
  if(inventoryUI==undefined) inventoryUI = new UIWindow("inventory");
  characterUI=new UIWindow("character");
  craftUI = new UIWindow("crafting");
  tradeui = new UIWindow("trade");
  mapUI = new UIWindow("map");
  notesUI = new UIWindow("notes");

  setupAbout();

  setupMap();
}

let setupAbout=()=>{
  aboutUI = new UIWindow("about");
  aboutUI.setText(`
      planets by sam pc
      <br><br>
      Controls:
      <br><br>
      (while on planet) WASD to move, SPACE to interact.
      <br><br>
      (while on vessel) W to accelerate, AD to rotate, SPACE to stop, E to exit vessel.
      <br><br>
      in this game, you pretty much just roam space and give out muffins to the people you meet ;) Each planet gets a unique look, different trees, even a generated soundtrack. There's even different languages to learn if you can find a sage who can teach you.
      <br><br>
      this was originally made in 2021 for <a href="https://js13kgames.com/entries/spacew">js13k</a>, where the goal is to make a javascript game with a 13kb zip file limit `
    );
}

let uiUpdate=()=>{

  updateMapUI();
}


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
  //drawText("Known languages: "+knownLanguages.join(", "), 10, 590);

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
