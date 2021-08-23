const CrashAnimLength = 120;
const CrashThreshold = 10; // see planet.js

class Vessel extends AnimObject {
  constructor(x,y,size,frames){
    super(x,y,size,frames);

    this.vel = 1;
    this.throttle =0;
    this.mass = 1;
    this.vx =0;
    this.vy =0;
    this.lastvx =0;
    this.lastvy =0;

    this.nearestPlanet =-1;
    this.flame = new AnimObject(-20,40,50,FlameAnimation);
    this.children = [this.flame];
    this.gravity = true;
    this.radar = false;
    this.crashed = false;
  }



  update(){


    //this.vx =0;
    //this.vy =0;

    if(!this.crashed){
      // update radar and check for nearby
      // planet exerting gravity on this vessel
      this.findNearestPlanet();

      // if affected by gravity, update velocity
      if(this.gravity)
        this.applyGravity();

      // if accelerating, update velocity
      if(this.throttle > 0){
        this.vx += this.throttle * Math.sin(this.bearing);
        this.vy += this.throttle * Math.cos(this.bearing);
      }

      // update flame position according to throttle power
      this.flame.y = Math.min(this.throttle * 20, 40);

      // apply velocity
      this.x += this.vx;
      this.y -= this.vy;

      // save this to check for crashes in planet.js:getGravityFor()
      this.lastvx = this.vx;
      this.lastvy = this.vy;

      // display object
      this.display(this.children);
    }

    // if crashed
    else{
      this.display();
    }

  }


  applyGravity(){

    if(this.nearestPlanet!=-1){

      let p = planets[this.nearestPlanet];
      let d = dist(this,p);
      if(d >= p.gravity.range){
        this.nearestPlanet =-1;
      }
      else {
        let g = p.getGravityFor(this,d);

        if(this.landed){
          this.vx =0;
          this.vy =0;
        }
        else {
          let dir = directionFromObjectToObject(this,p);
          this.vx +=  g * dir.x;
          this.vy += - g * dir.y;
        }

      }
    }
  }


  findNearestPlanet(){
    if(this.counter % 2 ==0 && this.nearestPlanet==-1){
      for(let i=0; i<planets.length; i++){
        let d = dist(this,planets[i]);
        if(d < planets[i].gravity.range){
          this.nearestPlanet =i;
          console.log("nearest planet: "+i)
        }

        if(this.radar){
          this.onradar = [];
          if(d>planets[i].radius + this.radarMinRange&&d<planets[i].radius + this.radarMaxRange){
            this.onradar.push(planets[i]);
          }
        }
      }
    }
  }

  displayRadar(){
    if(this.radar){
      let radarArrowDist = 200;
      mCtx.fillStyle = "white";
      for(let i=0; i<this.onradar.length; i++){
        let p = this.onradar[i];
        let dir = directionFromObjectToObject(this,p);
        mCtx.save();
        mCtx.translate(middle.x,middle.y);
        mCtx.translate(radarArrowDist * dir.x, radarArrowDist * dir.y);
        mCtx.fillText("planet",0,0);
        mCtx.restore();
      }
    }
  }

  plusThrottle(amount){
    this.throttle = Math.min(this.throttle + amount, SpeedLimit);
  }

  minusThrottle(amount){
    this.throttle = Math.max(player.throttle - amount, 0);
  }

  rotate(amount){
    this.bearing = (this.bearing - amount)%TWO_PI;
  }

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
