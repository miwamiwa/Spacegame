const ItemPickupRange = 34;

class SimpleObject {
  constructor(x,y,img,size,text,firstReadAction){
    this.x = x;
    this.y = y;
    this.img = img;
    this.size = size;
    this.halfsize = size/2;
    this.collider = true;
    this.collidersize = size * 0.65;
    this.talkrange = size * 0.8;
    this.text = text;
    this.edible = false;
    this.active = true;
    this.id="";
    this.hue =0;
    this.firstReadAction = firstReadAction;
  }



  display(){
    //pickup item
    if(this.edible) this.interact();

    if(this.active&&this.img!=undefined){
      mCtx.save();
      if(this.hue!=0)
        mCtx.filter = `hue-rotate(${this.hue}deg)`;
      //let dy =0;
      //if(this.type=="tree") dy -= this.halfsize;

      mCtx.drawImage(this.img.img, this.x-this.halfsize, this.y-this.halfsize, this.size, this.size);
      mCtx.restore();
    }
  }

  interact(){
    //console.log("ey!")
    if(this.active && player.landed && !player.boarded){
      let p = player.nearestPlanet;
      if(p==undefined) return;

      let trupos = {x:this.x+p.x,y:this.y+p.y};
      let pTrupos = {x:player.x+player.dude.x,y:player.y+player.dude.y};

      if(dist(trupos,pTrupos)<ItemPickupRange){
        this.active = false;
        if(this.id=="cheese")
        playerFoundCracker();
      }
    }
  }

}
