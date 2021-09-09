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
let aCtx;
let samp;
let sound=false;
let mu; // current soundtrack settings

// time
let bars =0;

// improv
let pat;
let scale;



// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{
  //  return
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aCtx = new AudioContext();
  samp = aCtx.sampleRate;
  sound=true;

  // start beat
  playbar();
}






// playbar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = () =>{

  // WHILE ON PLANET

  if(nP){

    setScale(nP.m);

    // hats
    startBeat(
      [16,16,8,16,16,16,16,16,16,16,16,16],
      ()=>play(
        40,
        0.01,0.01,0.25,rand(0.1,0.7),
        40,noisey,
        rand(18,24),
        'highpass',roughly(1000),2
      ),0.92,1,true
    );


    // trigger melody notes
    playImprov();


  }

  // WHILE IN SPACE

  else {
    spaceMusic.t = rand(0.2,0.5);
    setScale(spaceMusic);
  }

  // bass drum
  startBeat(
    [4,2.7,17,17],
    ()=>play(
      800,
      0.04,0.11,0.6,0.06,
      2,constSine4,
      18,
      'lowpass',1250,
      14,0.01
    ),1,1,false
  );

  // snare
  startBeat(
    [4,2.7,8.2,16,16],
    ()=>play(
    10, // (freq)
    0.015,0.01,0.4,rand(0.1,0.2), // adsr
    2, // buffer cycles
    noisey2, // sound
    16, // vol
    'highpass',1200,1
  ),0.88,1,true);

  // bass
  startBeat(
    [2,5.29,16,16,16],
    ()=>play(
      nToF(48+mu.scales[bars][0]),
      0.01,0.2,0.6,0.8,
      flo(rand(1,6)),constSineZ,
      3.1,
      'lowpass',mu.pF,3
    ),0.4,1);

  chordNote(0);
  chordNote(2);

  // trigger next bar
  setTimeout(playbar,mu.barlength);


  // update TIME:
  bars++;

  // if end of tune reached
  backToTop();
}



let setScale=(m)=>{
  mu=m;
  backToTop();
  scale = m.scales[bars];
}


// backToTop()
//
// reset tune if over
let backToTop=()=>{
  if(bars>=mu.scales.length){
    bars=0;
    melcount =0;
  }
}



//  ****** Sound generation ********
//
//

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

// synth used in wobble bass and noisey synth and noiseysynth og
let constSine4=(i,d)=>
constrain(rand(0.1,0.2)+0.3*(sine(i,0,d)+0.3*sine(i,2,d)),0,0.10);


// chordNote()
//
// play the chord synth

let chordNote=(i)=>play(
  nToF(48+scale[i]),
  0.1, 1.1, 0.5, 1.5,
  6, constSine,
  0.65,
  "highpass", mu.cF, 1,
  mu.cDetune
);


// startBeat()
//
// play a beat pattern

let startBeat =(beat,sound,min,max,mute1)=>{
  let chance = rand(min,max) * mu.t;
  let c =0;
  for(let i=0; i<beat.length; i++){
    if(!(i==0&&mute1)&&rand()<chance)
    setTimeout(sound,c);
    c += mu.barlength/beat[i];
  }
}






// nToF()
//
// convert midi note number to frequency

let nToF=(note)=> (440 / 32) * (2 ** ((note - 9) / 12));




// play()
//
// play a synth note
// args: frequency (freq), envelope (a,d,s,r),
// buffer length (a short sample is buffered and copied to fill
// the entire note duration), sound-generating-function (func),
// volume (vol), filter (ftype,ffreq,fq) and slide factor (optional, "slide")

let play=(f,a,d,s,r,c,fu,v,ft,ff,fq,sl)=>
  playSound(preloadSound(
    f,new Envelope(a,d,s,r),c,fu,sl
  ),v,ft,ff,fq);





// preloadSound()
//
// generate a sound buffer

let preloadSound=(f,env,cycles,func,sli)=>{

  let res = [];
  let pre = [];
  let len = samp * ( env.a+env.d+env.r );
  let per = samp / f;
  let preL = flo(per)*cycles; // len of prebuffer in samples
  let div = per / TWO_PI;
  let i=0;
  // if this isn't a sliding sound:

  if(!sli){
    // prebuffer a given number of cycles
    for(i=0; i<preL; i++)
    pre[i]= func(i,div);

    // then repeat those over the full len of the note
    for (i = 0; i < len; i++)
    res[i] = 0.4* env.level(i) * pre[i%preL];
  }

  // if this is a sliding sound:

  // buffer the entire note
  else{
    for (i = 0; i < len; i++)
    res[i] = 0.4* env.level(i) * func(i,div+i*sli);
  }


  return res;
}


// preloadsound()
//
// creates a sound buffer array
// f: frequency,
// cycles: how many cycles to prebuffer
// envelope: envelope to apply, func: sound generating function
// sli: optional, factor by which to slide the note



let playSound=(arr,vol,fT,fF,fG)=>{

  let buf = new Float32Array(arr.length)
  for (var i = 0; i < arr.length; i++) buf[i] = vol*arr[i]
  let buffer = aCtx.createBuffer(1, buf.length, samp)
  buffer.copyToChannel(buf, 0)
  let source = aCtx.createBufferSource();
  source.buffer = buffer;
  let f = aCtx.createBiquadFilter();
  f.type = fT;
  f.frequency.value=fF;
  f.gain.value = fG;

  source.connect(f);

  f.connect(aCtx.destination);
  source.start(0);

}
