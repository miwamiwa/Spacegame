const GravityConstant = 40;
const PlanetMassMin = 800;
const PlanetMassMax = 2000;

class Planet {
  constructor(x,y,randomscenery,name){
    // mass and radius
    this.setRadMas(rand(150,320),rand(PlanetMassMin,PlanetMassMax));
    this.gravitationalConstant = GravityConstant;
    this.halfsize =0; // ellipses start from center point
    this.x = x;
    this.y = y;
    this.features = [];
    this.d2p =-1;

    if(name==undefined) name = RandomPlanetName();
    this.name = name;

    this.addBasicFeatures();

    if(randomscenery)
      this.setupScenery();
  }

  setRadMas(rad,mas){
    this.radius = rad;
    this.mass = mas;
    this.gravity = {range:mas};
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
      cracker.collider = false;
      cracker.id="cheese";
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
    // d is the distance from the input object to the center of this planet
    if(d==undefined) d = dist(this,input);

    // nextd is the distance to center in the next frame
    let nextd = dist(this,{x:input.x + input.lastvx, y:input.y + input.lastvy});
    ///console.log(nextd);

    // if this is true, we are touching the surface
    if(nextd<this.radius){

      input.landed = true;
      this.visited = true;
      let vel = dist({x:0,y:0},{x:input.lastvx,y:input.lastvy});

      //console.log(vel)

      // check for threshold velocity at which crash occurs.
      // this is affected by the vehicle's mass (1 by default)
      if(vel>CrashThreshold / input.mass && !input.crashed){
        input.crashed = true;
        crashtext = RandomFailText();
        input.crashFrame = input.counter;
        input.setFrames(CrashAnimation);
        console.log("crash! landed too fast.");
      }
    }
    else input.landed = false;


    if(!input.landed && d>this.radius){
      //console.log("this happened")
      //console.log(this.gravitationalConstant, this.mass, input.mass, d)
      return this.gravitationalConstant * (this.mass * input.mass) / Math.pow(d,2);
    }
    else return 0;
  }
}
