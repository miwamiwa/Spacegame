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
    this.firstReadAction = firstReadAction;
  }
  display(){
    if(this.edible) this.interact();
    //console.log(this.img)
    if(this.active&&this.img!=undefined)
      mCtx.drawImage(this.img.img, this.x-this.halfsize, this.y-this.halfsize, this.size, this.size);
  }

  interact(){
    if(this.active){
      let d = dist(this,player);
      if(d<20){
        moveTowards(this,player,2);

        if(d<4){
          this.active = false;
          playerFoundCracker();
        }
      }
    }

  }

}
