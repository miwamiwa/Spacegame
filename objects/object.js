

class StaticObject extends BasicObject {

  constructor(x,y,img,size,text,firstReadAction){
    // initialize object
    super(x,y,size,img,text,firstReadAction);
    this.setCollider();
    this.berries=randi(1,4);
  }



  // for tree objects
  lootBerry(){
    for(let i=0; i<this.berries; i++)
    AddToInventory({name:this.berry,type:"berry"});
    this.talker = undefined;
  }

  berryText(){
    return ["this tree has "+this.berry.replace("berry","")+"berries.","You picked "+this.berries+" "+plural(this.berry)+"."]
  }


  display(){
    if(this.active){
      // display sprite
      transform(xy(this.x,this.y),()=>{
        hue(this.hue);
        image(this.img,0,0,this.half,this.size);
      });


      if(this.edible) this.interact();
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
