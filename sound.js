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
let currentNote=58
let currentPattern;
let currentOctave = 5;
let note0 =0;
let octave0 =5;

let fullmel = [];

let phrase1=[];
let patcount =0;
let melcount =0;
let lastscale = [];

let lastScaleDegree =-1;
let mutemel = true;
let muteimprov = false;
let mutechords = true;
let mutebass = true;
let head =0;

let bassOctave = 3; // 2 and 3 both nice
let scale;
// chord settings


// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aContext = new AudioContext();
  samprate = aContext.sampleRate;
  soundStarted=true;
  setupMel();

  // start beat
  setInterval(playbar,1200);
}


// setupMel()
//
// build the melody array
let setupMel = () =>{
  phrase1 = melodyA.concat(melodyA).concat(melodyB).concat(melodyC);
  fullmel = phrase1.concat(melodyD).concat(phrase1).concat(melodyE)
    .concat(melodyF).concat(melodyG).concat(melodyH).concat(melodyI);
}


// playBar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = () =>{
  // get current scale
  scale = scales[bars];

  // TRIGGER DRUMS

  startBeat([600,400,200],playHats,0.99,1);
  startBeat([400,200,600],playSnare,0.0,0.25);
  // fluttery fx
  startBeat([100,100,100],playCash,.1,.3)

  // TRIGGER BASS

  if(!mutebass)
  startBassNotes([800,200,200],[0,flo(rand(2,4)),6],bassOctave,constSine5);

  // TRIGGER MELODY

  let melPattern = [400,400,400];
  if(bars%4==3) melPattern = [200,600,400]
  startMelNotes(melPattern,5,noisey2);

  // TRIGGER IMPROV LINE

  if(!muteimprov)
  startImprovNotes([200,400,400,200], noisey2, rand((bars%4)/4+0.3));

  // TRIGGER CHORDS

  if(!mutechords)
  setTimeout(()=>{
    chordNote(0);
    chordNote(2);
    chordNote(6);
  }, flo(rand(1.5))*200)

  // increment bars
  bars++;

  // if end of tune reached,
  // reset it:
  if(bars==scales.length){
    bars=0;
    melcount =0;
    head++;
    // play melody once every 3 repetitions
    if(head%3==1) mutemel = false;
    if(head%3==2) mutemel = true;

    // chance to add some detune to melody synth
    glideval = 0.000005 * (head+1) * rand(0.1,0.3);
  }
}

let chordNote=(i)=>
  play(noteToFreq(flo(rand(4,6))*12+scale[i]), 0.1, 1.1, 0.3, 0.3, 4, constSine, 0.15, "lowpass", 4400, 1)


// startImprovNotes()
//
// generate next few notes to play for the improv line

let startImprovNotes=(beat,sound,temperament)=>{
  let counter =0;

  // if scale changed, move the currentNote to the
  // closest scale degree.

  if(scale!=lastscale){
    let data = findClosestNoteInScale(scale);
    note0 = data.note; // remember scale degree
    currentNote = data.octave*12+data.note;
    if(currentNote<40) currentNote +=12
    currentOctave = data.octave;
  }

  // for each note in the rhythm pattern,
  // there is a chance of actually playing a note

  let intervals = [];
  for(let i=0; i<beat.length; i++){
    if(rand()<temperament) intervals.push(counter);
    counter += beat[i];
  }

  // remember current scale to check for changes later
  lastscale = scale;

  // for each note that will actually get played:
  for(let i=0; i<intervals.length; i++){
    setTimeout(()=>{

      // define pattern if we need a new one
      if(currentPattern==undefined){
        currentPattern = Array.from(RandomFromArray(patterns));

        // reverse pattern randomly but not if current note
        // is kinda low. higher chance to reverse the higher up we are.
        // at a certain point, reverse is certain.
        if((!currentNote<68) &&
        (currentNote>86||rand()< Math.min(0.7,currentNote / 64 - 0.2)))
        currentPattern = currentPattern.reverse();
        patcount=0;
      }

      // this is next scale degree
      let scaledegree = (note0+currentPattern[patcount])%scale.length;
      // this is next note
      currentNote = currentOctave*12 + scale[scaledegree]

      lastScaleDegree = scaledegree;

      // check for any issues,
      // then play note if all is good.
      if(!isNaN(currentNote))
        playNoiseySynth(noteToFreq(currentNote), intervals[i]);

      // move to next note in the current pattern
      patcount++;
      // remove pattern if end reached
      if(patcount==currentPattern.length-1) currentPattern = undefined;

    },intervals[i]);

  }
}


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
    if(octave==8) return {note:0,octave:defoctave}
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
    counter += beat[i]
  }
}


// startBassNotes()
//
// trigger bass notes for a given bar

