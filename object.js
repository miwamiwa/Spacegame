

class StaticObject extends BasicObject {

  constructor(x,y,img,size,text,firstReadAction){
    // initialize object
    super(x,y,size,img);
    this.collider = true;
    this.talker = false;
    this.collidersize = size * 0.65;
    this.talkrange = size * 0.8;
    this.text = text;
    this.edible = false;
    this.firstReadAction = firstReadAction;
  }

  // for tree objects
  lootBerry(){
    AddToInventory(this.berry);
    this.talker = false;
    //availableText = undefined;
  }

  berryText(){
    return ["this tree has "+this.berry+"berries.","You picked a "+this.berry+" berry."]
  }


  display(){
    // handle pickup if this is "edible"
    if(this.edible) this.interact();

    // display sprite
    if(this.active&&this.img!=undefined){
      mCtx.save();
      hue(this.hue);
      image(this.img,this.x,this.y,this.half,this.size);
      mCtx.restore();
    }
  }

  interact(){
    if(this.active && player.landed && !player.boarded){
      let p = player.nearestPlanet;
      if(p==undefined) return;

      // if in range
      if(dist({x:this.x+p.x,y:this.y+p.y},
        {x:player.x+player.dude.x,y:player.y+player.dude.y})<ItemPickupRange){
        // pick up item
        this.active = false;
        if(this.id=="cheese")
          playerFoundCracker();
      }
    }
  }
}
