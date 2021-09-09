// sound.js

// core
let aCtx;
let samp;
let sound=false;

// time
let bars =0;
let head =0;

// improv
let pat;
let scale;
let temperament;
let lastnote = 60;
let improBeat=[8,8,8,8,8,8,16,16,16,16];
let bar = 3800;
let chordfilter;
let chorddetune;
let percfilter=4500;


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
  setTimeout(playbar,bar);
}


// getRhythm()
//
//

let getRhythm=(b,t)=>{

  let r = [];
  let c;
  let count=0;
  temperament = t;

  for(let i=0; i<improBeat.length; i++){
    c = t;
    if(i%2==1) c = 0.4
    if(rand()<c) r.push(count);
    count += b/improBeat[i];
  }

  return r;
}



// getNotePattern()
//
//

let getNotePattern=(rhythm,scalelist)=>{
  let pat = RandomFromArray(patterns);
  let note = flo(rand(7));
  let patcount=0;
  let deg;
  let res ={notes:[],octaves:[]};

  // for each note that will actually get played:
  for(let i=0; i<rhythm.length; i++){
    // this is next scale degree
    deg = note+pat[patcount];
    res.octaves[i]=(3+flo(deg/8))*12;

    while(deg<0) deg += 8;
    res.notes[i]=deg%8;

    // move to next note in the current pattern
    patcount++;
    // remove pattern if end reached
    if(patcount==pat.length-1){
      pat = RandomFromArray(patterns);
      note = deg;
      patcount=0;
    }
  }
  return res;
}







// playBar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = () =>{

  // update chord contents
  temperament = rand(0.2,0.5);

  if(nP){
    bar = nP.barlength;
    chordfilter =nP.cFilter;
    chorddetune = nP.cDetune;
    percfilter=nP.filter;
    scales = nP.scales;
    temperament = nP.temperament;
    if(bars>=nP.scales.length) bars =0;
    scale = scales[bars];

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


    // trigger notes
    let counter =0;
    let pat = nP.pattern;
    if(bars%2==1) pat = nP.pattern2;

    for(let i=0; i<nP.riddim.length; i++){
      if(counter<nP.barlength)
      setTimeout(()=>{

        play(
          2*nToF(pat.octaves[i] + scale[pat.notes[i]%scale.length]),
          0.01,0.1,0.25,0.4,
          5,constSine,
          2,
          'highpass',450,8
        );
      }, counter);
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
      nToF(48+scales[bars-1][0]),
      0.01,0.2,0.6,0.8,
      flo(rand(1,6)),constSineZ,
      3.1,
      'lowpass',percfilter,3
    ),0.4,1);

  chordNote(0);
  chordNote(2);

  // trigger next bar
  setTimeout(playbar,bar);


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

let chordNote=(i)=>
play(nToF(48+scale[i]), 0.1, 1.1, 0.5, 1.5, 6, constSine, 0.65, "highpass", chordfilter, 1, chorddetune)


// startBeat()
//
// play a beat pattern

let startBeat =(beat,sound,min,max,mute1)=>{
  let chance = rand(min,max) * temperament;
  let counter =0;
  for(let i=0; i<beat.length; i++){
    if(!(i==0&&mute1)&&rand()<chance)
    setTimeout(sound,counter);
    counter += bar/beat[i];
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
  let filter = aCtx.createBiquadFilter();
  filter.type = fT;
  filter.frequency.value=fF;
  filter.gain.value = fG;

  source.connect(filter);

  filter.connect(aCtx.destination);
  source.start(0);

}
