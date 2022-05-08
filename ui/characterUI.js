let refreshCharacterPanel=()=>{
  let ui = characterUI;

  let equipedItem = "none";
  if(player.equipedItem!=undefined) equipedItem = player.equipedItem.name;
  ui.setText(`
    equiped item: ${equipedItem}
    <br> ${"Known languages: "+knownLanguages.join(", ")}
    `);
}
