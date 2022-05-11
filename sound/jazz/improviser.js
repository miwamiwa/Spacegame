let MusicRng;

class Improviser {
  constructor(){
    this.currentMelodySection=0;
    this.lastMelodyNote =0;
    this.lastMelodyScaleNote =0;
    this.lastSection =0;
    this.InitialMelodyOctave = 2;
    this.InitialImprovOctave = 5;
    this.MaxNoteRange = 12;
    this.firstNote;
    this.currentChord;
    this.currentPattern;
    this.currentOctave;
    this.currentPatternIndex;
    this.lastNotePlayed;
    this.lastScaleNotePlayed;
    this.lastChordPlayed;
    this.currentPatternOffset =0;
    this.baseNote;

    this.InitNotePatterns = [
      [0,1,2],
      [0,1,0],
      [0,0],
      [0,1],
      [0,2],
      [0,3,6],
      [0,2,4],
      [0,2,5],
      [1,2,0],
      [2,3,0],
      [3,4,0]
    ];

    this.NotePatterns = [];
    this.AscendingNotePatterns=[];
    this.Invert = "Invert";
    this.NoInvert = "NoInvert";
    this.Reverse = "Reverse";
    this.NoReverse = "NoReverse";

    this.setupNotePatterns(this.InitNotePatterns);
  }


  // adaptToScale()
  //
  // go through a buncha notes and find the closest
  // scale note to the last note that was played
  // lastNote (number, post-transposition),
  // scale (array of scale degrees, relative to this chord's root)
  // root (interval between this chord and homeKey)

  adaptToScale(bgmObject,lastNote,scale,root,reportStatus){

    if(reportStatus==true) console.log(`attempting to adapt note to scale`,this.lastMelodyNote,scale,root);

    let tempnote=bgmObject.homeKey + root;
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
      if(result.note!=this.lastMelodyNote){
        console.log(`adapted note to fit scale.`);
        console.log(`last note: ${this.lastMelodyNote} (${m.toLetter(this.lastMelodyNote)}); adapted: ${result.note} (${m.toLetter(result.note)})`);
      }
      else console.log(`last note: ${result.note}`);
      console.log(`which is scale degree: ${result.degree}`);
    }


