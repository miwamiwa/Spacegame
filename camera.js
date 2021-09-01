class Camera {
  constructor(){
    this.middle={}
    this.targetIsDude();
  }

  update(){

    // lock on target
    if(!this.targetisdude) setV(this,player);
    else setV(this,addV(player.nearestPlanet,Dude));

    //set camera center
    setV(this.middle,subV(this,middle));
  }

  // position object relative to camera target
  position(input){
    return subV(input,this.middle);
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
