class ZikGenerator {
  constructor(){
    this.chord = new Chord('i',0);
    this.debugMode = false;
    this.redo = false;
    this.AllChords = {
      uniqueChords:[],
      chordColors:[]
    }
  }

  // preloadTunes()
  //
  // preload a markov object with specified list of tunes.
  // there are "options": namely
  // "combine" which indicates that chords and notes should be combined prior to loading
  // "get-notes" which returns a list of all notes associated with each chord we looked at (but loading remains the same)

  preloadTunes(tunes,markovObject,optionalSetting){

    // optionally, return array of notes,
    // organized by chord name
    let allnotes = [];

    tunes.forEach(tune=>{

      let sentence;
      if(optionalSetting=="combine") sentence = this.unpackTuneData(tune);
      else sentence = tune.chordList_relative+".";
      // load tune
      markovObject.loadText(sentence);

      // get stats (for debug)
      if(this.debugMode) this.preAnalyzeChords(tune);

      // get all the notes in this tune
      if(optionalSetting=="get-notes"){
        tune.full_piece.forEach(chord=>{
          if(allnotes[chord.chord]==undefined) allnotes[chord.chord] = [];
          chord.notes.forEach(note=>{

            // organize notes in a named array
            // (note lists are indexed by chord name)
            if(allnotes[chord.chord].indexOf(note)==-1)
            allnotes[chord.chord].push(note);
          });
        });
      }
    });

    if(optionalSetting=="get-notes") return allnotes;
  }

  // unpackTuneData()
  //
  // for preloadTunes in "combine" mode
  // combine chords and notes in a tune

  unpackTuneData(tune){
    let sentence = "";
    tune.full_piece.forEach(chord=>{
      chord.notes.forEach(note=>{
        sentence += chord.chord+"_"+note+" ";
      });
    });
    return removeLastChar(sentence)+".";
  }

  // preloadChordNotes
  //
  // given a specific chord,
  // look through all the tunes for notes played over that chord,
  // and feed them into the specified markov object.

  preloadChordNotes(tunes,targetChord,markovObject){
    tunes.forEach(tune=>{
      tune.full_piece.forEach(chord=>{
        if(chord.chord==targetChord){
          let txt = chord.notes.join(" ")+".";
          markovObject.loadText(txt);
        }
      });
    });
  }

  // newRhythmicPattern
  //
  // create a random rhythmic pattern that fits a given subdivision

  newRhythmicPattern(subdivision,numNotes,noteZero,isHalf){

    let rhythmNotes = [];
    let resultingRhythm = [];
    let notesAdded =0;

    for(let i=0; i<subdivision; i++) rhythmNotes.push(false);

    // add note zero
    if(isHalf!=true && noteZero==true){
      rhythmNotes[0]=true;
      resultingRhythm.push(new Note(0,0,0));
      notesAdded ++;
    }

    // add as many notes as possible
    while(notesAdded<numNotes&&notesAdded<subdivision){
      let pick = MusicRng.randi(subdivision);
      if(rhythmNotes[pick]==false){
        let time = pick/subdivision;
        if(isHalf==true) time += 0.72/subdivision;
        rhythmNotes[pick]=true;
        resultingRhythm.push(new Note(time,0,0));
        notesAdded ++;
      }
    }

    return {
      pattern:rhythmNotes,
      actualRhythm:resultingRhythm,
      notesAdded:notesAdded
    }
  }

  // determineNoteLengths
  //
  // determine the length of notes of which we know the rhythm

  determineNoteLengths(noteList){
    for(let i=0; i<noteList.length; i++){
      let pattern = noteList[i];
      for(let j=0; j<pattern.length; j++){
        let note = pattern[j];
        let isLastNote = false;
        let nextNote = pattern[j+1];
        let offset = 0;
        if(nextNote==undefined){
          let nextpattern = noteList[i+1];
          if(nextpattern==undefined){
            // no next note
            isLastNote = true;
          }
          else {
            nextNote = nextpattern[0];
            offset = 1;
          }
        }

        if(!isLastNote){
          note.noteLength = nextNote.time + offset - note.time;
        }
        else note.noteLength = 0.2;
      }
    }
  }

  determineNoteLengths2(pattern){
    for(let j=0; j<pattern.length; j++){
      let note = pattern[j];
      let nextNote = pattern[j+1];
      if(nextNote==undefined){
        note.noteLength = 0.2;
      }
      else note.noteLength = nextNote.time - note.time;
    }
  }

