let getTreeSprite=(features,age,rng)=>{
  // create new family if necessary
  if(treeFamilies[features.berryName]==undefined){
    let data = createNewTreeType();
    treeFamilies[features.berryName] = data.mature_trees;
    youngTrees[features.berryName] = data.younglings;
  }

  // pick initial sprite
  let sprite;
  let variation = rng.randi(3);
  if(age=="mature") sprite = treeFamilies[features.berryName][variation];
  else{
    sprite = youngTrees[features.berryName][variation][age];
  //  console.log("sprite ",sprite)
  }
  return {
    sprite:sprite,
    variation:variation,
    matureSprite:treeFamilies[features.berryName][variation],
    youngSprites:[
      youngTrees[features.berryName][variation][0],
      youngTrees[features.berryName][variation][1],
      youngTrees[features.berryName][variation][2],
      youngTrees[features.berryName][variation][3]
    ]
  }
}

let getAppropriateTreeSprites=(features,variation)=>{
  return {
    matureSprite:treeFamilies[features.berryName][variation],
    youngSprites:[
      youngTrees[features.berryName][variation][0],
      youngTrees[features.berryName][variation][1],
      youngTrees[features.berryName][variation][2],
      youngTrees[features.berryName][variation][3]
    ]
  }
}

class Tree extends StaticObject {
  constructor(features,age,rng){

    let data = getTreeSprite(features,age,rng);

    super(0,0,{img:data.sprite},200);
    this.variation = data.variation;
    this.features = features;
    this.family = features.treeFamily;
    this.age = age;
    this.windy=true;
    this.collider = false;
    this.talker = true;
    this.berries=randi(1,4);
    this.ageMult = 1000;
    this.rng=rng;

    if(this.age!="mature"){
      this.talker = false;
      this.berries =0;
      this.age *=this.ageMult;
    }
    this.talkrange = 34;
    this.berryCounter =0;
    this.berryLoopLength=10000;
    this.berry = features.berryName+" berry";
    this.name=this.berry+" tree"

    this.setTandA(this.berryText(),this.lootBerry);
    this.id="tree";
  }

  berryText(){
    return ["this tree has "+this.berry.replace("berry","")+"berries.","You picked "+this.berries+" "+plural(this.berry,this.berries)+"."]
  }

  getName(){
    //console.log(this)
    let stage = "";
    let age = this.age;
    if(age!="mature") age=flo(age/this.ageMult);
    switch(age){
      case 0: stage = "sprout"; break;
      case 1: stage = "baby"; break;
      case 2: stage = "young"; break;
      case 3: stage = "small"; break;
      case "mature": stage = `mature, ${this.berries}`; break;
    }
    this.name = `${this.berry} tree (${stage})`
  }

  continueLife(){
    if(this.age!="mature"){
      ///console.log("immature tree",this.age);
      this.age += 1;
      if(this.age%this.ageMult==0){
        let data = getTreeSprite(this.features,this.age,this.rng)
        if(this.age==4*this.ageMult){
          this.age = "mature";
          //console.log("new age mature");
          this.talker = true;
          this.berries=randi(1,4);
          this.setTandA(this.berryText(),this.lootBerry);
          this.img = {img:data.matureSprite};
        }
        else{
          let newage = this.age/this.ageMult;
          //console.log("new age "+newage)
          this.img = {img:data.youngSprites[newage]};

        }
      //  console.log(this.img,this.age)
      }
    }
    // when mature
    else if(this.berries==0){
      this.berryCounter++;
      if(this.berryCounter>=this.berryLoopLength){
        this.berries = randi(1,4);
        this.setTandA(this.berryText(),this.lootBerry);
        this.talker = true;
        console.log("bing")
      }
    }
  }

  // for tree objects
  lootBerry(){
    if(this.berries==0) return;

    for(let i=0; i<this.berries; i++) AddToInventory({name:this.berry,type:"berry"});

    let num = randi(3);
    for(let i=0; i<num; i++) AddToInventory({name:"stick",type:"stick"});

    this.talker = undefined;
    this.berries = 0;
    //this.setTandA(this.berryText(),this.lootBerry);
    this.berryCounter =0;

    new Wiggle(this, 10, 100);
  }
}
