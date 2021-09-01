let stars = [];

// setupStars()
//
// trigger on game start
let setupStars=()=>{
  // create stars
  for(let i=0; i<NumStars; i++)
    stars.push(new AnimObject(-1000,-1000,10,StarAnimation))
}

// updateStars()
//
// remove stars that are too far away,
// add new stars to replace them,
// display current stars.

let updateStars=()=>{

  stars.forEach(s=>{
    let pos = camera.position(s);

    // reposition if far off screen
    if(!player.landed&&!camera.isOnScreen(pos,400)){
      // place somewhere off screen but not too far
      while(! (camera.isOnScreen(pos,400) && !camera.isOnScreen(pos,10)) ){
        s.x = player.x + roughly(0);
        s.y = player.y + roughly(0);
        pos = camera.position(s);
      }
    }

    // draw sprite
    s.drawMe(pos.x,pos.y);
    s.updateAnimation();

    // update our inner clock
    s.counter++;
  });
}
