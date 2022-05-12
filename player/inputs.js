let inputs = {
  w:false,
  a:false,
  s:false,
  d:false,
  b:false, // 66
  space:false, //32
  e:false,
  l:false,
  i:false,
  numbers:[
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]
}

let key;
let doneAction = false;
let waitForEBackUp = false;
// keyUp()
//
// track keyup events

let keyUp=(e)=>{
  e.preventDefault();
  e = e.keyCode;
  setKey(e,false);
  if(e==32) inputs.space = false;
  if(inputs.e==false) waitForEBackUp=false;
}

let setKey=(e,b)=>{

  if(e<=57&&e>=48){
    let num = e - 48;
    inputs.numbers[num] = b;
  }

  else{
    for(let i in inputs)
    if(i.toUpperCase().charCodeAt(0)==e) inputs[i]=b;
  }
}

// keydown()
//
// track key down events

let keyDown=(e)=>{
  e.preventDefault();
  key = e.keyCode;
  setKey(key,true);
  if(key==32){
    if(!inputs.space&&gamestate=="game") SpacePressInGameState();
    inputs.space=true;
  }

  if(key==73) toggleInventoryOptions();

  //console.log(inputs.e,canBoard())
  if(!player.boarded && inputs.e && canBoard()){
    //console.log("board!")
    // update dude
    waitForEBackUp = true;
    board();
    nP.removeDude();
    // update camera target
    camera.targetIsVessel();
    //availableText2 = undefined;
  }

  if(inventoryOptions.shown){
    if(inputs.w){
      inventoryOptions.selection = Math.max(inventoryOptions.selection-1, 0);
      RefreshInventory();
    }
    else if(inputs.s){
      inventoryOptions.selection = Math.min(inventoryOptions.selection+1, Object.keys(inventory).length-1);
      RefreshInventory();
    }
    else if (inputs.e){
      if(isEquipable(inventoryOptions.item)) EquipItem(inventoryOptions.item);
      else if(isUseable(inventoryOptions.item)) UseItem(inventoryOptions.item);
    }
    return;
  }
}


// toggleInventoryOptions()
//
//
let toggleInventoryOptions = ()=>{
  inventoryOptions.shown=!inventoryOptions.shown;
  RefreshInventory();
}


// HandlePlayerInputs()
//
// handle key inputs on or off planet
let HandlePlayerInputs=()=>{

  if(gamestate=="game"){
    canExit = false;
    canEnter = false;

    if(inventoryOptions.shown) return;

    if(tradeWindow.open) handleTradeWindowInputs();

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

  if(inputs.s && !player.landed && !availableText2) StopPlayer();

  // when landed,
  if(player.landed){
    // enable help text
    canExit = true;
    // press e to exit vessel
    if(!waitForEBackUp && inputs.e&&!player.crashed)
    playerLanded();
  }
}


// planetInputs()
//
// handle inputs for when player is on a planet
let planetInputs=()=>{


  handlePlanetHover();

  // look out for animation changes
  let running = player.running;
  let p =0;


  player.running = "";

  // if inputs pressed, move player
  if(inputs.d) moveX(1);
  if(inputs.a) moveX(-1);
  if(inputs.w) moveY(-1);
  if(inputs.s) moveY(1);


  if(player.running=="") player.running=false;

  // update animation
  if(running!=player.running){
    switch(player.running){
      case "left": p=1; Dude.left=true; break;
      case "right": p=1; Dude.left=false; break;
      case "down": p=2; break;
      case "up": p=3; break;

      case "leftdown": p=5; Dude.left=true; break;
      case "leftup": p=4; Dude.left=true; break;
      case "rightdown": p=5; Dude.left=false; break;
      case "rightup": p=4; Dude.left=false; break;
    }
    Dude.setFrames(poses[p]);
  }

  // enable hopping ON vessel when in range
  // (actually happens in keyDown)
  if(dist(player,addV(Dude,nP))<HopDistance)
  canEnter = true;

  refreshAvailableText();


}


let refreshAvailableText=()=>{
  // look through all features
  nP.features.forEach(f=>{
    // if collider enabled
    if((f.talker)&&dist(Dude,xy(f.x,f.y+60))<f.talkrange) availableText = f;
  });
}


let shoot = ()=>{
  if(!canShoot) return;
  if(!player.boarded) return;
  console.log(player.bearing)
  let direction = xy(Math.sin(player.bearing),-Math.cos(player.bearing));
  //  console.log("shoot!",direction);

  new Projectile(player,false,direction);

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

  if(tradeWindow.open){
    tradeWindow.open=false;
    return;
  }





  // 2. READ availableText2 TEXT BOX
  // (quest popup text)

  // if there is available text
  if (availableText2){
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
      if(availableText.DialogUpdate!=undefined) availableText.DialogUpdate();
      textCounter =0;
    }

    // show next phrase:
    else {
      textCounter++;

      if(!availableText.text){
        textCounter=0;
        player.reading=false;
        return;
      }

      if(
        textCounter>=availableText.text.length-1
        &&availableText.firstReadAction&&!doneAction
      ){
        doneAction=true;
        availableText.firstReadAction();
      }

      // remove text box
      if(!availableText||textCounter==availableText.text.length){
        availableText = undefined;
        player.reading = false;
        refreshAvailableText()
        console.log(availableText)
      }
    }
  }

  else if(player.boarded) shoot();
}
