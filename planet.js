//https://www.fantasynamegenerators.com/planet_names.php
const PlanetNames = [
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


let usedPlanetNames = [];

function RandomPlanetName(){
  name = RandomFromArray(PlanetNames);
  while(usedPlanetNames.includes(name))
    name += flo(rand(10));
  usedPlanetNames.push(name);
  return name;
}

class Planet {
  constructor(x,y,randomscenery,name){

    this.radius = rand(200,400);
    this.mass = this.radius * rand(3,12);
    this.gravitationalConstant = 0.1;
    this.halfsize =0; // ellipses start from center point
    this.x = x;
    this.y = y;
    this.features = [];

    if(name==undefined) name = RandomPlanetName();
    this.name = name;

    this.gravity = {
      range: this.mass * 1.0
    }

    this.addBasicFeatures();

    if(randomscenery)
      this.setupScenery();
  }

  addBasicFeatures(){
    let r = flo(rand(80,120));
    let g = flo(rand(80,120));
    let b = flo(rand(80,120));
    let rad = flo(rand(40, 140));

    this.groundColor = `rgba(${r},${g},${b}, 1)`;
    this.groundColor2 = `rgba(${r+20},${g+20},${b+20}, 0.3)`;
    this.spots = [];
    let spots = flo(rand(0,9));
    for(let i=0; i<spots; i++){
      this.spots.push({x:this.rPos(), y:this.rPos(), r:rad+rand(-10,10)});
    }
  }

  // return a random position on this planet
  rPos(){
    return rand(-this.radius,this.radius);
  }

  setupScenery(){

  }

  addCheese(){
    let count = flo(rand(6,12));
    for(let i=0; i<count; i++){
      let pos = {x:this.rPos(),y:this.rPos()};
      let cracker = new SimpleObject(pos.x,pos.y,cracker_png,10);
      cracker.edible = true;
      this.features.push(cracker);
    }
  }

  update(){

    let pos = camera.position(this);
    if(camera.isOnScreen(pos,this.gravity.range)){
      mCtx.save();

        // draw a circle to show range of gravity
        mCtx.fillStyle = "#5594";
        mCtx.beginPath();
        mCtx.ellipse(pos.x,pos.y, this.gravity.range, this.gravity.range, 0,0, TWO_PI);
        mCtx.fill();

        // draw planet
        mCtx.fillStyle = this.groundColor;

        mCtx.beginPath();
        mCtx.arc(pos.x,pos.y, this.radius, 0, TWO_PI, true);
        mCtx.clip();

        mCtx.beginPath();
        mCtx.ellipse(pos.x,pos.y, this.radius, this.radius, 0,0, TWO_PI);
        mCtx.stroke();
        mCtx.fill();

        mCtx.fillStyle = this.groundColor2;
        this.spots.forEach(spot=>{
          mCtx.beginPath();
          mCtx.ellipse(pos.x + spot.x, pos.y + spot.y,spot.r,spot.r,0,0,TWO_PI);
          mCtx.fill();
        });

        mCtx.translate(pos.x,pos.y);
        this.features.forEach(f=>f.display());


      mCtx.restore();
    }
  }

  getGravityFor(input,d){
    if(d==undefined) d = dist(this,input);

    if(dist(this,{x:input.x + input.lastvx, y:input.y + input.lastvy})<this.radius){

      input.landed = true;
      let vel = dist({x:0,y:0},{x:input.lastvx,y:input.lastvy});

      // check for threshold velocity at which crash occurs.
      // this is affected by the vehicle's mass (1 by default)
      if(vel>CrashThreshold * input.mass && !input.crashed){
        input.crashed = true;
        input.crashFrame = input.counter;
        input.setFrames(CrashAnimation);
        console.log("crash! landed too fast.");
      }
    }
    else input.landed = false;


    if(!input.landed && d>this.radius){
      return this.gravitationalConstant * (this.mass * input.mass) / d;
    }
    else return 0;
  }
}
