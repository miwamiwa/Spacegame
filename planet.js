
class Planet {
  constructor(x,y,randomscenery,name, rad, mas){

    // mass and radius
    if(rad==undefined){
      rad=rand(150,320);
      mas=rand(PlanetMassMin,PlanetMassMax)
    }
    this.radius = rad;
    this.mass = mas;

    // position
    this.half =0; // for camera calculations
    this.x = x;
    this.y = y;

    // children
    this.features = [];

    // distance to player
    this.d2p =-1;

    // random hue
    this.hue =flo(rand(360));

    // random planet name
    if(name==undefined) name = RandomPlanetName();
    this.name = name;

    // setup planet color, spots
    this.addBasicFeatures();

    // add random scenery (==trees)
    if(randomscenery)
    this.setupScenery();

  }

  // sortFeatures()
  //
  // sort planet features by y position to achieve
  // some sort of z-indexing.

  sortFeatures(){
    let sorted = [this.features[0]];

    for(let i=1; i<this.features.length; i++){
      let f = this.features[i];
      let found = false;
      let j=0;

      // compare y-pos at the base of each element
      sorted.forEach(el=>{
        if(!found&&f.y+f.half<el.y+el.half){
          // insert into array if element comes before
          // an already sorted element
          sorted.splice(j,0,f);
          found = true;
        }
        j++;
      });
      // otherwise insert at the end
      if(!found) sorted.push(f);
    }
    // update features[]
    this.features = sorted;
  }

  // addBasicFeatures()
  //
  // generate ground color and spots

  addBasicFeatures(){
    let r = flo(rand(80,120));
    let g = 255-r;
    let b = flo(rand(80,120));
    let rad = flo(rand(40, 140));
    let spots = flo(rand(4,12));
    let x;
    let y;

    this.groundColor = rgba(r,g,b,1);
    this.groundColor2 = rgba(r+20,g+20,b+20,0.3);
    this.spots = [];

    for(let i=0; i<spots; i++){
      x=this.rPos();
      y=this.rPos();
      this.spots.push({x:x, y:y, r:rad+rand(-10,10),g:gradient(x,y, 5, 10, 10, 30,this.groundColor2)});

    }

  }

  // rPos()
  //
  // return a random position on this planet

  rPos(){
    return rand(-this.radius,this.radius);
  }


  // findAvailableSpot
  //
  // get a random surface position that isn't
  // right on top of another object (hopefully lol)

  findAvailableSpot(){
    let pos;
    let found = false;

    // keep picking positions until one with no overlaps is found
    while(!found){
      pos = this.rSurf(0.5);
      let clear = true;

      for(let j=0; j<this.features.length; j++)
        if(this.features[j]!=Dude&&dist(pos,this.features[j])<MinDistanceBetweenFeatures)
          clear  = false;

      found = clear;
    }
    return pos;
  }

  // setupScenery()
  //
  // make some trees

  setupScenery(){

    // generate a unique tree family for this planet
    // see nature.js
    this.treeFamily = createNewTreeType();
    let treeCount = flo(rand(6,12));
    let berry = RandomFromArray(BerryNames);
    for(let i=0; i<treeCount; i++){

      // pick a random tree and position
      let pick = RandomFromArray(this.treeFamily);
      let pos = this.findAvailableSpot();

      // create tree object
      let tree = new StaticObject(pos.x,pos.y -90,{img:pick},200);
      tree.collider = false;
      tree.talker = true;
      tree.talkrange = 34;
      tree.berry = berry;
      tree.text=tree.berryText();
      tree.id="tree";
      tree.firstReadAction = tree.lootBerry;

      // add to features[]
      this.features.push(tree);
    }

    // order features by y
    this.sortFeatures();
  }


  // rSurf()
  //
  // random position on the surface of this planet

  rSurf(range){
    return {x:this.rPos() * range,y:this.rPos() * range};
  }

  // addCheese()
  //
  // litter cheese crackers all over the place

  addCheese(){
    let count = flo(rand(6,12));
    for(let i=0; i<count; i++){
      let pos = this.rSurf(1);
      let c = new StaticObject(pos.x,pos.y,cracker_png,10);
      c.edible = true;
      c.collider = false;
      c.id="cheese";
      this.features.push(c);
    }
  }


  // update()
  //
  // display everything on the planet

  update(){
    // check if planet is visible
    let pos = camera.position(this);
    if(camera.isOnScreen(pos,this.mass)){

      mCtx.save();
      hue(this.hue);
      mCtx.translate(pos.x,pos.y);
      // draw a circle to show range of gravity
      drawCircle(0,0,this.mass,"#5593");

      // set mask around contour
      mCtx.beginPath();
      mCtx.arc(0,0, this.radius, 0, TWO_PI, true);
      mCtx.clip();

      // draw planet
      drawCircle(0,0,this.radius,this.groundColor);
      // draw circular shadow overtop
      drawCircle(0,0,this.radius,
        gradient(-20,0, this.radius, pos.x-20,pos.y, this.radius-100,"#0006","#0000"));

      // draw "spots"
      this.spots.forEach(spot=>{
        mCtx.save();
        drawCircle(spot.x,spot.y,spot.r,spot.g);
        mCtx.restore();
      });

      // draw all the features' shadows
      this.features.forEach(f=>displayShadow(f));
      // then draw all features
      this.features.forEach(f=>f.display());
      mCtx.restore();
    }
  }

  getGravityFor(input,d){
    // d is the distance from the input object to the center of this planet
    // calculate if not provided
    if(d==undefined) d = dist(this,input);

    // nextd is the distance to center from where the object is headed
    let nextd = dist(this,{x:input.x + input.lastvx, y:input.y + input.lastvy});

    // if this is true, we are touching the surface
    if(nextd<this.radius){
      let vel = dist({x:0,y:0},{x:input.lastvx,y:input.lastvy});

      // crash if going too fast
      if(vel>CrashThreshold / input.mass && !input.crashed)
        input.crash();

      if(!input.crashed)
        this.visited = true;

      input.landed = true;
    }
    else input.landed = false;

    // if input is in the air return gravity
    if(!input.landed && d>this.radius)
      return GravityConstant * (this.mass * input.mass) / Math.pow(d,2); // gmm/r^2
      // otherwise gravity is 0
    else return 0;
  }

  // removeDude()
  //
  // remove dude from child objects
  removeDude(){
    for(let i=this.features.length-1; i>=0; i--){
      if(this.features[i]==Dude){
        this.features.splice(i,1);
        break;
      }
    }
  }
}
