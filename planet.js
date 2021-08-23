class Planet {
  constructor(x,y){

    this.radius = rand(200,400);
    this.mass = this.radius * rand(5,20);
    this.gravitationalConstant = 0.1;
    this.halfsize =0; // ellipses start from center point
    this.x = x;
    this.y = y;

    this.gravity = {
      range: this.mass * 1.0
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
        mCtx.fillStyle = "tomato";
        mCtx.beginPath();
        mCtx.ellipse(pos.x,pos.y, this.radius, this.radius, 0,0, TWO_PI);
        mCtx.stroke();
        mCtx.fill();

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
