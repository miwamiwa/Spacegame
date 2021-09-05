

class StaticObject extends BasicObject {

  constructor(x,y,img,size,text,firstReadAction){
    // initialize object
    super(x,y,size,img,text,firstReadAction);
    this.setCollider();

  }



  // for tree objects
  lootBerry(){
    AddToInventory({name:this.berry,type:"berry"});
    this.talker = undefined;
  }

  berryText(){
    return ["this tree has "+this.berry.replace("berry","")+"berries.","You picked a "+this.berry+"."]
  }


  display(){
    if(this.active){
      // display sprite
      mCtx.save();
      hue(this.hue);
      image(this.img,this.x,this.y,this.half,this.size);
      mCtx.restore();

      if(this.edible) this.interact();
    }
  }

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
}
