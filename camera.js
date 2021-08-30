class Camera {
  constructor(){
    this.middle={}
    this.targetIsDude();
  }

  update(){

    if(!this.targetisdude){
      this.x = player.x;
      this.y = player.y;
      //console.log("target is player")
    }
    else {
      this.x = player.nearestPlanet.x+Dude.x;
      this.y = player.nearestPlanet.y+Dude.y-50;
    }
    //console.log(this.x,this.y)
    this.middle.x = this.x - middle.x;
    this.middle.y = this.y - middle.y;

  }

  // position object relative to camera target
  position(input){
    return {x: input.x - this.middle.x ,
    y: input.y - this.middle.y,
  };
  }

  // check if input object is visible
  isOnScreen(pos,half){
    if(pos.x>-half&&pos.x<mainCanvas.width+half){
      if(pos.y>-half&&pos.y<mainCanvas.height+half)
        return true;
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
