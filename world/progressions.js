let showGrandpaQuestCompleteDialogue=()=>{
  //console.log("ey")
  grampQuest=false;
  inventory["surprizze"].num --;
  SpeedLimit = speedLimit2;
  popupText(["ring ring!","...","ring ring!","well gramps that's a nice surprise!","Gramps: your ship is twice as fast now","Yipekayay","Now about those ships that followed you",".. I also installed a shooting\ndevice on your ship.","press space to fire.","Those guys aren't good news.","I don't know who they are\nThey just appeared 2 days ago","They seemed to mind their own\nbusiness at first","but yesterday, I tried heading out\nto go harvest some black berries","they stopped me and said \nI couldn't leave my planet!","I don't like the sound of this","Look out for trouble... \nAnd don't tell your mom about your ship!"]);
  RefreshInventory();
  canShoot=true;
}
