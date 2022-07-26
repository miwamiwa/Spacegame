let fadingTexts = []

class FadingText{
  constructor(text, x, y, rate, color){
    this.text = text;
    this.frame =0;
    this.decay = 1;
    this.rate = rate;
    this.x = x;
    this.y = y;
    this.color = color;
    this.wait = randi(0, 10)
    this.y += this.wait*2
    fadingTexts.push(this);
  }
  update(){
    if(this.wait>0){
      this.wait--;
      return;
    }
    this.decay -= this.rate;
    this.y -= 0.5;
    if(this.decay<0) return;

    fill(`rgba(${this.color},${this.decay})`);
    mCtx.fillText(this.text, this.x,this.y);
  }
}

let updateTexts=()=>{
  for(let i=fadingTexts.length-1; i>=0; i--){
    fadingTexts[i].update();
    if(fadingTexts[i].decay<0) fadingTexts.splice(i,1);
  }
}
