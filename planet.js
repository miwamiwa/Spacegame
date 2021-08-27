const GravityConstant = 50;
const PlanetMassMin = 800;
const PlanetMassMax = 2000;

class Planet {
  constructor(x,y,randomscenery,name, rad, mas){
    // mass and radius\
    if(rad==undefined)
      this.setRadMas(rand(150,320),rand(PlanetMassMin,PlanetMassMax));
    else this.setRadMas(rad,mas);

    this.gravitationalConstant = GravityConstant;
    this.halfsize =0; // ellipses start from center point
    this.x = x;
    this.y = y;
    this.features = [];
    this.d2p =-1;
    this.hue =flo(rand(360));

    if(name==undefined) name = RandomPlanetName();
    this.name = name;

    this.addBasicFeatures();

    this.scenery = randomscenery;
    if(randomscenery)
      this.setupScenery();

    // order features by y
    //this.sortFeatures();
  }

  sortFeatures(){
    let sorted = [this.features[0]];
    for(let i=1; i<this.features.length; i++){
      let found = false;
      let d = 0;
      if(this.features[i].id=="rock"){
        d =-30;
        console.log("euh")
      }

      if(this.features[i].id=="tree"){
        d =-50;
        console.log("euh")
      }
      for(let j=0; j<sorted.length; j++){
        if(!found&&this.features[i].y+d<sorted[j].y){
          sorted.splice(j,0,this.features[i]);
          found = true;
        }
      }

      if(!found) sorted.push(this.features[i]);
    }

    this.features = sorted;
  }

  setRadMas(rad,mas){
    this.radius = rad;
    this.mass = mas;
    this.gravity = {range:mas};
  }

  addBasicFeatures(){
    let r = flo(rand(80,120));
    let g = 255-r;
    let b = flo(rand(80,120));

    let rad = flo(rand(40, 140));

    this.groundColor = `rgba(${r},${g},${b}, 1)`;
    this.groundColor2 = `rgba(${r+20},${g+20},${b+20}, 0.3)`;
    this.spots = [];
    let spots = flo(rand(4,12));
    for(let i=0; i<spots; i++){
      this.spots.push({x:this.rPos(), y:this.rPos(), r:rad+rand(-10,10)});
    }
  }

  // return a random position on this planet
  rPos(){
    return rand(-this.radius,this.radius);
  }

  findAvailableSpot(){
    let pos = this.randomSurfacePosition(0.5);
    let found = true;
    while(!found){
      pos = this.randomSurfacePosition(0.5);
      let clear = true;
      for(let j=0; j<this.features.length; j++){
        if(dist(pos,this.features[j])<200) clear  = false;
      }
      found = clear;
    }
    return pos;
  }

  // make some trees
  setupScenery(){
    this.treeFamily = createNewTreeType();
    let treeCount = flo(rand(3,12));
    //let treesAdded = [];

    console.log("radius: "+this.radius)
    for(let i=0; i<treeCount; i++){

      let pick = RandomFromArray(this.treeFamily);

      let pos = this.findAvailableSpot();

      if(rand()<0.0){
        let rock = new SimpleObject(pos.x,pos.y,rock_png,30);
        //rock.hue = flo(rand(360));
        rock.collider = false;
        rock.id="rock";
        this.features.push(rock);
        //treesAdded.push(rock);
      }
      else {
        let tree = new SimpleObject(pos.x,pos.y -90,{img:pick},200);
        tree.collider = false;
        tree.id="tree";
        this.features.push(tree);
        //treesAdded.push(tree);
      }


    //  console.log(pos)

    }
  }

  randomSurfacePosition(range,worldspace){
    let x = this.rPos() * range;
    let y = this.rPos() * range;
    if(worldspace!=undefined) return {x:this.x+x,y:this.y+y};
    return {x:x,y:y};
  }

  addCheese(){
    let count = flo(rand(6,12));
    for(let i=0; i<count; i++){
      let pos = {x:this.rPos(),y:this.rPos()};
      let cracker = new SimpleObject(pos.x,pos.y,cracker_png,10);
      cracker.edible = true;
      cracker.collider = false;
      cracker.id="cheese";
      this.features.push(cracker);
    }
  }

  update(){

    let pos = camera.position(this);
    if(camera.isOnScreen(pos,this.gravity.range)){
      mCtx.save();
      if(this.hue!=0)
        mCtx.filter = `hue-rotate(${this.hue}deg)`;
        // draw a circle to show range of gravity
        mCtx.fillStyle = "#5594";
        mCtx.beginPath();
        mCtx.ellipse(pos.x,pos.y, this.gravity.range, this.gravity.range, 0,0, TWO_PI);
        mCtx.fill();

        // draw planet
        mCtx.fillStyle = this.groundColor;

        // clipping path
        mCtx.beginPath();
        mCtx.arc(pos.x,pos.y, this.radius, 0, TWO_PI, true);
        mCtx.clip();

        mCtx.beginPath();
        mCtx.ellipse(pos.x,pos.y, this.radius, this.radius, 0,0, TWO_PI);
        mCtx.stroke();
        mCtx.fill();

        mCtx.fillStyle = this.groundColor2;
        this.spots.forEach(spot=>{
          mCtx.beginPath();
          mCtx.ellipse(pos.x + spot.x, pos.y + spot.y,spot.r,spot.r,0,0,TWO_PI);
          mCtx.fill();
        });

      mCtx.restore();

      mCtx.save();
      if(this.hue!=0)
        mCtx.filter = `hue-rotate(${this.hue}deg)`;
      mCtx.translate(pos.x,pos.y);
      this.features.forEach(f=>f.display());
      mCtx.restore();
    }
  }

  getGravityFor(input,d){
    // d is the distance from the input object to the center of this planet
    if(d==undefined) d = dist(this,input);

    // nextd is the distance to center in the next frame
    let nextd = dist(this,{x:input.x + input.lastvx, y:input.y + input.lastvy});
    ///console.log(nextd);

    // if this is true, we are touching the surface
    if(nextd<this.radius){

      input.landed = true;

      let vel = dist({x:0,y:0},{x:input.lastvx,y:input.lastvy});

      //console.log(vel)

      // check for threshold velocity at which crash occurs.
      // this is affected by the vehicle's mass (1 by default)
      if(vel>CrashThreshold / input.mass && !input.crashed){
        input.crashed = true;
        crashtext = RandomFailText();
        input.crashFrame = input.counter;
        input.setFrames(CrashAnimation);
        console.log("crash! landed too fast.");
      }


      if(!input.crashed)
        this.visited = true;
    }
    else input.landed = false;


    if(!input.landed && d>this.radius){
      //console.log("this happened")
      //console.log(this.gravitationalConstant, this.mass, input.mass, d)
      return this.gravitationalConstant * (this.mass * input.mass) / Math.pow(d,2);
    }
    else return 0;
  }
}
