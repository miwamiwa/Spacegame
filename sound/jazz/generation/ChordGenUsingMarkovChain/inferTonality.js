/// inferTonality.js
// uhmmmm
// this file is mostly just experiments
// not actually a working part of the generator


let analyzeProgression=()=>{
  let feel = getModeFromChord(harmony[0]);
  let runningTendencies = newTendencyTracker();
  console.log(feel.name)

  harmony.forEach(chord=>{
    let interval = chord.chordData.intervalToOrigin;
    let chordScaleDegree = getScaleDegree(interval,0,feel);

    //let tendency = getTendencies(chord);
    let tendency = getTendenciesWithHugeSwitch(chord,harmony[0].chordData.isMajor);
    arrAdd(tendency,runningTendencies);

    let sorted = Array.from(runningTendencies).sort(function(a, b){return b-a});
    let top = [];
    for(let i=0; i<3; i++){
      let value = sorted[i];
      let index = runningTendencies.indexOf(value);
      top.push({index:index,value:flo(value)});
    }

    console.log(`next chord: ${chord.chordData.symbol}. top running tendencies: ${top[0].index} (${top[0].value}), ${top[1].index} (${top[1].value}), ${top[2].index} (${top[2].value})`)

    // decay
    arrMult(runningTendencies, 0.5);

    //chord.absoluteNotes.forEach(note=>{

      // am i a scale degree in the original key?
    //  let degree = getScaleDegree(interval + note,0,feel);
    //});

    /*
    switch(degree){
    case 0: break;
    case 1: break;
    case 2: break;
    case 3: break;
    case 4: break;
    case 5: break;
    case 6: break;
    case 7: break;
    default: console.log("yo");
  }
  */
});
}

let newTendencyTracker=()=>{
  let tendency = [];
  for(let i=0; i<12; i++) tendency[i]=0;
  return tendency;
}

let getModeFromChord=(chord)=>{
  let mode = m.Ionian;
  switch(chord.chordData.symbol){
    case 'I6':  mode = m.Ionian; break;
    case 'iv6':  mode = m.Ionian; break;
    case 'iv7':  mode = m.Aeolian; break;
    case 'ii7b5':  mode = m.Aeolian; break;
    case 'i7':  mode = m.Aeolian; break;
    case 'i':  mode = m.Aeolian; break;
    case 'I':  mode = m.Ionian; break;
    case 'Ima7':  mode = m.Ionian; break;
    default:
    if(chord.indexOf("i")!=-1) mode = m.Aeolian;
  }

  return mode;
}


let arrAdd=(listtoadd,listtoaddto)=>{
  //console.log(listtoadd,listtoaddto)
  for(let i=0; i<listtoadd.length; i++){
    listtoaddto [i] += listtoadd[i];
  }
}

let arrMult=(listtomult,factor)=>{
  for(let i=0; i<listtomult.length; i++){
    listtomult[i] *= factor;
  }
}

let getTendencies=(chord)=>{
  let t = newTendencyTracker();
  let interval = chord.chordData.intervalToOrigin;
  for(let i=interval; i<interval + 12; i++){
    let index = wrap12tone(i);
    //console.log(t[index])
    switch(i){
      case 0: t[index]+=4; break;
      //case 1: t[index]+=0; break;
      //case 2: t[index]+=0; break;
      //case 3: t[index]+=0; break;
      //case 4: t[index]+=0; break;
      case 5: t[index]+=3; break;
      case 6: t[index]+=3; break;
      //case 7: t[index]+=0; break;
      //case 8: t[index]+=0; break;
      //case 9: t[index]+=0; break;
      case 11: t[index]+=2; break;
      //case 12: t[index]+=0; break;
    }
  }
  return t;
}

