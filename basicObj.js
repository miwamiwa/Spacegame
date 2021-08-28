// parent class with basic variables shared by most game objects
class BasicObject {
  constructor(x,y,size,img){
    this.x = x;
    this.y = y;
    this.img = img;
    this.active = true;
    this.hue =0;
    this.id="";
    this.setSize(size);
  }

  // set size and calculate half size
  setSize(s){
    this.size = s;
    this.half = s/2;
  }
}
