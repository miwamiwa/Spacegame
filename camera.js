class Camera {
  constructor(target){
    this.x = target.x;
    this.y = target.y;
    this.target = target;
    this.panVel = 1;
    this.middle = {x:0,y:0};
  }

  update(){

    this.panVel = Math.abs(player.throttle);
    //moveTowards(this,this.target,this.panVel);
    this.x = this.target.x;
    this.y = this.target.y;
    this.middle.x = this.x - middle.x;
    this.middle.y = this.y - middle.y;
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
}
