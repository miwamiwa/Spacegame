// sound scripts grabbed from my last js13k project

let aContext;
let samprate;
let soundStarted=false;


// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aContext = new AudioContext();
  samprate = aContext.sampleRate;
  soundStarted=true;
  setupMel();
  startBeatMachine();
}

//let hatchance = 0.4;

let startBeatMachine = ()=>{

  setInterval(playbar,1200);
}

let bars =0;

// improv
let currentNote=58
let currentPattern;
let currentOctave = 5;
let note0 =0;
let octave0 =5;


const Edorian = [4,6,7,9,11,13,14];
const FshPhrygi = [6,7,9,11,13,14,16];
const CLydian = [0,2,4,6,7,9,11];
const ADorian = [9,11,13,14,16,18,19];
const DMixo = [2,4,6,7,9,11,12];
const GLydian = [7,9,11,13,14,16,18];
const Fmin7flat5 = [6,7,9,11,12,14,16];
const BMixo = [11,13,15,16,18,20,21];
const Emaj7 = [4,6,8,10,11,13,15];
const FShDorian = [6,8,9,11,13,15,16];
const ALydian = [9,11,13,15,16,18,20];
const G6 = [7,9,11,13,14,16,18];
const AMixo = [9,11,13,15,16,18,19];

const scales = [
                Edorian,FshPhrygi,Edorian,FshPhrygi,
                CLydian,CLydian,CLydian,CLydian,
                ADorian,DMixo,GLydian,CLydian,
              GLydian,CLydian,Fmin7flat5,BMixo,
              Emaj7,FShDorian, Emaj7,FShDorian,
            ALydian,ALydian,ALydian,ALydian,
          ADorian,DMixo,GLydian,CLydian,
        GLydian,
      CLydian,Fmin7flat5, BMixo,
    Edorian,Edorian,Fmin7flat5,BMixo,
  Edorian,Edorian,CLydian,CLydian,
CLydian,CLydian,AMixo,AMixo,
GLydian,CLydian,CLydian,DMixo,
G6,CLydian,G6,CLydian,
GLydian,CLydian,Fmin7flat5,BMixo];

const melodyA = [4, 11, 11, 6, 4, 4, -1, 4, 4, 6, 4, false];
const melodyB = [4, 11, 9, 4, 6, 2, 2, 9, 7, 0, false, false];
const melodyC = [-1, 0, 2, 4, 6, 7]
const melodyD = [9, 11, 9, 3, false, false];
const melodyE = [9, 10, 11, 12, false, false];
const melodyF = [false, 11, 11, 11, false, 4, false, 9, 9, 9, false, 3];
const melodyG = [false, 7, 7, 7, false, -1, 4, false, false]
const melodyH = [false, false, 4, 4, 6, 4, 6, 4, 6, 7, 9, 7, 9, false, 7, 11, 12, 11, 12, false, false, false, false, false];
const melodyI = [11, false, false, 7, false, false];

const patterns = [
                  [0,1,2,3],
                  [0,1,0],
                  [0,4,3,0,1],
                  [0,4,3],
                  [1,2,0]
                ]

let fullmel = [];

let phrase1=[];
let patcount =0;
let melcount =0;
let lastscale = [];
const defoctave = 6;
let lastScaleDegree =-1;

let setupMel = () =>{
  // phrase 1
  phrase1 = melodyA.concat(melodyA).concat(melodyB).concat(melodyC);

  fullmel = phrase1.concat(melodyD)
    // phrase2
    .concat(phrase1).concat(melodyE)
      // phrase3
      .concat(melodyF).concat(melodyG)
      .concat(melodyH).concat(melodyI);
}

let mutemel = true;
let muteimprov = true;
let mutechords = true;
let mutebass = true;
let head =0;

let bassOctave = 3; // 2 and 3 both nice

