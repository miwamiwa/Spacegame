let treeFamilies = [];
let youngTrees = [];

let setupTreeFamilies=()=>{
  BerryNames.forEach(berry=>{
    let data = createNewTreeType();
    treeFamilies[berry] = data.mature_trees;
    youngTrees[berry] = data.younglings;
  });
}

let createNewTreeType=()=>{

  // general settings
  let youngTrees = [];
  let trees = [];

  // tree family settings
  let Hue = WorldRandom.randi(360);

  // trunk length
  let tMin = WorldRandom.rand(5, 10);
  let tMax = tMin + WorldRandom.rand(1, 8);

  // branch length
  let bMin = WorldRandom.rand(2,5);
  let bMax = WorldRandom.rand(2,4);
  // branch spacing
  let bSpa = WorldRandom.randi(2,6);
  // branch chance
  let bCha = WorldRandom.rand();
  // point branch up or down
  let bDev = WorldRandom.rand(-2,4);
  // leaf chance
  let lCha = WorldRandom.rand();

  let branch=(x,y,scale,ctx,stage)=>{
    if(WorldRandom.ch(bCha)){
      let x2 = -6;
      let y2 = 0;
      let branchlength = WorldRandom.rand(bMin,bMax);
      if(stage!=undefined) branchlength = flo(branchlength*stage);
      ctx.save();
      ctx.translate(x,y);
      ctx.scale(scale,1);

      for(let k=0; k<branchlength; k++){
        // draw branch part
        ctx.drawImage(branchbit_png.img,x2,y2,6,6);

        // chance to add leaf
        if(WorldRandom.ch(lCha))
          ctx.drawImage(leaf1_png.img, x2, y2+4, 6, 6);

        // move to next branch part
        x2 -= 5;
        y2 -= bDev;
      }
      ctx.restore();
    }
  }


  for(let i=0; i<3; i++){

    youngTrees[i] = [];

    let canvas = canv();
    canvas.width = TreeCanvasW;
    canvas.height = TreeCanvasH;

    let ctx = getCtx(canvas);
    ctx.filter = `hue-rotate(${Hue}deg)`;

    // individual tree settings
    let y = canvas.height - 6;
    let x = canvas.width/2;
    // trunk length
    let tLen = WorldRandom.randi(tMin,tMax);
    // trunk deviation left-right
    let tDev = WorldRandom.rand(3);

    //
    let snapshotInterval = tLen / 4;
    let snapshotIndex =0;
    let treestage =0;

    // construct tree
    for(let j=0; j<tLen; j++){
      // draw trunk part
      ctx.drawImage(trunkbit_png.img,x,y,6,6);

      // record a snapshot (younglings)
      if(j>snapshotIndex){
        let youngling = canv();
        youngling.width = TreeCanvasW;
        youngling.height = TreeCanvasH;
        let yctx = getCtx(youngling);
        yctx.drawImage(canvas,0,0,TreeCanvasW,TreeCanvasH);
        branch(x,y,1,yctx,treestage); // left
        ctx.translate(6,0);
        branch(x,y,-1,yctx,treestage); // right
        ctx.translate(-6,0);
        treestage += 0.25;
        snapshotIndex += snapshotInterval;
        youngTrees[i].push(youngling);
      }

      // draw branches
      if(j>1&&j%bSpa==0){
        branch(x,y,1,ctx); // left
        ctx.translate(6,0);
        branch(x,y,-1,ctx); // right
        ctx.translate(-6,0);
      }

      // move up to next trunk part
      y -= 5;
      x += WorldRandom.rand(-1,1)*tDev;

    }

    // save tree
    trees.push(canvas);
  }

  return {
    mature_trees:trees,
    younglings:youngTrees
  }
}
