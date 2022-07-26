const poses =[
  [player1_png,player2_png],
  [walk_left_2_png,walk_left_1_png],
  [walk_down_2_png,walk_down_1_png],
  [walk_up_1_png,walk_up_2_png],

  [walk_upleft_1_png,walk_upleft_2_png],
  [walk_downleft_1_png,walk_downleft_2_png]
]
// ANIMATION
const Hat = [chapo_png,chapo2_png];
const VesselAnimation = [vessel_png,vessel2_png];
const FlameAnimation = [fire1_png,fire2_png];
const CrashAnimation = [crash1_png,crash2_png,crash3_png];
const StarAnimation = [star1_png,star2_png];






const FailTextList = [
  "Ouch!",
  "Don't scratch the car. -Mom.",
  "It takes up to 4000 units of space to stop"
];

const gpPart="gear #5b8gh9";

const HomeText = ["This is my home.","Goood oleee hooooome"]

const Son2Text =[
  "Son II: Yo brother",
  "You scared of ghosts?",
  "Yeah you are",
  "...",
  "Me? No I'm not scared",
  "But you defo are",
  "What's that? You're not scared?",
  "lmao",
  "prove it."
];

const Son2Text2 = [
  "eyyyyyyy",
  "<3 love you bro",
  "Jerry knows alot about ghosts",
  "He might be interested in this stuff too",
  "He lives on planet Blabouze."
]
const GrandpaText2 = ["Hi grandson"];
const ShopText = ["Welcome to the shop","Need parts?","zzz"];

const ShopRect={x:200,y:200}

const cash = "coin";


const woosh = 100;

const Greetings =[
  "hello","hi!","<3"
];

const NegGreetings =[
  "got a muffin for me?", "nope? well then."
];

// IMAGE LOAD
const c1 = 48; // start char for char/int conversion


const allLanguages = [
  "Onian",
"Deotruin",
"Shuecdun",
"Uetnesh",

"Etlani",
"Flonaonathi",
"Uqoirtic"
];


// TREE GENERATION
const TreeCanvasW = 100;
const TreeCanvasH = 100;

// PLAYER
const PlayerAcceleration = 0.045;
const PlayerDeceleration = 0.2; // rate at which player.throttle recedes to 0.
const PlayerRotateRate = 0.14;
const PlayerRotateRate2 = 0.24;
const AccelerationLimit = 3;

const PlayerWalkVelocity = 8;

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
const font = 15;

// PLANETS
const GravityConstant = 50;


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
  "cyan",
  "orange",
  "yellow",
  "black"
];


// WORLD

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
const tbFill = "#445c";



const patterns = [
  [0,1,2,3],
  [0,1,0],
  [1,2,1,3],
  [1,3,5,3,1],
  [4,3,2,1],
  //[5,1,6],
  [2,3,1],
  [0,2,4]
  //[0,2,4,5]
];

// default octave (improv)
const defoctave = 4;
