// audio functions grabbed from my last js13k project

class Envelope{

  constructor(a,d,s,r){
    this.a=a;
    this.d=d;
    this.r=r;

    this.s=s;
    this.aS=a*samprate; // attack length in samples
    this.dS=d*samprate; // decay length in samples
    this.rS=r*samprate; // release length in samples
    this.rT=this.aS+this.dS; // release time is attack + decay
  }
  // return envelope level at given time point
  level(i){
    // if during attack
    if(i<this.aS) return i/this.aS;
    // if during decay
    else if(i<this.rT) return 1 - (1-this.s) * (i-this.aS)/this.dS;
    // if during release
    else return this.s*( 1 - (i-this.rT)/this.rS );
  }
}

let aContext;
let samprate;
let soundStarted=false;
let bars =0;

// improv
let currentPattern;

let mutemel = false;
let muteimprov = false;
let head =0;

let bassOctave = 3; // 2 and 3 both nice
let scale;

let temperament;

let lastnote = 60;
let improBeat=[8,8,8,8,8,8,16,16,16,16]
// chord settings

let bar = 3800;
// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{
  //  return
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aContext = new AudioContext();
  samprate = aContext.sampleRate;
  soundStarted=true;

  // start beat
  setTimeout(()=>{
    if(nP)
    bar = nP.barlength;
    setTimeout(playbar,bar);
  }, 500)

}




let getRhythm=(barlength,t)=>{
  temperament = t;
  let r = [];

  let counter=0;
  for(let i=0; i<improBeat.length; i++){
    let c = t;
    if(i%2==1) c = 0.4
    if(rand()<c) r.push(counter);
    counter += barlength/improBeat[i];
  }

  return r;
}





let getNotePattern=(rhythm,scalelist)=>{
  let currentPattern;
  let currentNote = flo(rand(7));
  let patcount=0;
  lastscale = scale;

  let notes=[];
  let octaves=[];

  // for each note that will actually get played:
  for(let i=0; i<rhythm.length; i++){
    // define pattern if we need a new one
    if(!currentPattern){
      currentPattern = RandomFromArray(patterns);
      patcount=0;
    }
    // this is next scale degree
    let scaledegree = currentNote+currentPattern[patcount];
    octaves.push((3+flo(scaledegree/8))*12);

    while(scaledegree<0) scaledegree += 8;
    notes.push(scaledegree%8);

    // move to next note in the current pattern
    patcount++;
    // remove pattern if end reached
    if(patcount==currentPattern.length-1){
      currentPattern = undefined;
      currentNote = scaledegree;
    }
  }
  return {notes:notes,octaves:octaves}
}







// playBar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = () =>{
  // get current scale


  // TRIGGER DRUMS



  // bass drum
  startBeat([4,2.7,17,17],playNoiseySynthog,1,1,false);

  // snare
  startBeat(
    [4,2.7,8.2,16,16],
    playSnare,0.88,1,true
  );


  // update chord contents
  temperament = rand(0.2,0.5);

  if(nP){
    chordfilter =nP.cFilter;
    chorddetune = nP.cDetune;
    percfilter=nP.filter;
    // hats
    startBeat(
      [16,16,8,16,16,16,16,16,16,16,16,16,16],
      playHats,0.92,1,true
    );

    console.log("playing notes")
    bar = nP.barlength;
    scales = nP.scales;
    if(bars>=nP.scales.length) bars =0;

    scale = scales[bars];
    // trigger notes
    let counter =0;

    for(let i=0; i<nP.riddim.length; i++){
      if(counter<nP.barlength&&i>0)
      setTimeout(()=>{
        let pat = nP.pattern;
        if(bars%2==1) pat = nP.pattern2;

        let scaledegree = pat.notes[i]%scale.length;
        // this is next note
        let f = noteToFreq(pat.octaves[i] + scale[scaledegree]);
        //console.log(scaledegree);
        //console.log(scale.length)
        //console.log(f)
        if(!isNaN(f))
        playNoiseySynth(f, nP.riddim[i]);
      }, counter)
      counter+=nP.riddim[i];

    }

  }
  else {

    chordfilter =20000;
    chorddetune = 0.000006;
    percfilter=3500;
    scales = defaultScales;
    if(bars>=defaultScales.length) bars =0;
    scale = scales[bars];


  }


  setTimeout(playbar,bar);
  //startBeat([8,8,4,4,8,8],playKik,0.3,0.5,false);





  // bassy synth
  startBeat(
    [2,5.29,16,16,16],
    perc,0.4,1
  );

