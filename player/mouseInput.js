let mainMouse;

let newMouseData=()=>{
  return {
    x:0,
    y:0
  }
}
//let stopListening=false;


let attachScrollControls=(data,canvas,func)=>{
  data.scroll =0;
  canvas.addEventListener("wheel", function(e) {
    e.preventDefault();
    data.scroll = e.deltaY;
    console.log(data.scroll )
    if(func!=undefined) func();
  });
}

let attachMouseControls=(data,canvas,clickevent,mouseoverfunc)=>{
  canvas.addEventListener("mousemove", function(e) {
      //if(stopListening) return;
      var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
      data.x= Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas
      data.y = Math.round(e.clientY - cRect.top);
      data.worldPos = addV(camera,subV(data,multV(0.5,canvasSize)))
      if(mouseoverfunc!=undefined) mouseoverfunc();
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

let mainCanvasHovered=false;
let mainCanvasMouseOver=()=>{
  mainCanvasHovered=true;
  console.log(mainCanvasHovered);
}


let mouseClickedOverCanvas=()=>{
  console.log(mainMouse)
}

const mouseOverDist = 40;
let planetMouseOverTarget;


let handlePlanetHover=()=>{
  if(planetMouseOverTarget&&planetMouseOverTarget.name){

    if(player.running) return;

    if(planetMouseOverTarget.getName!=undefined){
      planetMouseOverTarget.getName();
    }

    drawText(
      planetMouseOverTarget.name,
      mainMouse.x,
      mainMouse.y
    );
  }

}
