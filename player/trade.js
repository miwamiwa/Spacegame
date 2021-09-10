
let trade=(obj,type,ingred,num,blend)=>{
  let h = haveType(num,ingred);
  let name=type;


  if(h&&knownLanguages.includes(nP.language)){
    let spice="";
    if(ingred=="berry"){
      let j=haveType(1,"spice");
      if(j) spice=" "+j.name;
    }
    if(blend) name=h.name+spice+" "+type;
    tradedOnce=true;
    obj.setTandA([ `Oh, you have ${plural(h.type)}\nGive me a moment..`,
      ".....", "All done!\nHere's a "+name], ()=>{
        inventory[h.name].num -= num;
        if(spice!="") inventory[spice.replace(" ","")].num --;
        AddToInventory({
          name:name,
          type:type,
        });

      });
    return true;
  }
  else return false;
}
