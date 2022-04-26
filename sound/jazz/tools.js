const Sharp = "#";
const Flat = "b";
const OneMinute = 60000;

//>>//>>//>>// Randomness //<<//<<//<<//


let chooseBetween=(input)=> input[randi(input.length)];

let trueFalse=()=>chooseBetween([true,false]);

// music stuff

let keyToNum=(letterkey)=> Keys.indexOf(letterkey);

let isSharpOrFlat=(input)=>{
  if(input==Sharp) return Sharp;
  else if(input==Flat) return Flat;
  return undefined;
}

let isMajor=(input)=> input.charCodeAt(0) < 97;

// romanToNum()
//
// convert roman numeral to interval over origin (0)

let romanToNum=(symbol,counter)=>{
  if(counter==undefined) counter =0;
  let char = symbol[counter];
  let roman = "";
  while(char=="i"||char=="I"||char=="v"||char=="V"){
    roman += char;
    counter++;
    char = symbol[counter];
  }

  if(roman=="i"||roman=="I") return 0;
  if(roman=="ii"||roman=="II") return 1;
  if(roman=="iii"||roman=="III") return 2;
  if(roman=="iv"||roman=="IV") return 3;
  if(roman=="v"||roman=="V") return 4;
  if(roman=="vi"||roman=="VI") return 5;
  if(roman=="vii"||roman=="VII") return 6;

  return undefined;
}

// getChordDataFromSymbol()
//
// old method of analyzing chord symbol
// derprecated.
// see js/generation/ChordGenUsingMarkovChain/tools.js for
// up-to-date methods

let getChordDataFromSymbol=(symbol)=>{

  let counter =0;
  let firstchar = symbol[counter];

  // is there a flat or sharp at the beginning?
  let keyModifier = isSharpOrFlat(firstchar);
  if(keyModifier!=undefined){
    firstchar = symbol[1];
    counter = 1;
  }

  // resolve major / minor
  let major = isMajor(firstchar);
  let num = romanToNum(symbol,counter);

  let color = getChordColor(symbol);

  let origin = getChordOrigin(symbol);

  return {
    major: major,
    scaleDegree: num,
    color: color,
    modifier: keyModifier,
    of: origin,
    symbol:symbol
  }
}

// getChordColor()
//
// derprecated.
// see js/generation/ChordGenUsingMarkovChain/tools.js for
// up-to-date methods

let getChordColor=(symbol)=>{
  let coloration = [];
  if(symbol.indexOf("b5")!=-1) coloration.push(Flat5);

  if(symbol.indexOf("b6")!=-1) coloration.push(Flat6);
  else if(symbol.indexOf("6")!=-1) coloration.push(Ma6);

  if(symbol.indexOf("b9")!=-1) coloration.push(Flat9);
  else if(symbol.indexOf("9")!=-1) coloration.push(Dom9);

  if(symbol.indexOf("ma7")!=-1) coloration.push(Ma7);
  else if(symbol.indexOf("7")!=-1) coloration.push(Dom7);

  if(symbol.indexOf("#11")!=-1) coloration.push(Sharp11);
  return coloration;
}

// flo()
//
// floor this

// let flo=(input)=>Math.floor(input);

// double miam
// const TWO_PI = 2*Math.PI;

// roughly()
//
// sometimes "roughly" means +/- 1000 lol

// let roughly=(i)=>rand(i-1000,i+1000);

// getChordOrigin()
//
// for a slash chord symbol (for ex. A7/G),
// get whatever comes after the slash mark "/"

let getChordOrigin=(symbol)=>{
  let index = symbol.indexOf("/");
  if(index==-1) return "I"; // default: return I
  else return symbol.substring(index+1);
}
