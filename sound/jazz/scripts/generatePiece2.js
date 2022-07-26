
// generatePiece2()
//
// generate a piece!
// First harmony with a markov object,
// then generate melody independently with another markov object

// params list (all are optional):

// params.harmonicFidelity
// params.melodicFidelity
// params.minHarmonyLength
// params.maxHarmonyLength
// params.minMelodyPerChord
// params.maxMelodyPerChord
// params.chanceToDupeSameChord
// params.chanceToDupeSamePattern
// params.dupeChanceDecay


let generatePiece2=(bgmObject, params)=>{

  bgmObject.harmony = [];
  bgmObject.melody = [];

  // generate harmonic content
  let harmonydata = Zik.generateChordList(bgmObject, params);

  // generate melodic content
  let phrases = Zik.generateMelodyOverChordList(harmonydata.chordList,params,bgmObject,harmonydata.allNotes);
  if(phrases="stop") return;

  // generate melodic rhythm
  let subdivision = chooseBetween([3,4]);
  Zik.generateMelodicRhythm(phrases,2,bgmObject);

  // done!
}