let startBassNotes = (beat,notes,octave,sound)=>{
  let counter =0;
  for(let i=0; i<beat.length; i++){
    setTimeout(playWobbleBass,counter,noteToFreq(octave*12 + scale[notes[i]]))
    counter += beat[i];
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

let startBeat =(beat,sound,min,max)=>{
  let chance = rand(min,max);
  let counter =0;
  for(let i=0; i<beat.length; i++){
    if(rand()<chance)
    setTimeout(sound,counter);
    counter += beat[i];
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

let soundCheck=()=>{
  playSnare()
}



// **** SOUNDS ******



// playsnare()
//
let snarerelease=0.3;
let playSnare=()=>
  play( 10, 0.02,0.01,0.4,snarerelease , 4,noisey2,6,'highpass',1200,4);

// playcash()
// modified cash sound from original code,
// more like a wierd percussive thing now
let cash2timeout;
let playCash=()=>{
  perc();
  if(rand()>.5){
    clearTimeout(cash2timeout);
    cash2timeout=setTimeout(()=>{
      perc();
    }, 260);
  }
}

let perc=()=>play(noteToFreq(36+scales[bars-1][0]), 0.01,0.2,0.3,0.1, 5,constSineZ,2.1,'highpass',500,3);

// play a ride / hi hat sound
let playHats=()=>
  play(40,0.01,0.01,0.35,0.6,40,noisey,24,'highpass',7400,2);

// this is for playing the bass notes
let playWobbleBass=(freq)=>
  play(freq,.05,0.11,0.1,1.11, 4,constSine4,8.6,'lowpass',1600,20); // adjust filter freq value 200-1000 to get nice dub fx

// function for playing the improv notes
let playNoiseySynth=(freq, l)=>
  play( freq,0.04,0.4,0.3,Math.max(l*0.006,0.3), 5,constSine4,1.5,'highpass',450,2);

// glide value for playNoiseySynthog
let glideval = 0.00001;

// function for playing the melody notes
let playNoiseySynthog=(freq)=>
  play( freq,0.04,0.31,0.2,1.2, 1,constSine4,2.8,'highpass',650,14,+glideval);



//  ****** MATH that generates sounds ********



// synth used in playhop2 and playcash
let constSineZ=(i,dividor)=>
constrain(rand(0.1)+0.8*(Math.sin(i / (0.2*i+dividor))),0,0.60);

// synth used in hats
let noisey=(i,dividor)=>rand(0.02);

// synth sound used in melody notes, improv notes and snare lol
let noisey2=(i,dividor)=> rand(constrain(Math.round(Math.sin(i / (i+dividor))),0,0.130));

// synth used in chords
let constSine=(i,dividor)=>
constrain(Math.sin(i / dividor),-0.8,0.8);

// used in thunder and bass
let constSine5=(i,dividor)=>
constrain(rand(0.2)*(Math.sin(i / dividor)+Math.sin(i / (1000+dividor))),0,0.10);

// synth used in wobble bass and noisey synth and noiseysynth og
let sine4fact=0.8;
let constSine4=(i,dividor)=>
constrain(rand(0.1,0.3)*sine4fact+0.3*(Math.sin(i / dividor)+0.3*Math.sin(i / (2+dividor))),0,0.10);



//let sine4counter=0;

// used in playhop
//let wubfact2=200;
//let constSine2=(i,dividor)=>
//constrain(0.5*(Math.sin(i / dividor)+Math.sin(i / (wubfact2+dividor))),0,0.10);

// used in damage sfx
//let constSine3=(i,dividor)=>
//constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (100+dividor))),0,0.10);

//let constSineB=(i,dividor)=>
//constrain(Math.round(Math.sin(i / (dividor+i/100))),0,0.10);

//let constSineB2=(i,dividor)=>
//constrain(Math.round(Math.sin(i / (dividor+i/1000))),0,0.10);

//let playHop=(fact)=>
//play(fact,0.01,0.11,0.3,0.31,10,constSine2,8,'highpass',500,2,-0.001);

//let playHop2=()=>
//play( 200,0.01,0.11,0.3,0.31,200,constSineZ,9,'highshelf',1500,2);

// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
//let playBlaster=(factor,vol)=>
//play( factor, 0.01,0.11,0.3,0.25, 100,constSineB2 ,vol,'highpass',1080,8);

//let playDamageFX=()=>
//play( 20, 0.01,0.11,0.3,0.31, 60+randInt(20),constSine3 ,14,'highshelf',1500,2);

//let playThunder=()=>
//play( 15+randInt(85), 0.3,0.61,0.3,2.81, 20+randInt(50),constSine5 ,4,'lowpass',300+randInt(2200),2);
