const CrashAnimLength = 120;
const CrashThreshold = 18; // see planet.js

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

        if(!(
          dist({x:0,y:0},{x:this.vx+this.throttle,y:this.vy+this.throttle})
          >SpeedLimit)){
            this.vx += this.throttle * Math.sin(this.bearing);
            this.vy += this.throttle * Math.cos(this.bearing);
        }


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
    if(this.counter % 2 ==0){

      this.onradar = [];
      planets.forEach(p=>{
        let d = dist(this,p);

        if(d < p.gravity.range)
          this.nearestPlanet = p;

        p.d2p = abs(flo(d));
        if(this.radar){

          if(d>p.radius + this.radarMinRange&&d<p.radius + this.radarMaxRange)
            this.onradar.push(p);

          else if(p.visited)
            this.onradar.push(p);
        }
      });
    }
  }

  displayRadar(){
    if(this.radar && this.boarded){
      let radarArrowDist = 150;


      this.onradar.forEach(p=>{

        if(p.d2p >= p.radius + 200){
          //console.log("radar")
          let dir = directionFromObjectToObject(this,p);
          mCtx.save();
          mCtx.translate(middle.x,middle.y);
          mCtx.translate(radarArrowDist * -dir.x, radarArrowDist * dir.y);
          let from = {
            x:-dir.x*20,
            y:dir.y*20
          }
          let to = {
            x:-dir.x*50,
            y:dir.y*50
          }
          mCtx.beginPath();
          mCtx.strokeStyle = "white";
          mCtx.moveTo(from.x,from.y);
          mCtx.lineTo(to.x,to.y);
          mCtx.stroke();

          let visit = "";

          if(p.visited){
            visit = " (visited)";
            mCtx.fillStyle = "green";
          }
          else mCtx.fillStyle = "white";

          mCtx.fillText("planet: "+p.name+visit+". distance: "+p.d2p,-35,0);
          mCtx.restore();
        }

      });
    }
  }

  plusThrottle(amount){
    this.throttle = Math.min(this.throttle + amount, AccelerationLimit);
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