// TRIGGER CHORDS

chordNote(0);
chordNote(2);



  // update TIME:


  // increment bars
  bars++;

  // if end of tune reached
  if(bars>=scales.length){
    bars=0;
    melcount =0;
    head++;
  }
}
let chordfilter =400;
let chorddetune = 0.000002;


let chordNote=(i)=>
play(noteToFreq(48+scale[i]), 0.1, 1.1, 0.5, 1.5, 6, constSine, 0.65, "highpass", chordfilter, 1, chorddetune)



// findClosestNoteInScale()
//
//

let findClosestNoteInScale=(sca)=>{
  let octave = 4;
  let note = currentNote;
  let found =999;
  let res = 99;
  while(res>3){
    for(let i=0; i<sca.length; i++){
      let note2 = sca[i] + octave * 12;
      res = abs(note2-note);
      if(res<abs(found-note)) found = note2;

      if(res<=2){
        return {note:i,octave:octave}
      }
    }
    octave++;
    // if too high, abort
    if(octave==6) return {note:0,octave:defoctave}
  }

  return {note:0,octave:defoctave}
}


// startMelnotes()
//
// Trigger melody notes for the current bar

let startMelNotes=(beat,octave,sound)=>{
  let counter =0;
  // there's always 3
  for(let i=0; i<3; i++){
    if(melcount<fullmel.length){
      // trigger individual notes
      setTimeout(()=>{

        if(fullmel[melcount]!=false){

          if(!mutemel)
          playNoiseySynthog(noteToFreq(octave*12+fullmel[melcount]));
        }
        // increment melody count
        melcount++;
      },counter);
    }
    counter += bar/beat[i]
  }
}


// startBassNotes()
//
// trigger bass notes for a given bar

let startBassNotes = (beat,notes,octave,sound)=>{
  let counter =0;
  for(let i=0; i<beat.length; i++){
    setTimeout(playWobbleBass,counter,noteToFreq(octave*12 + scale[notes[i]]))
    counter += bar/beat[i];
  }
}

// noteToFreq()
//
// convert midi note number to frequency

let noteToFreq=(note)=> (440 / 32) * (2 ** ((note - 9) / 12));

// play()
//
// big bulky function that buffers and plays a synth note.
// args: frequency (freq), envelope (a,d,s,r),
// buffer length (a short sample is buffered and copied to fill
// the entire note duration), sound-generating-function (func),
// volume (vol), filter (ftype,ffreq,fq) and slide factor (optional, "slide")

let play=(freq,a,d,s,r,cycles,func,vol,ftype,ffreq,fq,slide)=>{
  playSound(preloadSound(
    freq,
    new Envelope(a,d,s,r),
    cycles,func,slide
  ),vol,ftype,ffreq,fq);
}




// startBeat()
//
// play the provided sound with the provided beat pattern,
// and chance of playing each note.
// used to play hats and snare.

let startBeat =(beat,sound,min,max,mute1)=>{
  let chance = rand(min,max) * temperament;
  let counter =0;
  for(let i=0; i<beat.length; i++){
    if(!(i==0&&mute1)&&rand()<chance)
    setTimeout(sound,counter);
    counter += bar/beat[i];
  }
}

// preloadSound()
//
// generate a sound buffer

let preloadSound=(f,envelope,cycles,func,sliding)=>{

  let result = [];
  let prebuffer = [];
  let length = samprate * ( envelope.a+envelope.d+envelope.r );
  let period = samprate / f;
  let preBuffL = flo(period)*cycles; // length of prebuffer in samples
  let dividor = period / TWO_PI;

  // if this isn't a sliding sound:

  if(sliding==undefined){
    // prebuffer a given number of cycles
    for(let i=0; i<preBuffL; i++)
    prebuffer.push( func(i,dividor) );

    // then repeat those over the full length of the note
    for (let i = 0; i < length; i++)
    result[i] = 0.4* envelope.level(i) * prebuffer[i%preBuffL];
  }

  // if this is a sliding sound:

  // buffer the entire note
  else{
    for (let i = 0; i < length; i++)
    result[i] = 0.4* envelope.level(i) * func(i,dividor+i*sliding);
  }


  return result;
}

