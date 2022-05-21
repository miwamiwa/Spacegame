

// parent class with basic variables shared by most game objects
class BasicObject {
  constructor(x,y,size,img,text,firstReadAction){
    this.x = x;
    this.y = y;
    this.img = img;
    this.active = true;
    this.hue =0;
    this.id="";
    this.equipedItem = undefined;
    this.windy=false;
    this.setSize(size);
    this.setTandA(text,firstReadAction);
  }

  getDirection(str){
    if(str==false){
      if(this.left) return directions["left"]
      return directions["right"]
    }
    return directions[str]
  }

  middle(){
    return xy(this.x+0.5*this.size,this.y+0.5*this.size)
  }

  setLootTable(t){
    this.lootTable = t;
  }

  generateLoot(){
    let lootlist = [];

    if(this.lootTable!=undefined){
      for(let i=0; i<this.lootTable.length; i++){
        let item = this.lootTable[i];
        if(rand()<item.dropChance){
          let amount = randi(item.minNum, item.maxNum);
          if(amount>0) lootlist.push({name:item.item.name, type:item.item.type, num:amount});
        }
      }
    }

    return lootlist;
  }

  // set size and calculate half size
  setSize(s){
    this.size = s;
    this.half = s/2;
  }

  setTandA(t,a){
    this.text=t;
    this.firstReadAction=a;
  }

  setCollider(){
    this.collider = true;
    this.collidersize = this.size * 0.65;
    this.talkrange = this.size * 0.8;
  }

  getBounds(){
    return {x:this.x,y:this.y,w:this.size,h:this.size}
  }

  applyTransform(){
    if(this.transform!=undefined) this.transform();
    else if(this.windy){
      if(rand()<0.02)
      new Wiggle(this, 6, 800);
    }
  }
}