let playbar = () =>{

  let scale = scales[bars];
  startBeat([600,400,200],playHats,0.99,1);
  startBeat([400,200,600],playSnare,0.0,0.25);
  // fluttery fx
  startBeat([100,100,100],playCash,.1,.3)
  // bass
  if(!mutebass)
  startNotes([800,200,200],[0,flo(rand(2,4)),6],bassOctave,constSine5,scale);
  // melody
  let melPattern = [400,400,400];
  if(bars%4==3) melPattern = [200,600,400]
  startMelNotes(melPattern,5,noisey2);
  // improv keys
  if(!muteimprov)
  startImprovNotes([200,400,400,200], noisey2, scale, rand((bars%4)/4+0.3));
  // chord
  //freq,a,d,s,r,cycles,func,vol,ftype,ffreq,fq,slide
  if(!mutechords)
  setTimeout(()=>{
    let chord8ve = 5;
    let chordfilt = "lowpass";
    let chordvol = 0.15
    let sustainTime = 1.1
    play(noteToFreq(flo(rand(4,6))*12+scale[0]), 0.1, sustainTime, 0.3, 0.3, 4, constSine, chordvol, chordfilt, 4400, 1)
    play(noteToFreq(flo(rand(4,6))*12+scale[2]), 0.1, sustainTime, 0.3, 0.3, 4, constSine, chordvol, chordfilt, 4400, 1)
    play(noteToFreq(flo(rand(4,6))*12+scale[6]), 0.1, sustainTime, 0.3, 0.3, 4, constSine, chordvol, chordfilt, 4400, 1)
  }, flo(rand(1.5))*200)


  bars++;
//  console.log(bars)
  if(bars==scales.length){
    bars=0;
    melcount =0;
    head++;
    if(head%3==1) mutemel = false;
    if(head%3==2) mutemel = true;

    // chance to add some detune to melody synth
    glideval = 0.000005 * (head+1) * rand(0.1,0.3);
  }
}

let startImprovNotes=(beat,sound,scale,temperament)=>{
  let counter =0;

  if(scale!=lastscale){
    let data = findClosestNoteInScale(scale);
    note0 = data.note;
    currentNote = data.octave*12+data.note;
    if(currentNote<40) currentNote +=12
    //console.log(currentNote)
    currentOctave = data.octave;
  }
  let intervals = [];
  for(let i=0; i<beat.length; i++){
    if(rand()<temperament) intervals.push(counter);
    counter += beat[i];
  }
  lastscale = scale;
  for(let i=0; i<intervals.length; i++){
    setTimeout(()=>{

        // define pattern
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
        let scaledegree = (note0+currentPattern[patcount])%scale.length;

        //if(lastScaleDegree==3) scaledegree = 2;
      //  if(lastScaleDegree==6) scaledegree = 0;
        currentNote = currentOctave*12 + scale[scaledegree]

        lastScaleDegree = scaledegree;
        //console.log(currentNote)
        if(!isNaN(currentNote))
          playNoiseySynth(noteToFreq(currentNote), intervals[i])
        patcount++;
        // remove pattern if end reached
        if(patcount==currentPattern.length-1) currentPattern = undefined;

    },intervals[i]);

  }
}

let findClosestNoteInScale=(scale)=>{
  let octave = 0;
  let note = currentNote;
  let found =999;
  let res = 99;
  while(res>3){
    for(let i=0; i<scale.length; i++){
      let note2 = scale[i] + octave * 12;
      res = abs(note2-note);
      if(res<abs(found-note)) found = note2;

      if(res<=2){
        return {note:i,octave:octave}
      }
    }
    octave++;
    // lol lets not go too high
    if(octave==8) return {note:0,octave:defoctave}
  }

  return {note:0,octave:defoctave}

}

let startMelNotes=(beat,octave,sound)=>{
  let counter =0;
  for(let i=0; i<3; i++){
    if(melcount<fullmel.length){

        setTimeout(()=>{

          if(fullmel[melcount]!=false){

            let n = octave*12+fullmel[melcount];
            if(!mutemel){
              playNoiseySynthog(noteToFreq(n));
            }

          }
          melcount++;
        },counter);
    }
    counter += beat[i]
  }
}

let startNotes = (beat,notes,octave,sound,scale)=>{
  let counter =0;
  for(let i=0; i<beat.length; i++){
    //setTimeout(play,counter,noteToFreq(octave*12 + scale[notes[i]]),0.3,0.3,0.4,0.5,1,constSine,0.2,"highpass",1500,1,false);
    setTimeout(playWobbleBass,counter,noteToFreq(octave*12 + scale[notes[i]]))
    counter += beat[i];
  }
}


let noteToFreq=(note)=> (440 / 32) * (2 ** ((note - 9) / 12));

let play=(freq,a,d,s,r,cycles,func,vol,ftype,ffreq,fq,slide)=>{
  playSound(preloadSound(
    freq,
    new Envelope(a,d,s,r),
    cycles,func,slide
  ),vol,ftype,ffreq,fq);
}






