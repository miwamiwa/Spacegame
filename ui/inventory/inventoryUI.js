let div=()=>{
  let el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

let inventoryUI;


let toggleInventory=()=>{
  inventoryUI.toggle();
}

let updateInventoryUI=()=>{
  inventoryUI.setText(inventoryString);
}

let clickToEquip=(index)=>{
  EquipItem(inventoryByIndex[index]);
}

let clickToUse=(index)=>{
  UseItem(inventoryByIndex[index])
}

let clickToOpen=(index)=>{
  OpenItem(inventoryByIndex[index])
}

let clickToPlant=(index)=>{
  PlantItem(inventoryByIndex[index])
}

let formatInventoryItem=(item,index)=>{
  // item.name
  // item.num
  // isEquipable(item);
  // isUseable(item);

  let suffix = "";
  let func = "";
  if(isEquipable(item)){
    suffix = "<span class='equipable_txt'> equip </span>";
    func = `onclick="clickToEquip(${index})"`;
  }
  if(isUseable(item)){
    suffix = "<span class='useable_txt'> use </span>";
    func = `onclick="clickToUse(${index})" `;
  }
  if(isOpenable(item)){
    suffix = "<span class='openable_txt'> open </span>";
    func = `onclick="clickToOpen(${index})"`;
  }
  if(isPlantable(item)){
    suffix = "<span class='plantable_txt'> plant </span>";
    func = `onclick="clickToPlant(${index})"`;
  }
  let str = `<div ${func}class="inventoryitem">
  <span class="inventoryitem_name">${item.name}</span>
  <span class="inventoryitem_num">
  <span class="greyed">(</span>
    ${item.num}
  <span class="greyed">)</span>
  </span>
  ${suffix}
  </div>`;

  return str;
}