let getTendenciesWithHugeSwitch=(chord,isMajor)=>{
  let feel = Minor;
  if(isMajor) feel = Major;

  let t;
  if(feel==Major){
    switch(chord.chordData.romanNumeral){
      case "I": t=[6,1,1,0,1, 4,0,3, 0,0,0,1]; break;
      case "bII": t=[2,2,1,0,0, 1,0,0, 2,0,0,0]; break;
      case "II": t=[0,1,3,1,0, 0,0,5, 0,2,0,0]; break;
      case "bIII": t=[0,0,1,3,1, 0,0,0, 4,0,1,0]; break;
      case "III": t=[1,0,0,1,3, 1,0,0, 0,4,0,1]; break;
      case "IV": t=[4,0,2,0,0, 4,0,2, 0,1,0,0]; break;
      case "bV": t=[0,2,0,0,0, 3,1,1, 0,0,0,0]; break;
      case "V": t=[6,0,2,0,0, 1,1,4, 1,1,0,0]; break;
      case "bVI": t=[2,1,0,2,0, 0,0,2, 2,1,0,0]; break;
      case "VI": t=[3,0,0,0,2, 0,0,0, 1,3,1,0]; break;
      case "bVII": t=[3,0,0,2,0, 2,0,0, 1,0,0,0]; break;
      case "VII": t=[3,0,0,0,3, 0,0,1, 0,0,0,0]; break;
      case "i": t=[2,0,0,2,0, 6,0,0, 2,0,0,0]; break;
      case "bii": t=[0,1,0,0,0, 0,0,0, 2,0,0,1]; break;
      case "ii": t=[3,0,0,0,0, 2,0,3, 0,2,0,0]; break;
      case "biii": t=[1,0,0,3,0, 0,0,1, 4,0,0,0]; break;
      case "iii": t=[2,0,0,1,2, 1,0,0, 0,5,0,0]; break;
      case "iv": t=[1,0,2,0,0, 3,0,0, 2,0,0,0]; break;
      case "bv": t=[0,2,0,0,0, 2,0,0, 0,0,0,0]; break;
      case "v": t=[2,0,2,0,0, 0,0,3, 0,0,1,0]; break;
      case "bvi": t=[0,0,0,2,0, 0,0,0, 2,0,2,0]; break;
      case "vi": t=[4,0,0,0,2, 3,0,0, 0,2,0,0]; break;
      case "bvii": t=[2,0,0,3,0, 0,0,0, 2,0,0,0]; break;
      case "vii": t=[3,0,0,0,2, 0,0,3, 0,0,1,0]; break;
    }
  }
  else {
    switch(chord.chordData.romanNumeral){
      case "I": t=[2,0,0,2,0, 6,0,0, 2,0,0,0]; break;
      case "bII": t=[0,1,0,0,0, 0,0,0, 2,0,0,1]; break;
      case "II": t=[3,0,0,0,0, 2,0,3, 0,2,0,0]; break;
      case "bIII": t=[1,0,0,3,0, 0,0,1, 4,0,0,0]; break;
      case "III": t=[2,0,0,1,2, 1,0,0, 0,5,0,0]; break;
      case "IV": t=[1,0,2,0,0, 3,0,0, 2,0,0,0]; break;
      case "bV": t=[0,2,0,0,0, 2,0,0, 0,0,0,0]; break;
      case "V": t=[7,0,2,0,0, 0,0,3, 0,0,1,0]; break;
      case "bVI": t=[0,0,0,2,0, 0,0,0, 2,0,2,0]; break;
      case "VI": t=[4,0,0,0,2, 3,0,0, 0,2,0,0]; break;
      case "bVII": t=[2,0,0,3,0, 0,0,0, 2,0,0,0]; break;
      case "VII": t=[3,0,0,0,2, 0,0,3, 0,0,1,0]; break;
      case "i": t=[6,1,1,0,1, 4,0,3, 0,0,0,1]; break;
      case "bii": t=[2,2,1,0,0, 1,0,0, 2,0,0,0]; break;
      case "ii": t=[0,1,3,1,0, 0,0,5, 0,2,0,0]; break;
      case "biii": t=[0,0,1,3,1, 0,0,0, 4,0,1,0]; break;
      case "iii": t=[1,0,0,1,3, 1,0,0, 0,4,0,1]; break;
      case "iv": t=[4,0,2,0,0, 4,0,2, 0,1,0,0]; break;
      case "bv": t=[0,2,0,0,0, 3,1,1, 0,0,0,0]; break;
      case "v": t=[2,0,2,0,0, 3,1,4, 1,1,0,0]; break;
      case "bvi": t=[2,1,0,2,0, 0,0,2, 2,1,0,0]; break;
      case "vi": t=[3,0,0,0,2, 0,0,0, 1,3,1,0]; break;
      case "bvii": t=[3,0,0,2,0, 2,0,0, 1,0,0,0]; break;
      case "vii": t=[3,0,0,0,3, 0,0,1, 0,0,0,0]; break;
    }
  }
  return t

}

/*
let getTendenciesWithHugeSwitch=(chord)=>{
  let t = newTendencyTracker();

  switch(chord.chordData.symbol){
    case "I": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "I6": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "I7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "I7b9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "I7sharp5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "II7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "III7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "III7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "III7b9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IIIma7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IIIma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IIma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IV6": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IV7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IV7sharp11": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "IVma7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "Ima7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case "Ima7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "V7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "V7b9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "V7sharp5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VI7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VI7b9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VI7sharp5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VI7sharp9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VII7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VII7b9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VII7sus4": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VIIma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "VIma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "Vma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bIII6": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bIII7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bIIIma7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bIIIma7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bVI7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bVI7sharp11": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bVII7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bVII9": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bVIma7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "biidim7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "biii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "biiidim7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bv7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bvdim7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bvi7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bvii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "bviii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "i": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "i7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "ii6": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "ii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "ii7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iii7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iiidim7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iv": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iv6": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "iv7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "v7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "v7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "vi7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "vii7": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    case  "vii7b5": arrAdd([0,0,0,0,0,0,0,0,0,0,0,0],t); break;
    default: console.log("Error: trying to get tendencies from unknown chord "+chord);
  }
}
*/
