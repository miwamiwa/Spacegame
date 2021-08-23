let loadCanvas;
let loadCtx;
const c1 = 48; // for char conversion
const VesselAnimation = [vessel_png,vessel2_png];
const FlameAnimation = [fire1_png,fire2_png];
const CrashAnimation = [crash1_png,crash2_png,crash3_png];
const StarAnimation = [star1_png,star2_png];
const PlayerAnimation = [player1_png,player2_png];
const PlayerWalkLeft = [walk_left_1_png,walk_left_2_png];
const PlayerWalkRight = [walk_right_1_png,walk_right_2_png];
const PlayerWalkUp = [walk_up_1_png,walk_up_2_png];
const PlayerWalkDown = [walk_down_1_png,walk_down_2_png];

function loadImages(){
  all_images.forEach(el=>loadImage(el));
}

function loadImage(input){

  loadCanvas = document.createElement("canvas");

  // convert string to rgba values
  let pixels = [];
  for(let i=0; i<input.t.length; i+=2){
    let i1 = input.t.charCodeAt(i) -c1; // color
    let i2 = input.t.charCodeAt(i+1) -c1 + 1; // buffer count
    while(i2>0){
      pixels.push(HexToRgba(all_colors[input.c[parseInt(i1)]]))
      i2--;
    }
  }

  // update load canvas size to match image
  loadCanvas.width = input.w;
  loadCanvas.height = Math.ceil(pixels.length / input.w);

  // create a pixel data object
  loadCtx = loadCanvas.getContext("2d");
  let loadpix = loadCtx.getImageData(0,0,loadCanvas.width,loadCanvas.height);
  let pixcounter =0;

  // assign rgba values to each pixel
  for(let i=0; i<loadpix.data.length; i+=4){
    let p = pixels[pixcounter];

    if(p!=undefined){
      loadpix.data[i] = p[0];
      loadpix.data[i+1] = p[1];
      loadpix.data[i+2] = p[2];
      loadpix.data[i+3] = p[3];
      pixcounter++;
    }
  }
  loadCtx.putImageData(loadpix, 0, 0);

  input.t = ""; // delete text to free some memory
  input.img = loadCanvas; // save this canvas

}


function HexToRgba (hexinput){

  //console.log(hexinput);
  let result = [];
  let hex = hexinput.replace("#","");

  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
    parseInt(hex.substring(6, 8), 16)
  ];
}
