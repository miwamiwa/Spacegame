class Wiggle {
  constructor(obj,length,rate){
    this.obj = obj;
    this.counter=0;
    this.rate = rate;
    this.counterMax = length;
    setTimeout(this.update,this.rate,this);
  }
  update(e){
    e.obj.transform = ()=>{
      mCtx.transform(1, 0.2+Math.sin(e.counter)*0.1,0.0, 1, 0, 0);
    }
    e.counter++;
    if(e.counter<e.counterMax) setTimeout(e.update,e.rate, e);
    else e.obj.transform = undefined;
  }
}
