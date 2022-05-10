class Camera {
  constructor(){
    this.middle={}
    this.targetIsDude();
  }

  update(){

    // lock on target
    if(!this.targetisdude) setV(this,player);
    else setV(this,addV(nP,Dude));

    //set camera center
    setV(this.middle,subV(this,middle));

    //console.log(player.throttle,this.middle,player.x,player.y)
  }

  // position object relative to camera target
  position(i){
    return subV(i,this.middle);
  }

  // check if input object is visible
  isOnScreen(p,half){
    if(range(p.x,half,mainCanvas.width)){
      if(range(p.y,half,mainCanvas.height))
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
