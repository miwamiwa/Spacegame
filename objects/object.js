

class StaticObject extends BasicObject {

  constructor(x,y,img,size,text,firstReadAction){
    // initialize object
    super(x,y,size,img,text,firstReadAction);
    this.setCollider();
    
  }



  // for tree objects
  lootBerry(){
    for(let i=0; i<this.berries; i++) AddToInventory({name:this.berry,type:"berry"});

    let num = randi(3);
    for(let i=0; i<num; i++) AddToInventory({name:"stick",type:"stick"});

    this.talker = undefined;

    new Wiggle(this, 10, 100);
  }




  display(){
    if(this.active){
      // display sprite
      transform(xy(this.x,this.y),()=>{
        this.applyTransform();
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
