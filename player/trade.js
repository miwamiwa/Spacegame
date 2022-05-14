let  tradeWindow = {open:false};

let handleTradeWindowInputs=()=>{
  for(let i=0; i<tradeWindow.contents.length; i++){
    let num = i+1;
    let  item = tradeWindow.contents[i];
    if(inputs.numbers[num]){
      if(trade(undefined,item[0],item[1],item[2],item[3],false,true)){
        tradeWindow.open = false;
      }
    }

  }
}

// displayTradeWindow()
//
//
let displayCraftWindow=()=>{
  let el = {
    x: 300,
    y: 200
  }
  //!knownLanguages.includes(nP.language)
  frect(el,320, 160, tbFill);
  drawText("craft window",el.x + 6,el.y + 20);

  for(let i=0; i<tradeWindow.contents.length; i++){
    let item = tradeWindow.contents[i];
    let requirements = "";
    for(let j=2; j<item.length-1; j+=2){
      if(j!=2) requirements+= ",";
      requirements += item[j+1] +"x "+ item[j];
    }
    drawText(`${i+1}: ${item[0]} (${requirements})`,el.x + 6,el.y + 40 + i*20);
  }
}


// trade()
//
// trade an object
let trade=(obj,type2,type,ingred,num,blend,notxt)=>{
  let h = haveType(num,ingred);
  let name=type2;

  console.log("muffin trade...")
  if(h&&knownLanguages.includes(nP.language)){
    let spice="";
    if(ingred=="berry"){
      let j=haveType(1,"spice");
      if(j) spice=" "+j.name;
    }
    if(blend) name=h.name+spice+" "+type2;
    tradedOnce=true;

    let theitem = {
      name:name,
      type:type,
    };

    // if muffin
    if(notxt==undefined){
      obj.setTandA([ `Oh, you have ${plural(h.type)}\nGive me a moment..`,
        ".....", "All done!\nHere's a "+name], ()=>{

          console.log("traded.")
          inventory[h.name].num -= num;
          if(spice!="") inventory[spice.replace(" ","")].num --;
          AddToInventory(theitem);
          //refreshAvailableText();
        });
    }


      // all other items:
      else {
        inventory[h.name].num -= num;
        AddToInventory(theitem);
      }
      console.log("yes muffin!")
      return true;
    }
    else{
      console.log("no muffin!")
      return false;
    }
  }
