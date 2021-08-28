// loadImages()
//
// load all images in the pre-generated all_images array
let loadImages=()=>{
  all_images.forEach(el=>loadImage(el));
}


// loadImage()
//
// create image from an input string
let loadImage=(input)=>{
  // make a new canvas
  let lCanvas = canv();

  // convert string to rgba values
  let pixels = [];

  // look through chars 2 by 2
  for(let i=0; i<input.t.length; i+=2){
    // 1st char is a number of pixels
    let j = input.t.charCodeAt(i+1) -c1 + 1;
    // 2nd char is their color
    let h = HexToRgba(all_colors[input.c[parseInt(input.t.charCodeAt(i) -c1)]]);
    // add that number of chars of this color to array of pixels
    while(j>0){
      pixels.push(h)
      j--;
    }
  }

  // now we can infer canvas size
  lCanvas.width = input.w;
  lCanvas.height = Math.ceil(pixels.length / input.w);
  let lCtx = lCanvas.getContext("2d");

  // create pixel data object
  let lpix = lCtx.getImageData(0,0,lCanvas.width,lCanvas.height);
  let pixcounter =0;

  // assign rgba values to each pixel
  for(let i=0; i<lpix.data.length; i+=4){
    let p = pixels[pixcounter];

    if(p!=undefined){
      lpix.data[i] = p[0];
      lpix.data[i+1] = p[1];
      lpix.data[i+2] = p[2];
      lpix.data[i+3] = p[3];
      pixcounter++;
    }
  }

  // save this canvas
  lCtx.putImageData(lpix, 0, 0);
  input.img = lCanvas;
  input.t = ""; // delete text to free some memory? not sure about this lol

}
