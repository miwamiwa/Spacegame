
// nextMelodyNote()
//
// get the next note in the given melody section

let nextMelodyNote=(scale,melodySection)=>{
//  console.log(scale,melodySection)
  // get interval between SCALE DEGREES
  let interval = melodySection.getNextInterval();
  //console.log(interval)
  // handle resolutions
  if(interval=="resolve") interval = Math.min(getScaleIntervalTo(0),getScaleIntervalTo(2));
  //console.log(interval)
  // get the interval in NOTES that corresponds to that
  let actualInterval = translateToNoteInterval(interval,scale)
//  console.log(actualInterval)
  // now, update current scale degree
  lastMelodyScaleNote=wrapToScaleDegrees(lastMelodyScaleNote +interval,scale);
  // and update melody note
  lastMelodyNote = lastMelodyNote + actualInterval;

  // update UI
  //displayLastNotePlayed(`Melody note: ${m.Keys[lastMelodyNote%m.Octave]} (8ve: ${currentOctave})`);

  // report
  //console.log(`playing note: ${lastMelodyNote} (+8ve: ${currentOctave}) [scale note: ${lastMelodyScaleNote}]`);
  //console.log(lastMelodyNote,lastMelodyScaleNote);
  return lastMelodyNote;
}





// generateMelody()
//
// populate the melody array with a few sections (MelodicLine objects)
// sections are indexed by the number of the bar at which they start

let generateMelody=(planet)=>{

  // figure out how long the main theme should be

  let numSections = planet.jazz.tuneData.sections.length;
  let section1Length = planet.jazz.tuneData.sections[0].length;

  // what fraction of the full piece should this melody span
  let portion = Math.min(3, Math.max(1,randi(flo(planet.jazz.harmony.length/6))));
  // limit to 8 bars
  let mel1Bars = Math.min(flo(planet.jazz.harmony.length/portion)+1,8);
  // chance to limit to 4
  if(ch(0.5)) mel1Bars = Math.min(mel1Bars,4);
  // limit to harmony length
  mel1Bars = Math.min(mel1Bars,planet.jazz.harmony.length);

  // create melody
  let mel1 = new MelodicLine(mel1Bars,0,planet);

  let structure = [];
  structure [0] = mel1;

  // create second melody?
  let mel2Bars =0;
  let mel2;
  // if there is room
  if(mel1Bars<planet.jazz.harmony.length -2){
    // determine length
    mel2Bars = Math.min(flo(planet.jazz.harmony.length/portion)+1,8);
    mel2Bars = Math.min(mel1Bars,planet.jazz.harmony.length-mel1Bars);
    // create new melody
    mel2 = new MelodicLine(mel2Bars,mel1Bars,planet);
    structure [mel1Bars] = mel2;
  }

  // add more???
  let totalbars = mel1Bars + mel2Bars;
  let counter =0;
  // while there's still room...
  while(totalbars < planet.jazz.harmony.length - mel1Bars){
    let chosenmel;
    // chance to add the first melody line
    if(counter%2==0) chosenmel = mel1;
    // or create a new melody line
    else chosenmel = new MelodicLine(mel1Bars,totalbars,planet);
    structure[totalbars] =chosenmel;
    counter++;
    totalbars += mel1Bars;
  }

  // one last bit?
  if(planet.jazz.harmony.length - totalbars > 3){
    // create new melody to fill remaining few bars
    let lastmel = new MelodicLine(planet.jazz.harmony.length - totalbars - 1,totalbars,planet);
    structure[totalbars] = lastmel;
  }

  // had enough??

  // done. update current melody
  planet.jazz.melody = structure;

  // report
  // console.log(structure);

  // number sections (this is the nth section)
  let structureIndex=0;
  for(let i=0; i<totalbars + 1; i++){
    if(structure[i]!=undefined && structure[i].sectionIndex==undefined){
      structure[i].sectionIndex = structureIndex;
      structureIndex++;
    }
  }
}


// getSectionIndex()
//
// get section and pattern data for display on ui.currentInfo.status

let getSectionIndex=(startnum)=>{
  let structureIndex=0;
  for(let i=0; i<99; i++){
    if(planet.jazz.melody[i]!=undefined){
      if(i==startnum) return `${structureIndex} (pattern #${planet.jazz.melody[i].sectionIndex})`;
      structureIndex++;
    }
  }
  return -1;
}


// MelodicLine
//
// buncha notes with a rhythmic pattern

class MelodicLine {
  constructor(bars,startnum,planet){
    this.bars = bars;
    this.noteCount =0;
    this.notes = [];
    this.rhythm = [];
    this.counter =0;
    this.scales = [];
    this.scaleNames = [];
    this.scalesRecorded=false;
    this.startnum = startnum;


    // settings
    this.possibleSubdivisions = 2;
    this.preferredSubdivision = randi(this.possibleSubdivisions);
    this.preferenceAmount = rand()/4;
    this.scarcity = Math.max(0.5,rand());

    // generate!
    this.generateRhythm(planet);
    this.generateMelody(planet);
  }

  // reset
  //
  reset(){
    this.counter =0;
  }


  // getNextInterval()
  //
  // move to the next note in this pattern,
  // and return interval from last note to this note

