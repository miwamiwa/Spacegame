class BGM {
  constructor(params){
    this.harmony = []; // list of Chord objects
    this.melody = []; // list of lists of Note objects
    if(params.homeKey==undefined) this.homeKey = MusicRng.randi(12);
    else this.homeKey = params.homeKey;
    this.bpm = params.bpm;
    this.beatLength = OneMinute / this.bpm;
    this.measure = {numerator:4,denominator:4};
    this.barLength = this.measure.numerator*this.beatLength;
    this.barCounter=0;
    this.headsPlayed=0;
    this.currentMelodySection=0;

    this.hatIntensity = MusicRng.rand(0.05, 0.5);
    this.hatType = MusicRng.randi(5);

    currentBGM = this;
    Impro.initializeImprov();
    this.setAccompanimentOctave(4);
    Zik.redo = false;
    this.generate(params);
    if(Zik.redo){
      Zik.redo = false;
      console.log("redo!")
      this.generate(params);
    }
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

  playHat(){
    //console.log(this.hatIntensity)
    playHat(this.hatIntensity);
  }

  hatTimeout(i){
    setTimeout(()=>{
      this.playHat();
    }, this.barLength * i);
  }

  play(time){
    //console.log(this.barCounter)
    let chanceOfShortNote = MusicRng.rand(.2,.9);
    //console.log("..")

    if(this.harmony[this.barCounter]!=undefined&&this.harmony[this.barCounter]!=m.NoChord){
      let chord = this.harmony[this.barCounter].notes;
      //console.log("playing ",chord)
      Impro.currentChord = this.harmony[this.barCounter];

      // setup midi recording
      if(recordingHead) recordedNotes = [];

      // play chord
      this.playChord(chord,0.9,recordingHead,time);


      switch(this.hatType){
        case 0:
        this.playHat();
        if(MusicRng.ch(0.5)) this.hatTimeout(0.5);
        if(MusicRng.ch(0.5)) this.hatTimeout(0.77);
        break;

        case 1:
        this.playHat();
        if(MusicRng.ch(0.5)) this.hatTimeout(0.66);
        break;

        case 2:
        this.playHat();
        if(MusicRng.ch(0.5)) this.hatTimeout(0.33);
        if(MusicRng.ch(0.5)) this.hatTimeout(0.66);
        break;

        case 3:
        this.playHat();
        if(MusicRng.ch(0.5)) this.hatTimeout(0.25);
        if(MusicRng.ch(0.5)) this.hatTimeout(0.5);
        break;

        case 4:
        let subdiv = chooseBetween([4,6,8]);
        let rhythm = new Rhythm(subdiv, chooseBetween([randi(randi(1), subdiv), 2]), false);
        let notes = [];
        for(let i=0; i<rhythm.beats.length; i++) notes.push(50);
        Zik.combineNotesAndBeats(rhythm.beats,notes,4);
        Zik.determineNoteLengths2(rhythm.beats);

        rhythm.beats.forEach(note=>{
          //console.log(note, this.getNote(scale), Math.abs(note.noteLength * currentBGM.barLength), note.time * currentBGM.barLength);
          setTimeout(()=>{this.playHat();}, note.time * this.barLength);
        });
        break;

      }


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
