class Camera {
  constructor(target){
    this.x = target.x;
    this.y = target.y;
    this.target = target;
    this.panVel = 1;
    this.middle = {x:0,y:0};
    this.rotation =0;
    this.targetRotation =0;
    this.targetisdude = false;
    this.rotateRate =0.06;
  }

  update(){

    this.panVel = Math.abs(player.throttle);

    if(!this.targetisdude){
      this.x = this.target.x;
      this.y = this.target.y;
    }
    else {
      this.x = player.x + player.dude.x;
      this.y = player.y + player.dude.y;
    }

    this.middle.x = this.x - middle.x;
    this.middle.y = this.y - middle.y;

    if(player.landed){
      this.targetRotation = - player.bearing;
    }
    else this.targetRotation =0;

    this.rotating = false;
    if(this.rotation+this.rotateRate<this.targetRotation){
      this.rotating = true;
      this.rotation += this.rotateRate;
    }
    else if (this.rotation-this.rotateRate>this.targetRotation){
      this.rotating = true;
      this.rotation -= this.rotateRate;
    }
  }

  rotateCam(){

    mCtx.translate(middle.x,middle.y);
    mCtx.rotate(this.rotation);
    mCtx.translate(-middle.x,-middle.y);
  }

  // position()
  //
  // position input relative to camera target
  position(input){
    return {x: input.x - this.middle.x - input.halfsize,
    y: input.y - this.middle.y - input.halfsize};
  }

  isOnScreen(pos,halfsize){
    if(pos.x>-halfsize&&pos.x<mainCanvas.width+halfsize){
      if(pos.y>-halfsize&&pos.y<mainCanvas.height+halfsize){
        return true;
      }
    }
    return false;

  }
  targetIsDude(){
    this.targetisdude=true;
  }

  targetIsVessel(){
    this.targetisdude = false;
  }


}
