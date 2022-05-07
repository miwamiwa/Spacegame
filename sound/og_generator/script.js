const defaultScales = [
  [0,1,3,4,6,7,9,10]
]

// sound.js
let spaceMusic={
  barlength:3800,
  pF:4500,
  cF:20000,
  cDetune:0.000006,
  scales:defaultScales,
  t:0.2
};

// core
let samp;
let sound=false;
let mu; // current soundtrack settings

// time
let bars =0;

// improv
let pat;
let scale;




let playBarrenPlanetMusic=()=>{

  console.log("barren music")

  setScale(nP.m);

  // hats
  startBeat(
    [8,8,8,8,8,8,8,8],
    ()=>playDrumSound(),.92,1,true
  );


  // trigger melody notes
  playImprov();

  // play chords

  let now = Tone.now()

  let octave = 48;
  let notes = [
    toToneFormat(octave + randomVoicing() + scale[0]),
    toToneFormat(octave + randomVoicing() + scale[2]),
    toToneFormat(octave + randomVoicing() + scale[scale.length-1])
  ];
  console.log(notes)
  setTimeout(()=>{
    playChordNotes(notes, 4, 0.2, now);
  },mu.barlength/2);

  playChordNotes(notes, 4, 0.2, now);

}
