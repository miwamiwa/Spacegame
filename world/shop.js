let fixshop=false;

// showshop()
//
//

let ShowShop=(shop)=>{
  shopText="";
  for(let i=0;i<shop.length;i++)
  shopText += `${shop[i].name} ${shop[i].price} ${plural(nP.currency)} (press ${(i+1)})\n`;
  ActiveShop=shop;
  fixshop=true;
}

// runshop()
//
//

let RunShop=()=>{
  frect(ShopRect,350,ActiveShop.length*20+10,black);
  SplitText(shopText,ShopRect.x+8,ShopRect.y+font+5);

  for(let i=0; i<ActiveShop.length; i++)
  if(key==i+49&&ActiveShop) Buy(ActiveShop[i]);

  if(inputs.space&&!fixshop) ActiveShop=undefined;
  if(!inputs.space) fixshop=false;
}


// buy()
//
//

let Buy=(item)=>{
  if(haveType(item.price,nP.currency)){
    ActiveShop=undefined;
    textCounter=0;
    inventory[nP.currency].num-=item.price;
    AddToInventory(item)
    availableText2=["Purchased a "+item.name,"Thank you!"];
  }
}
