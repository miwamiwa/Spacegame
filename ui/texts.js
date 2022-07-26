
let GrandpaText = ["Hi grandson!","Help me with my ship will ya",`Go buy a ${gpPart} on planet Timmy.`];
let MomText = ["Son","Are you hungry?","Bring me 5 fruits"];

let WorkshopText = ["Workshop!"];


let updateWorkshopText=()=>{
  let stuff = [];
  stuff[0] = ["wood sword","weapon","stick",2];
  stuff[1] = ["ladder","utility","stick",16];

  openTradeWindow(stuff);
}

let openTradeWindow=(stuff)=>{
  if(!tradeWindow.open)
    tradeWindow.open = true;

  tradeWindow.contents = stuff;
}

let updateMechanicText=()=>{
  let stuff = [];
  stuff[0] = [gpPart,gpPart,"coin",50];
  stuff[1] = ["zoomzoom3000","upgrade","coin",500];

  openTradeWindow(stuff);
}

// homeObjectText()
//
//

let UpdateMomText=()=>{
  // if we can make something, make it
  if(trade(Mom,"muffin","food","berry",5,true)) return;
  // otherwise just talk to mom
  else Mom.setTandA(MomText);
}

//

let UpdateSonIIText=()=>{
  if(haveType(1,"ghost-hair")){
    inventory["ghost hair"].num -= 1;
    Son2.DialogUpdate = undefined;
    Son2.setTandA(Son2Text2a,()=>{
      availableText = undefined;
      newPlanetAroundPlayer(30, "jerry");
      Son2.setTandA(Son2Text2);
    });
    return;
  }
  else Son2.setTandA(Son2Text);
}

let Son2Text2a=[
  "oh that's ghost hair!",
  "wow, impressive bro.",
  "you have all my respect.",
  "can I have it btw?",
  "oh yeeeeeeaaaaaaaa",
  "Now that I have this, my friend Jerry\n will think I'm cool",

  "Jerry knows alot about ghosts",
  "He might be interested in this stuff too",
  "He lives on planet Blabouze.",
  "..."
]


// homeObjectText()
//
//
/*
let UpdateShopText=()=>{
  // if we can make something, make it
  if(trade(Shop,gpPart,gpPart,cash,50,false)) return;
  // otherwise just talk
  else Shop.setTandA(ShopText);
}
*/

//
//
//

let UpdateGPText=()=>{
  if(trade(Grandpa,"surprizze","surprizze",gpPart,1,false)){
    //canShoot = true;
    GrandpaText=GrandpaText2;
  }
  else Grandpa.setTandA(GrandpaText,grandpaQuestStart);
}


// showTextArray()
//
// split text into multiple lines,
// and display text box

let showTextArray=(txtarr,lang)=>{

  frect(TextBox,320,40,tbFill);

  if(txtarr){
    let t = txtarr[textCounter];
    if(lang) t = translate(t);
    SplitText(t,TextBox.x+5,TextBox.y+17);
  }

}


// translate()
//
//

let translate=(t)=>{
  if(!knownLanguages.includes(nP.language)){
    let str = "";
    for(let i=0; i<t.length; i++){
      let index = allLanguages.indexOf(nP.language)+2;
      str += String.fromCharCode(t.charCodeAt(i)+index*100);
    }
    return str;
  }
  return t;
}


// SplitText()
//
//

let SplitText=(text,x,y,c,f)=>{
  if(!f) f=font;
  let i=0;
  text.split("\n").forEach(line=>{
    drawText(line, x, y + i,c);
    i+= f;
  });
}


// drawText()
//
// display text on canvas

let drawText=(txt,x,y,color)=>{
  if(!color) color = "white";
  if(!x){
    x=middle.x-40;
    y=middle.y+39;
  }
  fill("#3338");
  mCtx.fillText(txt,x-1,y+1)
  fill(color);
  mCtx.fillText(txt,x,y)
}
