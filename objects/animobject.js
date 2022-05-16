class AnimObject extends BasicObject {
  constructor(x,y,size,frames,text,func){
    // position,rotation,scale
    //console.log(x,y,size,frames,text,func)
    super(x,y,size,frames[0],text,func);
    this.bearing =0;
    // animation
    this.animRate = 5;
    this.setFrames(frames);
    // states
    this.counter =0;
    this.boarded = true;
    this.left=true;
    this.up=false;
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
      //if(nP) nP.sortFeatures();
      // draw & update sprite
      this.draw(this);

      if(
        mainMouse.planetPos
        &&dist(mainMouse.planetPos,this)<=mouseOverDist
      ){
        //console.log("mouse over ",this);
        planetMouseOverTarget=this;
      }
    }
    else {
      // if not on a planet,
      // get position relative to camera
      let pos = camera.position(this,this.half);

      // if on screen
      if(camera.isOnScreen(pos,this.half)){
        this.draw(pos,children);

        if(
          mainMouse.planetPos
          &&dist(mainMouse.worldPos,this)<=mouseOverDist
        ){
          //console.log("mouse over ",this);
          planetMouseOverTarget=this;
        }
      }
    }
  }

  draw(p,c){
    if(this.hat) this.hat.draw(addV(p,this.hat));

    this.drawMe(p.x,p.y,c);
    //if(this==player) console.log(player.throttle,p)
    this.updateAnimation();

    this.counter++;
  }

  // drawMe()
  //
  // display sprite
  drawMe(x,y,children){
    if(!this.active) return;

    // update transform
    transform(xy(x,y),()=>{

      this.applyTransform();

      if(!this.left) mCtx.scale(-1,1);
      if(this.children!=undefined&&this.children.length>0) this.displayChildren(this.children);
      // display sprite:
      hue(this.hue);

      image(this.img,0,0,this.half,this.size);

    },this.bearing);
  }

  displayChildren(children){
    if(children!=undefined){
      // this is an exception for the player
      // object only, don't draw children if player isn't boarded. ?? wat
      if(this.boarded){

        for(let i=children.length-1; i>=0; i--){
          let c = children[i];
          if(c.drawMe) c.draw(c);
          else c.display();

          if(c.done) children.splice(i,1);
        }
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
