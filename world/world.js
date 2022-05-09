// canvas
let mainCanvas;
let mCtx;
let middle = xy(400,260);
let canvasSize;

// Planets
let HomePlanet;
let GrandpaPlanet;
let MechanicPlanet;

// npc
let Mom;
let Grandpa;
let Shop;
let Son2;
let Scientist;



// setupcanvas()
//
// called on start. setup the canvas area,
// and the key inputs as well

let setupCanvas=()=>{
  // create canvas
  mainCanvas = canv();
  mainCanvas.id="mainCanvas"
  canvasSize = xy(800,600);

  mainCanvas.width = canvasSize.x;
  mainCanvas.height = canvasSize.y;

  mCtx = getCtx(mainCanvas);
  mCtx.font = "bold "+font+"px Arial";

  mainMouse = attachMouseControls(newMouseData(),mainCanvas,mouseClickedOverCanvas,mainCanvasMouseOver);

  let b=document.body;
  document.getElementById("canvasarea").appendChild(mainCanvas);
  b.onkeydown = keyDown;
  b.onkeyup = keyUp;
}



// setupPlanets()
//
// create home planet and todd's planet

let setupPlanets=()=>{

  // create home planet:

  let p = addV(xy(0,551),player);
  HomePlanet = new Planet(p.x,p.y, false, "Home, sweet home", 550, 7, false);
  closestPlanet=planets[0];

  let homeobject = new StaticObject(0,0,home_png, 100, HomeText);
  homeobject.name="my house"
  HomePlanet.addFeature( homeobject, 100);
  HomePlanet.special=true;
  Mom = HomePlanet.addFeature( new AnimObject(0,0,100,poses[0],MomText), 100);
  Mom.DialogUpdate = UpdateMomText;
  Mom.name="mom";
  planetMode(Mom);

  Son2 = HomePlanet.addFeature( new AnimObject(0,0,40,poses[0],Son2Text), 50);
  Son2.name="Son II (my brother)"
  planetMode(Son2);

  let workshop = HomePlanet.addFeature( new StaticObject(0,0,home_png, 80, WorkshopText), 100);
  workshop.hue = 80;
  workshop.DialogUpdate = updateWorkshopText;
  workshop.name="workshop"

  // create grandpas's planet:

  p=addV(xy(200,-12000),HomePlanet);
  GrandpaPlanet = new Planet(p.x,p.y, false, "Grandpa's", 410, false);
  GrandpaPlanet.special=true;
  GrandpaPlanet.setupMusic(false);
  GrandpaPlanet.addFeature(new StaticObject(80,0,home_png, 80));
  GrandpaPlanet.addFeature(new StaticObject(0,0,vessel_png, 100, ["Grandpa's ship"]),70);
  Grandpa = GrandpaPlanet.addFeature(new AnimObject(0,0,100,poses[0],GrandpaText), 100);
  Grandpa.DialogUpdate = UpdateGPText;
  Grandpa.name="grandpa"
  planetMode(Grandpa);

  // create the mechanic's planet:

  p=addV(xy(roughly(12000), 600),GrandpaPlanet);
  MechanicPlanet = new Planet(p.x,p.y,false,"Timmy", 340, false);
  MechanicPlanet.setupMusic(false);
  MechanicPlanet.special=true;
  Shop=MechanicPlanet.addFeature(new StaticObject(0,0,home_png, 140, ShopText), 100);
  Shop.DialogUpdate = updateMechanicText;
  Shop.hue=flo(rand(360));
  Shop.name="mechanic's shop";

  Scientist = MechanicPlanet.addFeature( new AnimObject(0,0,100,poses[0]), 100);
  Scientist.name="a man of science";
  Scientist.hue=flo(rand(360));
  Scientist.setTandA([
    "Yo dude!",
    "me? I'm a scientist.\nI do science stuff all day.",
    "#cool I know",
    "looks like you might want\nto be a scientist too!",
    "here take this and go explore places\nk bye",
    ""
  ],()=>{
    console.log("received a map!");
    availableText=undefined
    receiveMap();
    Scientist.setTandA([
      "i friggen love science","you.. go explore stuff!"
    ],undefined);
  });
  planetMode(Scientist)

}

// planetMode()
//
// Setup an AnimObject to work as a
// planet feature

let planetMode=(obj,h)=>{
  obj.planetMode=true;
  if(!h) obj.hue=flo(rand(360));
  obj.setCollider();
}


// Grandpa's quest
//
//

let gpQuest=false;
let grandpaQuestStart=()=>{
  if(!gpQuest){
    for(let i=0; i<70; i++)
    AddToInventory({name:cash,type:cash});
    gpQuest=true;
  }
}
