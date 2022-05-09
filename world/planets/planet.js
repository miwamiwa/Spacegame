let visitPlanet =(p)=>{
  p.visited = true;
  knownPlanets.push(p);
}

class Planet {
  constructor(x,y,randomscenery,name, rad, minfruit, isBarren){

    // seeded random for this planet
    this.randomseed = generatePlanetSeed();
    this.rng = new RNG(this.randomseed);

    // mass and radius
    if(!rad) rad=this.rng.randi(350,460);
    this.r = rad;
    this.mass = this.rng.randi(800,2000);

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
    if(!name) name = randomPlanetName();
    this.name = name;

    // children
    this.features = [];
    this.hue=this.rng.randi(360);

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
    if(this.rng.ch(0.57)) this.tribe = new Tribe(this);

    // setup music accordingly
    if(this.tribe!=undefined) this.setupMusic(false);
    else this.setupMusic(true);

  }

  // check if given position is in water
  posIsInWater(p){
    return this.surface.posIsInWater(p);
  }

  toScale(i){
    return flo(50*(i + this.r)/(2*this.r));
  }

  // make planet surface
  make(){
    this.surface = new Surface(this.rng,this.r);
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
    return this.rng.rand(-this.r,this.r);
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
      // get random position
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
    this.treeCount = this.rng.randi(24,32);

    let berry = this.rng.randomFromArray(BerryNames);
    this.localFlora = {
      berryName:berry,
      treeFamily:treeFamilies[berry]
    }

    for(let i=0; i<this.treeCount; i++) this.newTree();

    // add rocks
    this.rocks = [];
    this.rockCount = this.rng.randi(6, 12);
    for(let i=0; i<this.rockCount; i++) this.newRock();

    // order features by y
    this.sortFeatures();
  }

  newTree(){
    // create tree object
    let age = this.rng.randi(5);
    if(age==4) age = "mature"
    let tree = this.addFeature(new Tree(this.localFlora,age,this.rng), 10);
    this.trees.push(tree);
  }

  newRock(){

    let size = this.rng.randi(40, 120);
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
    this.hue=allLanguages.indexOf(this.language)*30+this.rng.rand(-1,1)
  }


// displayAtmosphere()
// displays ring around the planet
displayAtmosphere(){
  // draw atmosphere
  fill("#5593");
  mCtx.beginPath();
  circ(0,0,this.mass);
  mCtx.fill();
}

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

      this.displayAtmosphere();

      mCtx.globalCompositeOperation = 'destination-out';
      this.surface.drawMask(mCtx);
      // draw things inside mask:
      transform(zero,()=>{
        // draw planet
        mCtx.globalCompositeOperation = 'xor';
        this.surface.draw(mCtx);
        // draw shadows
        this.features.forEach(f=>displayShadow(f));
      });
    });

    // objects outside of mask (front layer)

    transform(pos,()=>{
      hue(this.hue);
      this.features.forEach(f=>f.display());
    });

    this.surface.updateWater();

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
        this.visit();
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

  visit(){
    visitPlanet(this);
    updateMap();
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


// LOL
// gotta bring back the cheese some day
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
