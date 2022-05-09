// rand()
//
// get a random value
let rand =(min,max)=>{
  // 0 args: from 0 to 1
  if(min==undefined&&max==undefined)
  return random();
  //return Math.random();

  // 1 arg: from 0 to arg1
  else if(max==undefined)
  return rand()*min;
  // 2 args: from arg1 to arg2
  else return min + rand() * (max-min);
}

// ch()
//
// chance (returns true/false)
let ch=(i)=>rand()<i;

// randi()
//
// random integer
let randi=(i,j)=>flo(rand(i,j));

// roughly()
//
// plus or minus 1000 lol
let roughly=(i)=>rand(i-1000,i+1000);

// RandomFromArray()
//
// return a random value from given array
let RandomFromArray=(array)=> array[flo(rand(array.length))]


// SEEDED RANDOM (OLD METHOD)
/*
let RandomSeed = 0;
let random=()=> {
    var x = Math.sin(RandomSeed++) * 10000;
    return x - Math.floor(x);
}
*/

let random=()=>{
    return Math.random();
}

// SEEDED RANDOM
let WorldSeed = "applez";
let WorldRandom;
let planetSeedLength = 8;

let setupRNG=()=>{

  WorldRandom = new RNG(WorldSeed);

  //console.log(generatePlanetSeed(),generatePlanetSeed())
  //console.log(WorldRandom.random(),WorldRandom.random())
  // Create xmur3 state:
  //let seed = xmur3(WorldSeed);
  // Output one 32-bit hash to provide the seed for mulberry32.
  //let rand = mulberry32(seed());
  //console.log(rand(),rand())
}

let generatePlanetSeed=()=>{
  let str = "";
  for(let i=0; i<planetSeedLength; i++) str += WorldRandom.randomLetter();
  return str;
}


class RNG {
  constructor(seed){
    this.setSeed(seed);
  }
  setSeed(seed){
    this.counter =0;
    this.seed = seed;
    let xm = xmur3(seed);
    this.seededRand = mulberry32(xm())
  }
  random(){
    this.counter++;
    return this.seededRand();
  }
  randomLetter(){
    return String.fromCharCode(97+flo(this.random()*26));
  }

  randi(min,max){
    return flo(this.rand(min,max))
  }

  // handle random calls with 0, 1 or 2 args
  rand(min,max){
    // 0 args: from 0 to 1
    if(min==undefined&&max==undefined)
    return this.random();

    // 1 arg: from 0 to arg1
    else if(max==undefined)
    return this.rand()*min;
    // 2 args: from arg1 to arg2
    else return min + this.rand() * (max-min);
  }

  randomFromArray(arr){
    return arr[this.randi(arr.length)];
  }

  ch(i){
    return this.rand()<i;
  }
}

let xmur3=(str)=>{
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}


let mulberry32=(a)=>{
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
