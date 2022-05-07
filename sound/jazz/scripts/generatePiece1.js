// generatePiece #1
//
// this generation method combines notes and chords before
// loading them in the markov object, so that chords and notes
// also get generated together. The expectation is that melodies
// end up a bit less diverse than in generatePiece2, but hopefully
// more melodic and with nice chord resolutions.

let generatePiece=(bgmObject, params)=>{

  // setup parameters
  if(params.harmonicFidelity==undefined) params.harmonicFidelity = 2;

  // setup markov object
  let combinedMarkov = new RiMarkov(params.harmonicFidelity,true,false);

  // load tunes, combining notes and chords
  Zik.preloadTunes(Tunes2,combinedMarkov,"combine");

  let data = Zik.generateFromCombinedData(combinedMarkov,bgmObject);

  bgmObject.harmony = data.chords;
  bgmObject.melodicPhrases = data.phrases;
  bgmObject.longestPhrase = data.longestPhrase;

  let subdivision = chooseBetween([3,4]);
  Zik.generateMelodicRhythm(data.phrases,subdivision,bgmObject);
  // done!
}
