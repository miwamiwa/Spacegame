
class Planet {
  constructor(x,y,randomscenery,name, rad, mas, minfruit){

    // mass and radius
    if(!rad){
      rad=rand(300,460);
      mas=rand(PlanetMassMin,PlanetMassMax)
    }
    this.r = rad;
    this.mass = mas;

    // position
    this.half =0; // for camera calculations
    this.x = x;
    this.y = y;

    this.currency=cash;
    this.setLang("Onian");
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
    this.setupScenery(minfruit);

    if(randomscenery)
    this.populate();

    planets.push(this);

    this.make();

    this.music();
  }


  music(){
    // setup music for this place

    this.scales = [];
    let scale1=RandomFromArray(allScales);
    let scale2=RandomFromArray(allScales);
    let scale3=RandomFromArray(allScales);

    this.scales.push(scale1);
    this.scales.push(scale1);
    this.scales.push(scale2);
    this.scales.push(scale1);
    this.scales.push(scale2);
    this.scales.push(scale3);

    this.filter=flo(rand(500,2000))
    this.cFilter=flo(rand(200,4000))
    this.cDetune=rand(0.000001,0.000004);
    this.barlength = flo(rand(2200,3200));

    this.riddim = getRhythm(this.barlength, rand());
    this.pattern = getNotePattern(this.riddim,this.scales);
    if(rand()<0.5) this.pattern2 = this.pattern;
    else this.pattern2 = getNotePattern(this.riddim,this.scales);
  }


  // populate()
  //
  //

  populate(){

    if(rand()<1){

      // make a tribe
      let numHomes=flo(rand(1,5));
      let s = rand(30,70);
      let vendor;
      let trader;
      let sage;

      this.setLang(RandomFromArray(allLanguages));
      this.reputation=0;
      this.currency=RandomFromArray(allCurrencies);

      for(let i=0; i<numHomes; i++){
        let numPpl = flo(rand(1,4));
        this.addFeature(new StaticObject(0,0,home_png,70), s+5);

        for(let j=0; j<numPpl; j++){

          let bob = this.addFeature(new AnimObject(0,0,s+flo(rand(-5,5)),RandomFromArray(poses)), s);
          planetMode(bob,true);
          let grain = this.language+" grain";
          if(!vendor&&rand()<0.6){
            console.log("added vendor")
            vendor=bob;
            bob.setTandA(["Buy my stuff"])
            bob.shop = [sItem(grain,flo(rand(1,3)), "grain")];
            if(rand()<0.4) bob.shop.push(sItem(RandomFromArray(BerryNames)+" metal",flo(rand(10,25)), "metal"));
            if(rand()<0.4) bob.shop.push(sItem(this.language+" bead",flo(rand(2,5)), "bead"));
            if(rand()<0.4) bob.shop.push(sItem(this.language+" "+RandomFromArray(BerryNames)+" spice",flo(rand(4,8)) ,"spice"));
          }
          else if(!trader&&rand()<0.6){
            console.log("added trader")
            trader=bob;
            bob.gives= this.language+" bread";
            bob.takes= grain;
            bob.takenum= rand(3,5);
            bob.tradeTxt=["I make bread.","Bring me "+bob.takenum+" grains."];
          }

          else if(!sage&&rand()<0.6){
            console.log("added sage")
            console.log(this.language)
            sage=bob;
            bob.knownLanguage=RandomFromArray(allLanguages);
            bob.setTandA(["I am a sage","People here speak "+this.language],()=>{

              textCounter=0;
              availableText=undefined;

              if(knownLanguages.includes(this.language)
              &&!knownLanguages.includes(bob.knownLanguage)){

                availableText2=["I can teach you "+bob.knownLanguage];
                knownLanguages.push(bob.knownLanguage);
              }
              else if(!knownLanguages.includes(this.language)
              &&knownLanguages.includes(bob.knownLanguage)){
                availableText2=["I can teach you "+this.language];
                knownLanguages.push(this.language);
              }

            });
            console.log(bob.knownLanguage)
          }
          else bob.setTandA([RandomFromArray(Greetings)])
        }
      }
    }
  }


  // make()
  //
  // make planet canvas

  make(){

    this.planet=scanv();
    this.planet2=scanv();

    let ctx=getCtx(this.planet);
    let ctx2=getCtx(this.planet2); // mask canvas

    ctx2.fillStyle=black;

    for(let y=0; y<50; y++){
      let r = rand(y%50);
      let r2 = rand(y%30);
      let fact = rand(0,10);

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

  setupScenery(min){

    // generate a unique tree family for this planet
    // see nature.js
    if(!min) min=3;
    this.treeFamily = createNewTreeType();
    let treeCount = flo(rand(min,min+6));

    let berry = RandomFromArray(BerryNames);
    for(let i=0; i<treeCount; i++){
      // create tree object
      let tree = this.addFeature(
        new StaticObject(0,0,{img:RandomFromArray(this.treeFamily)},200),50);

      tree.collider = false;
      tree.talker = true;
      tree.talkrange = 34;
      tree.berry = berry+" berry";
      tree.setTandA(tree.berryText(),tree.lootBerry);
      tree.id="tree";

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

  setLang(l){
      this.language=l;
      this.hue=allLanguages.indexOf(this.language)*30+rand(-2,2)
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
        drawCircle(0,0,this.mass,"#5593");

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
