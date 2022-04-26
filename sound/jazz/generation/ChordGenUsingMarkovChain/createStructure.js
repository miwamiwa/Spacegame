let doublingFactor;
let silenceFactor;

// createStructure()
//
//

let createStructure =(planet)=>{
  console.log("Hmmm!! what would Wolfgang Amadeus say?");

  // roman numeral of final chord is the Home Key
  let hkNumeral = numeral(planet.jazz.harmony[planet.jazz.harmony.length-1]);

  // an object to collect the features we're looking for
  let data = {
    homeKeyEquivalents:[],
    resolvingDominants:[],
    localTonics:[],
    sections:[]
  }

  // for debug
  let homeKeyEquivalents_sym = [];
  let resolvingDominants_sym = [];

  for(let i=0; i<planet.jazz.harmony.length; i++){
    let chord = planet.jazz.harmony[i];

    // find instances of the home key or its equivalents
    if(numeralIsHomeKey(hkNumeral,numeral(chord))){
      data.homeKeyEquivalents.push(i);
      // readable version so we can report
      homeKeyEquivalents_sym.push(`${chord.symbol} (${i})`);
    }

    // check relationship to next chord
    let nextChord = getNextChord(i,planet);
    // is this a dominant chord resolving to the next chord?
    if(isV7toI(chord,nextChord.chord)){
      data.resolvingDominants.push(i);
      data.localTonics.push(nextChord.index);
      // readable version so we can report
      resolvingDominants_sym.push(`${chord.symbol} to ${nextChord.chord.symbol} (${i} to ${nextChord.index})`);
    }
  }

  // split into sections

  let sections = [];
  let lastIndex=0;
  data.localTonics.forEach(index=>{
    if(index!=0){
      sections.push(planet.jazz.harmony.slice(lastIndex,index));
      lastIndex = index;
    }
    else sections.push(planet.jazz.harmony.slice(lastIndex));
  });
  // if we don't have any sections per se
  if(data.localTonics.length==0){
    sections.push(planet.jazz.harmony);
  }

  // insert doubles and silences in each section, and even them out
  chanceOfShortNote = rand(.2,.9)
  chanceOfNoChord = rand(.0,.9);
  doublingFactor = randi(1,4);
  silenceFactor = randi(0,3);

  planet.jazz.harmony = []; // reset harmony since we're about to add sections back in
  sections.forEach(section=>{
    // chance to double first chord
    if(ch(.5)) section.splice(0,0,section[0]);

    // double random chords
    let min = Math.max(doublingFactor, flo(section.length/3));
    while(min>0 || section.length%2==1){
      if(ch(.5)){
        let index = randi(section.length);
        section.splice(index,0,section[index]);
      }

      min--;
    }


    // random no-cbord parts
    min = Math.max(silenceFactor, flo(section.length/3));
    while(min>0 || section.length%2==1){
      if(ch(chanceOfNoChord)){
        let index = randi(1,section.length);
        section.splice(index,0,NoChord);
        //console.log("no chord!")
      }

      min--;
    }

    // add back to harmony array
    planet.jazz.harmony = planet.jazz.harmony.concat(section);
    data.sections.push(sections);
  });


  planet.jazz.tuneData = data;
  //console.log("sections: ", sections)
  //console.log("home key equivalents ", homeKeyEquivalents_sym);
  //console.log("resolving dominants ", resolvingDominants_sym);
}

const NoChord = "NoChord";

// isV7toI()
//
// return true if chord1 is V7 (dominant) of chord2

let isV7toI=(chord1,chord2)=> isDominant7(chord1) && isPossibleDominant(intervalToChord(chord1,chord2))


// getNextChord(i)
//
// get the chord in harmony[] that comes after index i

let getNextChord=(i,planet)=>{
  let nextChord = planet.jazz.harmony[0];
  let nextChordIndex = 0;
  if(i!=planet.jazz.harmony.length-1){
    nextChordIndex = i+1;
    nextChord = planet.jazz.harmony[i+1];
  }
  return {
    chord:nextChord,
    index:nextChordIndex
  };
}

// numeral()
//
// get roman numeral of this chord

let numeral=(chord)=>{
  return chord.chordData.romanNumeral;
}

// isDominant7()
//
// return true if this is a dominant7 chord

let isDominant7=(chord)=>{
  return chord.chordData.isDominant;
}

// intervalToChord()
//
// get the interval from chord1 to chord2

let intervalToChord=(chord1,chord2)=>{
  if(chord1.chordData!=undefined){
    chord1 = chord1.chordData.intervalToOrigin;
    chord2 = chord2.chordData.intervalToOrigin;
  }
  return wrap12tone(chord1 - chord2);
}

// isPossibleDominant()
//
// (accepted dominant relationships are TTsub of V7 of I, V7 of I OR bVII7 of I)

let isPossibleDominant =(interval)=>{
  return interval==m.bII||interval==m.V||interval==m.bVII
}
