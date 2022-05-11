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
  // trigger melody notes
  playImprov();

  let octave = 48;
  let notes = [
    (octave + randomVoicing() + scale[0]),
    (octave + randomVoicing() + scale[2]),
    (octave + randomVoicing() + scale[scale.length-1])
  ];
  console.log(notes)


  playChordNotes(notes, 1, 0.8);//, now);

}
