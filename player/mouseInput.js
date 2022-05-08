let mainMouse;

let newMouseData=()=>{
  return {
    x:0,
    y:0
  }
}
//let stopListening=false;

let attachMouseControls=(data,canvas,clickevent)=>{
  canvas.addEventListener("mousemove", function(e) {
      //if(stopListening) return;
      var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
      data.x= Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
      data.y = Math.round(e.clientY - cRect.top);
      data.worldPos = addV(camera,subV(data,multV(0.5,canvasSize)))

      if(nP!=undefined){
        data.planetPos = subV(data.worldPos,nP);
      }
  });


  canvas.addEventListener("mousedown", function(e){
    clickevent();
    //stopListening=true;
  });

  return data;
}


let mouseClickedOverCanvas=()=>{
  console.log(mainMouse)
}

const mouseOverDist = 40;
let planetMouseOverTarget;


let handlePlanetHover=()=>{
  if(planetMouseOverTarget&&planetMouseOverTarget.name)
  drawText(
    planetMouseOverTarget.name,
    mainMouse.x,
    mainMouse.y
  );
}
