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
  HomePlanet = new Planet(p.x,p.y, false, "Home, sweet home", HomePlanetRadius, 1500, 7);
  HomePlanet.addFeature( new StaticObject(0,0,home_png, 100, HomeText), 100);
  Mom = HomePlanet.addFeature( new AnimObject(0,0,100,poses[0],MomText), 100);
  planetMode(Mom);

  // create grandpas's planet
  p=addV(xy(200,-12000),HomePlanet);
  GrandpaPlanet = new Planet(p.x,p.y, false, "Grandpa's",410,1200);
  GrandpaPlanet.addFeature(new StaticObject(80,0,home_png, 80));
  GrandpaPlanet.addFeature(new StaticObject(0,0,vessel_png, 100),70);
  Grandpa = GrandpaPlanet.addFeature(new AnimObject(0,0,100,poses[0],GrandpaText), 100);
  planetMode(Grandpa);

  // create the mechanic's planet
  p=addV(xy(roughly(12000), 600),GrandpaPlanet);
  MechanicPlanet = new Planet(p.x,p.y,false,"Timmy",340, 1200);
  Shop=MechanicPlanet.addFeature(new StaticObject(0,0,home_png, 140, ShopText), 100);
  Shop.hue=flo(rand(360));
  Shop.shop=ShopItems;
}

let planetMode=(obj,h)=>{
  obj.planetMode=true;
  if(!h) obj.hue=flo(rand(360));
  obj.setCollider();
}

let grandpaQuestStarted=false;
let grandpaQuestStart=()=>{
  if(!grandpaQuestStarted){
    for(let i=0; i<70; i++)
    AddToInventory({name:cash,type:cash})

    grandpaQuestStarted=true;
  }


}

// closeTextBox()
//
// close text popup
let closeTextBox=()=> availableText2 = undefined;
