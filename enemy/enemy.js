let flyingEnemies = [];

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
  }
}

class Enemy {
  constructor(){
  }

  update(){

  }
}

class FlyingEnemy {
  constructor(){
    this.x = player.x + roughly(0);
    this.y = player.y + roughly(0);
    this.vel = xy(player.vx,player.vy);
    this.size = 30;
    this.half = 15;
    this.removeable = false;
  }

  update(){
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

    let pos = addV(this.vel,this);
    this.x=pos.x;
    this.y=pos.y;

    this.display();
  }

  display(){
    let pos = camera.position(this,this.half);

    // if on screen
    if(camera.isOnScreen(pos,this.half)){
      //console.log(this)
      mCtx.fillStyle="tomato";
      mCtx.fillRect(pos.x - this.size/2,pos.y - this.size/2,this.size,this.size);
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
