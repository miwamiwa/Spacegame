
class Planet {
  constructor(x,y,randomscenery,name, rad, minfruit, isBarren){

    // mass and radius
    if(!rad) rad=rand(350,460);
    this.r = rad;
    this.mass = rand(800,2000);

    // position
    this.half =0; // for camera calculations
    this.x = x;
    this.y = y;
    this.d2p =-1; // distance to player

    this.tribe;

    this.bobsMuffined=0
    this.totalBobs=0;
    this.prizeAwarded=false;
    // random planet name
    if(!name){
      name = RandomFromArray(PlanetNames);
      while(usedPlanetNames.includes(name))
      name += flo(rand(100));
      usedPlanetNames.push(name);
    }
    this.name = name;

    // children
    this.features = [];
    this.hue =flo(rand(360));

    // create planet image, water
    this.make();
    // add trees
    this.setupScenery(minfruit);

    // set local currency and language
    this.setLang("Onian");

    if(isBarren!=undefined) this.setupMusic(isBarren);

    // all done
    planets.push(this);
  }

  setupMusic(isBarren){

    this.jazz = {
      barCounter:0,
      currentMelodySection:0,
      headsPlayed:0,
      playingMelody:true
    };

    // am i a barren planet?
    this.isBarren = isBarren;

    if(this.isBarren){
      // barren music for this planet
      // see sound/setupBarrenPlanetMusic.js
      this.m = setupBarrenPlanetMusic();
    }

    // populated music
    // see sound/setupPopulatedPlanetMusic.js
    else setupPopulatedPlanetMusic(this);


  }



  // populate()
  //
  //

  populate(){

    // populate!
    if(ch(0.47)) this.tribe = new Tribe(this);

    // setup music accordingly
    if(this.tribe!=undefined) this.setupMusic(false);
    else this.setupMusic(true);

  }




  posIsInWater(p){
    let x = this.toScale(p.y);
    let y = this.toScale(p.x);
    let w = this.water[y+1][x];

    if(w) this.previous[y][x+1] = 180;
    return w;
  }

  toScale(i){
    return flo(50*(i + this.r)/(2*this.r));
  }

  // make()
  //
  // make planet canvas

  make(){

    this.rainRate = randi(1,20);
    this.counter=0;

    this.planet=scanv();
    this.planet2=scanv();
    this.water = [];
    this.current = [];
    this.previous = [];


    let ctx=getCtx(this.planet);
    let ctx2=getCtx(this.planet2); // mask canvas
    this.ctx=ctx;
    ctx2.fillStyle=black;

    for(let y=0; y<50; y++){
      this.water[y]=[];
      this.current[y]=[];
      this.previous[y]=[];

      let r = rand(y);
      let r2 = rand(y%30);
      let fact = rand(0,10);
      let started=false;

      for(let x=0; x<50; x++){

        this.current[y][x] = 0;
        this.previous[y][x] = 0;

        if(dist(xy(x,y),xy(25,25))<25){

          if(!started){
            started=true;
            if(ch(0.5)) this.water[y][x]=true;
          }

          let f=`#${randi(3,7)}8cf`;
          if(x<r||x>r2) f="#8bef";

          ctx.fillStyle=f;
          ctx.fillRect(x,y,1,1);
          ctx2.fillRect(x,y,1,1);

          if(
            x>0&&y>0&&ch(.005)
            ||(this.water[y][x-1]&&ch(.7))
            ||(this.water[y-1][x]&&ch(.3))
          )
          this.makeWater(y,x);
        }

        r2 += rand(-fact,fact)
      }
    }


    for(let i=0; i<49; i++){
      for(let j=0; j<49; j++){
        if(this.water[i][j]){
          if(ch(.4)) this.makeWater(i-1,j);
          if(ch(.4)) this.makeWater(i,j-1);
          if(ch(.4)) this.makeWater(i+1,j);
          if(ch(.4)) this.makeWater(i,j+1);
        }
      }
    }

    this.outMin = 120;
    this.outMax = 225;
  }


  makeWater(x,y,ctx){
    if(dist(xy(x,y),xy(25,25))<25){
      this.water[x][y]=true;
      this.ctx.fillStyle="#ca8f";
      this.ctx.fillRect(x,y,1,1);
    }
  }

