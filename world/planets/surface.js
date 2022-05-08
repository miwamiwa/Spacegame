// class Surface
//
// a class where we can find everything
// pertaining to coloring a planet's surface tiles
// as well as adding and updating water.

class Surface {
  constructor(rng,r){
    this.r = r;
    this.rng = rng;
    this.make();
  }

  posIsInWater(p){
    let x = this.toScale(p.y);
    let y = this.toScale(p.x);
    let w = this.water[y+1][x];

    if(w) this.previous[y][x+1] = 180;
    return w;
  }

  toScale(i){
    return flo(50*(i + this.r)/(2*this.r));
  }

  tryAddWater(x,y){
    return x>0&&y>0&&this.rng.ch(.005)
    ||(this.water[y][x-1]&&this.rng.ch(.7))
    ||(this.water[y-1][x]&&this.rng.ch(.3))
  }

  getTileColor(x,r,r2){
    let f=`#${this.rng.randi(3,7)}8cf`;
    if(x<r||x>r2) f="#8bef";
    return f;
  }

  draw(ctx){
    ctx.drawImage(this.planet,-this.r,-this.r,this.r*4,this.r*4);
  }

  drawMask(ctx){
    // draw mask
    ctx.drawImage(this.planet2,-this.r,-this.r,this.r*4,this.r*4);
  }

  make(){

    this.rainRate = this.rng.randi(1,20);
    this.counter=0;

    this.planet=scanv();
    this.planet2=scanv();
    this.water = [];
    this.current = [];
    this.previous = [];

    // setup surface canvas
    let ctx=getCtx(this.planet);
    this.ctx=ctx;

    // setup mask canvas
    let ctx2=getCtx(this.planet2);
    ctx2.fillStyle=black;

    for(let y=0; y<50; y++){
      this.water[y]=[];
      this.current[y]=[];
      this.previous[y]=[];

      // in each row, tiles between r and r2 get special colors
      let r = this.rng.rand(y);
      let r2 = this.rng.rand(y%30);
      let fact = this.rng.rand(0,10);
      let started=false;

      for(let x=0; x<50; x++){

        // initialize water behaviour
        this.current[y][x] = 0;
        this.previous[y][x] = 0;

        // if tile is part of visible surface
        if(dist(xy(x,y),xy(25,25))<25){

          // is this is the start of a water streak?
          if(!started){
            started=true;
            if(this.rng.ch(0.5)) this.water[y][x]=true;
          }

          // generate surface tile
          ctx.fillStyle=this.getTileColor(x,r,r2);
          ctx.fillRect(x,y,1,1);

          // draw mask tile
          ctx2.fillRect(x,y,1,1);

          // chance to continue ongoing water streak
          if(this.tryAddWater(x,y)) this.makeWater(y,x);
        }

        // displace r2
        r2 += this.rng.rand(-fact,fact)
      }
    }


    for(let i=0; i<49; i++){
      for(let j=0; j<49; j++){
        if(this.water[i][j]){
          if(this.rng.ch(.4)) this.makeWater(i-1,j);
          if(this.rng.ch(.4)) this.makeWater(i,j-1);
          if(this.rng.ch(.4)) this.makeWater(i+1,j);
          if(this.rng.ch(.4)) this.makeWater(i,j+1);
        }
      }
    }

    this.outMin = 120;
    this.outMax = 225;
  }


  makeWater(x,y){
    if(dist(xy(x,y),xy(25,25))<25){
      this.water[x][y]=true;
      this.ctx.fillStyle="#ca8f";
      this.ctx.fillRect(x,y,1,1);
    }
  }




  updateWater(){

    let dataCount =0;
    let color;
    let imageData = this.ctx.getImageData(0, 0, 50, 50);
    let newFrame = imageData.data;

    // new rain drop
    if(this.counter%this.rainRate==0)
    this.previous[this.rng.randi(50)][this.rng.randi(50)] = this.outMin+5;

    // actually update
    if(this.counter%5==0){
      for(let i=1; i<49; i++){
        for(let j=1; j<49; j++){

          this.current[i][j] =
          ( this.previous[i - 1][j]
            + this.previous[i + 1][j]
            + this.previous[i][j - 1]
            + this.previous[i][j + 1] ) / 2 - this.current[i][j];

            this.current[i][j] = (this.current[i][j] * 0.7);
            if(this.water[i][j]){
              dataCount = 4*(j*50+i);
              color = flo(this.outMin+(this.outMax-this.outMin)*( this.current[i][j] )/255);
              color = flo(255 - color*0.5);
              newFrame[dataCount] = color;
              newFrame[dataCount+1] = color*0.9;
              newFrame[dataCount+2] = color*0.9;
              newFrame[dataCount+3] = 255;
            }
          }
        }

        this.ctx.putImageData(imageData, 0, 0);
        let temp = [];

        for(let i=0; i<50; i++){
          temp[i] = [];

          for(let j=0; j<50; j++){
            temp[i][j] = this.previous[i][j];
            this.previous[i][j] = this.current[i][j];
            this.current[i][j] = temp[i][j];
          }
        }
      }

      this.counter++;
    }

}
