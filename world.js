// this is to count how many planets we explored
// during cracker on 3 planets part
let planetsIFoundCrackersOn = [];
let investigationTriggered = false;
let InvestigationText = [];
let HomePlanet;
let ToddsPlanet;
let FinalPlanet;
let ToddsVessel;
let ToddsCouch;
let MysteryPlanet;
let HelpOff = false; // display flight instructions
let mainCanvas;
let mCtx;
let middle = {x:300,y:260};
let rightPlanetsEnabled = false;
let crackersFound =0;
let HomeObject;
let HomeCouch;
let RandomHome;
let font = 16;
// setupcanvas()
//
// called on start. setup the canvas area,
// and the key inputs as well

let setupCanvas=()=>{
  // create canvas
  mainCanvas = canv();
  mainCanvas.width = 600;
  mainCanvas.height = 600;
  mCtx = getCtx(mainCanvas);
  mCtx.font = font+"px Arial";

  let b=document.body;
  b.appendChild(mainCanvas);
  b.onkeydown = keyDown;
  b.onkeyup = keyUp;
}



// setupPlanets()
//
// create home planet and todd's planet

let setupPlanets=()=>{

  // create home planet
  HomePlanet = new Planet(player.x,player.y + HomePlanetRadius + Planet1Distance, true, "Home, sweet home", HomePlanetRadius, 1500);
  HomeObject=new StaticObject(0,0,home_png, 100, HomePlanetText, talkedToMom);
  HomeCouch = new StaticObject(0,0,couch_png, 100, HomeCouchText, triggerStoryStart);
  HomePlanet.addFeature(HomeObject,100);
  HomePlanet.addFeature(HomeCouch,100);


  // create todd's planet
  ToddsPlanet = new Planet(HomePlanet.x + 200, HomePlanet.y-DistanceToTodd, true, "Todd's place",310,1200);

  ToddsPlanet.addFeature(new StaticObject(80,0,home_png, 100, ToddsHomeText, triggerTommysHouseFound));
  ToddsCouch=new StaticObject(-90,40,couch_png, 100, CouchText2,triggerGoToPlanetsOnRight);
  ToddsPlanet.addFeature(ToddsCouch);
}


let talkedToMom=()=>
  talkedToMomOnce = true;




let mysteryHomeText=()=>{

  // check if we have muffins
  let muffin = undefined;
  for(let i in inventory)
    if(i.indexOf("muffin")!=-1) muffin = i;

  if(!talkedToMysteryDudeOnce)
  RandomHome.setTandA(RandomHomeText1, talkToMDude);

  else if(!mysteryDudeGone){
    if (!muffin)
      RandomHome.setTandA(["I'm hungry."]);
    else
      RandomHome.setTandA(["Oh, that muffin. Can I have it?","Wow thanks!\nMunch... munch...",
      "That was an amazing muffin.","Do you know who made this?",
      "Some stranger who lives light years\naway from here?","I see..",
      "Well I should leave now if I want to\nmeet them before I get hungry again.",
      "Thanks. Bye."],triggerFinalPart);

  }
  else RandomHome.setTandA();

}

let talkToMDude=()=>
  talkedToMysteryDudeOnce=true;



let homeObjectText=()=>{
  let make;

  // what's a type of muffin we can make?
  for(let b in inventory)
    if(inventory[b]>4) make = b;

  // if we can make something, make it
  if(talkedToMomOnce&&make){
    muffinType=make;
    HomeObject.setTandA(["Oh! You brought berries!\nLet's make muffinnnnzzzz",
      ".....","all done!\nhere's a "+muffinType+" muffin"], makeMuffins);
    make = undefined
  }
  // otherwise just talk to mom
  else HomeObject.text= HomePlanetText;
}

let makeMuffins =()=>{
  if(inventory[muffinType]>4){
    inventory[muffinType] -= 5;
    AddToInventory(muffinType+" muffin");
  }
}


// triggerstorystart()
//
// first trigger in the game. interact with the home before you can
// enter the rocket.

let triggerStoryStart=()=> canBoard = true;


// triggerTommysHouseFound
//
// LOL it's todd now. second trigger in the game:
// go interact with todd's house. it enables the couch text,
// where you find todd's note

let triggerTommysHouseFound=()=>{

  mutechords = false;
  // disable flight instructions since we succesfully landed somewhere.
  HelpOff = true;
  // update couch text

  HomeCouch.text=HCouchText2;

}

// triggergotoplanetsonright()
//
// todd's note sends you to planets on the right.
// create those (3) planets and litter them with cheese.

let triggerGoToPlanetsOnRight=()=>{
  if(!rightPlanetsEnabled){

    let p = ToddsPlanet;
    for(let i=0; i<3; i++){
      p = new Planet(p.x+roughly(9000), p.y+roughly(0), true);
      p.addCheese();
    }

    rightPlanetsEnabled = true;
    muteimprov = false;
  }
}




// nextCrackerText()
//
// set which text appears during the part with crackers on 3 planets
let nextCrackerText=()=>{
  let l = planetsIFoundCrackersOn.length;
  let t;

  if(l==0) t = CrackerText;
  else if(l==1) t = CrackerText2;
  else if(l==2) t = CrackerText3;

  availableText2=t;
  textCounter =0;
}

// closeTextBox()
//
// close text popup
let closeTextBox=()=> availableText2 = undefined;


// playerFoundCracker()
//
// in class StaticObject (object.js)
// what to do when player finds crackers
let playerFoundCracker=()=>{

  if(!planetsIFoundCrackersOn.includes(player.nearestPlanet)){
    // display text
    nextCrackerText();
    planetsIFoundCrackersOn.push(player.nearestPlanet);
  }

  // keep a score for funsies
  AddToInventory("cracker");
}

// triggered in player.js:HandlePlayerInputs()
// when crackers have been found on 2 planets
let triggerCrackerInvestigation=()=>{
  //console.log("trigg")
  if(!investigationTriggered&&dist(player,player.nearestPlanet)>2000){
    //console.log("trigger")
    continueInvestigation();

    InvestigationText = ["I don't get it","I found nothing but a bunch \nof cheese crackers"
      ,"What does it all mean?","Is Todd ok?",
      "I need a clue! \nHEY CRACKER!","TAKE ME TO YOUR LEADER!","\"fine.\"","what?",`"head to the planet called ${MysteryPlanet.name}"`,
      "I'm not eating any more of these crackers!"];

    availableText2 = InvestigationText;
    investigationTriggered = true;
    textCounter =0;
    LandPlayer();
  }
}


let continueInvestigation=()=>{

  // new planet
  MysteryPlanet = new Planet(player.x + roughly(15000), player.y-roughly(0), true);
  MysteryPlanet.addCheese();

  // this is the object thru which we interact with the mystery guy
  RandomHome = new StaticObject(-90,40,home_png, 120, RandomHomeText1);
  MysteryPlanet.addFeature(RandomHome);
}




let triggerFinalPart=()=>{
  mysteryDudeGone = true;
  FinalPlanet = new Planet(player.x+roughly(6000),player.y+roughly(8000), true);
  FinalPlanet.addCheese();
  FinalPlanet.addFeature(new StaticObject(80,-80,vessel_png,80,ToddsVesselText1,jamWithTodd));
}


let jamWithTodd=()=>{
  console.log("win")
}
