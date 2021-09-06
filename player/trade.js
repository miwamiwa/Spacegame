
let trade=(obj,type,ingred,num,blend)=>{
  let h = haveType(num,ingred);
  let name=type;


  if(h&&knownLanguages.includes(nP.language)){
    if(blend) name=h.name+" "+type;

    obj.setTandA([ `Oh, you have ${plural(h.type)}\nGive me a moment..`,
      ".....", "All done!\nHere's a "+name], ()=>{
        inventory[h.name].num -= num;
        AddToInventory({
          name:name,
          type:type,
        })
      });
    return true;
  }
  else return false;
}
