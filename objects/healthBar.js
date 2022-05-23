let attachHealthBar=(obj,scale)=>{
  obj.healthBar = new HealthBar(obj,scale);
}

class HealthBar {
  constructor(parentObject,scale){
    this.target = parentObject;
    this.scale = scale;

    this.w = 100;
    this.h = 10;

    this.w*=scale;
    this.h*=scale;

    this.halfW = this.w/2;
    this.halfH = this.h/2;
  }
  display(){
    if(pIsDead) return;
    
    if(this.target.health<100){
      //console.log(pos)
      //console.log(this.target.x,this.target.y,this.w,this.h)
      mCtx.fillStyle="white";
      mCtx.fillRect(- this.halfW,- this.halfH, this.w,this.h);
      mCtx.fillStyle="red";
      mCtx.fillRect(- this.halfW,- this.halfH, this.w * this.target.health / 100,this.h);
    }
  }
}
