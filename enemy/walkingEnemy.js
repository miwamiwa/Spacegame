let trySpawnEnemy=()=>{
  let enemy = new WalkingEnemy(0,0,60,poses[0],nP);
  nP.features.push(enemy);
  nP.enemies.push(enemy);
  nP.spot(enemy,20);

  nP.sortFeatures();

  console.log(enemy)
}

class WalkingEnemy extends AnimObject{
  constructor(x,y,size,frames,planet){
    super(0,0,size,frames,undefined,undefined);
    planetMode(this,true);
    this.planet = planet;
    this.name="enemy";
    this.id="enemy";
    this.isEnemy=true;
    this.vel = 1;
    this.left=false;
    this.health = 99;

    attachHealthBar(this,1.0);
  }
  enemyUpdate(){
    if(player.boarded) return;
    let lastp=this.p;
    this.p=0;

    if(Dude.x<this.x-this.vel){
      // go left
      this.p=1;
      this.left=true;
      this.x-=this.vel;
    }
    else if(Dude.x>this.x+this.vel){
      // go right
      this.p=1;
      this.left=false;
      this.x+=this.vel;
    }
    if(Dude.y<this.y-this.vel){
      // go up
      if(this.p>0) this.p=4;
      else this.p=3;
      this.y-=this.vel;
    }
    else if(Dude.y>this.y+this.vel){
      // go down
      if(this.p>0) this.p=5;
      else this.p=2;
      this.y+=this.vel;
    }

    if(this.p!=lastp)this.setFrames(poses[this.p]);
  }

  died(){
    trySpawnEnemy();
  }
}
