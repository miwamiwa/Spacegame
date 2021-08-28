const HomePlanetText = [
  "This is my home... \nI've lived here for the past 30 years.",
  "Pretty neat."
];

const ToddsHomeText = [
  "This is Todd's home.\nThe jam space is in the basement.",
  "Ring! ring!!",
  "...",
  "Todd's not here.",
  "What's that over here? A package with a note...",
  "\"Sorry for the delay, \nThis box should complete your recent order of",
  "875 bags of cheese crackers.\nThank you for your business. You are our favorite customer.\" ",
  "Todd WAS here all right!"
];

const CouchText1 = ["This couch..."];
const CouchText2 = ["This is Todd's couch.\nBest couch ever!",
"This couch, in this place, it's the best view ever.\nTrust me we tried all the couches.",
"Oh dang, a note",
"\"scurred off to one of the planets to the right.\nprolly gonna hit up all of em\""]

// text which appears during the part with crackers on 3 planets
const CrackerText = ["a cracker","munch... munch...","Most definitely Todd's cracker"];
const CrackerText2 = ["More crackers.","But where is Todd?"];
const CrackerText3 = ["These crackers are literally \neverywhere!"];

// this is to count how many planets we explored
// during cracker on 3 planets part
let planetsIFoundCrackersOn = [];

// the investigation follows the crackers on 3 planets part
let investigationTriggered = false;

let InvestigationText = [];

const HomePlanetRadius = 250;
const DistanceToTodd = 12000;

let HomePlanet;
let ToddsPlanet;
let ToddsCouch;
let MysteryPlanet;


let HelpOff = false; // display flight instructions

let mainCanvas;
let mCtx;
let middle = {};
let canBoard = false;
let rightPlanetsEnabled = false;

let crackersFound =0;


function trackQuests(){
  if(player.boarded && rightPlanetsEnabled && planetsIFoundCrackersOn.length>1){
    triggerCrackerInvestigation();
  }
}
// setupcanvas()
//
// called on start. setup the canvas area,
// and the key inputs as well

function setupCanvas(){

  // create canvas
  mainCanvas = document.getElementById("canvas");
  mainCanvas.width = 600;
  mainCanvas.height = 600;
  mCtx = mainCanvas.getContext("2d");
  mCtx.imageSmoothingEnabled= false;
  document.body.appendChild(mainCanvas);
  // middle of the canvas
  middle.x = 300;
  middle.y = 260;
  // key controls
  document.body.onkeydown = keyDown;
  document.body.onkeyup = keyUp;
}


// setupPlanets()
//
// create home planet and todd's planet

function setupPlanets(){

  // create home planet
  HomePlanet = new Planet(player.x,player.y + HomePlanetRadius + Planet1Distance, true, "Home, sweet home", HomePlanetRadius, 1500);
  planets.push(HomePlanet);

  // place home
  let pos = HomePlanet.findAvailableSpot();
  HomePlanet.features.push(new StaticObject(pos.x,pos.y,home_png, 100, HomePlanetText, triggerStoryStart));
  // sort planet sub-elements by y coordinate
  HomePlanet.sortFeatures();

  // create todd's planet
  ToddsPlanet = new Planet(HomePlanet.x + 200, HomePlanet.y-DistanceToTodd, true, "Todd's place",310,1200);
  planets.push(ToddsPlanet);

  // create todd's home
  ToddsPlanet.features.push(new StaticObject(80,0,home_png, 100, ToddsHomeText, triggerTommysHouseFound));
  // create couch
  ToddsCouch = new StaticObject(-90,40,couch_png, 100, CouchText1);
  ToddsPlanet.features.push(ToddsCouch);
  // sort planet sub-elements
  ToddsPlanet.sortFeatures();
}


// triggerstorystart()
//
// first trigger in the game. interact with the home before you can
// enter the rocket.

function triggerStoryStart(){
  canBoard = true;

}

// triggerTommysHouseFound
//
// LOL it's todd now. second trigger in the game:
// go interact with todd's house. it enables the couch text,
// where you find todd's note

function triggerTommysHouseFound(){

  mutechords = false;
  // disable flight instructions since we succesfully landed somewhere.
  HelpOff = true;
  // update couch text
  ToddsCouch.text = CouchText2;
  // assign next trigger to couch
  ToddsCouch.firstReadAction = triggerGoToPlanetsOnRight;

}

// triggergotoplanetsonright()
//
// todd's note sends you to planets on the right.
// create those (3) planets and litter them with cheese.

function triggerGoToPlanetsOnRight(){
  if(!rightPlanetsEnabled){

    let p = ToddsPlanet;
    for(let i=0; i<3; i++){

      p = new Planet(p.x+rand(8000,11000), p.y+rand(-1000,1000), true);
      p.addCheese();
      planets.push(p);

    }

    rightPlanetsEnabled = true;

    // add improv line to BGM
    muteimprov = false;
  }
}




// nextCrackerText()
//
// set which text appears during the part with crackers on 3 planets
function nextCrackerText (){
  let l = planetsIFoundCrackersOn.length;
  textCounter =0;
  if(l==0)
    availableText2 = CrackerText;
  else if(l==1)
    availableText2 = CrackerText2;
  else if(l==2) availableText2 = CrackerText3;
  else availableText2=undefined;
}

// closeTextBox()
//
// close text popup
function closeTextBox(){
  availableText2 = undefined;
}


// playerFoundCracker()
//
// in class StaticObject (object.js)
// what to do when player finds crackers
function playerFoundCracker(){

  if(!planetsIFoundCrackersOn.includes(player.nearestPlanet)){
    // display text
    nextCrackerText();
    planetsIFoundCrackersOn.push(player.nearestPlanet);
  }

  // keep a score for funsies
  crackersFound++;
}

// triggered in player.js:HandlePlayerInputs()
// when crackers have been found on 2 planets
function triggerCrackerInvestigation(){
  if(!investigationTriggered&&player.nearestPlanet==undefined){

    continueInvestigation();


    InvestigationText = ["I don't get it","I found nothing but a bunch \nof cheese crackers"
      ,"What does it all mean?","Is Todd ok?",
      "I need a clue! \nHEY CRACKER!","TAKE ME TO YOUR LEADER!","\"fine.\"","what?",`"head to the planet called ${MysteryPlanet.name}"`,
      "I'm not eating any more of these crackers!"];
    availableText2 = InvestigationText;

    console.log("investigation started")
    investigationTriggered = true;
    textCounter =0;
  }
}


function continueInvestigation(){

  // new planet
  let pos = {
    x:player.x + rand(14000,16000),
    y:player.y-rand(-1000,1000)
  }
  MysteryPlanet = new Planet(pos.x, pos.y, true);
  MysteryPlanet.addCheese();
  planets.push(MysteryPlanet);

  // this should be a dude not a couch lol
  MysteryPlanet.features.push(new StaticObject(-90,40,couch_png, 100, CouchText1));
  MysteryPlanet.features[MysteryPlanet.features.length-1].collider = false;
  // wouldbe nice if the dude sends you on a stupid / mundane quest
  // that makes him seem more annoying than anything else

  // perhaps he's the dude who offended todd?
  // could there be a (subtle?) link there?

  // once the quest is done, the dude points you to 2-3 more planets
  // theres wierd stuff on the planets

  // todd appears on a moon just off the last planet
  // conversation with todd

  // the end, pan out?
}
