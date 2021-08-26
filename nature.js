const TreeCanvasW = 100;
const TreeCanvasH = 100;

function createNewTreeType (){


  // general settings
  let treesToGenerate = 3;
  let trees = [];

  // tree family settings
  let hue = flo(rand(360));
  let trunkmin = rand(2, 8);
  let trunkmax = trunkmin + rand(1, 8);

  let branchmin = rand(2,5);
  let branchmax = rand(2,4);
  let branchspacing = flo(rand(2,6));
  let branchchance = rand();
  let branchDeviation = rand(-2,4);

  let leafchance = rand();

  for(let i=0; i<treesToGenerate; i++){

    let canvas = document.createElement("canvas");
    canvas.width = TreeCanvasW;
    canvas.height = TreeCanvasH;

    //document.body.appendChild(canvas);// remove me
    let ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled= false;

    // individual tree settings
    let y = canvas.height - 6;
    let x = (i+1)*canvas.width/4 -3;
    let trunkLength = flo(rand(trunkmin,trunkmax));
    let trunkdeviation = rand(4);

    for(let j=0; j<trunkLength; j++){
      ctx.filter = `hue-rotate(${hue}deg)`;
      ctx.drawImage(trunkbit_png.img,x,y,6,6);

      if(j>1&&j%branchspacing==0){

        // left branch
        if(rand()<branchchance){
          let x2 = x - 6;
          let y2 = y;
          let branchlength = rand(branchmin,branchmax);
          for(let k=0; k<branchlength; k++){
            ctx.drawImage(branchbit_png.img,x2,y2,6,6);
            if(rand()<leafchance)
              ctx.drawImage(leaf1_png.img, x2, y2+4, 6, 6);
            x2 -= 5;
            y2 -= branchDeviation;
          }
        }

        // right branch
        if(rand()<branchchance){
          let x2 = -6;
          let y2 = 0;
          let branchlength = rand(branchmin,branchmax);
          ctx.save();
          ctx.translate(x,y);
          ctx.scale(-1,1);
          for(let k=0; k<branchlength; k++){
            ctx.drawImage(branchbit_png.img,x2,y2,6,6);
            if(rand()<leafchance)
              ctx.drawImage(leaf1_png.img, x2, y2+4, 6, 6);
            x2 -= 5;
            y2 -= branchDeviation;
          }
          ctx.restore();
        }
      }

      y -= 5;
      x += rand(-1,1)*trunkdeviation;
    }

    trees.push(canvas);
  }

  return trees;
}
