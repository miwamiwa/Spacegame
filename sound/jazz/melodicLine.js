

// MelodicLine
//
// buncha notes with a rhythmic pattern

class MelodicLine {
  constructor(bars,startnum,bgmObject){
    this.bars = bars;
    this.noteCount =0;
    this.notes = [];
    this.rhythm = [];
    this.counter =0;
    this.scales = [];
    this.scaleNames = [];
    this.scalesRecorded=false;
    this.startnum = startnum;
    this.bgmObject = bgmObject;

    // settings
    this.possibleSubdivisions = 2;
    this.preferredSubdivision = randi(this.possibleSubdivisions);
    this.preferenceAmount = rand()/4;
    this.scarcity = Math.max(0.5,rand());

    // generate!
    this.generateRhythm();
    this.generateMelody();
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

  generateRhythm(){

    // for scales
    this.lastchord;
    // generate rhythm for each bar
    for(let i=0; i<this.bars; i++){
      let pattern = [];

      // get a random subdivision (1,2,3)
      let subdivision = this.getRandomSubdivision(
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
        let chord = this.bgmObject.harmony[this.startnum+i];

        // if there is a new chord at this point in time
        // add this chord's scale
        if(chord!=m.NoChord) this.addScaleForThisChord(chord);

        // otherwise, backtrack to find the last right chord.
        else{
          // if we know the last chord, use that
          if(this.lastchord!=undefined) this.scales.push(this.lastchord);
          else {
            // if we don't know what the last chord was
            // (section started with a m.NoChord),
            // backtrack to find current chord
            let index=this.startnum;
            while(this.bgmObject.harmony[index]==m.NoChord) index--;
            // chord found.

            // add scale
            this.addScaleForThisChord(this.bgmObject.harmony[index]);
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
      this.generateRhythm();
    }
  }

  // addScaleForThisChord()
  //
  // pick a random a scale corresponding to the current chord
  // & remember it
  addScaleForThisChord(chord){
    let scale = m.getScaleFromChordData(chord.chordData);
    this.scaleNames.push(scale.name)
    scale = scale.removeAvoidNotes();
    this.scales.push(scale);
    this.lastchord = scale;
  }

  // generateMelody()
  //
  // generate a bunch of patterns

  generateMelody(){

    // settings
    Impro.currentPatternOffset=0;
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
    if(distToCenter>Impro.MaxNoteRange/2) pattern = Impro.newDescendingPattern();
    // same if we're getting low, go up
    else if(distToCenter<-Impro.MaxNoteRange/2) pattern = Impro.newAscendingPattern();
    else pattern = Impro.newRandomPattern();

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
      pattern[i] += Impro.currentPatternOffset
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


  // getRandomSubdivision()
  //
  // get a Number between 0 and maxsubdivision (inclusive)
  // also set a preferred subdivision

  getRandomSubdivision(){

    // start with preferred subdivision
    let subdivision = this.preferredSubdivision;

    // chance to pick another
    if(!ch(0.5 + this.preferenceAmount)){
      if(this.possibleSubdivisions>2){
        for(let i=0; i<this.possibleSubdivisions-1; i++)
        if(ch(0.5)) subdivision += 1;
      }
      else subdivision += 1;
    }

    // return value between 0 and maxsubdivision+1
    return 1 + (subdivision%(this.possibleSubdivisions+1));
  }



  // nextMelodyNote()
  //
  // get the next note in the given melody section

  nextMelodyNote(scale){

    // get interval between SCALE DEGREES
    let interval = this.getNextInterval();

    // handle resolutions
    if(interval=="resolve") interval = Math.min(Impro.getScaleIntervalTo(0),Impro.getScaleIntervalTo(2));

    // get the interval in NOTES that corresponds to that
    let actualInterval = Impro.translateToNoteInterval(interval,scale)

    // now, update current scale degree
    Impro.lastMelodyScaleNote=m.wrapToScaleDegrees(Impro.lastMelodyScaleNote +interval,scale);
    // and update melody note
    Impro.lastMelodyNote = Impro.lastMelodyNote + actualInterval;
    // report
    //console.log(`playing note: ${Impro.lastMelodyNote} (+8ve: ${Impro.currentOctave}) [scale note: ${Impro.lastMelodyScaleNote}]`);

    return Impro.lastMelodyNote;
  }

}
