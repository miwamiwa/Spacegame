let playMelody = false;
let melody;
let melodyExists = true;
let currentMelodySection =0;
let lastMelodyNote =0;
let lastMelodyScaleNote =0;
let lastSection =0;
const InitialMelodyOctave = 5;

// initializeMelody()
//
// reset melody when the head starts

let initializeMelody=()=>{
  firstNote = nP.jazz.homeKey + InitialMelodyOctave * m.Octave;
  baseNote = firstNote;

  lastMelodyNote =firstNote;
  lastMelodyScaleNote =0;
  nP.jazz.currentMelodySection =0;
  currentOctave =0;
  lastSection =0;
  currentPatternOffset =0;

  nP.jazz.melody.forEach(section=>{
    section.counter=0;
  });
}

// initializeSection()
//
// reset values at the start of a new melody section

let initializeSection=()=>{
  lastMelodyScaleNote =0;
  lastMelodyNote = firstNote + currentChord.intervalToOrigin;
}

// getCurrentMelodySection()
//
// get current section, update last section

let getCurrentMelodySection=()=>{
  lastSection = nP.jazz.currentMelodySection;
  return nP.jazz.melody[nP.jazz.currentMelodySection];
}

// getCurrentRhythm()
//
// get the rhythm for this bar of melody

let getCurrentRhythm=(section)=>{
  let index = nP.jazz.barCounter - nP.jazz.currentMelodySection;
  return section.rhythm[index];
}

// getCurrentScale()
//
//

let getCurrentScale=(section,reportStatus)=>{
  let index = nP.jazz.barCounter - nP.jazz.currentMelodySection;
  // report
  if(reportStatus==true) console.log(`scale: ${section.scaleNames[index]}`);
  // update ui
  //ui.currentInfo.scale.setText(`scale: ${section.scaleNames[index]}`);
  return section.scales[index];
}


// playInRhythm()
//
//

let playInRhythm=(rhythm,notes,planet)=>{
  let timings = getNoteTiming(rhythm,planet);
  let noteLengths = getNoteLengths(rhythm,planet);
  for(let i=0; i<rhythm.length; i++){
    if(rhythm[i]) setTimeout(()=>{
      playJazzNote(notes[i],noteLengths[i])
    },timings[i]);
  }
}

// getNoteTiming()
//
// get the onset of each note of a given rhythmic group

let getNoteTiming=(rhythm,planet)=>{
  if(rhythm.length==1) return [0];
  else if (rhythm.length==2) return [0,0.7*planet.jazz.barLength];
  else if (rhythm.length==3) return [0,0.33333*planet.jazz.barLength,0.66666*planet.jazz.barLength];
}

// getNoteLengths()
//
// Get the note lengths for a given rhythmic group

let getNoteLengths=(rhythm,planet)=>{
  if(rhythm.length==1) return [planet.jazz.barLength*.0006];
  else if (rhythm.length==2) return [planet.jazz.barLength*.0005,planet.jazz.barLength*.0005];
  else if (rhythm.length==3) return [planet.jazz.barLength*.0002,planet.jazz.barLength*.0002,planet.jazz.barLength*.0002];
}

// getNotes()
//
// generate a number of notes given some function,
// return them in an awway

let getNotes=(rhythm,func)=>{
  let notes = [];
  for(let i=0; i<rhythm.length; i++) if(rhythm[i]) notes[i] = func();
  return notes;
}

// playTheMelody()
//
//

let playTheMelody=()=>{

  //console.log("\n******* playTheMelody() *******");

  // if this is the start of the melody, or one of its sections
  if(nP.jazz.barCounter==0) initializeMelody();
  if(currentMelodySection!=lastSection) initializeSection();

  // where are we in the melody, time-wise?
  let section = getCurrentMelodySection();
  let rhythm = getCurrentRhythm(section);

  // if rhythm is undefined, it's because this phrase is over.
  if(rhythm==undefined) return;

  // get current harmony
  let scale = getCurrentScale(section);
  let chord = currentChord;
  let root = chord.intervalToOrigin;

  // if necessary, find an equivalent of the last melody note in the current scale
  adaptToScale(lastMelodyNote,scale,root);
  //console.log(scale,section)
  // fetch the notes we need
  let notes = getNotes(rhythm,()=>nextMelodyNote(scale,section));
  // now let's play 'em
//  console.log(notes);
  playInRhythm(rhythm,notes,nP);

  // updateSection if we reached a new section
  if(nP.jazz.melody[nP.jazz.barCounter+1]!=undefined) nP.jazz.currentMelodySection = nP.jazz.barCounter+1;

}


