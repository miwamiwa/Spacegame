let startPlanetBGM=(p)=>{

  p.bgm.reset();
  currentBGM = p.bgm;
  Impro.initializeMelody(currentBGM);
  Impro.initializeImprov();
  clearTimeout(musicTimeout);
  musicTimeout = setTimeout(playbar,currentBGM.barLength)

    //playbar(time);
  console.log("bgm started")
}

let endPlanetBGM=(p)=>{
  if(nP.bgm!=undefined) nP.bgm.reset();
  currentPattern=undefined;
  Impro.initializeImprov();

  if(p.resetMelodyOnNextVisit){
    nP.resetMelodyOnNextVisit=false;
    nP.getMusicSeed();
    nP.setupMusic(!nP.special && nP.tribe==undefined)
  }
}



// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{
  if(!SoundEnabled) return;

  // setup audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aCtx = new AudioContext();
  samp = aCtx.sampleRate;
  sound=true;

}

let musicTimeout;



let playChordNotes=(notes,length,roll,moment)=>{
  if(ch(0.5)){
    actualyPlayChord(notes,moment,length,0);
  }
  else if(ch(0.5)){
    actualyPlayChord(notes,moment,length*0.2,0);
  }
  //else if(ch(0.5)){
    //actualyPlayChord(notes,moment,length,0.1);
  //}
  else {
    actualyPlayChord(notes,moment,length*0.7,0);
    actualyPlayChord(notes,moment+0.72,length*0.25,0);
  }
}

let actualyPlayChord=(notes,time,length,roll)=>{
  playBassNote(notes[0]%m.Octave + 3*m.Octave, length * currentBGM.barLength)
  for(let i=0; i<notes.length; i++) setTimeout(()=>{playNote(notes[i] + randomVoicing(), length * currentBGM.barLength,true)},roll*i*currentBGM.barLength);
}




let playNote=(num,length,isChord)=>{
  length /=2000;
  //console.log(num,length,isChord);
  //return;
  //console.log(num,length)
  length = Math.abs(length)
  length = Math.max(0.1,length)

  //console.log(nToF(num))
  if(isChord){
    playOrgan(
      nToF(24+num),
      0.05, 1.4*length, 0.8, .5*length,
      2, constSine1,
      2.2 - length / 2 - Math.pow((num)/48,2),
      'lowpass',8600,1
    );
  }
  else {
  //  length = 0.2
    playOrgan(
      nToF(12+num),
      0.05, 1.4*length, 0.7, .5*length,
      2, siney,
      Math.max(2, 3.9 - length / 2 - Math.pow((num)/48,2)),
      'lowpass',12200,1
    );
  }
}




let playBassNote=(num,length)=>{
  length /=2000;
  //console.log(num,length,isChord);
  //return;
  //console.log(num,length)
  length = Math.abs(length)

  if(ch(0.3)){
    play(
      nToF(num),
      0.1*length, 0.8*length, 0.3, 2.6*length,
      2, noisey2,
      1.8,
      'lowpass',2000,1
    );
  }
  else {
    play(
      nToF(num),
      0.1*length, 0.8*length, 0.3*length, 2.6*length,
      2, constSine3,
      1.8,
      'lowpass',2000,1
    );
  }


  if(ch(.25)) setTimeout(()=>{playBassNote(num,length*1000)}, currentBGM.barLength * .75);
}
/*
let playNote=(num,length,isChord,time)=>{
  console.log(length)
  noteSynth.triggerAttackRelease(
    toToneFormat(num), length*2, time);
}
*/

// playbar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = (time) =>{

  // WHILE ON PLANET
  //console.log("play bar.." + nP.bgm.barCounter)
  if(nP){
    //if(nP.isBarren){
      //playBarrenPlanetMusic(time);
      //spaceyRhythm();
    //}
    ///else
    playJazzMusic(time);
  }

  // WHILE IN SPACE
  else {
    spaceMusic.t = rand(0.2,0.5);
    setScale(spaceMusic);
  }

  // trigger next bar
  //if(nP&&!nP.isBarren) setTimeout(playbar,nP.jazz.barLength);
  //else setTimeout(playbar,mu.barlength);

  // update TIME:
  bars++;

  // if end of tune reached
  backToTop();

  musicTimeout = setTimeout(playbar,currentBGM.barLength)
}



let spaceyRhythm=()=>{

  console.log("spacey rhythm!")
  return;

  // bass drum
  startBeat(
    [4,4,4,4],
    ()=>playDrumSound(),1,1,false
  );

  // snare
  startBeat(
    [4,2.7,8.2,16,16],
    ()=>playDrumSound(),0.88,1,true
  );

  // bass
  startBeat(
    [2,5.29,16,16,16],
    ()=>playDrumSound(),0.4,1
  );
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
  if(mu&&bars>=mu.scales.length){
    bars=0;
    melcount =0;
  }
}



//  ****** Sound generation ********
//
//

