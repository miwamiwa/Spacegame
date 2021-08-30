

class Vessel extends AnimObject {
  constructor(x,y,size,frames){

    super(x,y,size,frames);

    this.vel = 1;
    this.throttle =0;
    this.mass = VesselMass;

    this.nearestPlanet =undefined;
    this.flame = new AnimObject(0,55,50,FlameAnimation);
    this.children = [this.flame];
    this.gravity = true;
    this.radar = false;
    this.crashed = false;

    this.vx =0;
    this.vy =0;
    this.lastvx =0;
    this.lastvy =0;

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

        let ax = this.throttle * Math.sin(this.bearing);
        let ay = this.throttle * Math.cos(this.bearing);
        // check if new speed is below the speed limit
        if(!( dist({x:0,y:0},{x:this.vx+ax,y:this.vy+ay})
          >SpeedLimit)){
            this.vx += ax;
            this.vy += ay;
        }
      }

      // update flame position according to throttle power
      this.flame.y = 20+Math.min(this.throttle * 20, 40);

      // apply velocity
      this.x += this.vx;
      this.y -= this.vy;

      // save this to check for crashes in planet.js:getGravityFor()
      this.lastvx = this.vx;
      this.lastvy = this.vy;

      // display object, and its children
      this.display(this.children);
    }

    // if crashed
    else this.display();

  }


  applyGravity(){

    if(this.nearestPlanet!=undefined){

      let p = this.nearestPlanet;
      let d = dist(this,p);

      // if we're beyond range of gravity (which == mass lol)
      // then nearest planet is undefined.
      if(d >= p.mass)
        this.nearestPlanet =undefined;

      else {
        // if in gravity range:

        // get gravity factor
        let g = p.getGravityFor(this,d);

        // if landed, set velocity
        if(this.landed){
          this.vx =0;
          this.vy =0;
        }

        // if in flight, apply gravity
        else {
          let dir = directionFromObjectToObject(p,this);
          this.vx +=  g * dir.x;
          this.vy +=  g * dir.y;
        }
      }
    }
  }

  // crash()
  // things to do when crash happens
  crash(){
    this.crashed = true;
    crashtext = RandomFromArray(FailTextList);
    this.crashFrame = this.counter;
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
        p.d2p = abs(flo(d));

        // update radar.
        if(this.radar){
          // add to radar list if in range
          if(d>p.radius + RadarMin&&d<p.radius + RadarMax)
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
      let radarArrowDist = 150;


      this.onradar.forEach(p=>{

        if(p.d2p >= p.radius + 200){
          //console.log("radar")
          let dir = directionFromObjectToObject(this,p);
          mCtx.save();
          mCtx.translate(
            middle.x+radarArrowDist * -dir.x,
            middle.y+radarArrowDist * dir.y
          );

          // draw line
          mCtx.beginPath();
          mCtx.strokeStyle = "white";
          mCtx.moveTo(-dir.x*20,dir.y*20);
          mCtx.lineTo(-dir.x*50,dir.y*50);
          mCtx.stroke();

          // draw text
          let visit = "";
          if(p.visited){
            visit = " (visited)";
            mCtx.fillStyle = "green";
          }
          else mCtx.fillStyle = "white";
          mCtx.fillText("planet: "+p.name+visit+". distance: "+p.d2p,-35,0);
          mCtx.fillStyle="tomato"
          if(!HelpOff&&p.d2p<5000) mCtx.fillText("press L to slow down before landing", -35,15)

          mCtx.restore();
        }
      });
    }
  }

  // accelerate
  plusThrottle(amount){
  //  console.log("plus")
    this.throttle = Math.min(this.throttle + amount, AccelerationLimit);
  }

  // decelerate
  minusThrottle(amount){
    //console.log("minus")
    this.throttle = Math.max(player.throttle - amount, 0);
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
    this.vx =0;
    this.vy =0;
    this.throttle =0;
    this.bearing =0;
    this.fcount =0;
  }
}
