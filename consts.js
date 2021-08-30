// IMAGE LOAD
const c1 = 48; // start char for char/int conversion

// ANIMATION
const VesselAnimation = [vessel_png,vessel2_png];
const FlameAnimation = [fire1_png,fire2_png];
const CrashAnimation = [crash1_png,crash2_png,crash3_png];
const StarAnimation = [star1_png,star2_png];
const PlayerAnimation = [player1_png,player2_png];
const PlayerWalkLeft = [walk_left_1_png,walk_left_2_png];
const PlayerWalkRight = [walk_right_1_png,walk_right_2_png];
const PlayerWalkUp = [walk_up_1_png,walk_up_2_png];
const PlayerWalkDown = [walk_down_1_png,walk_down_2_png];

// TREE GENERATION
const TreeCanvasW = 100;
const TreeCanvasH = 100;

// PLAYER
const ItemPickupRange = 34; //in SimpleObject (object.js)
const PlayerAcceleration = 0.05;
const PlayerDeceleration = 0.2; // rate at which player.throttle recedes to 0.
const PlayerRotateRate = 0.14;
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
const RaDist = 180;
const RadarMin = 200;
const RadarMax = 20000;


// UI
const TopText = {x: 4, y: 10};
// text box default size
const TextBox = {
  x:100,
  y:100
}

// PLANETS
const GravityConstant = 50;
const PlanetMassMin = 800;
const PlanetMassMax = 2000;
const MinDistanceBetweenFeatures = 50;
const PlanetNames = [ ////https://www.fantasynamegenerators.com/planet_names.php
  "Nuchearus",
"Binvethea",
"Eccurn",
"Hinomia",
"Haotov",
"Peiyama",
"Strutacarro",
"Llenigawa",
"Garvis 5",
"Lloria ER2"
];
const BerryNames=[
  "red","blue","orange","yellow","black"
]


// WORLD
const Planet1Distance = 1;
const HomePlanetRadius = 250;
const DistanceToTodd = 12000;


// STARS
const NumStars = 16;

// UTILITIES
const PI = Math.PI;
const TWO_PI = 2*Math.PI;
const grey = "#eee8";
const white = "#fffc";

// TEXT
const IntroText = ["Welcome","To space game","woop woop"];
const FailTextList = ["Ouch!","Don't scratch the car. -Mom.","Oof."];
const HomePlanetText = [
  "This is my home... \nI've always lived here!","Gooood oleeee hooooomeee","Oh hi mom!","Mom: Hey son! Want a muffin?","Yeah!","Mom: Go find me some berries then!\n5 of any kind. Thanks!","Oh"

];

const HomeCouchText=["This is a nice couch","But you know who has an even\nbetter couch?","My neighbour Todd.","I should go over to Todd's place."]
const HCouchText2 = ["<3 my couch"]
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

const RandomHomeText1 =["Someone's inside...","Uhm hello... I was led here by\na handful of cr..","Nevermind. have you seen my friend Todd?",
"Stranger: Todd? you mean that dork and his\ndorky guitar?","...","Stranger:Yeah I saw him!\nHe came here to hurt my ears!",
"In fact you're hurting my ears!","Get out!"];

const ToddsVesselText1 =["Todd: Hi dude!\nWhat are you doing over here?","You were looking for me??",
"Whadd'ya mean, what am I doing here? ;)","Ealier today someone said I sounded\nterrible","So I got on my ship and started\nlooking for a place with better accoustics"
,"This place is awesome!\nHear that?? Sounds amazing.","You: Todd..","Todd: wat","You: There's no accoustics in space..","You've always sounded awesome","Todd: ....?","Todd: Dang!","Now that you're here, let's jam!"];

const ToddsVesselText2 = ["Todd: Hi dude!","Let's jam!"]
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

const scales = [
  Edorian,FshPhrygi,Edorian,FshPhrygi,
  CLydian,CLydian,CLydian,CLydian,
  ADorian,DMixo,GLydian,CLydian,
  GLydian,CLydian,Fmin7flat5,BMixo,
  Emaj7,FShDorian, Emaj7,FShDorian,
  ALydian,ALydian,ALydian,ALydian,
  ADorian,DMixo,GLydian,CLydian,
  GLydian,
  CLydian,Fmin7flat5, BMixo,
  Edorian,Edorian,Fmin7flat5,BMixo,
  Edorian,Edorian,CLydian,CLydian,
  CLydian,CLydian,AMixo,AMixo,
  GLydian,CLydian,CLydian,DMixo,
  G6,CLydian,G6,CLydian,
  GLydian,CLydian,Fmin7flat5,BMixo
];

const melodyA = [4, 11, 11, 6, 4, 4, -1, 4, 4, 6, 4, false];
const melodyB = [4, 11, 9, 4, 6, 2, 2, 9, 7, 0, false, false];
const melodyC = [-1, 0, 2, 4, 6, 7]
const melodyD = [9, 11, 9, 3, false, false];
const melodyE = [9, 10, 11, 12, false, false];
const melodyF = [false, 11, 11, 11, false, 4, false, 9, 9, 9, false, 3];
const melodyG = [false, 7, 7, 7, false, -1, 4, false, false]
const melodyH = [false, false, 4, 4, 6, 4, 6, 4, 6, 7, 9, 7, 9, false, 7, 11, 12, 11, 12, false, false, false, false, false];
const melodyI = [11, false, false, 7, false, false];

const patterns = [
  [0,1,2,3],
  [0,1,0],
  [0,4,3,0,1],
  [0,4,3],
  [1,2,0]
];

// default octave (improv)
const defoctave = 6;