  // addRhythmToMelody()
  //
  // create a random rhythm for a single melodic phrase

  addRhythmToMelody(phrase,chosenSubdivision){
    let notes = this.noteStringToList(phrase);
    let rhythm = new Rhythm(chosenSubdivision * 2,notes.length);
    this.combineNotesAndBeats(rhythm.beats,notes,4);

    return rhythm.beats


    // old version:


    // generate beats
    let beats = this.newRhythmicPattern(chosenSubdivision,notes.length,MusicRng.ch(0.4));
    // generate off-beats
    let offbeats = this.newRhythmicPattern(chosenSubdivision,notes.length - beats.notesAdded,MusicRng.ch(0.2), true);

    // assign notes
    let orderedBeats = this.combineBeats(beats.actualRhythm,offbeats.actualRhythm);
    this.combineNotesAndBeats(orderedBeats,notes,4);

    return orderedBeats;
  }

  combineNotesAndBeats(beats,notes,octave){
    for(let i=0; i<beats.length; i++) beats[i].note = octave*m.Octave + notes[i];
  }

  // generateFromCombinedData()
  //
  // used in generate-piece-1
  // generate chords and notes together
  // from combined input data
  generateFromCombinedData(markovObject, bgmObject){

    let allChords = [];
    let phrases = [];
    let lastchord;
    let currentPhrase;
    let longestPhrase =0;
    let phraselength =0;

    MinSentenceLength = 6;
    MaxSentenceLength = 32;

    // generate chords
    markovObject.generateSentence().split(" ").forEach(symbol=>{
      // split chords and notes
      let data = this.splitCombinedSymbol(symbol);

      if(data.chord!=lastchord || MusicRng.ch(0.1*phraselength)){
        if(currentPhrase!=undefined) phrases.push(currentPhrase);
        allChords.push(new Chord(data.chord,bgmObject.homeKey));
        currentPhrase = "";
        phraselength =0;
      }

      lastchord = data.chord;
      currentPhrase+=data.note+" ";
      phraselength ++; // count notes in this phrase
      longestPhrase = Math.max(longestPhrase,phraselength);
    });

    phrases.push(currentPhrase);

    return {
      chords:allChords,
      phrases:phrases,
      longestPhrase:longestPhrase
    }
  }

  // splitCombinedSymbol()
  //
  // sseparate chord and note for a symbol that looks like vii7b5_1
  splitCombinedSymbol(symbol){
    let data = symbol.split("_");
    return {
      chord:data[0],
      note: parseInt(data[1])
    }
  }


  // generateMelodicRhythm()
  //
  // generate rhythm for a list of melodic phrases.

  generateMelodicRhythm(phrases,subdivision,bgmObject){
    subdivision = this.getSmallestSubdivision(subdivision,phrases);
    bgmObject.smallestSubdivision = subdivision * 2;
    let longestPhrase =0;

    phrases.forEach(phrase=>{
      let phraseWithRhythm = this.addRhythmToMelody(phrase,subdivision);
      longestPhrase = Math.max(phraseWithRhythm.length, longestPhrase);
      bgmObject.melody.push(phraseWithRhythm);
    });

    this.determineNoteLengths(bgmObject.melody);

    //console.log(bgmObject.melody)
    //console.log(longestPhrase)

    bgmObject.longestPhrase = longestPhrase;
  }



  // generateChordList()
  //
  // used in generate-piece-2

  generateChordList(bgmObject, params){

      // setup parameters

      if(params.harmonicFidelity==undefined) params.harmonicFidelity = 2;
      if(params.melodicFidelity==undefined) params.melodicFidelity = 2;

      if(params.minHarmonyLength==undefined) params.minHarmonyLength = 8;
      MinSentenceLength = params.minHarmonyLength;

      if(params.maxHarmonyLength==undefined) params.maxHarmonyLength = params.minHarmonyLength + 8;
      MaxSentenceLength = params.maxHarmonyLength;

      // create markov object

      let harmonyMarkov = new RiMarkov(params.harmonicFidelity,true,false);
      let allnotes = this.preloadTunes(Tunes2, harmonyMarkov, "get-notes");

      // generate harmonic content

      let generatedText = harmonyMarkov.generateSentence();
      // convert to array
      let chordList = removeLastChar(generatedText).split(" ");

      // done generating harmony and melody!
      // bgmObject.rawHarmony = chordList;

      // analyze harmony we just produced
      chordList.forEach(chord=>{
        bgmObject.harmony.push(new Chord(chord,bgmObject.homeKey));
      });

      return {
        chordList:chordList,
        allNotes:allnotes
      }
  }