  getNextInterval(reportStatus){
    this.counter++;

    // resolve interval
    let result = "resolve";
    if(this.counter<this.noteCount-1)
    result= this.notes[this.counter] - this.notes[this.counter-1];
    else this.counter=0;

    // report
    if(reportStatus==true){
      if(result>=0) console.log(`up ${result} scale degrees`);
      else console.log(`down ${result} scale degrees`);
    }

    return result;
  }


  // generateRhythm()
  //
  //

  generateRhythm(planet){

    // for scales
    this.lastchord;
    // generate rhythm for each bar
    for(let i=0; i<this.bars; i++){
      let pattern = [];

      // get a random subdivision (1,2,3)
      let subdivision = getRandomSubdivision(
        this.preferredSubdivision, // has higher chance of being chosen
        this.preferenceAmount,
        this.possibleSubdivisions
      );

      // chance to generate note at each subdivision
      for(let j=0; j<subdivision; j++){
        let playANote = ch(this.scarcity);
        if(playANote) this.noteCount++;
        // add array element with true/false to indicate whether a note
        // is played at this point in time
        pattern.push(playANote);
      }

      // remember this pattern
      this.rhythm.push(pattern);

      if(!this.scalesRecorded){
        // while we're at it, record what scale is
        // being played at this point in time
        let chord = planet.jazz.harmony[this.startnum+i];

        // if there is a new chord at this point in time
        // add this chord's scale
        if(chord!=NoChord) this.addScaleForThisChord(chord);

        // otherwise, backtrack to find the last right chord.
        else{
          // if we know the last chord, use that
          if(this.lastchord!=undefined) this.scales.push(this.lastchord);
          else {
            // if we don't know what the last chord was
            // (section started with a NoChord),
            // backtrack to find current chord
            let index=this.startnum;
            while(planet.jazz.harmony[index]==NoChord) index--;
            // chord found.

            // add scale
            this.addScaleForThisChord(planet.jazz.harmony[index]);
          }
        }
      }
    }

    // don't re-record chords.
    this.scalesRecorded=true;

    // restart if we didn't come up with very many notes
    if(this.noteCount<3){
      this.rhythm = [];
      this.noteCount=0;
      this.generateRhythm(planet);
    }
  }

  // addScaleForThisChord()
  //
  // pick a random a scale corresponding to the current chord
  // & remember it
  addScaleForThisChord(chord){
    let scale = getScaleFromChordData(chord.chordData);
    this.scaleNames.push(scale.name)
    scale = removeAvoidNotes(scale);
    this.scales.push(scale);
    this.lastchord = scale;
  }

  // generateMelody()
  //
  // generate a bunch of patterns

  generateMelody(){

    // settings
    currentPatternOffset=0;
    let startNote = chooseBetween([0,2,4]);
    let currentNote = startNote;
    this.notes = [currentNote];

    // generate up until the second to last note
    while(this.notes.length!=this.noteCount-1){

      // pick a pattern
      let pattern = this.getNewPattern(currentNote - startNote);
      // add all the notes in this pattern
      currentNote = this.addNotesFromPattern(currentNote,pattern);

      // reset if we generated too much.. until we get something that works ;D
      if(this.notes.length>=this.noteCount){
        currentNote = startNote;
        this.notes = [currentNote];
      }
    }

    // as for the last note, we will resolve it to 0 or 2
    // of whatever chord while the piece is running
    this.notes.push("resolve");
  }


  // getNewPattern()
  //
  // get a new note pattern, maybe choose up or down specifically
  // to get a bit closer to the tonal center (start note)

  getNewPattern(distToCenter){
    let pattern;
    // if we're high up, maybe choose something that heads down
    if(distToCenter>MaxNoteRange/2) pattern = newDescendingPattern();
    // same if we're getting low, go up
    else if(distToCenter<-MaxNoteRange/2) pattern = newAscendingPattern();
    else pattern = newRandomPattern();

    return pattern;
  }

  // addNotesFromPattern()
  //
  // record the notes in this pattern. Transpose them to start
  // from currentNote.

  addNotesFromPattern(currentNote, pattern){

    // add all the notes in this pattern
    let lastnum =0;
    for(let i=1; i<pattern.length; i++){
      // generate note
      pattern[i] += currentPatternOffset
      let diff = pattern[i] - lastnum;
      let newNote = currentNote + diff;
      // record
      this.notes.push(newNote);
      currentNote = newNote;
      lastnum = pattern[i];
    }

    // return the state of currentNote (at the end of the pattern)
    return currentNote;
  }
}



// getRandomSubdivision()
//
// get a Number between 0 and maxsubdivision (inclusive)
// also set a preferred subdivision

let getRandomSubdivision=(pref,prefamount,maxsubdivision)=>{

  // start with preferred subdivision
  let subdivision = pref;

  // chance to pick another
  if(!ch(0.5 + prefamount)){
    if(maxsubdivision>2){
      for(let i=0; i<maxsubdivision-1; i++)
      if(ch(0.5)) subdivision += 1;
    }
    else subdivision += 1;
  }

  // return value between 0 and maxsubdivision+1
  return 1 + (subdivision%(maxsubdivision+1));
}
