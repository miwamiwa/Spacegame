let stars = [];
const NumStars = 16;

function setupStars(){

  // create stars
  for(let i=0; i<NumStars; i++)
    stars.push(new AnimObject(-1000,-1000,10,StarAnimation))

}


function updateStars(){

  stars.forEach(s=>{
    let pos = camera.position(s);

    // reposition if far off screen
    if(!camera.isOnScreen(pos,400)){
      // place somewhere off screen but not too far
      while(! (camera.isOnScreen(pos,400) && !camera.isOnScreen(pos,10)) ){
        s.x = rand(player.x - 1000, player.x + 1000);
        s.y = rand(player.y - 1000, player.y + 1000);
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
