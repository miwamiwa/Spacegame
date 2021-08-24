let mainCanvas;
let mCtx;
let middle = {};
let canBoard = false;
let rightPlanetsEnabled = false;
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
                    "\"scurred off to one of the planets to the right ight. \nprolly gonna hit up all of em\""]

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
  p.radius = 150;
  p.mass = 1500;
  p.gravity.range = p.mass;
  p.y += p.radius + Planet1Distance;
  p.groundColor = "#a37765ff";
  p.groundColor2 = "#9e857b88";
  p.features.push(new SimpleObject(0,0,home_png, 100, HomePlanetText, triggerStoryStart));


  let p2 = new Planet(p.x + 200, p.y-8000, false, "Todd's place");
  planets.push(p2);
  p2.radius = 210;
  p2.mass = 1200;
  p2.gravity.range = p2.mass;

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


function playerFoundCracker(){
  console.log("found cracker")
}
