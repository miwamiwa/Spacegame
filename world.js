let mainCanvas;
let mCtx;
let middle = {};

function setupCanvas(){
  mainCanvas = document.getElementById("canvas");
  mainCanvas.width = 600;
  mainCanvas.height = 600;


  middle.x = 300;
  middle.y = 200;
  mCtx = mainCanvas.getContext("2d");
  mCtx.imageSmoothingEnabled= false;
  document.body.appendChild(mainCanvas);
  document.body.onkeydown = keyDown;
  document.body.onkeyup = keyUp;
}
