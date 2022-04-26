let isNumeralCharacter=(str)=>{
  return str=="b"||str=="i"||str=="v"||isMajorKeyCharacter(str)
}

let isMajorKeyCharacter=(str)=>{
  return str=="I"||str=="V"
}

let toLetter=(note)=>{
  return m.Keys[note%m.Octave];
}

let bothChordsAreHomeKey=(first,last)=>{

  let chord1 = analyzeSymbol(first);
  let chord2 = analyzeSymbol(last);

  return chord1.romanNumeral == chord2.romanNumeral
  || (chord1.romanNumeral=="i" && (chord2.romanNumeral=="bIII"||chord2.romanNumeral=="bVI"))
  || (chord1.romanNumeral=="I" && (chord2.romanNumeral=="iii"||chord2.romanNumeral=="vi"))
}


let numeralIsHomeKey=(hkNumeral,otherNumeral)=>{
  return hkNumeral == otherNumeral
  || (hkNumeral=="i" && (otherNumeral=="bIII"||otherNumeral=="bVI"))
  || (hkNumeral=="I" && (otherNumeral=="iii"||otherNumeral=="vi"))
}


// analyzeSymbol()
//
//

let analyzeSymbol=(chord)=>{
  let scaleDegree = -1;
  let chordname = chord;
  let romanNumeral = "";
  let chordColor = "";
  let isMajor = true;
  let isDiminished = false;

  for(let i=0; i<chord.length; i++){
    if(scaleDegree==-1){
      if(isNumeralCharacter(chord[i])){
        romanNumeral += chord[i];
        if(!isMajorKeyCharacter(chord[i])) isMajor = false;
      }
      else{
        scaleDegree = m[chord.substring(0,i)];
        chordColor = chord.substring(i, chord.length);
        break;
      }
    }
  }

  if(scaleDegree==-1){
    scaleDegree=m[chord];
    chordColor="";
  }

  // the CHORD DATA OBJECTS
  return {
    intervalToOrigin:scaleDegree,
    chordColor:chordColor,
    romanNumeral:romanNumeral,
    isMajor:isMajor,
    isDiminished:chordColor=="dim7",
    symbol:chord,
    isDominant: isMajor
      && (chordColor.includes("7")||chordColor.includes("9"))
      && !chordColor.includes("ma7")
      // if chord is Major and has a 7th
      // or a 9th (in which case the 7th is assumed)
      // but not a major 7th,
      // then it is a Dominant chord
  }
}




// getThird()
//
// get chord's third (unless this is a sus4 chord)

let getThird=(chordData)=>{
  if(chordData.chordColor.indexOf("sus4")==-1){
    if(chordData.isMajor) return m.TierceMajeure;
    else return m.TierceMineure;
  }
}

// getFifthAndSeventh()
//
//

let getFifthAndSeventh=(color)=>{
  let features = [];
  switch(color){
    case "6": features.push(m.SixteMajeure); features.push(m.Quinte); break;
    case "7": features.push(m.SeptiemeMineure); break;
    case "ma7": features.push(m.SeptiemeMajeure); break;
    case "7b5": features.push(m.QuinteDiminuee); features.push(m.SeptiemeMineure); break;
    case "dim7": features.push(m.QuinteDiminuee); features.push(m.SeptiemeDiminuee); break;
    case "7b9": features.push(m.SeptiemeMineure); features.push(m.SecondeMineure); break;
    case "9": features.push(m.SeptiemeMineure); features.push(m.SecondeMajeure); break;
    case "": features.push(m.Quinte); break;
    case "7sharp5": features.push(m.SeptiemeMineure); features.push(m.QuinteAugmentee); break;
    case "7sharp11": features.push(m.SeptiemeMineure); features.push(m.QuarteAugmentee); break;
    case "7sharp9": features.push(m.SeptiemeMineure); features.push(m.SecondeAugmentee); break;
    case "ma7b5": features.push(m.SeptiemeMajeure); features.push(m.QuinteDiminuee); break;
    case "7sus4": features.push(m.SeptiemeMineure); features.push(m.Quarte); break;
    default: console.log("Unrecognized chord color: "+chordColor);
  }
  return features;
}




// getChordSymbolFromChordData
//
// generate a legible chord symbol (as string) from chord data

let getChordSymbolFromChordData=(chordData,planet)=>{
  let symbol = m.Keys[wrap12tone(planet.jazz.homeKey+chordData.intervalToOrigin)];
  if(!chordData.isDiminished&&!chordData.isMajor) symbol += "-";
  symbol += chordData.chordColor;
  return symbol;
}

// getTonesFromChordData()
//
// generate chord tones from chord data

let getTonesFromChordData=(chordData,hk,wrapit)=>{

  // build chord
  let tones = getRelativeChordTonesFromChordData(chordData);

  // transpose
  for(let i=0; i<tones.length; i++){
    if(wrapit) tones[i] = hk +wrap12tone(tones[i] +  chordData.intervalToOrigin);
    else tones[i] = tones[i] + hk + chordData.intervalToOrigin;
  }

  return tones
}

let getRelativeChordTonesFromChordData=(chordData)=>{
  let tones = [0,getThird(chordData)];
  tones = tones.concat(getFifthAndSeventh(chordData.chordColor));
  return tones;
}
