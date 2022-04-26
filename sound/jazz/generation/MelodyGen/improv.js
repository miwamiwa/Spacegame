const InitialOctave = 6;
const AccompanimentOctave = 4;
const MaxNoteRange = 12;

let firstNote;
let currentChord;
let currentPattern;
let currentOctave;
let currentPatternIndex;
let lastNotePlayed;
let lastScaleNotePlayed;
let lastChordPlayed;
let currentPatternOffset =0;
let baseNote;
let currentScale = "";

let initializeImprov=(planet)=>{
  currentPatternIndex = -1;
  currentOctave =0;
  // initialize pattern
  currentPattern = newRandomPattern();
  lastScaleNotePlayed =0;
  firstNote = planet.jazz.homeKey + InitialOctave * m.Octave;
  baseNote = firstNote;
  lastNotePlayed = firstNote;
}

// improvise()
//
//

let improvise=()=>{

  if(currentPattern==undefined) initializeImprov(nP);

  let relativeRoot = currentChord.chordData.intervalToOrigin;
  let scale = getScaleFromChordData(currentChord.chordData);
  currentScale = scale.name;
  //////console.log(scale)
  scale = removeAvoidNotes(scale);
  //////console.log(scale)
  let playNote1=false;
  let playNote2=false;
  let playNote3=false;
  if(ch(0.8)) playNote1=true;
  if(ch(0.8)) playNote2=true;
  if(ch(0.4)) playNote3=true;

  if(playNote1){
    let noteLength = nP.jazz.barLength*.0005;
    if(playNote2) noteLength /=2;
    else if(playNote3) noteLength *= .7;

    playJazzNote(getNote(scale), noteLength);
  }
  if(playNote2){
    let noteLength = nP.jazz.barLength*.0005*0.5;
    if(playNote3) noteLength = nP.jazz.barLength*.0005*0.2;
    setTimeout(()=>{
      playJazzNote(getNote(scale), noteLength);
    }, nP.jazz.barLength * 0.5);
  }
  if(playNote3){
    let noteLength = nP.jazz.barLength*.0005*0.3;
    setTimeout(()=>{
      playJazzNote(getNote(scale), noteLength);
    }, nP.jazz.barLength * 0.7);
  }

}

let getNote=(scale)=>{
  let note;

  // if chord changed, find equivalent scale degree
  if(currentChord!=lastChordPlayed){
    lastScaleNotePlayed = getEquivalentScaleDegree(lastNotePlayed,scale,currentChord.intervalToOrigin,nP);
    lastChordPlayed = currentChord;
  }

  let scaleDegree = continuePattern() + currentPatternOffset;
  note = currentChord.intervalToOrigin+ getNoteFromScale(scale,scaleDegree) + baseNote + currentOctave * m.Octave;

  lastNotePlayed = note;
  //displayLastNotePlayed(`Melody note: ${m.Keys[note%m.Octave]} (8ve: ${currentOctave})`);

  // report
  //console.log(m.Keys[note%m.Octave]);
  return note;
}


// getEquivalentScaleDegree()
//
// hmmm see adaptToScale(lastNote,scale,root,reportStatus)
// instead because it's newer and shiny

let getEquivalentScaleDegree=(lastNote,scale,interval,planet)=>{
  let candidates = [];
  let lowestDiff = 999;
  let transpose = baseNote + interval;

  for(let i=planet.jazz.homeKey; i<128; i++){
    let note = scale[i%scale.length] + flo(i/scale.length)*scale.length;
    let diff = Math.abs(note-lastNote);
    if(diff<=lowestDiff){
      candidates[0]=i;
      lowestDiff = diff;
      if(diff==lowestDiff) candidates[1]=i;
    }
  }

  return chooseBetween(candidates)%scale.length;
}

// getNoteFromScale()
//
// wrap scaleDegree to scale length, and return actual note

let getNoteFromScale=(scale,scaleDegree)=>{
  //console.log("scale degree: "+scaleDegree)
  while(scaleDegree<0){
    scaleDegree += scale.length;
    lastScaleNotePlayed = scaleDegree;
    currentOctave--;
  }

  while(scaleDegree>=scale.length){
    scaleDegree-=scale.length;
    lastScaleNotePlayed = scaleDegree;
    currentOctave++;
  }

  //console.log("8ve: "+currentOctave +" +-"+scale.length)

  return scale[scaleDegree];
}

// continuePattern()
//
//

let continuePattern =()=>{

  // continue along pattern
  currentPatternIndex ++;
  let diff = currentPattern[currentPatternIndex] - currentPattern[currentPatternIndex-1];

  let scaleNote = lastScaleNotePlayed + diff;
  //console.log(scaleNote,lastScaleNotePlayed,diff)
  lastScaleNotePlayed = scaleNote;

  // if end reached, new pattern
  if(currentPatternIndex>=currentPattern.length-1){
    let chanceOfAscending = constrain(firstNote-lastNotePlayed, 0, MaxNoteRange)/MaxNoteRange;
    let chanceOfDescending = constrain(lastNotePlayed-firstNote, 0, MaxNoteRange)/MaxNoteRange;

    if(lastNotePlayed<firstNote&&ch(chanceOfAscending))
      currentPattern = newAscendingPattern();
    else if(lastNotePlayed>firstNote&&ch(chanceOfDescending))
      currentPattern = newDescendingPattern();
    else currentPattern = newRandomPattern();
  }

  ////console.log(scaleNote)
  return scaleNote;
}

// removeAvoidNotes()
//
//

let removeAvoidNotes=(scale)=>{
  let avoidNotes = getAvoidNotes(scale);
  let newscale = [];
  for(let i=0; i<scale.degrees.length; i++){
    if(avoidNotes.includes(i)) continue;
    newscale.push(scale.degrees[i]);
  }
  return newscale;
}

// getAvoidNotes()
//
//

let getAvoidNotes=(scale)=>{
  let avoidNotes = [];
  switch(scale.name){
    case "Ionian": avoidNotes = [3]; break;
    case "Dorian": avoidNotes = [5]; break;
    case "Phrygian": avoidNotes = [1,5]; break;
    case "Lydian": avoidNotes = []; break;
    case "Mixolydian": avoidNotes = [3]; break;
    case "Aeolian": avoidNotes = [5]; break;
    case "NaturalMinor": avoidNotes = [5]; break;
    case "Locrian": avoidNotes = [1]; break;
    case "MelodicMinor": avoidNotes = []; break;
    case "LydianAugmented": avoidNotes = [5]; break;
    case "LocrianNatural2": avoidNotes = []; break;
    case "MajorBebop": avoidNotes = [3]; break;
    case "MinorBebop": avoidNotes = [5]; break;
    case "MixolydianBebop": avoidNotes = [3]; break;
  }
  return avoidNotes;
}
