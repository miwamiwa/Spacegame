let flyingEnemies = [];
const EnemyCrashAnimLength = 20;


// updateEnemies()
//
// update and display flying enemies

let updateEnemies=()=>{
  if(!nP && flyingEnemies.length<3){
    if(ch(0.01)){
      flyingEnemies.push(new FlyingEnemy());
    }
  }


  for(let i=flyingEnemies.length-1; i>=0; i--){
    let enemy = flyingEnemies[i];
    enemy.update();
    if(enemy.removeable) flyingEnemies.splice(i,1);
    else if(enemy.crashed&&enemy.crashFrame==EnemyCrashAnimLength) flyingEnemies.splice(i,1);
  }
}

// Enemy class
//
// only used for flying enemies..
// fix that at some point?

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
    this.crashFrame = 0; // time at which crash animation started
    this.setFrames(CrashAnimation);
    AddToInventory({name:"coin",type:"coin"}, randi(1,4));
    AddToInventory({name:"scrap metal",type:"metal0"}, randi(4,12));

    if(ch(0.01)) AddToInventory({name:"small radio",type:"radio"});
  }

  // setup animation frames
  setFrames(anim){
    this.fcount=0;
    this.frames = anim;
    this.img = anim[0];
  }
}
