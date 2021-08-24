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

const InvestigationText = ["yo! these cheese crakers....."];


let mainCanvas;
let mCtx;
let middle = {};
let canBoard = false;
let rightPlanetsEnabled = false;

function setupCanvas(){
  mainCanvas = document.getElementById("canvas");
  mainCanvas.width = 600;
  mainCanvas.height = 600;


  middle.x = 300;
  middle.y = 200;
  mCtx = mainCanvas.getContext("2d");
  mCtx.imageSmoothingEnabled= false;
  document.body.appendChild(mainCanvas);
  document.body.onkeydown = keyDown;
  document.body.onkeyup = keyUp;
}


function setupPlanets(){
  // place a planet below player
  let p = new Planet(player.x,player.y, false, "Home, sweet home");
  planets.push(p);
  p.setRadMas(150,1500);

  p.y += p.radius + Planet1Distance;
  p.groundColor = "#a37765ff";
  p.groundColor2 = "#9e857b88";
  p.features.push(new SimpleObject(0,0,home_png, 100, HomePlanetText, triggerStoryStart));


  let p2 = new Planet(p.x + 200, p.y-8000, false, "Todd's place");
  planets.push(p2);
  p2.setRadMas(210,1200);

  p2.features.push(new SimpleObject(80,0,home_png, 100, ToddsHomeText, triggerTommysHouseFound));
  p2.features.push(new SimpleObject(-90,40,couch_png, 100, CouchText1))
}

function triggerStoryStart(){
  canBoard = true;
}

function triggerTommysHouseFound(){
  player.nearestPlanet.features[1].text = CouchText2;
  player.nearestPlanet.features[1].firstReadAction = triggerGoToPlanetsOnRight;
}

function triggerGoToPlanetsOnRight(){
  if(!rightPlanetsEnabled){

    // add planet 1
    let p0 = planets[1];
    let pos = {
      x:p0.x + rand(14000,16000),
      y:p0.y-rand(-1000,1000)
    }
    let p = new Planet(pos.x, pos.y, true);
    p.addCheese();
    planets.push(p);

    for(let i=0; i<2; i++){
      // add planets 2,3
      pos.x += rand(4000,6000);
      pos.y += rand(-1000,1000);
      p = new Planet(pos.x, pos.y, true);
      p.addCheese();
      planets.push(p);
    }

    rightPlanetsEnabled = true;
  }
}

let planetsIFoundCrackersOn = [];
function playerFoundCracker(){
  console.log("found cracker");
  if(!planetsIFoundCrackersOn.includes(player.nearestPlanet)){
    planetsIFoundCrackersOn.push(player.nearestPlanet);
  }
}

// triggered in player.js:HandlePlayerInputs()
// when crackers have been found on 2 planets
let investigationTriggered = false;
function triggerCrackerInvestigation(){
  if(!investigationTriggered){
    let so = new SimpleObject(0,0,undefined,10,InvestigationText,continueInvestigation);
    player.children.push(so);
    so.collider = false;
    investigationTriggered = true;
  }
}


function continueInvestigation(){
  player.children.pop();

  // new planet
  let pos = {
    x:player.x + rand(14000,16000),
    y:player.y-rand(-1000,1000)
  }
  let p = new Planet(pos.x, pos.y, true);
  p.addCheese();
  planets.push(p);

  // this should be a dude not a couch lol
  p.features.push(new SimpleObject(-90,40,couch_png, 100, CouchText1));

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
