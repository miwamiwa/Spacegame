// this is to count how many planets we explored
// during cracker on 3 planets part
let planetsIFoundCrackersOn = [];
let investigationTriggered = false;
let InvestigationText = [];
let HomePlanet;
let GrandpaPlanet;
let Mom;
let Grandpa;
let MechanicPlanet;
let Shop;

let HelpOff = true; // display flight instructions
let mainCanvas;
let mCtx;
let middle = xy(300,260);
let rightPlanetsEnabled = false;
let crackersFound =0;

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
  mCtx.font = "bold "+font+"px Arial";

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
  let p = addV(xy(0,HomePlanetRadius + 1),player);
  HomePlanet = new Planet(p.x,p.y, true, "Home, sweet home", HomePlanetRadius, 1500, 7);
  HomePlanet.addFeature( new StaticObject(0,0,home_png, 100, HomeText), 100);
  Mom = HomePlanet.addFeature( new AnimObject(0,0,100,PlayerAnimation,MomText), 100);
  planetMode(Mom);

  // create grandpas's planet
  p=addV(xy(200,-12000),HomePlanet);
  GrandpaPlanet = new Planet(p.x,p.y, true, "Grandpa's",410,1200);
  GrandpaPlanet.addFeature(new StaticObject(80,0,home_png, 80));
  Grandpa = GrandpaPlanet.addFeature(new AnimObject(0,0,100,PlayerAnimation,GrandpaText), 100);
  planetMode(Grandpa);

  // create the mechanic's planet
  p=addV(xy(roughly(12000), 600),GrandpaPlanet);
  MechanicPlanet = new Planet(p.x,p.y,true,"Timmy",340, 1200);
  Shop=MechanicPlanet.addFeature(new StaticObject(0,0,home_png, 140, ShopText), 100);
  Shop.hue=flo(rand(360));
  Shop.shop=ShopItems;
}

let planetMode=(obj)=>{
  obj.planetMode=true;
  obj.hue=flo(rand(360));
  obj.setCollider();
}


// closeTextBox()
//
// close text popup
let closeTextBox=()=> availableText2 = undefined;