let organWaveAt=(sampleNumber,transpose)=>{

  let t = sampleNumber/aCtx.sampleRate;
  let result=0;
  transpose /= 1024;
  for(let i=0; i<organ.length; i++){
    result += organ[i].a * Math.cos( 2*Math.PI*transpose*organ[i].f*t+organ[i].p );
  }
  return result;
}

let playOrgan=(f,a,d,s,r,c,fu,v,ft,ff,fq,sl)=>
playSound(preloadOrganSound(
  f,new Envelope(a,d,s,r),c,fu,sl
),v,ft,ff,fq);


let preloadOrganSound=(f,env,cycles,func,sli)=>{
  //console.log(f)
  func = organWaveAt;
  let res = [];
  let pre = [];
  let len = samp * ( env.a+env.d+env.r );
  let per = samp / f;
  let preL = flo(per)*cycles; // len of prebuffer in samples
  let div = per / TWO_PI;
  let i=0;
  let tone = f;
  // if this isn't a sliding sound:

  if(!sli){
    // prebuffer a given number of cycles
    for(i=0; i<preL; i++)
    pre[i]= func(i,tone);

    // then repeat those over the full len of the note
    for (i = 0; i < len; i++)
    res[i] = 0.4* env.level(i) * pre[i%preL];
  }

  // if this is a sliding sound:

  // buffer the entire note
  else{
    for (i = 0; i < len; i++)
    res[i] = 0.4* env.level(i) * func(i,tone + i*sli);
  }


  return res;
}



// sin of a value at index i in the sample buffer.
let sine=(i,a,d)=>Math.sin(i/(a+d));

let sine2=(i,a,d)=>Math.floor(0.5+1.5*Math.sin(i/(a+d)));

let tanwavee=(i,a,d)=>Math.tan(i/(a+d));

let siney=(i,d)=>constrain(sine(i,0,d)*0.5,-0.3,0.3)

let constSine1=(i,d)=>
constrain( tanwavee(i,0,d),-0.1,0.1);

let constSine2=(i,d)=>
constrain( squarewave(i,d),-0.15,0.1);

let constSine3=(i,d)=>
constrain( sine(i,0,d)+sine(i*0.925,0,d)+rand(-.2,.2),-0.2,0.2);

let squarewave=(i,d)=>
  constrain(
    flo(sine(i,0,d)+1)-0.5,
    -0.2,0.2
  );

// synth used in playhop2 and playcash
let constSineZ=(i,d)=>0.2*sine(i,i,d)+0.2*sine(2*i,i,d)+0.2*sine(4*i,i,d)

// synth used in hats
let noisey=(i,d)=>rand(0.02);

// synth sound used in melody notes, improv notes and snare lol
let noisey2=(i,d)=> rand(constrain(Math.round(sine(i,i,d)),0,0.130));

// synth used in chords
let constSine=(i,d)=>
constrain( sine(i,0,d),-0.1,0.1);

let randomVoicing=()=>randi(-1,1)*12;

// synth used in wobble bass and noisey synth and noiseysynth og
let constSine4=(i,d)=>
constrain(rand(0.1,0.2)+0.3*(sine(i,0,d)+0.3*sine(i,2,d)),0,0.10);

// harmonics for the organ sound (freq,amplitude,phase)
let organ= [
  {f:499.98 ,a:0.05024,p:-79.26},
  {f:989.78, a:0.01608,p:10.89},
  {f:1489.66,a:0.02179,p:-13.22},
  {f:1989.55,a:0.03411,p:-30.97},
  {f:2489.44,a:0.01904,p:156.26},
  {f:2989.32,a:0.03099,p:-54.57},
  {f:3469.21,a:0.00796,p:-49.46},
  {f:3979.10,a:0.01728,p:-129.91},
];




// chordNote()
//
// play the chord synth

let chordNote=(i)=>{
  if(!nP) return;
  let s=constSine;
  let filt=0.8;
  let o=randi(-1,1)*12;
  if(nP.m.cType==1){
    filt=1;
    s=constSine2;
  }
  play(
    nToF(48+o+scale[i]),
    1.4, 1.5, 0.6, nP.m.barlength/3000,
    6, s,
    0.85,
    "lowpass", filt*rand(0.9,1,1)*mu.cF, 1,
    mu.cDetune
  );
}


// startBeat()
//
// play a beat pattern

let startBeat =(beat,sound,min,max,mute1)=>{
  let chance = .8*rand(min,max) * mu.t;
  if(nP&&!nP.isBarren) chance = .8*rand(min,max) * .5;
  let c =0;
  for(let i=0; i<beat.length; i++){
    if(!(i==0&&mute1)&&rand()<chance) setTimeout(sound,c);
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


let playHat=(intensity)=>{
  play(
    100,0.01,0.1,intensity,0.5,
    4,noisey2,2,"highpass",4000,1)
}


// preloadSound()
//
// generate a sound buffer

let preloadSound=(f,env,cycles,func,sli)=>{
  //console.log(f)
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
