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
    if(this.planetMode!=undefined){
      // update "z-index"
      if(this.nearestPlanet!=undefined)
        this.nearestPlanet.sortFeatures();
      // draw & update sprite
      this.drawMe(this.x,this.y);
      this.updateAnimation();
      // update our inner clock
      this.counter++;
      return;
    }


    // if not on a planet,
    // get position relative to camera
    let pos = camera.position(this,this.half);

    // if on screen
    if(camera.isOnScreen(pos,this.half)){
        // draw & update sprite and any children
      this.drawMe(pos.x,pos.y,children);
      this.updateAnimation();
      // update our inner clock
      this.counter++;
    }
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
          // if child is AnimObject
          if(c.drawMe!=undefined){
            c.drawMe(c.x,c.y);
            c.updateAnimation();
          }
          // else if child is Object
          else c.display();

          c.counter++;
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
