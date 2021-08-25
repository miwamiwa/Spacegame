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
    //console.log("ey!")
    if(this.active && player.landed){
      let p = player.nearestPlanet;
      if(p==undefined) return;

      let trupos = {x:this.x+p.x,y:this.y+p.y};
      let pTrupos = {x:player.x+player.dude.x,y:player.y+player.dude.y};

      let d = dist(trupos,pTrupos);
    //  console.log(d)
      if(d<30){
        moveTowards(trupos,pTrupos,6);

        if(d<20){
          this.active = false;
          playerFoundCracker();
        }
      }
    }

  }

}