let startBeat =(beat,sound,min,max)=>{
  let chance = rand(min,max);
  let counter =0;
  for(let i=0; i<beat.length; i++){
    if(rand()<chance)
    setTimeout(sound,counter);
    counter += beat[i];
  }
  //setTimeout(startBeat,counter,beat,sound);
}

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

class Envelope{

  constructor(a,d,s,r){
    // i feel like these 3 are useless but somehow audio breaks if i delete them ..?
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




let sine4counter=0;
let sine4fact=0.8;


let constSineB=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/100))),0,0.10);

let constSineB2=(i,dividor)=>
constrain(Math.round(Math.sin(i / (dividor+i/1000))),0,0.10);

let noisey=(i,dividor)=>
Math.random()*0.02;

let noisey2=(i,dividor)=> Math.
random()*constrain(Math.round(Math.sin(i / (i+dividor))),0,0.130);

let constSine=(i,dividor)=>
constrain(Math.sin(i / dividor),-0.8,0.8);

let wubfact2=200;
let constSine2=(i,dividor)=>
constrain(0.5*(Math.sin(i / dividor)+Math.sin(i / (wubfact2+dividor))),0,0.10);

let constSine3=(i,dividor)=>
constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (100+dividor))),0,0.10);

let constSine5=(i,dividor)=>
constrain(0.2*Math.random()*(Math.sin(i / dividor)+Math.sin(i / (1000+dividor))),0,0.10);



let constSine4=(i,dividor)=>
constrain(rand(0.1,0.3)*sine4fact+0.3*(Math.sin(i / dividor)+0.3*Math.sin(i / (2+dividor))),0,0.10);


let soundCheck=()=>{
  playSnare()
}


let snarerelease=0.3;

let playSnare=()=>
  play( 10, 0.02,0.01,0.4,snarerelease , 4,noisey2,6,'highpass',1200,4);


let cash2timeout;
let playCash=()=>{

  play(noteToFreq(36+scales[bars-1][0]), 0.01,0.2,0.3,0.1, 5,constSineZ,2.1,'highpass',500,3);
  if(rand()>.5){
    clearTimeout(cash2timeout);
    cash2timeout=setTimeout(function(){
      play(noteToFreq(36+scales[bars-1][0]), 0.01,0.32,0.3,0.2, 20,constSineZ,2.1,'highpass',1500,2);
    }, 260);
  }

}


let playHats=()=>
  play(40,0.01,0.01,0.35,0.6,40,noisey,24,'highpass',7400,2);




let constSineZ=(i,dividor)=>
constrain(0.1*Math.random()+0.8*(Math.sin(i / (0.2*i+dividor))),0,0.60);


let playHop=(fact)=>
  play(fact,0.01,0.11,0.3,0.31,10,constSine2,8,'highpass',500,2,-0.001);



let playHop2=()=>
  play( 200,0.01,0.11,0.3,0.31,200,constSineZ,9,'highshelf',1500,2);


let wubfactor=1250;
let playWobbleBass=(freq)=>
  play(freq,.05,0.11,0.1,1.11, 4,constSine4,8.6,'lowpass',1600,20); // adjust filter freq value 200-1000 to get nice dub fx


let playNoiseySynth=(freq, l)=>{
  //console.log(freq)
  play( freq,0.04,0.4,0.3,Math.max(l*0.006,0.3), 5,constSine4,1.5,'highpass',450,2);
  //sine4counter++;
  //if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}
let glideval = 0.00001;
let playNoiseySynthog=(freq)=>{
  //console.log(freq)
  play( freq,0.04,0.31,0.2,1.2, 1,constSine4,2.8,'highpass',650,14,+glideval);
  //sine4counter++;
  //if(sine4counter%12==0) sine4fact = 1 - sine4fact;
}



// factor:
// compact bassy hits <1500, trappy pitched long hits 6000-20000
let playBlaster=(factor,vol)=>
  play( factor, 0.01,0.11,0.3,0.25, 100,constSineB2 ,vol,'highpass',1080,8);




let playDamageFX=()=>
  play( 20, 0.01,0.11,0.3,0.31, 60+randInt(20),constSine3 ,14,'highshelf',1500,2);



let playThunder=()=>
  play( 15+randInt(85), 0.3,0.61,0.3,2.81, 20+randInt(50),constSine5 ,4,'lowpass',300+randInt(2200),2);
