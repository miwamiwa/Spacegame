class AnimObject {
  constructor(x,y,size,frames){
    this.x = x;
    this.y = y;

    this.setFrames(frames);

    this.bearing =0;
    this.setSize(size);
    this.counter =0;
    this.fcount =0;
    this.animRate = 5;
    this.bypassCamConstraint = false;
  }

  setFrames(anim){
    this.frames = anim;
    this.img = anim[0];
  }

  setSize(input){

    this.size = input;
    this.halfsize = input/2;
  }
  display(children){
    // get on screen position
    let pos = camera.position(this);

    // check if on screen
    if(this.bypassCamConstraint||camera.isOnScreen(pos,this.halfsize)){

        // draw sprite
      this.drawMe(pos.x,pos.y,children);

      this.updateAnimation();
    }

    // update our inner clock
    this.counter++;
  }

  drawMe(x,y,children){
    if(x==undefined) x = this.x;
    if(y==undefined) y = this.y;
    mCtx.save();
    mCtx.translate(x + this.halfsize,y + this.halfsize);
    mCtx.rotate(this.bearing)
    if(children!=undefined){
      for(let i=0; i<children.length; i++){
        children[i].drawMe();
        children[i].updateAnimation();
        children[i].counter++;
      }
    }
    mCtx.drawImage(this.img.img, -this.halfsize,-this.halfsize , this.size, this.size);
    mCtx.restore();
  }

  updateAnimation(){
    // update animation
    if(this.counter%this.animRate==0){
      this.img = this.frames[this.fcount];
      this.fcount = (this.fcount+1)%this.frames.length;
    }
  }
}
