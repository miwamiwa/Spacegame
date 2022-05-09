let mapCanvas;
let mapCtx;
let mapCanvasSize = {
  x:400,
  y:400
}
let mapMouseData;
let knownPlanets = [];
let mapCamTarget = {x:0,y:0};
let mapBounds;
let mapScroll = "none";


let setupMap=()=>{

  // create map
  mapMouseData = newMouseData();
  mapCanvas = document.createElement("canvas");
  mapCanvas.setAttribute("width",mapCanvasSize.x);
  mapCanvas.setAttribute("height",mapCanvasSize.y);
  mapCtx = mapCanvas.getContext("2d");

  mapBounds = {
    x:0,
    y:0,
    w:mapCanvasSize.x,
    h:mapCanvasSize.y
  }

  mapUI.addElement(mapCanvas);
  mapCanvas.id="mapCanvas";

  mapMouseData=attachMouseControls(mapMouseData,mapCanvas,mapClick,mapMouseOver)

  attachScrollControls(mapMouseData,mapCanvas,()=>{
    mapScale = Math.max(0.0001,mapScale + mapMouseData.scroll * 0.0001);
    mapCamTarget = multV(mapScale,player);
    mapCamTarget = subV(mapCamTarget,multV(0.5,mapCanvasSize));

    updateMap();
  });

}


let mapScale = 0.01;


let updateMap=()=>{
  mapCtx.fillStyle = "black";
  mapCtx.fillRect(0,0,mapCanvasSize.x,mapCanvasSize.y);



  let planetMapSize = 20 * mapScale * 100

  planets.forEach(planet=>{
    if(knownPlanets.includes(planet)){
      if(planet.special) mapCtx.strokeStyle = "green";
      else if(planet.tribe) mapCtx.strokeStyle = "blue";
      else mapCtx.strokeStyle = "white";
    }
    else mapCtx.strokeStyle = "grey";
    mapCtx.beginPath();
    planet.mapPos = subV(multV(mapScale,planet),mapCamTarget);
    planet.showOnMap = posInBounds(planet.mapPos,planetMapSize,mapBounds);
    if(planet.showOnMap){
      mapCtx.moveTo(planet.mapPos.x,planet.mapPos.y)
      mapCtx.ellipse(planet.mapPos.x,planet.mapPos.y,planetMapSize,planetMapSize,0,0,TWO_PI);
    }
    mapCtx.stroke();
  });


  mapCtx.fillStyle= "white"
  knownPlanets.forEach(planet=>{
    if(planet.showOnMap) mapCtx.fillText(planet.name,planet.mapPos.x,planet.mapPos.y);
  });


  // lastly, draw player
  if(player==undefined) return;
  let playerMapPos = subV(multV(mapScale,player),mapCamTarget);
  mapCtx.strokeStyle="red";
  drawCross(mapCtx,playerMapPos,3);

  //mapCamTarget =
}

let drawCross=(ctx,point,length)=>{
  ctx.beginPath();
  ctx.moveTo(point.x - length, point.y - length);
  ctx.lineTo(point.x + length, point.y + length);
  ctx.moveTo(point.x + length, point.y - length);
  ctx.lineTo(point.x - length, point.y + length);
  ctx.stroke();
}

let posInBounds=(pos,rad,bounds)=>{
  return pos.x+rad>=bounds.x
  && pos.x-rad<bounds.x+bounds.w
  && pos.y+rad>=bounds.y
  && pos.y-rad<bounds.y+bounds.h
}

let updateMapUI=()=>{
  let scrollSpeed = 2;
  if(!mainCanvasHovered){
    switch(mapScroll){
      case "left": mapCamTarget.x -=scrollSpeed; break;
      case "right": mapCamTarget.x +=scrollSpeed; break;
      case "up": mapCamTarget.y -=scrollSpeed; break;
      case "down": mapCamTarget.y +=scrollSpeed; break;
    }
    if(mapScroll!="none") updateMap();
  }
  else mapScroll = "none";

}


let scrollMargin = 33;
let mapMouseOver=()=>{


  console.log("map mouse over",mapMouseData)
  mainCanvasHovered = false;
  console.log(mainCanvasHovered);

  if(mapMouseData.x<scrollMargin) mapScroll = "left";
  else if(mapMouseData.x>mapCanvasSize.x-scrollMargin) mapScroll = "right";
  else if(mapMouseData.y<scrollMargin) mapScroll = "up";
  else if(mapMouseData.y>mapCanvasSize.y-scrollMargin) mapScroll = "down";
  else mapScroll = "none";

}

let centerMap=()=>{
  mapCamTarget = {x:0,y:0};
}
let mapClick=()=>{
  console.log("map click",mapMouseData)
}