  addFeature(obj, r){
    if(r) this.spot(obj,r);

    this.features.push(obj);
    this.sortFeatures();
    return obj;
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
      if(!i)i=0.9;
      pos = this.rInRange(i);
      let clear = true;
      //if(this.posIsInWater(pos)) continue;

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

  setupScenery(min){

    // generate a family of trees
    this.trees = [];
    this.treeCount = randi(24,32);

    this.localBerry = {
      berryName:RandomFromArray(BerryNames),
      treeFamily:createNewTreeType()
    }

    for(let i=0; i<this.treeCount; i++) this.newTree();

    // add rocks
    this.rocks = [];
    this.rockCount = randi(6, 12);
    for(let i=0; i<this.rockCount; i++) this.newRock();

    // order features by y
    this.sortFeatures();
  }

  newTree(){
    // create tree object
    let tree = this.addFeature(new Tree(this.localBerry), 10);
    this.trees.push(tree);
  }

  newRock(){

    let size = flo(rand(40, 120));
    let rock = this.addFeature( new Rock(size),size);
    this.rocks.push(rock);
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

  setLang(l){
    this.language=l;
    this.hue=allLanguages.indexOf(this.language)*30+rand(-1,1)
  }

  // addCheese()
  //
  // litter cheese crackers all over the place
  /*
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
*/


// update()
//
// display everything on the planet

update(){
  // check if planet is visible
  let pos = camera.position(this);
  if(camera.isOnScreen(pos,this.mass)){

    // back layer

    transform(pos,()=>{
      hue(this.hue);
      // draw atmosphere
      fill("#5593");
      mCtx.beginPath();
      circ(0,0,this.mass);
      mCtx.fill();

      // draw mask
      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.drawImage(this.planet2,-this.r,-this.r,this.r*4,this.r*4);

      // draw things inside mask:
      transform(zero,()=>{
        // draw planet
        mCtx.globalCompositeOperation = 'xor';
        mCtx.drawImage(this.planet,-this.r,-this.r,this.r*4,this.r*4);
        // draw shadows
        this.features.forEach(f=>displayShadow(f));
      });
    });

    // objects outside of mask (front layer)

    transform(pos,()=>{
      hue(this.hue);
      this.features.forEach(f=>f.display());
    });

    this.updateWater();
    this.counter++;
  }
}

updateWater(){

  let dataCount =0;
  let color;
  let imageData = this.ctx.getImageData(0, 0, 50, 50);
  let newFrame = imageData.data;

  if(this.counter%this.rainRate==0)
  this.previous[flo(rand(50))][flo(rand(50))] = this.outMin+5;

  if(this.counter%5==0){
    for(let i=1; i<49; i++){
      for(let j=1; j<49; j++){

        this.current[i][j] =
        ( this.previous[i - 1][j]
          + this.previous[i + 1][j]
          + this.previous[i][j - 1]
          + this.previous[i][j + 1] ) / 2 - this.current[i][j];

          this.current[i][j] = (this.current[i][j] * 0.7);
          if(this.water[i][j]){
            dataCount = 4*(j*50+i);
            color = flo(this.outMin+(this.outMax-this.outMin)*( this.current[i][j] )/255);
            color = flo(255 - color*0.5);
            newFrame[dataCount] = color;
            newFrame[dataCount+1] = color*0.9;
            newFrame[dataCount+2] = color*0.9;
            newFrame[dataCount+3] = 255;
          }
        }
      }

      this.ctx.putImageData(imageData, 0, 0);
      let temp = [];

      for(let i=0; i<50; i++){
        temp[i] = [];

        for(let j=0; j<50; j++){
          temp[i][j] = this.previous[i][j];
          this.previous[i][j] = this.current[i][j];
          this.current[i][j] = temp[i][j];
        }
      }
    }

  }

  getGravityFor(input,d){
    // d is the distance from the input object to the center of this planet

    // if this is true, we are touching the surface
    if(d<this.r){
      let vel = dist(zero,vxy(input));

      // crash if going too fast
      if(CrashEnabled&&vel>input.crashThreshold && !input.crashed){
        input.crash();
      }


      if(!this.visited && !input.crashed){
        this.visited = true;
        knownPlanets.push(this);
        updateMap();
      }


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
