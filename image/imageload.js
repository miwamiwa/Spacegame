let bgPng;
let bgPngWidth;
let bgPngHeight;

// loadImages()
//
// load all images in the pre-generated all_images array
let loadImages=()=>{
  all_images.forEach(el=>loadImage(el));
  bgPng = new Image();
  bgPng.src = "image/assets/bg.png";
  bgPngWidth = 1024;
  bgPngHeight = 657;
}


// loadImage()
//
// create image from an input string
let loadImage=(input)=>{

  let j;
  let h;
  // pixel buffer
  let pixels = [];
  // make a new canvas
  let lCanvas = canv();

  // look through chars 2 by 2
  for(let i=0; i<input.t.length; i+=2){
    // 1st char is a number of pixels
    j = input.t.charCodeAt(i+1) -c1 + 1;
    // 2nd char is their color
    h = HexToRgba(all_colors[input.c[input.t.charCodeAt(i) -c1]]);
    // add that number of chars of this color to array of pixels
    while(j>0){
      pixels.push(h)
      j--;
    }
  }

  // now we can infer canvas size
  lCanvas.width = input.w;
  lCanvas.height = Math.ceil(pixels.length / input.w);
  let lCtx = getCtx(lCanvas);

  // create pixel data object
  let lpix = lCtx.getImageData(0,0,lCanvas.width,lCanvas.height);

  // assign rgba values to each pixel
  for(let i=0; i<lpix.data.length; i+=4){
    let p = pixels[i/4];

    if(p) for(let j=0; j<4; j++)
        lpix.data[i+j] = p[j];

  }

  // save this canvas
  lCtx.putImageData(lpix, 0, 0);
  input.img = lCanvas;
  input.t = ""; // delete text to free some memory? not sure if useful lol

}
