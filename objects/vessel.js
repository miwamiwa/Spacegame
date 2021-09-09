

class Vessel extends AnimObject {
  constructor(x,y,size,frames,t,f){

    super(x,y,size,frames,t,f);

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

        let v = xy(
          this.vx + this.throttle * Math.sin(this.bearing),
          this.vy + this.throttle * Math.cos(this.bearing)
        );

        let d = dist(zero,v);

        // if we are below the speed limit, add the acceleration
        if(d<=SpeedLimit){
          this.vx = v.x;
          this.vy = v.y;
        }
        // if we are above the speed limit, gotta compress the speed
        else {
          this.vx = v.x * SpeedLimit / d;
          this.vy = v.y * SpeedLimit / d;
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

    if(nP){

      let d =dist(this,nP);
      // if we're beyond range of gravity (which == mass lol)
      // then nearest planet is undefined.
      if(d >= nP.mass) nP=undefined;

      else {
        // if in gravity range:

        // get gravity factor
        let g = nP.getGravityFor(this,d);

        // if landed, stop vehicle
        if(this.landed) this.stop();

        // if in flight, apply gravity
        else {
          let dir = directionFromObjectToObject(nP,this);
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
        if(d < p.mass) nP = p;
        // calculate distance to planet
        p.d2p = flo(d);

        if(p.d2p<closestPlanet.d2p) closestPlanet=p;
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
      let ytaken = [];
      let diff = 24;
      this.onradar.forEach(p=>{
        // don't update if too close to planet
        if(p.d2p >= p.r + RaDist){

          let a= 1;
          let dir = directionFromObjectToObject(this,p);
          // direction from obj to obj in vector form

          let visit = ""; // did we visit this place?
          let col; // text color (white by default)
          let y = diff*flo((middle.y+RaDist * dir.y)/diff);
          // setup text
          if(p.visited){
            visit = " (visited)";
            col= "#6e6";
          }

          if(p.d2p<80000){
            a = Math.max(1, 9-flo(p.d2p/10000));

            let tries = 8;
            while(ytaken.includes(y)&&tries>0){
              y += diff;
              tries--;
            }
            ytaken.push(y);

          }
          col+=a












          // position
          transform(xy(middle.x+RaDist * -dir.x, y + 30),()=>{
            // draw line
            mCtx.beginPath();
            mCtx.strokeStyle = "#eee";
            mCtx.moveTo(-dir.x*20,dir.y*20);
            mCtx.lineTo(-dir.x*50,dir.y*50);
            mCtx.stroke();

            // draw text
            mCtx.font="bold 12px Arial"
            SplitText("planet "+p.name+"\n"+visit+" ("+p.d2p+")",-35,0,col,12);
          });
        }
      });
    }
  }

  // accelerate
  //  console.log("plus")
  plusThrottle(){
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
