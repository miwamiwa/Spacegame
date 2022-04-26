let markov;
let markovReady = false;

// for debug
let AllChords = {
  uniqueChords:[],
  chordColors:[]
}



// RiTa Setting (initial value was 35)
// max harmony length before expanding
const MaxSentenceLength = 16;

// waitForMarkovThenGenerateTune()
//
// called on start. get things started up in this piece

let preloadMarkov=()=>{

  // setup markov and load tunes
  preloadTunes();

  // make sure markov is ready then generate
  setTimeout(waitForMarkovReady,10);
}

// waitForMarkovReady()
//
//

let waitForMarkovReady=()=>{
  if(markov.ready){
    console.log("Markov is ready.");
    markovIsReady();
  }
  else setTimeout(waitForMarkovReady,10);
}

// preloadTunes()
//
// setup markov objects and feed it music

let preloadTunes=()=>{
  // create markov object
  markov = new RiMarkov(3,true,false);

  // preload tunes
  Tunes.forEach(tune=>{
    markov.loadText(tune.chords.trim()+".");
    // save some stats
    preAnalyzeChords(tune);
  });

  reportStats();
}

// markovIsReady()
//
//

let markovIsReady=()=>{
  markovReady = true;
  // newMusic()
}

// newMusic()
//
//

let newMusic=(planet)=>{

  setupNotePatterns(InitNotePatterns);
  generateTune(planet);
  generateMelody(planet);
  //startSound();
  //updateGeneralInfo();
}

// generateTune()
//
//

let generateTune=(planet)=>{
  console.log("Generating tune...");
  generateHarmony(planet);
  //analyzeProgression();
  createStructure(planet);

  printLegibleChordList(planet);
}

// generateHarmony()
//
//

let generateHarmony=(planet)=>{

    // generate a chord progressino
    let chordlist = markov.generateSentence();
    chordlist = chordlist.substring(0, chordlist.length-1).split(" ");

    // set home key
    let hk = randi(12);
    planet.jazz.homeKey = hk;

    // generate harmony from this chord list
    planet.jazz.harmony = [];

    chordlist.forEach(chord=>{
      let chordData = analyzeSymbol(chord);
      planet.jazz.harmony.push({
        absoluteNotes:getRelativeChordTonesFromChordData(chordData),
        notes:getTonesFromChordData(chordData,hk,true),
        key: m.Keys[chordData.intervalToOrigin],
        origin: m.Keys[hk],
        intervalToOrigin: chordData.intervalToOrigin,
        symbol:getChordSymbolFromChordData(chordData,planet),
        chordData:chordData
      });
    });

    //console.log(harmony);

    //printLegibleChordList();
}


let printLegibleChordList=(planet)=>{
  // print out legible chord list
  let list = [];
  planet.jazz.harmony.forEach(chord=>{
    if(chord==NoChord) list.push(NoChord);
    else list.push(chord.symbol);
  });
  console.log(list);
}



// reportStats()
//
// report general stats about tunes and chords
let reportStats=()=>{

  console.log("Loaded chords.")
  AllChords.uniqueChords = AllChords.uniqueChords.sort();
  console.log(AllChords);
}



// preAnalyzeChords()
//
// on start, analyze chords in all tunes (for debug)

let preAnalyzeChords=(tune)=>{

  tune.chords.trim().split(" ").forEach(chord=>{
    // report error
    if(chord=="") console.log(tune);

    // tally unique chords
    if(!AllChords.uniqueChords.includes(chord))
    AllChords.uniqueChords.push(chord);

    // tally unique chord colors
    let chordData = analyzeSymbol(chord);
    if(!AllChords.chordColors.includes(chordData.chordColor))
    AllChords.chordColors.push(chordData.chordColor);
  });
}
