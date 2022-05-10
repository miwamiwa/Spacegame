let flyingEnemies = [];
const EnemyCrashAnimLength = 20;

let updateEnemies=()=>{
  if(!nP && flyingEnemies.length<3){
    if(ch(0.01)){
      flyingEnemies.push(new FlyingEnemy());
    }
  }


  for(let i=flyingEnemies.length-1; i>=0; i--){
    let enemy = flyingEnemies[i];
    enemy.update();
    //console.log(enemy.x-player.x,enemy.y-player.y)
    //console.log(player)
    if(enemy.removeable) flyingEnemies.splice(i,1);
    else if(enemy.crashed&&enemy.crashFrame==EnemyCrashAnimLength) flyingEnemies.splice(i,1);
  }
}

class Enemy {
  constructor(){
    this.fcount=0;
  }

  update(){

  }

  // crash()
  // things to do when crash happens
  crash(){
    this.crashed = true;
    if(!enemiesCanShoot) console.log("enemies can shoot.")
    enemiesCanShoot=true;
    //crashtext = RandomFromArray(FailTextList);
    this.crashFrame = 0; // time at which crash animation started
    this.setFrames(CrashAnimation);
  }

  // setup animation frames
  setFrames(anim){
    this.fcount=0;
    this.frames = anim;
    this.img = anim[0];
  }
}

class FlyingEnemy extends Enemy {
  constructor(){
    super();
    this.x = player.x + roughly(0);
    this.y = player.y + roughly(0);
    this.vel = xy(player.vx,player.vy);
    this.size = 60;
    this.half = 30;
    this.removeable = false;
    this.img;
    this.shotInterval = 50;
    this.shotCounter=0;
  }

  update(){
    if(this.crashed==true){
      this.crashFrame++;
      this.fcount=(this.fcount+1)%this.frames.length;
      this.img = this.frames[this.fcount]
      this.display();
      return;
    }
    let distance = dist(player,this);
    if(nP){
      // move away
      let n = multV( 0.01,subV(this,player));
      this.vel = addV(this.vel,n);
    }
    else if(distance>230){
      let acc = dist(zero,this.vel) * distance / 600000;
      //console.log(acc)
      let n = multV( limit(acc,0.01),subV(player,this));
      this.vel = addV(this.vel,n);
    }
    else{
      if(dist(this.vel,xy(player.vx,player.vy))>0.08 * dist(zero,this.vel))
      this.vel = multV( 0.95, this.vel);
    }

    let pos = addV( multV(mainDelta,this.vel),this);
    this.x=pos.x;
    this.y=pos.y;

    if(enemiesCanShoot){
      this.shoot();
    }

    this.display();
  }

  shoot(){
    this.shotCounter++;
    if(this.shotCounter%this.shotInterval==0){
      let direction = addV(subV(player,this),xy(rand(-0.3,0.3),rand(-0.1,0.1)));
      direction=multV(1/dist(this,player),direction);
      new Projectile(this,true,direction)
    }
  }

  display(){
    let pos = camera.position(this,this.half);

    // if on screen
    if(camera.isOnScreen(pos,this.half)){
      //console.log(this)
      if(this.img==undefined){
        mCtx.fillStyle="tomato";
        mCtx.fillRect(pos.x - this.size/2,pos.y - this.size/2,this.size,this.size);
      }
      else {
        mCtx.drawImage(this.img.img,pos.x - this.size/2,pos.y - this.size/2,this.size,this.size)
      }
    }
    else {
      // remove if too far off screen
      if(dist(this,player)>2000){
        this.removeable = true;
      }
    }
  }
}

class WalkingEnemy {
  constructor(){

  }
}
