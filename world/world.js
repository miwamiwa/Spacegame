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
let Son2;

let HelpOff = true; // display flight instructions
let mainCanvas;
let mCtx;
let middle = xy(400,260);
let rightPlanetsEnabled = false;
let crackersFound =0;


// setupcanvas()
//
// called on start. setup the canvas area,
// and the key inputs as well

let setupCanvas=()=>{
  // create canvas
  mainCanvas = canv();
  mainCanvas.width = 800;
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
  let p = addV(xy(0,551),player);
  HomePlanet = new Planet(p.x,p.y, false, "Home, sweet home", 550, 7);
  closestPlanet=planets[0];
  HomePlanet.addFeature( new StaticObject(0,0,home_png, 100, HomeText), 100);
  Mom = HomePlanet.addFeature( new AnimObject(0,0,100,poses[0],MomText), 100);
  //Mom.hat=addHat(100);
  planetMode(Mom);
  Son2 = HomePlanet.addFeature( new AnimObject(0,0,40,poses[0],Son2Text), 50);
  planetMode(Son2);


  // create grandpas's planet
  p=addV(xy(200,-12000),HomePlanet);
  GrandpaPlanet = new Planet(p.x,p.y, false, "Grandpa's", 410);
  GrandpaPlanet.addFeature(new StaticObject(80,0,home_png, 80));
  GrandpaPlanet.addFeature(new StaticObject(0,0,vessel_png, 100, ["Grandpa's ship"]),70);
  Grandpa = GrandpaPlanet.addFeature(new AnimObject(0,0,100,poses[0],GrandpaText), 100);
  planetMode(Grandpa);

  // create the mechanic's planet
  p=addV(xy(roughly(12000), 600),GrandpaPlanet);
  MechanicPlanet = new Planet(p.x,p.y,false,"Timmy", 340);
  Shop=MechanicPlanet.addFeature(new StaticObject(0,0,home_png, 140, ShopText, shopCheck), 100);
  Shop.hue=flo(rand(360));


}


let shopCheck=()=>{
  console.log("shoppin");
  //availableText=undefined;
  //trade(Shop,gpPart,cash,50,false);
  //Shop.firstReadAction=undefined;
}

let planetMode=(obj,h)=>{
  obj.planetMode=true;
  if(!h) obj.hue=flo(rand(360));
  obj.setCollider();
}

let gpQuest=false;
let grandpaQuestStart=()=>{
  if(!gpQuest){
    for(let i=0; i<70; i++)
    AddToInventory({name:cash,type:cash});
    gpQuest=true;
  }
}


// closeTextBox()
//
// close text popup
let closeTextBox=()=> availableText2 = undefined;
