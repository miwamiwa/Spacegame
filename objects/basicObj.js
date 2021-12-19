// parent class with basic variables shared by most game objects
class BasicObject {
  constructor(x,y,size,img,text,firstReadAction){
    this.x = x;
    this.y = y;
    this.img = img;
    this.active = true;
    this.hue =0;
    this.id="";
    this.equippedItem = undefined;
    this.windy=false;
    this.setSize(size);
    this.setTandA(text,firstReadAction);
  }

  // set size and calculate half size
  setSize(s){
    this.size = s;
    this.half = s/2;
  }

  setTandA(t,a){
    this.text=t;
    this.firstReadAction=a;
  }

  setCollider(){
    this.collider = true;
    this.collidersize = this.size * 0.65;
    this.talkrange = this.size * 0.8;
  }

  applyTransform(){
    if(this.transform!=undefined) this.transform();
    else if(this.windy){
      if(rand()<0.02)
      new Wiggle(this, 6, 800);
    }
  }
}
