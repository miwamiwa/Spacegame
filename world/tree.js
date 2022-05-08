class Tree extends StaticObject {
  constructor(features){
    super(0,0,{img:RandomFromArray(features.treeFamily)},200);
    this.family = features.treeFamily;

    this.windy=true;
    this.collider = false;
    this.talker = true;
    this.talkrange = 34;
    this.berry = features.berryName+" berry";
    this.name=this.berry+" tree"
    this.berries=randi(1,4);
    this.setTandA(this.berryText(),this.lootBerry);
    this.id="tree";
  }

  berryText(){
    return ["this tree has "+this.berry.replace("berry","")+"berries.","You picked "+this.berries+" "+plural(this.berry,this.berries)+"."]
  }

  getName(){
    //console.log(this)
    this.name = `${this.berry} tree (${this.berries})`
  }

  // for tree objects
  lootBerry(){
    for(let i=0; i<this.berries; i++) AddToInventory({name:this.berry,type:"berry"});

    let num = randi(3);
    for(let i=0; i<num; i++) AddToInventory({name:"stick",type:"stick"});

    this.talker = undefined;
    this.berries = 0;

    new Wiggle(this, 10, 100);
  }
}