// preloadsound()
//
// creates a sound buffer array
// f: frequency,
// cycles: how many cycles to prebuffer
// envelope: envelope to apply, func: sound generating function
// sliding: optional, factor by which to slide the note



let playSound=(arr,vol,filterT,filterF,filterG)=>{

  let buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = vol*arr[i]
  let buffer = aContext.createBuffer(1, buf.length, samprate)
  buffer.copyToChannel(buf, 0)
  let source = aContext.createBufferSource();
  source.buffer = buffer;
  let filter = aContext.createBiquadFilter();
  filter.type = filterT;
  filter.frequency.value=filterF;
  filter.gain.value = filterG;

  source.connect(filter);

  filter.connect(aContext.destination);
  source.start(0);


}



// **** SOUNDS ******



// playsnare()
//

let playSnare=()=>
play( 10, // (freq)
  0.015,0.01,0.4,rand(0.1,0.2), // adsr
  2, // buffer cycles
  noisey2, // sound
  16, // vol
  'highpass',1200,1); // filter


  let playKik=()=>
  play( 100, // (freq)
    0.02,0.11,0.2,0.2, // adsr
    10, // buffer cycles
    noisey2, // sound
    0.4, // vol
    'highpass',210,4
  ); // filter


  // playcash()
  // modified cash sound from original code,
  // more like a wierd percussive thing now

  let percfilter=4500;
  let perc=()=>play(noteToFreq(48+scales[bars-1][0]), 0.01,0.2,0.6,0.8, flo(rand(1,6)),constSineZ,3.1,'lowpass',percfilter,3);

  // play a ride / hi hat sound
  let playHats=()=>
  play(40,0.01,0.01,0.25,rand(0.1,0.7),40,noisey,rand(18,24),'highpass',roughly(1000),2);

  // this is for playing the bass notes
  let playWobbleBass=(freq)=>
  play(
    freq,
    .05,0.21,0.2,0.21,
    8,constSine4,
    9,
    'lowpass',1200,2,
    0.0001); // adjust filter freq value 200-1000 to get nice dub fx

    // function for playing the improv notes
    let playNoiseySynth=(freq, l)=>
    play( 2*freq,0.01,0.1,0.25,0.4, 5,constSine,2,'highpass',450,8);

    // glide value for playNoiseySynthog
    let glideval = 0.00001;

    // function for playing the melody notes
    let playNoiseySynthog=(freq)=>
    play( 800,
      0.04,0.11,0.6,0.06,
      2,constSine4,
      18,
      'lowpass',1250,
      14,0.01);



      //  ****** MATH that generates sounds ********

      // sin of a value at index i in the sample buffer.
      let sine=(i,a,d)=>Math.sin(i/(a+d));

      // synth used in playhop2 and playcash
      let constSineZ=(i,d)=>0.2*sine(i,i,d)+0.2*sine(2*i,i,d)+0.2*sine(4*i,i,d)

      // synth used in hats
      let noisey=(i,d)=>rand(0.02);

      // synth sound used in melody notes, improv notes and snare lol
      let noisey2=(i,d)=> rand(constrain(Math.round(sine(i,i,d)),0,0.130));

      // synth used in chords
      let constSine=(i,d)=>
      constrain( sine(i,0,d),-0.2,0.2);

      // used in thunder and bass
      let constSine5=(i,d)=>
      constrain(rand(0.2)*(sine(i,0,d) + sine(i,1000,d)),0,0.10);

      // synth used in wobble bass and noisey synth and noiseysynth og
      let sine4fact=0.8;
      let constSine4=(i,d)=>
      constrain(rand(0.1,0.2)+0.3*(sine(i,0,d)+0.3*sine(i,2,d)),0,0.10);