  // generateMelodyOverChordList()
  //
  // used in generate-piece2
  // generate a melody given a list of all notes/chord
  // and a pre-generated harmony

  generateMelodyOverChordList(chordList,params,bgmObject,allnotes){
    let phrases = []; // output
    let generatedContent = []; // used to track which chords we already have a melody for
    let uniquePhrases = []; // used to track which unique melody lines were generated so far

    // melody generation parameters

    if(params.minMelodyPerChord==undefined) params.minMelodyPerChord = MusicRng.randi(2, 3);
    MinSentenceLength = params.minMelodyPerChord;

    if(params.maxMelodyPerChord==undefined) params.maxMelodyPerChord = 1+flo(MusicRng.rand(2.5,5.5)*MinSentenceLength);
    MaxSentenceLength = params.maxMelodyPerChord;

    if(params.chanceToDupeSameChord==undefined) params.chanceToDupeSameChord = 0.6;
    if(params.chanceToDupeSamePattern==undefined) params.chanceToDupeSamePattern = 0.4;
    if(params.dupeChanceDecay==undefined) params.dupeChanceDecay = 0.1;

    // generate bits of melody for each chord in the harmony.
    let dupetype1 = 0;
    let dupetype2 = 0;

    chordList.forEach(chordinpiece=>{
      let done = false;

      // check if we already generated a melody for this type of chord

      if(generatedContent[chordinpiece]!=undefined){
        // chance to use this melody
        if(MusicRng.ch(params.chanceToDupeSameChord - dupetype2 * params.dupeChanceDecay)){
          dupetype2++;
          phrases.push(generatedContent[chordinpiece]);
          done=true;
        }
      }

      // now look at all melodies generated so far,
      // and check if their note content fits this chord
      // (without looking at chord type)

      if(!done) {
        uniquePhrases.forEach(phrase=>{
          if(!done&&this.phraseFitsChord(phrase, allnotes[chordinpiece])){
            // chance to use this melody
            if(MusicRng.ch(params.chanceToDupeSamePattern - dupetype1 * params.dupeChanceDecay)){
              phrases.push(phrase);
              done=true;
              dupetype1 ++;
            }
          }
        });
      }

      // if we aren't using a duplicate,
      // then we need to generate a new melodic line

      if(!done) {
        // load notes relevant to the current chord
        let melodyMarkov = new RiMarkov(params.melodicFidelity,true,true);
        this.preloadChordNotes(Tunes2,chordinpiece,melodyMarkov);

        // generate phrase
        let phrase = melodyMarkov.generateSentence();
        if(phrase==undefined){
          this.redo = true;
          console.log("undefined at "+chordinpiece + "... not enough notes associated to this chord? min generation length too high?");
          return "stop"
        }
        else phrase=removeLastChar(phrase);

        // remember
        phrases.push(phrase);
        uniquePhrases.push(phrase);
        generatedContent[chordinpiece] = phrase;
      }
    });

    bgmObject.melodicPhrases = phrases;

    return phrases;
  }

  // noteStringToList()
  //
  // create a list of integers from a string
  // like this:
  // "0 - 5 3" => [0,-1,5,3]

  noteStringToList(str){
    let phrase = str.replace(".","").split(" ");
    for(let j=0; j<phrase.length; j++){
      phrase[j] = parseInt(phrase[j]);
    }
    return phrase;
  }



  // phraseFitsChord()
  //
  // check if this phrase is playable over the specified chord.

  phraseFitsChord(phraseStr,chordNotes){

    // convert phrase string to array
    let phrase = this.noteStringToList(phraseStr);
    let phraseworks = true;

    if(phrase.length<2) phraseworks = false;
    else {
      for(let j=0; j<phrase.length; j++){
        let note = phrase[j];
        // if parse failed ignore note
        if (isString(note)) continue;
        // if chordNotes list doesn't include this note, phrase doesn't fit.
        if(chordNotes.indexOf(note)==-1){
          phraseworks = false;
          break;
        }
      }
    }
    return phraseworks;
  }



  // getSmallestSubdivision()
  //
  // in generateMelodicRhythm().
  // check through a list of phrases and return
  // the "smallest multiple" (musically speaking) of the provided baseSubdivision
  // the half-value of which would fit all the phrases

  getSmallestSubdivision(baseSubdivision, phrases){
    let chosenSubdivision = baseSubdivision;

    phrases.forEach(phrase=>{
      let notes = Zik.noteStringToList(phrase);
      if(notes.length>chosenSubdivision*2) chosenSubdivision *=2;
    });

    return chosenSubdivision;
  }