    // update last note plated
    this.lastMelodyNote=result.note;
    this.lastMelodyScaleNote=result.degree;
    return result;
  }



  // getScaleIntervalTo(degree)
  //
  // get distance along scale from this.lastMelodyScaleNote to provided note

  getScaleIntervalTo(scaleDegree){
    return scaleDegree-this.lastMelodyScaleNote;
  }


  // translateToNoteInterval()
  //
  // Get Interval in halftones corresponding to an interval
  // between scale degrees

  translateToNoteInterval(interval,scale,reportStatus){
    let originalInterval = interval;
    let index = this.lastMelodyScaleNote;
    let trueInterval =0;
    let octave=0;

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


  // getNotes()
  //
  // generate a number of notes given some function,
  // return them in an awway

  getNotes(rhythm,func){
    let notes = [];
    for(let i=0; i<rhythm.length; i++) if(rhythm[i]) notes[i] = func();
    return notes;
  }


  // getNoteTiming()
  //
  // get the onset of each note of a given rhythmic group

  getNoteTiming(rhythm){
    if(rhythm.length==1) return [0];
    else if (rhythm.length==2) return [0,0.7];//*currentBGM.barLength];
    else if (rhythm.length==3) return [0,0.33333,0.66666];
  }

  // getNoteLengths()
  //
  // Get the note lengths for a given rhythmic group

  getNoteLengths(rhythm){
    if(rhythm.length==1) return [.6];
    else if (rhythm.length==2) return [.5,.5];
    else if (rhythm.length==3) return [.2,.2,.2];
  }


  // getCurrentScale()
  //
  //

  getCurrentScale(i,section,reportStatus){
    let index = i - this.currentMelodySection;
    // report
    if(reportStatus==true) console.log(`scale: ${section.scaleNames[index]}`);
    // update ui
    //ui.currentInfo.scale.setText(`scale: ${section.scaleNames[index]}`);
    return section.scales[index];
  }


  // getCurrentRhythm()
  //
  // get the rhythm for this bar of melody

  getCurrentRhythm(i,section){
    let index = i - this.currentMelodySection;
    return section.rhythm[index];
  }

  // getCurrentMelodySection()
  //
  // get current section, update last section

  getCurrentMelodySection(melody){
    this.lastSection = this.currentMelodySection;
    return melody[this.currentMelodySection];
  }

  // initializeSection()
  //
  // reset values at the start of a new melody section

  initializeSection(chord){
    this.lastMelodyScaleNote =0;
    this.lastMelodyNote = this.firstNote + chord.intervalToOrigin;
  }

  // initializeMelody()
  //
  // reset melody when the head starts

  initializeMelody(bgmObject){
    this.firstNote = bgmObject.homeKey + this.InitialMelodyOctave * m.Octave;
    this.baseNote = this.firstNote;

    this.lastMelodyNote =this.firstNote;
    this.lastMelodyScaleNote =0;
    this.currentMelodySection =0;
    this.currentOctave =0;
    this.lastSection =0;
    this.currentPatternOffset =0;
  }



  // continuePattern()
  //
  //

  continuePattern(){

    // continue along pattern
    this.currentPatternIndex ++;
    let diff = this.currentPattern[this.currentPatternIndex] - this.currentPattern[this.currentPatternIndex-1];

    let scaleNote = this.lastScaleNotePlayed + diff;
    //console.log(scaleNote,this.lastScaleNotePlayed,diff)
    this.lastScaleNotePlayed = scaleNote;

    // if end reached, new pattern
    if(this.currentPatternIndex>=this.currentPattern.length-1){
      let chanceOfAscending = constrain(this.firstNote-this.lastNotePlayed, 0, this.MaxNoteRange)/this.MaxNoteRange;
      let chanceOfDescending = constrain(this.lastNotePlayed-this.firstNote, 0, this.MaxNoteRange)/this.MaxNoteRange;

      if(this.lastNotePlayed<this.firstNote&&MusicRng.ch(chanceOfAscending))
        this.currentPattern = this.newAscendingPattern();
      else if(this.lastNotePlayed>this.firstNote&&MusicRng.ch(chanceOfDescending))
        this.currentPattern = this.newDescendingPattern();
      else this.currentPattern = this.newRandomPattern();
    }

    ////console.log(scaleNote)
    return scaleNote;
  }



  // getNoteFromScale()
  //
  // wrap scaleDegree to scale length, and return actual note

  getNoteFromScale(scale,scaleDegree){
    //console.log("scale degree: "+scaleDegree)
    while(scaleDegree<0){
      scaleDegree += scale.length;
      this.lastScaleNotePlayed = scaleDegree;
      this.currentOctave--;
    }

    while(scaleDegree>=scale.length){
      scaleDegree-=scale.length;
      this.lastScaleNotePlayed = scaleDegree;
      this.currentOctave++;
    }

    //console.log("8ve: "+this.currentOctave +" +-"+scale.length)

    return scale[scaleDegree];
  }



  // getEquivalentScaleDegree()
  //
  // hmmm see adaptToScale(lastNote,scale,root,reportStatus)
  // instead because it's newer and shiny

  getEquivalentScaleDegree(lastNote,scale,interval){
    let candidates = [];
    let lowestDiff = 999;
    let transpose = this.baseNote + interval;

    for(let i=currentBGM.homeKey; i<128; i++){
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



  getNote(scale){
    let note;

    // if chord changed, find equivalent scale degree
    if(this.currentChord!=this.lastChordPlayed){
      this.lastScaleNotePlayed = this.getEquivalentScaleDegree(this.lastNotePlayed,scale,this.currentChord.intervalToOrigin);
      this.lastChordPlayed = this.currentChord;
    }

    let scaleDegree = this.continuePattern() + this.currentPatternOffset;
    note = this.currentChord.intervalToOrigin+ this.getNoteFromScale(scale,scaleDegree) + this.baseNote + this.currentOctave * m.Octave;

    this.lastNotePlayed = note;
    //displayLastNotePlayed(`Melody note: ${m.Keys[note%m.Octave]} (8ve: ${this.currentOctave})`);

    // report
    //console.log(m.Keys[note%m.Octave]);
    return note;
  }


  // improvise()
  //
  //

  improvise(){

    //let relativeRoot = this.currentChord.chordData.intervalToOrigin;
    let scale = m.getScaleFromChordData(this.currentChord.chordData);
  //  currentScale = scale.name;
    //////console.log(scale)
    scale = scale.removeAvoidNotes();
    //////console.log(scale)
    let playNote1=ch(0.8);
    let playNote2=ch(0.8);
    let playNote3=ch(0.4);

    if(playNote1){
      let noteLength = currentBGM.barLength*.001;
      if(playNote2) noteLength /=2;
      else if(playNote3) noteLength *= .7;

      playNote(this.getNote(scale), noteLength);
    }
    if(playNote2){
      let noteLength = currentBGM.barLength*.01*0.5;
      if(playNote3) noteLength = currentBGM.barLength*.01*0.2;
      setTimeout(()=>{
        playNote(this.getNote(scale), noteLength);
      }, currentBGM.barLength * 0.5);
    }
    if(playNote3){
      let noteLength = currentBGM.barLength*.05*0.3;
      setTimeout(()=>{
        playNote(this.getNote(scale), noteLength);
      }, currentBGM.barLength * 0.7);
    }
  }


  // initializeImprov()
  //
  // called in playMusic()

  initializeImprov(){
    this.currentPatternIndex = -1;
    this.currentOctave =0;
    // initialize pattern
    this.currentPattern = this.newRandomPattern();
    this.lastScaleNotePlayed =0;
    this.firstNote = currentBGM.homeKey + this.InitialImprovOctave * m.Octave;
    this.baseNote = this.firstNote;
    this.lastNotePlayed = this.firstNote;
  }



  // this.refreshAscendingPatterns()
  // find all ascending note patterns in
  // NotePatterns, and add a couple too
  refreshAscendingPatterns(){
    this.AscendingNotePatterns=[
      [0,3],
      [0,4]
    ];
    this.NotePatterns.forEach(pattern=>{
      if(pattern[pattern.length-1]>pattern[0]) this.AscendingNotePatterns.push(pattern);
    });
  }


  // addNewNotePattern()
  // add one new note pattern, remove one.
  addNewNotePattern(pattern,removeOldest){
    this.NotePatterns.unshift(pattern);
    if(removeOldest==true) this.NotePatterns.pop();
    this.refreshAscendingPatterns();
  }


  // randomTransformation()
  // transform a pattern randomly:
  // either invert, reverse, both, or none.
  randomTransformation(pattern){
    // choose random transforms
    let inverted = this.Invert==MusicRng.randomFromArray([this.Invert,this.NoInvert]);
    let reversed = this.Reverse==MusicRng.randomFromArray([this.Reverse,this.NoReverse]);
    // apply
    let newpattern;
    if(reversed) newpattern = this.reversePattern(pattern);
    else newpattern = Array.from(pattern);
    if(inverted) newpattern = this.invertPattern(newpattern);
    // return
    return newpattern;
  }

  // reversePattern()
  //
  // reverse a note pattern, or make the beginning the end

  reversePattern(pattern){
    let newpattern = [];
    for(let i=0; i<pattern.length; i++) newpattern[pattern.length-1-i] = pattern[i];
    return newpattern;
  }

  // invertPattern()
  //
  // apply an inversion to this pattern, or make its highest note its lowest

  invertPattern(pattern){
    let highestnum = -999;
    let newpattern = [];
    pattern.forEach(num=>{if(num>highestnum) highestnum=num});
    for(let i=0; i<pattern.length; i++) newpattern[i] = highestnum-pattern[i];
    return newpattern;
  }



  // newRandomPattern()
  //
  //

  newRandomPattern(){
    let pattern = chooseBetween(this.NotePatterns);
    pattern = this.randomTransformation(pattern);
    this.currentPatternIndex = 0;
    this.currentPatternOffset = -pattern[0];
    return pattern;
  }


  // newAscendingPattern()
  //
  //

  newAscendingPattern(){
    let pattern = chooseBetween(this.AscendingNotePatterns);
    pattern = Array.from(pattern);
    this.currentPatternIndex = 0;
    this.currentPatternOffset = -pattern[0];
    return pattern;
  }


  // newDescendingPattern()
  //
  //

  newDescendingPattern(){
    let pattern = chooseBetween(this.AscendingNotePatterns);
    pattern = this.reversePattern(pattern);
    this.currentPatternIndex = 0;
    this.currentPatternOffset = -pattern[0];
    return pattern;
  }

  // setupNotePatterns()
  //
  // called in newMusic

  setupNotePatterns(patternList){
    this.NotePatterns = [];

    for(let i=0; i<patternList.length; i++){
      this.NotePatterns.push(patternList[i]);
    }

    this.refreshAscendingPatterns();
  }
}

const Impro = new Improviser();
