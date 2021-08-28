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
const PlayerRotateRate = 0.1;
const AccelerationLimit = 3;
const SpeedLimit = 80;
const PlayerWalkVelocity = 4;

const PlayerStartX = 50;
const PlayerStartY = 50;
const PlayerSize = 100;
const DudeSize = 50;

const RadarMin = 200;
const RadarMax = 20000;
const HopDistance = 60;  // dist travelled when hopping off ship


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


// WORLD
const Planet1Distance = 1;

// UTILITIES 
const PI = Math.PI;
const TWO_PI = 2*Math.PI;
const grey = "#eee8";
const white = "#fffc";

// TEXT
const IntroText = ["Welcome","To space game","woop woop"];
const FailTextList = ["Ouch!","Don't scratch the car. -Mom.","Oof."];
