
class Planet {
  constructor(x,y,randomscenery,name, rad, mas){

    // mass and radius
    if(!rad){
      rad=rand(250,380);
      mas=rand(PlanetMassMin,PlanetMassMax)
    }
    this.r = rad;
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


    // add random scenery (==trees)
    if(randomscenery)
    this.setupScenery();

    planets.push(this);

    this.make();
  }


  make(){

    let r = flo(rand(40,60));
    let g = 255-r;
    let b = flo(rand(20,120));

    this.groundColor = rgba(r,g,b,1);
    this.groundColor2 = rgba(r+20,g+20,b+20,1);

    this.planet=scanv();
    this.planet2=scanv();

    let ctx=getCtx(this.planet);
    let ctx2=getCtx(this.planet2);

    ctx2.fillStyle="black";
    ctx.fillStyle="white"

    for(let y=0; y<50; y++){
      let r = rand(y%50);
      let r2 = rand(y%30);
      let fact = rand(0,10)
      for(let x=0; x<50; x++){
        if(dist(xy(x,y),xy(25,25))<25){
          if(x<r||x>r2) ctx.fillStyle="#8bef";
          else ctx.fillStyle=`#${flo(rand(3,7))}8cf`;
          ctx.fillRect(x,y,1,1);
          ctx2.fillRect(x,y,1,1);
        }

        r2 += rand(-fact,fact)
      }
    }


  }

  addFeature(obj, r){
    if(r) this.spot(obj,r);

    this.features.push(obj);
    this.sortFeatures();
  }


  spot(obj,r){
    setV(obj,this.findAvailableSpot(r));
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



  // rPos()
  //
  // return a random position on this planet

  rPos(){
    return rand(-this.r,this.r);
  }


  // findAvailableSpot
  //
  // get a random surface position that isn't
  // right on top of another object (hopefully lol)

  findAvailableSpot(d,i){
    let pos;
    let found = false;

    // keep picking positions until one with no overlaps is found
    while(!found){
      if(!i)i=0.5;
      pos = this.rInRange(i);
      let clear = true;

      for(let j=0; j<this.features.length; j++){
        let distance = dist(pos,this.features[j]);

        if(this.features[j].id=="tree"){
          if(distance<50) clear=false;
        }
        else if (this.features[j]!=Dude&&distance<d)
          clear  = false;
      }


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
    let treeCount = flo(rand(3,9));
    let berry = RandomFromArray(BerryNames);
    for(let i=0; i<treeCount; i++){

      // pick a random tree and position
      let pick = RandomFromArray(this.treeFamily);
      let pos = this.findAvailableSpot(MinDistanceBetweenFeatures);

      // create tree object
      let tree = new StaticObject(pos.x,pos.y -90,{img:pick},200);
      tree.collider = false;
      tree.talker = true;
      tree.talkrange = 34;
      tree.berry = berry+" berry";
      tree.setTandA(tree.berryText(),tree.lootBerry);
      tree.id="tree";

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
    return xy(this.rPos() * range,this.rPos() * range);
  }

  rInRange(r){
    let p = this.rSurf(1);
    while(dist(zero,p)>r*this.r) p = this.rSurf(1);
    return p;
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

      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.drawImage(this.planet2,-this.r,-this.r,this.r*4,this.r*4);
      mCtx.save();
      mCtx.globalCompositeOperation = 'xor';

      mCtx.drawImage(this.planet,-this.r,-this.r,this.r*4,this.r*4);

      this.features.forEach(f=>displayShadow(f));


      mCtx.restore();

      mCtx.restore();


      // then draw all features
      mCtx.save();
      hue(this.hue);
      mCtx.translate(pos.x,pos.y);
      this.features.forEach(f=>f.display());
      mCtx.restore();



    }
  }

  getGravityFor(input,d){
    // d is the distance from the input object to the center of this planet

    // if this is true, we are touching the surface
    if(d<this.r){
      let vel = dist(zero,vxy(input));

      // crash if going too fast
      if(vel>input.crashThreshold && !input.crashed)
        input.crash();

      if(!input.crashed)
        this.visited = true;

      input.landed = true;
    }
    else{
      input.landed = false;
      return GravityConstant * (this.mass * input.mass) / sq(d); // gmm/r^2
    }


      // otherwise gravity is 0
    return 0;
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
