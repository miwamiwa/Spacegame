class BGM {
  constructor(params){
    this.harmony = []; // list of Chord objects
    this.melody = []; // list of lists of Note objects
    if(params.homeKey==undefined) this.homeKey = randi(12);
    else this.homeKey = params.homeKey;
    this.bpm = params.bpm;
    this.beatLength = OneMinute / this.bpm;
    this.measure = {numerator:4,denominator:4};
    this.barLength = this.measure.numerator*this.beatLength;
    this.barCounter=0;
    this.headsPlayed=0;
    this.currentMelodySection=0;

    currentBGM = this;
    Impro.initializeImprov();
    this.setAccompanimentOctave(4);

    this.generate(params);
  }

  reset(){
    this.headsPlayed =0;
    this.barCounter=0;
    Impro.currentMelodySection =0;
  }

  setAccompanimentOctave(num){
    this.AccompanimentOctave = num;
    this.accompanimentBaseNote = this.AccompanimentOctave*m.Octave;
  }

  generate(params){
    this.params = params;
    switch(this.params.generationType){
      case "generate-piece-1": generatePiece(this, params); break;
      case "generate-piece-2": generatePiece2(this, params); break;
      case "generate-piece-with-improviser": generatePieceUsingImproviser(this,params); break;
    }
  }

  play(time){
    //console.log(this.barCounter)
    let chanceOfShortNote = rand(.2,.9);
    //console.log("..")

    if(this.harmony[this.barCounter]!=undefined&&this.harmony[this.barCounter]!=m.NoChord){
      let chord = this.harmony[this.barCounter].notes;
      //console.log("playing ",chord)
      Impro.currentChord = this.harmony[this.barCounter];

      // setup midi recording
      if(recordingHead) recordedNotes = [];

      // play chord
      this.playChord(chord,0.9,recordingHead,time);

      playHat();
      if(ch(0.5)) setTimeout(playHat, this.barLength * 0.66)

      // play melody
      if(this.headsPlayed%4<2){
        if(this.melody[this.barCounter]!=undefined){

          this.melody[this.barCounter].forEach(note=>{
            let val = this.homeKey + (m.Octave * 1) + parseInt(note.note);
            if(!isNaN(val)){
              // record note
              if(recordingHead) recordedNotes.push({note:val,time:this.barCounter + note.time});
              // play after timeout
        //      console.log(val,time,note.time,note.noteLength)
              setTimeout(()=>{playNote(val, Math.abs(note.noteLength * this.barLength), false)}, note.time * this.barLength);
            }
          });
        }
      }
      // or improvise
      else Impro.improvise();

      // process recorded values
      recordNotes();


    }

    // continue music
    this.barCounter++;
    if(this.barCounter==this.harmony.length-1){
      this.headsPlayed++;
      this.barCounter=0;
      // finalize recording
      // finishRecording();
    }
  }

  playChord(chord,length,record,time){
    let notes = [];
    for(let i=0; i<chord.length; i++){
      let note = this.accompanimentBaseNote+chord[i];

      notes.push(note);
      //playNote(note,length,true);
      if(record==true) recordedNotes.push({note:note,time:this.barCounter});
    }

    //if(time==undefined) time = Tone.now();
    playChordNotes(notes,length,0,time);

  }
}
