class Projectile {
  constructor(pos,targetIsPlayer,direction,initVel,source){
    console.log(pos,targetIsPlayer,direction)
    this.visible = true;
    this.going=false;
    this.x = pos.x;
    this.y = pos.y;
    this.source=source;

    this.size=10;
    this.half=5;
    this.initVel=initVel

    this.targetIsPlayer=targetIsPlayer;

    all_projectiles.push(this)

    this.shoot(direction);
  }
  shoot(direction){
    this.vel = multV(50,direction);
    this.going=true;
  }
  update(){
    if(this.going){
      let pos = addV(this,this.vel);
      //console.log(pos)
      this.x=pos.x;
      this.y=pos.y;
      // collision code
      if(this.targetIsPlayer){
        if(dist(this,player)<this.half+player.half){
          console.log("hit player!");
          player.health-=this.source.damage;
          this.destroy();
          return;
        }
      }
      else {
        flyingEnemies.forEach(enemy=>{
          if(dist(this,enemy)<this.half+enemy.half){
            console.log("hit enemy!");
            enemy.crash();
            this.destroy();
            return;
          }
        });
      }
    }
  }
  display(){
    let pos = camera.position(this,this.half);

    // if on screen
    if(camera.isOnScreen(pos,this.half)){

      if(!this.targetIsPlayer) mCtx.fillStyle="blue";
      else mCtx.fillStyle="orange";
      mCtx.fillRect(pos.x,pos.y,10,10);

      this.visible = true;
    }
    else this.visible = false;
  //  console.log(this.visible)
  }

  destroy(){
    this.going=false;
  }
}

let all_projectiles = [];
let updateProjectiles=()=>{
//  console.log("update projectiles")
  for(let i=all_projectiles.length-1; i>=0; i--){
    let projectile = all_projectiles[i];
    projectile.update();

    if(!projectile.visible||!projectile.going){
      all_projectiles.splice(i,1);
      console.log("remove projectile")
    }
  }
}

let displayProjectiles=()=>{
  all_projectiles.forEach(projectile=>{
    projectile.display();
  });
}
