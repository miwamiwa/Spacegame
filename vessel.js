const CrashAnimLength = 120;
const CrashThreshold = 10; // see planet.js

class Vessel extends AnimObject {
  constructor(x,y,size,frames){

    console.log(x,y,size,frames)
    super(x,y,size,frames);

    this.vel = 1;
    this.throttle =0;
    this.mass = 1;

    console.log(this.lastvx,this.lastvy)
    this.nearestPlanet =undefined;
    this.flame = new AnimObject(-20,40,50,FlameAnimation);
    this.children = [this.flame];
    this.gravity = true;
    this.radar = false;
    this.crashed = false;

    this.vx =0;
    this.vy =0;
    this.lastvx =0;
    this.lastvy =0;

    //console.log(this)
    //console.log(this.x,this.y,this.vx,this.vy,this.lastvx,this.lastvy)
  }



  update(){


    //this.vx =0;
    //this.vy =0;

    if(!this.crashed){

      // update radar and check for nearby
      // planet exerting gravity on this vessel
      this.findNearestPlanet();
      //console.log(this.nearestPlanet.name)



      // if affected by gravity, update velocity
      if(this.gravity)
        this.applyGravity();

        //console.log(player);
        //return;

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

      // display object, and its children
      this.display(this.children);
    }

    // if crashed
    else{
      this.display();
    }

  }


  applyGravity(){

    //console.log(this.nearestPlanet)
    if(this.nearestPlanet!=undefined){

      let p = this.nearestPlanet;
      let d = dist(this,p);
      //console.log(d)
      //console.log(this)
      //console.log(p.name)
      if(d >= p.gravity.range){
        this.nearestPlanet =undefined;
      }
      else {
        //console.log(p.name,d)
        let g = p.getGravityFor(this,d);

        //console.log(g)

        if(this.landed){
          this.vx =0;
          this.vy =0;
        }
        else {
          //console.log(p,this)
          let dir = directionFromObjectToObject(p,this);
          //console.log(dir)
          this.vx +=  g * dir.x;
          this.vy +=  g * dir.y;
        }

      }
    }


  }


  findNearestPlanet(){
    if(this.counter % 2 ==0 && this.nearestPlanet==undefined){
      planets.forEach(p=>{
        let d = dist(this,p);

        if(d < p.gravity.range)
          this.nearestPlanet = p;


        if(this.radar){
          this.onradar = [];
          if(d>p.radius + this.radarMinRange&&d<p.radius + this.radarMaxRange){
            this.onradar.push(p);
          }
        }
      });
    }
  }

  displayRadar(){
    if(this.radar){
      let radarArrowDist = 200;
      mCtx.fillStyle = "white";

      this.onradar.forEach(p=>{
        console.log("radar")
        let dir = directionFromObjectToObject(this,p);
        mCtx.save();
        mCtx.translate(middle.x,middle.y);
        mCtx.translate(radarArrowDist * dir.x, radarArrowDist * dir.y);
        mCtx.fillText("planet: "+p.name,0,0);
        mCtx.restore();
      });
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
