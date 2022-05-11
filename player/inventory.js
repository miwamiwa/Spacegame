let inventoryOptions = {
  shown:false,
  selection:0,
  item:undefined
}


// old version
let displayInventory=()=>{
  if(inventoryOptions.shown){
    frect(zero,mainCanvas.width,mainCanvas.height,tbFill);
    drawText("press i to toggle inventory options", 450, mainCanvas.height/2);
  }

  SplitText(inventoryString, 5, 200);
}

// AddToInventory()
//
//

let AddToInventory =(item)=>{

  //console.log(item)
  if(!inventory[item.name])
  inventory[item.name] = {num:1,type:item.type,name:item.name};
  else inventory[item.name].num ++;

  RefreshInventory();


}

let inventoryByIndex = [];
let RefreshInventory=()=>{
  inventoryString = "";
  let counter =0;
  inventoryByIndex = [];

  for(let i in inventory){
    if(inventory[i].num>0 && (inventory[i].equipped!=true)){
      inventoryByIndex.push(inventory[i])
      inventoryString += formatInventoryItem(inventory[i],counter);//.name,inventory[i].num);
      /*
      if(inventoryOptions.shown && inventoryOptions.selection==counter){
        inventoryOptions.item = inventory[i];
        if(isEquipable(inventory[i])) inventoryString += " - e to equip";
        if(isUseable(inventory[i])) inventoryString += " - e to use";
        if(counter>0) inventoryString += " - w up";
        if(counter<Object.keys(inventory).length-1) inventoryString += " - s down";
      }
      */
      counter ++;
    }

  }
  updateInventoryUI();
}

let isEquipable=(item)=>{
  return item.type=="weapon"||item.type=="armor"
}

let isPlantable=(item)=>{
  return item.type=="seed" || item.type=="spice"
}

let isUseable=(item)=>{
  return item.type=="utility" || item.type=="food"
}

let isOpenable=(item)=>{
  return item.type=="berry"
}

let isUpgrade=(item)=>{
  return item.type=="upgrade"
}


let EquipItem=(item)=>{
  console.log("equip");
  item.num--;
  if(player.equipedItem!=undefined){
    player.equipedItem.num++;
  }
  player.equipedItem = item;
  refreshCharacterPanel();
  RefreshInventory();
}


let UseItem=(item)=>{
  console.log("use");
  item.num--;
  RefreshInventory();
}



let OpenItem=(item)=>{
  console.log("open",item);
  if(item.type=="berry"){
    //let kind = item.name.replace(" berry","");
    AddToInventory({name:item.name+" seed",type:"seed"});
  }
  item.num--;
  RefreshInventory();
}

let PlantItem=(item)=>{
  //console.log("plant",item);
  //{name:item.name+" seed",type:"seed"}

  let pos = xy(Dude.x,Dude.y + 5);

  if(nP.checkIfClear(pos,40)){
    let flora = {berryName:item.name.replace(" seed","")};
    flora.treeFamily = treeFamilies[flora.berryName];

    //local flora: {berryName: 'orange', treeFamily: Array(3)}
    //this.addFeature(new Tree(this.localFlora,age,this.rng), 10);
    let tree =new Tree(flora,0,nP.rng);
    tree.x = pos.x;
    tree.y = pos.y;
    nP.trees.push(tree);
    nP.features.push(tree);
    nP.resetMelodyOnNextVisit=true;
    nP.sortFeatures();


    item.num--;
    RefreshInventory();
    console.log("planted tree!")
  }
  else {
    console.log("can't plant");
  }
}


// have()
//
//

let haveType=(num,type)=>{
  let have;
  for(let b in inventory)
    if(inventory[b].num>=num&&inventory[b].type==type) have=inventory[b];

  //console.log(have)
  return have;
}
