// type 3 bgm
//
// this was actually the first iteration of this bgm stuff
// harmony is generated using a markov chain, then the
// melody is generated using the "improviser", a convoluted process
// that involves playing random intervals along a randomly
// picked scale that should in theory fit the current chord.
// despite the right scales (hopefully) being used,
// there's pretty much no sense of tonal centricity
// .. we avoid avoid notes but other than that any scale note
// can be chosen at random at any time.
// So there's a chance no chord tone ever gets played.
// so yeah..
// There is a redeeming factor in that there should be enough
// repetitions inserted in the melodic lines that a "theme"
// becomes recognizeable, however bizarre it might be
// .. ALSO this could be adapted to support generative scales and chords
//
// Some themes are sorta catchy tbh
// but everything this produces is super weird



let generatePieceUsingImproviser=(bgmObject, params)=>{

  if(params.patterns==undefined) params.patterns = Impro.InitNotePatterns;
  if(params.harmonicFidelity==undefined) params.harmonicFidelity = 2;

  // load note patterns for the improviser
  Impro.setupNotePatterns(params.patterns);

  // see below
  Zik.generateChordList(bgmObject, params);

  // see createStruture.js
  Zik.createStructure(bgmObject, params);

  // see MelogyGen/melodicLine.js
  generateMelody(bgmObject, params);

  // done!
}




// generateMelody()
//
// populate the melody array with a few sections (MelodicLine objects)
// sections are indexed by the number of the bar at which they start

let generateMelody=(bgmObject,params)=>{
  let melody = [];

  // create main theme
  let mel1 = new MelodicLine(getMainThemeLength(bgmObject),0,bgmObject);
  let totalbars = mel1.bars;
  melody[0] = mel1;

  // create second melody?
  if(mel1.bars<bgmObject.harmony.length -2){
    melody[mel1.bars] = new MelodicLine(limit(mel1.bars,bgmObject.harmony.length-mel1.bars),mel1.bars,bgmObject);
    totalbars += melody[mel1.bars].bars;
  }

  // while there's still room... add more stuff!
  let counter =0;
  while(totalbars < bgmObject.harmony.length - mel1.bars){
    // alternate between main theme and other melodies
    if(counter%2==1) melody[totalbars] = new MelodicLine(mel1.bars,totalbars,bgmObject);
    else melody[totalbars] = mel1;
    counter++;
    totalbars += mel1.bars;
  }

  // one last bit? (create new melody to fill remaining few bars)
  if(bgmObject.harmony.length - totalbars > 3){
    melody[totalbars] = new MelodicLine(bgmObject.harmony.length - totalbars - 1,totalbars,bgmObject);
  }



  // oof bon in the last version, the generation was over
  // at this point. but now, melodies are formatted differently.
  // let's convert the melody:

  Impro.initializeMelody(bgmObject);
  bgmObject.melody = [];

  for(let i=0; i<bgmObject.harmony.length; i++){

    if(Impro.currentMelodySection!=Impro.lastSection) Impro.initializeSection(bgmObject.harmony[i]);
    let runningList = [];

    // where are we in the melody, time-wise?
    let section = Impro.getCurrentMelodySection(melody);
    let rhythm = Impro.getCurrentRhythm(i,section);

    // if rhythm is undefined, it's because this phrase is over.
    if(rhythm==undefined){
      bgmObject.melody.push(runningList);
      continue;
    }

    // get current harmony
    let scale = Impro.getCurrentScale(i,section);
    let chord = bgmObject.harmony[i];
    let root = chord.intervalToOrigin;

    // if necessary, find an equivalent of the last melody note in the current scale
    Impro.adaptToScale(bgmObject,Impro.lastMelodyNote,scale,root);

    // fetch the notes we need
    let notes = Impro.getNotes(rhythm,()=>section.nextMelodyNote(scale));
    let timings = Impro.getNoteTiming(rhythm);
    let noteLengths = Impro.getNoteLengths(rhythm);

    for(let j=0; j<rhythm.length; j++){
      if(rhythm[j]) runningList.push(new Note(timings[j],notes[j],noteLengths[j]));
    }

    // updateSection if we reached a new section
    if(melody[i+1]!=undefined) currentMelodySection = i+1;

    bgmObject.melody.push(runningList);
  }
}


let getMainThemeLength=(bgmObject)=>{
  let length  = flo(1 + bgmObject.harmony.length/constrain(randi(bgmObject.harmony.length/6),1,3));
  length = limit(length,8); // limit to 8 bars
  if(ch(0.5)) length = limit(length,4); // chance to limit to 4
  length = limit(length,bgmObject.harmony.length); // limit to harmony length
  return length
}
