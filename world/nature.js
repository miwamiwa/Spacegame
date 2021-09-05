

let createNewTreeType=()=>{

  // general settings
  let trees = [];

  // tree family settings
  let Hue = flo(rand(360));

  // trunk length
  let tMin = rand(2, 8);
  let tMax = tMin + rand(1, 8);

  // branch length
  let bMin = rand(2,5);
  let bMax = rand(2,4);
  // branch spacing
  let bSpa = flo(rand(2,6));
  // branch chance
  let bCha = rand();
  // point branch up or down
  let bDev = rand(-2,4);
  // leaf chance
  let lCha = rand();

  let branch=(x,y,scale,ctx)=>{
    if(rand()<bCha){
      let x2 = -6;
      let y2 = 0;
      let branchlength = rand(bMin,bMax);

      ctx.save();
      ctx.translate(x,y);
      ctx.scale(scale,1);

      for(let k=0; k<branchlength; k++){
        // draw branch part
        ctx.drawImage(branchbit_png.img,x2,y2,6,6);

        // chance to add leaf
        if(rand()<lCha)
          ctx.drawImage(leaf1_png.img, x2, y2+4, 6, 6);

        // move to next branch part
        x2 -= 5;
        y2 -= bDev;
      }
      ctx.restore();
    }
  }


  for(let i=0; i<3; i++){

    let canvas = canv();
    canvas.width = TreeCanvasW;
    canvas.height = TreeCanvasH;

    let ctx = getCtx(canvas);
    ctx.filter = `hue-rotate(${Hue}deg)`;

    // individual tree settings
    let y = canvas.height - 6;
    let x = canvas.width/2;
    // trunk length
    let tLen = flo(rand(tMin,tMax));
    // trunk deviation left-right
    let tDev = rand(4);

    // construct tree
    for(let j=0; j<tLen; j++){

      // draw trunk part
      ctx.drawImage(trunkbit_png.img,x,y,6,6);

      // draw branches
      if(j>1&&j%bSpa==0){
        // left
        branch(x,y,1,ctx);
        // right
        ctx.translate(6,0);
        branch(x,y,-1,ctx);
      }

      // move up to next trunk part
      y -= 5;
      x += rand(-1,1)*tDev;
    }

    // save tree
    trees.push(canvas);
  }

  return trees;
}
