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


let RefreshInventory=()=>{
  inventoryString = "inventory";
  for(let i in inventory){
    //console.log(inventory[i]);

    if(inventory[i].num>0)
    inventoryString += "\n"+inventory[i].name+": "+inventory[i].num;
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
