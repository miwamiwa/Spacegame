let sItem=(n,p,t)=>{
  if(!t) t=n;
  return {name:n,price:p,type:t};
}

let ShopItems = [
  sItem(gpPart,50),
  sItem("boosters",600),
  sItem("parachute", 200),
  sItem("radarPro9001",900)
];


let shopText;
let ActiveShop;
let GrandpaText = ["Hi grandson!","Help me with my ship will ya",`Go buy a ${gpPart} on planet Timmy.`];
let MomText = ["Son","Are you hungry?","Bring me 5 fruits"];

// homeObjectText()
//
//

let UpdateMomText=()=>{
  // if we can make something, make it
  if(trade(Mom,"muffin","berry",5,true)) return;
  // otherwise just talk to mom
  else Mom.setTandA(MomText);
}

//
//
//

let UpdateGPText=()=>{
  if(trade(Grandpa,"surprizze",gpPart,1,false))
  GrandpaText=GrandpaText2;
  else Grandpa.setTandA(GrandpaText,grandpaQuestStart);
}


//
//
//

let UpdateTraderText=()=>{
  let a = availableText;
  if(!trade(a,a.gives,a.takes,a.takenum,false))
  a.setTandA(a.tradeTxt)
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
  fill(black);
  mCtx.fillText(txt,x-1,y+1)
  fill(color);
  mCtx.fillText(txt,x,y)
}
