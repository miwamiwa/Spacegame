

class Vessel extends AnimObject {
  constructor(x,y,size,frames){

    super(x,y,size,frames);

    this.throttle =0;
    this.mass = VesselMass;
    this.crashThreshold = CrashThreshold / this.mass;

    this.flame = new AnimObject(0,55,50,FlameAnimation);
    this.children = [this.flame];
    this.gravity = true;
    this.radar = false;
    this.crashed = false;


    this.stop();

  }



  update(){


    if(!this.crashed){

      // update radar and check for nearby
      // planet exerting gravity on this vessel
      this.findNearestPlanet();

      // if affected by gravity, update velocity
      if(this.gravity)
        this.applyGravity();

      // if accelerating, update velocity
      if(this.throttle > 0){

        let vxax = this.vx + this.throttle * Math.sin(this.bearing);
        let vyay = this.vy + this.throttle * Math.cos(this.bearing);
        let d = dist(zero,{x:vxax,y:vyay});

        // if we are below the speed limit, add the acceleration
        if(d<=SpeedLimit){
          this.vx = vxax;
          this.vy = vyay;
        }
        // if we are above the speed limit, gotta compress the speed
        else {
          this.vx = vxax * SpeedLimit / d;
          this.vy = vyay * SpeedLimit / d;
        }

      }

      // update flame position according to throttle power
      this.flame.y = 20+Math.min(this.throttle * 20, 40);

      // apply velocity
      this.x += this.vx;
      this.y -= this.vy;

      // display object, and its children
      this.display(this.children);
    }

    // if crashed
    else this.display();

  }


  applyGravity(){

    if(this.nearestPlanet!=undefined){

      let p = this.nearestPlanet;
      let d =dist(this,p);
      // if we're beyond range of gravity (which == mass lol)
      // then nearest planet is undefined.
      if(d >= p.mass) p=undefined;

      else {
        // if in gravity range:

        // get gravity factor
        let g = p.getGravityFor(this,d);

        // if landed, stop vehicle
        if(this.landed) this.stop();

        // if in flight, apply gravity
        else {
          let dir = directionFromObjectToObject(p,this);
          this.vx +=  g * dir.x;
          this.vy +=  g * dir.y;
        }
      }
    }
  }

  stop(){
    this.vx=0;
    this.vy=0;
  }

  // crash()
  // things to do when crash happens
  crash(){
    this.crashed = true;
    crashtext = RandomFromArray(FailTextList);
    this.crashFrame = this.counter; // time at which crash animation started
    this.setFrames(CrashAnimation);
  }

  // findNearestPlanet()
  //
  // find closest planet, and update list of planets on radar
  // while we're at it
  findNearestPlanet(){
    // no need to do this every frame
    if(this.counter % 2 ==0){
      this.onradar = [];
      // for each planet
      planets.forEach(p=>{
        let d = dist(this,p);

        // are we in gravity range of this planet?
        if(d < p.mass)
          this.nearestPlanet = p;
        // calculate distance to planet
        p.d2p = flo(d);

        // update radar.
        if(this.radar){
          // add to radar list if in range
          if(d>p.r + RadarMin&&d<p.r + RadarMax)
            this.onradar.push(p);
          // add to radar by default if already visited.
          else if(p.visited)
            this.onradar.push(p);
        }
      });
    }
  }

  // displayRadar()
  //
  // display radar ui

  displayRadar(){
    if(this.radar && this.boarded){

      this.onradar.forEach(p=>{
        // don't update if too close to planet
        if(p.d2p >= p.r + RaDist){

          // direction from obj to obj in vector form
          let dir = directionFromObjectToObject(this,p);
          let visit = ""; // did we visit this place?
          let col; // text color (white by default)

          // setup text
          if(p.visited){
            visit = " (visited)";
            col= "green";
          }

          // position
          mCtx.save();
          mCtx.translate(
            middle.x+RaDist * -dir.x,
            middle.y+RaDist * dir.y
          );

          // draw line
          mCtx.beginPath();
          mCtx.strokeStyle = "white";
          mCtx.moveTo(-dir.x*20,dir.y*20);
          mCtx.lineTo(-dir.x*50,dir.y*50);
          mCtx.stroke();

          // draw text
          SplitText("planet: "+p.name+visit+"\ndistance: "+p.d2p,-35,0,col);
          mCtx.restore();
        }
      });
    }
  }

  // accelerate
  plusThrottle(){
  //  console.log("plus")
    this.throttle = Math.min(this.throttle + PlayerAcceleration, AccelerationLimit);
  }

  // decelerate
  minusThrottle(){
    //console.log("minus")
    this.throttle = Math.max(player.throttle - PlayerDeceleration, 0);
  }



  // rotate
  rotate(amount){
    this.bearing = (this.bearing - amount)%TWO_PI;
  }

  // reset to initial position
  resetPos(x,y){
    this.crashed = false;
    this.x = x;
    this.y = y;
    this.bearing =0;
    // this.fcount =0; // don't think anything breaks if i remove this
  }
}
