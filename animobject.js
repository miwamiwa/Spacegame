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
    this.preRot =0; // used for player.dude
    this.visible = true;

    //console.log(this)
    //console.log(this.x,this.y);
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
    if(!this.visible) return;

    if(x==undefined) x = this.x;
    if(y==undefined) y = this.y;
    mCtx.save();
    if(this.preRot!=0)
      mCtx.rotate(this.preRot)
    mCtx.translate(x + this.halfsize,y + this.halfsize);
    mCtx.rotate(this.bearing)
    if(children!=undefined){
      for(let i=0; i<children.length; i++){
        let c = children[i];
        if(c.drawMe!=undefined){
          c.drawMe();
          c.updateAnimation();
        }
        else c.display();

        c.counter++;
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
