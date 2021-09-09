const FailTextList = [
  "Ouch!",
  "Don't scratch the car. -Mom.",
  "It takes up to 3000 units of space to stop"
];

const gpPart="gear #5b8gh9";

const HomeText = ["This is my home.","Goood oleee hooooome"]

const Son2Text =[
  "Son II: Hi brother",
  "Have fun out there",
  "Me? Fly?",
  "Pfft"
];
const GrandpaText2 = ["Hi grandson"];
const ShopText = ["Welcome to the shop"];

const ShopRect={x:200,y:200}

const cash = "coin";

const allCurrencies = [
  cash,
  "muffin",
  "bead",
  "berry"
];

const woosh = 100;

const Greetings =[
  "hello","hi!"
];

// IMAGE LOAD
const c1 = 48; // start char for char/int conversion
const poses =[
  [player1_png,player2_png],
  [walk_left_2_png,walk_left_1_png],
  [walk_down_2_png,walk_down_1_png],
  [walk_up_1_png,walk_up_2_png]
]

const allLanguages = [
"Deotruin",
"Shuecdun",
"Uetnesh",
"Onian",
"Etlani",
"Flonaonathi",
"Uqoirtic"
];


// ANIMATION
const Hat = [chapo_png,chapo2_png];
const VesselAnimation = [vessel_png,vessel2_png];
const FlameAnimation = [fire1_png,fire2_png];
const CrashAnimation = [crash1_png,crash2_png,crash3_png];
const StarAnimation = [star1_png,star2_png];
// TREE GENERATION
const TreeCanvasW = 100;
const TreeCanvasH = 100;

// PLAYER
const PlayerAcceleration = 0.045;
const PlayerDeceleration = 0.2; // rate at which player.throttle recedes to 0.
const PlayerRotateRate = 0.14;
const PlayerRotateRate2 = 0.24;
const AccelerationLimit = 3;
const SpeedLimit = 60;
const PlayerWalkVelocity = 4;

const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
const DudeSize = 50;

const HopDistance = 60;  // dist travelled when hopping off ship

const CrashAnimLength = 120;
const CrashThreshold = 18; // see planet.js
const VesselMass = 0.8;


// RADAR
const RaDist = 250;
const RadarMin = 200;
const RadarMax = 20000;


// UI
const TopText = {x: 4, y: 16};
// text box default size
const TextBox = {x:350, y:100};

// PLANETS
const GravityConstant = 50;
const PlanetMassMin = 800;
const PlanetMassMax = 2000;


let font = 15;

//https://www.fantasynamegenerators.com/planet_names.php
const PlanetNames = [
  "Nuchearus",
  "Binvethea",
  "Eccurn",
  "Hinomia",
  "Haotov",
  "Peiyama",
  "Llenigawa",
  "Garvis",
  "Lloria"
];

const BerryNames=[
  "red",
  "blue",
  "orange",
  "yellow",
  "black"
];


// WORLD

const HomePlanetRadius = 550;
const FarRange = 36000;

// STARS
const NumStars = 16;

// UTILITIES
const PI = Math.PI;
const TWO_PI = 2*Math.PI;

// COLORS
const grey = "#eee8";
const white = "#fff9";
const bgFill = "#2a1f42";
const black = "black";
const tbFill = "#445a";
// MUSIC

const Edorian = [4,6,7,9,11,13,14];
const FshPhrygi = [6,7,9,11,13,14,16];
const CLydian = [0,2,4,6,7,9,11];
const ADorian = [9,11,13,14,16,18,19];
const DMixo = [2,4,6,7,9,11,12];
const GLydian = [7,9,11,13,14,16,18];
const Fmin7flat5 = [6,7,9,11,12,14,16];
const BMixo = [11,13,15,16,18,20,21];
const Emaj7 = [4,6,8,10,11,13,15];
const FShDorian = [6,8,9,11,13,15,16];
const ALydian = [9,11,13,15,16,18,20];
const G6 = [7,9,11,13,14,16,18];
const AMixo = [9,11,13,15,16,18,19];

let allScales = [
  Edorian,
  FshPhrygi,
  CLydian,
  ADorian,
  DMixo,
  GLydian
];

const defaultScales = [
  FshPhrygi, GLydian,
  FshPhrygi, GLydian,
  ADorian, GLydian,
  Emaj7,Emaj7
]



const patterns = [
  [0,1,2,3],
  [0,1,0],
  [0,4,3,0,1],
  [5,1,6],
  [2,3,1]
];

// default octave (improv)
const defoctave = 4;
