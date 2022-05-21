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
