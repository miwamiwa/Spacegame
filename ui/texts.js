let sItem=(n,p)=>{
  return {name:n,price:p};
}


const HomeText = ["This is my home.","I've always lived here!"]
const MomText2 =["Son.","Go help your Grandpa."];
const GrandpaText = ["Oh hi!"];
const ShopText = ["Welcome to the shop"];
const ShopItems = [
  sItem("gear #5b8gh9",50),
  sItem("boosters",600),
  sItem("parachute", 200),
  sItem("radarPro9001",900)
];
const ShopRect={x:200,y:200}

let shopText;
let ActiveShop;



let MomText = ["Son","Are you hungry?","Bring me 5 fruits"];

// homeObjectText()
//
//

let UpdateMomText=()=>{
  // if we can make something, make it
  if(trade(Mom,"muffin","berry",5,true)){
    if(!talkedToMomOnce) MomText=MomText2;
  }


  // otherwise just talk to mom
  else{
    if(MomText==MomText2) talkedToMomOnce=true;
    Mom.setTandA(MomText);
  }
}

let ShowShop=(shop)=>{
  shopText="";
  for(let i=0;i<shop.length;i++)
    shopText += `${shop[i].name} $${shop[i].price} (press ${i})\n`;

  ActiveShop=shop;
}



let RunShop=()=>{
  mCtx.fillStyle=black;
  mCtx.fillRect(ShopRect.x,ShopRect.y,260,ActiveShop.length*20);
  SplitText(shopText,ShopRect.x+8,ShopRect.y+font+5);
  for(let i=0; i<ActiveShop.length; i++)
    if(key==i+49&&ActiveShop) Buy(ActiveShop[i]);

}

let Buy=(item)=>{
  ActiveShop=undefined;
  textCounter=0;
  availableText2=["Purchased a "+item.name,"Thank you!"];
}