  // combineBeats()
  //
  // combine and order two lists of beats

  combineBeats(beatList1,beatList2){
    //console.log(beatList1,beatList2)
    let result = beatList1;

    if(beatList2.length>0)
    beatList2.forEach(beat=>{
      let added = false;
      for(let j=0; j<result.length; j++){
        if(!added && beat.time<result[j].time){
          result.splice(j, 0, beat);
          added = true;
          break;
        }
      }
      if(!added) result.push(beat)
    });
    //console.log(result)
    return result;
  }


  // createStructure()
  //
  //

  createStructure(bgmObject,params){

    console.log("Hmmm!! what would Wolfgang Amadeus say?");
    if(params.doublingFactor==undefined) params.doublingFactor = MusicRng.randi(1,4);
    if(params.chanceOfNoChord==undefined) params.chanceOfNoChord = MusicRng.rand(.0,.9);

    let data = this.analyzeHarmony(bgmObject);

    // split into sections
    let sections = this.splitHarmonyIntoSections(data,bgmObject);

    // insert doubles and silences in each section, and even them out
    bgmObject.harmony = this.doubleRandomChords(data,sections,params);
    bgmObject.tuneData = data;
  }

  // analyzeHarmony()
  //
  //

  analyzeHarmony(bgmObject){
    // an object to collect the features we're looking for
    let data = {
      homeKeyEquivalents:[],
      resolvingDominants:[],
      localTonics:[],
      sections:[]
    }
    // roman numeral of final chord is the Home Key
    let hkNumeral = lastListElement(bgmObject.harmony).numeral();

    for(let i=0; i<bgmObject.harmony.length; i++){
      let chord = bgmObject.harmony[i];

      // find instances of the home key or its equivalents
      if(m.numeralIsHomeKey(hkNumeral,chord.numeral())){
        data.homeKeyEquivalents.push(i);
      }

      // check relationship to next chord
      let nextChord = this.getNextChord(i,bgmObject);
      // is this a dominant chord resolving to the next chord?
      if(m.isV7toI(chord,nextChord.chord)){
        data.resolvingDominants.push(i);
        data.localTonics.push(nextChord.index);
      }
    }
    return data;
  }

  getNextChord(i,bgmObject){
    let nextChord = bgmObject.harmony[0];
    let nextChordIndex = 0;
    if(i!=bgmObject.harmony.length-1){
      nextChordIndex = i+1;
      nextChord = bgmObject.harmony[i+1];
    }
    return {
      chord:nextChord,
      index:nextChordIndex
    };
  }


  // splitHarmonyIntoSections()
  //
  //

  splitHarmonyIntoSections(data,bgmObject){
    let sections = [];
    let lastIndex=0;
    data.localTonics.forEach(index=>{
      if(index!=0){
        sections.push(bgmObject.harmony.slice(lastIndex,index));
        lastIndex = index;
      }
      else sections.push(bgmObject.harmony.slice(lastIndex));
    });
    // if we don't have any sections per se
    if(data.localTonics.length==0){
      sections.push(bgmObject.harmony);
    }
    return sections;
  }


  // doubleRandomChords()
  //
  //

  doubleRandomChords(data,sections,params){
    let result = []; // reset harmony since we're about to add sections back in
    sections.forEach(section=>{
      // chance to double first chord
      if(MusicRng.ch(.5)) section.splice(0,0,section[0]);

      // double random chords
      let min = Math.max(params.doublingFactor, flo(section.length/3));
      while(min>0 || section.length%2==1){
        if(MusicRng.ch(.5)){
          let index = MusicRng.randi(section.length);
          section.splice(index,0,section[index]);
        }

        min--;
      }

      // add back to harmony array
      result = result.concat(section);
      data.sections.push(sections);
    });
    return result;
  }


  // for debug
  preAnalyzeChords(tune){

    tune.chordList_relative.trim().split(" ").forEach(chord=>{
      // report error
      if(chord=="") console.log(tune);

      // tally unique chords
      if(!this.AllChords.uniqueChords.includes(chord))
      this.AllChords.uniqueChords.push(chord);

      // tally unique chord colors
      let chordData = Zik.chord.analyzeSymbol(chord);
      if(!this.AllChords.chordColors.includes(chordData.chordColor))
      this.AllChords.chordColors.push(chordData.chordColor);
    });
  }
}

const Zik = new ZikGenerator();
