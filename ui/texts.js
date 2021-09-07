let sItem=(n,p,t)=>{
  if(!t) t=n;
  return {name:n,price:p,type:t};
}


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
  else{
    if(MomText==MomText2) talkedToMomOnce=true;
    Mom.setTandA(MomText);
  }
}

let UpdateGPText=()=>{
    if(trade(Grandpa,"surprizze",gpPart,1,false))
      GrandpaText=GrandpaText2;
    else Grandpa.setTandA(GrandpaText,grandpaQuestStart);
}



let UpdateTraderText=()=>{
  let a = availableText;
  if(!trade(a,a.gives,a.takes,a.takenum,false))
    a.setTandA(a.tradeTxt)
}



let ShowShop=(shop)=>{
  shopText="";
  for(let i=0;i<shop.length;i++)
    shopText += `${shop[i].name} ${shop[i].price} ${plural(nP.currency)} (press ${(i+1)})\n`;

  ActiveShop=shop;
}



let RunShop=()=>{
  mCtx.fillStyle=black;
  mCtx.fillRect(ShopRect.x,ShopRect.y,350,ActiveShop.length*20);
  SplitText(shopText,ShopRect.x+8,ShopRect.y+font+5);

  for(let i=0; i<ActiveShop.length; i++)
    if(key==i+49&&ActiveShop) Buy(ActiveShop[i]);
}

let Buy=(item)=>{

  if(haveType(item.price,nP.currency)){
    ActiveShop=undefined;
    textCounter=0;
    inventory[nP.currency].num-=item.price;
    AddToInventory(item)
    availableText2=["Purchased a "+item.name,"Thank you!"];
  }
}
