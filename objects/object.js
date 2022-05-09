

class StaticObject extends BasicObject {

  constructor(x,y,img,size,text,firstReadAction){
    // initialize object
    super(x,y,size,img,text,firstReadAction);
    this.setCollider();

  }

  display(){
    if(this.active){
      // display sprite
      transform(xy(this.x,this.y),()=>{
        this.applyTransform();
        hue(this.hue);
        image(this.img,0,0,this.half,this.size);
      });

      if(
        mainMouse.planetPos
        &&dist(mainMouse.planetPos,this)<=mouseOverDist
      ){
        planetMouseOverTarget=this
      }
      if(this.edible) this.interact();
      if(this.age) this.continueLife();
    }
  }

  /*
  interact(){
  if(!player.boarded){
  // if in range
  if(dist(this,Dude)<34){
  // pick up item
  this.active = false;

  // do something
  //if(this.id=="cheese")
  //  playerFoundCracker();
}
}
}
*/
}
