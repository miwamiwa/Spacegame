class Camera {
  constructor(target){
    this.x = target.x;
    this.y = target.y;
    this.middle = {x:0,y:0};
    this.targetisdude = false;
  }

  update(){

    if(!this.targetisdude){
      this.x = player.x;
      this.y = player.y;
    }
    else {
      this.x = player.nearestPlanet.x+Dude.x;
      this.y = player.nearestPlanet.x+Dude.y + 200;
    }

    this.middle.x = this.x - middle.x;
    this.middle.y = this.y - middle.y;

  }

  // position object relative to camera target
  position(input){
    return {x: input.x - this.middle.x ,
    y: input.y - this.middle.y };
  }

  // check if input object is visible
  isOnScreen(pos,half){
    if(pos.x>-half&&pos.x<mainCanvas.width+half){
      if(pos.y>-half&&pos.y<mainCanvas.height+half){
        return true;
      }
    }
    return false;
  }

  targetIsDude(){
    this.targetisdude=true;
  }

  targetIsVessel(){
    this.targetisdude=false;
  }

}
