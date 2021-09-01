class AnimObject extends BasicObject {
  constructor(x,y,size,frames){
    // position,rotation,scale
    super(x,y,size);
    this.bearing =0;
    // animation
    this.animRate = 5;
    this.setFrames(frames);
    // states
    this.counter =0;
    this.boarded = true;
  }

  // setup animation frames
  setFrames(anim){
    this.fcount=0;
    this.frames = anim;
    this.img = anim[0];
  }

  // display current sprite & any children
  display(children){



    // if on planet (this is for Dude),
    // then skip the cam positioning stuff
    // since we are a child of the planet object
    if(this.planetMode){
      // update "z-index"
      if(this.nearestPlanet)
        this.nearestPlanet.sortFeatures();
      // draw & update sprite
      this.draw(this);
    }
    else {
      // if not on a planet,
      // get position relative to camera
      let pos = camera.position(this,this.half);

      // if on screen
      if(camera.isOnScreen(pos,this.half))
          this.draw(pos,children);
    }
  }

  draw(p,c){
    this.drawMe(p.x,p.y,c);
    this.updateAnimation();
    this.counter++;
  }

  // drawMe()
  //
  // display sprite
  drawMe(x,y,children){
    if(!this.active) return;

    // update transform
    mCtx.save();
    mCtx.translate(x ,y );
    mCtx.rotate(this.bearing);
    // display any children:
    this.displayChildren(children);
    // display sprite:
    hue(this.hue);
    image(this.img,0,0,this.half,this.size);
    mCtx.restore();
  }

  displayChildren(children){
    if(children!=undefined){
      // this is an exception for the player
      // object only, don't draw children if player isn't boarded.
      if(this.boarded){
        children.forEach(c=>{
          // check which method to use then draw object
          if(c.drawMe) c.draw(c);
          else c.display();

        });
      }
    }
  }

  updateAnimation(){
    // set sprite according to counter
    if(this.counter%this.animRate==0){
      this.img = this.frames[this.fcount];
      // update counter
      this.fcount = (this.fcount+1)%this.frames.length;
    }
  }
}
