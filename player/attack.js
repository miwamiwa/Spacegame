let attack=(attacker)=>{
  new WeaponSwipeAnimation(attacker,{img:stick_png,w:10,h:60,distance:20})
}

class WeaponSwipeAnimation {
  constructor(attacker,weapon){
    this.attacker=attacker;
    attacker.attacking=true;
    this.weapon=weapon;
    this.swipeStartAngle=TWO_PI*0.9;
    if(this.attacker.up) this.swipeStartAngle-=PI*0.8
    this.swipeDistance=TWO_PI*0.5;
    this.progress=0;
    this.angleDelta = 0.4;
    this.done=false;
    this.frames =0;
    console.log("attack")

    if(attacker.children==undefined) attacker.children = [];
    attacker.children.push(this);
  }

  display(){
  //  console.log("display attack")

    if(this.progress<this.swipeDistance){

      let progress=0;
      let frame =0;
      let numFramesDisplayed = 2;
      let blurStart = -PI*0.4;
      while(progress<=this.progress){

        if(frame>this.frames-numFramesDisplayed)
        transform(zero,()=>{

          mCtx.filter=`opacity(${1-(this.frames-frame)/numFramesDisplayed})`;

          mCtx.fillStyle="#fdd9"
          mCtx.beginPath();
          mCtx.moveTo(0,0)
          mCtx.arc(0,0, this.weapon.h, blurStart,blurStart+progress);
          mCtx.fill();

          mCtx.translate(-this.weapon.distance,0);


          mCtx.rotate(-PI*0.9)
          mCtx.drawImage(this.weapon.img.img,0,0,this.weapon.w,this.weapon.h);
        },-progress+this.swipeStartAngle);

        progress+=this.angleDelta;
        frame++;
      }

      this.frames++;
      this.progress+=mainDelta*this.angleDelta;
    //  console.log(this.progress)
    }
    else {
      // done
      this.attacker.attacking=false;
      this.done=true;
    }
  }
}