// adaptToScale()
//
// go through a buncha notes and find the closest
// scale note to the last note that was played
// lastNote (number, post-transposition),
// scale (array of scale degrees, relative to this chord's root)
// root (interval between this chord and homeKey)

let adaptToScale=(lastNote,scale,root,reportStatus)=>{

  if(reportStatus==true) console.log(`attempting to adapt note to scale`,lastMelodyNote,scale,root);

  let tempnote=nP.jazz.homeKey + root;
  let counter =0;
  let lowestDiff = 999;
  let candidates = [];
  let scaleDegrees = [];

  while(tempnote<128){
    // get scale note at this index
    let note = tempnote + scale[counter];
    let diff = Math.abs(note - lastNote);

    // if value is equal or lower than current best
    // candidate, it becomes candidate
    if(diff<=lowestDiff){
      if(diff==lowestDiff){
        // (there can be 2 candidates of the same value)
        candidates[1]=note;
        scaleDegrees[1]=counter;
      }
      else{
        // add single candidate
        candidates[0]=note;
        scaleDegrees[0]=counter;
      }
      lowestDiff=diff;
    }

    counter++;
    // go up by octave
    if(counter==scale.length){
      counter=0;
      tempnote += m.Octave;
    }
  }

  // adress a situation where both candidates aren't the same??
  // idk if this really happens
  if(candidates[1]!=undefined&&candidates[1]!=candidates[0]){
    if(candidates[0]==undefined){
      candidates[0] = candidates[1];
      scaleDegrees[0] = scaleDegrees[1];
    }
    else{
      candidates[0] = Math.min(candidates[1],candidates[0]);
      if(candidates[1]==candidates[0]) scaleDegrees[0]=scaleDegrees[1];
    }
    candidates[1] = undefined;
  }

  // pick candidate 0
  let result = {
    note:candidates[0],
    degree:scaleDegrees[0]
  }

  // chance to pick candidate 1 if it exists
  if(candidates[1]!=undefined){
    let pick = chooseBetween([0,1]);
    if(pick==1){
      result = {
        note:candidates[1],
        degree:scaleDegrees[1]
      }
    }
  }

  // blabla
  if(reportStatus==true){
    if(result.note!=lastMelodyNote){
      console.log(`adapted note to fit scale.`);
      console.log(`last note: ${lastMelodyNote} (${toLetter(lastMelodyNote)}); adapted: ${result.note} (${toLetter(result.note)})`);
    }
    else console.log(`last note: ${result.note}`);
    console.log(`which is scale degree: ${result.degree}`);
  }


  // update last note plated
  lastMelodyNote=result.note;
  lastMelodyScaleNote=result.degree;
  return result;
}

// getScaleIntervalTo(degree)
//
// get distance along scale from lastMelodyScaleNote to provided note

let getScaleIntervalTo=(scaleDegree)=>{
  return scaleDegree-lastMelodyScaleNote;
}

// translateToNoteInterval()
//
// Get Interval in halftones corresponding to an interval
// between scale degrees

let translateToNoteInterval=(interval,scale,reportStatus)=>{
  let originalInterval = interval;
  let index = lastMelodyScaleNote;
  let trueInterval =0;
  let octave=0;

  ///console.log(interval,index)

  // calculate ascending interval
  while(interval>0){

    // get next note
    let newIndex = index+1;
    let newOctave = octave;

    // handle octaves
    if(newIndex==scale.length){
      newOctave++;
      newIndex=0;
    }

    // add interval between this note and last
    trueInterval += (newOctave*m.Octave+scale[newIndex]) - (octave*m.Octave+scale[index])

    interval--;
    index = newIndex;
    octave = newOctave;
  }

  // calculate descending interval
  while(interval<0){

    // get next note
    let newIndex = index-1;
    let newOctave = octave;

    // handle octaves
    if(newIndex==-1){
      newOctave--;
      newIndex=scale.length-1;
    }

    // add interval between this note and last
    trueInterval += (newOctave*m.Octave+scale[newIndex]) - (octave*m.Octave+scale[index])

    interval ++;
    index = newIndex;
    octave = newOctave;
  }

  // report
  if(reportStatus==true){
    console.log(`Interval of ${originalInterval} scale degrees translates to ${trueInterval} halfTones`);
    console.log("scale: ",scale);
  }


  return trueInterval;
}
