

/*
class Envelope{

  constructor(a,d,s,r){
    this.a=a;
    this.d=d;
    this.r=r;
    this.s=s;
    this.aS=a*samp; // attack length in samples
    this.dS=d*samp; // decay length in samples
    this.rS=r*samp; // release length in samples
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

*/

// sin of a value at index i in the sample buffer.
let sine=(i,a,d)=>Math.sin(i/(a+d));

let constSine2=(i,d)=>
constrain( sine(i,0,d)+sine(i*0.975,0,d)+rand(.1,.3),-0.1,0.1);

// synth used in playhop2 and playcash
let constSineZ=(i,d)=>0.2*sine(i,i,d)+0.2*sine(2*i,i,d)+0.2*sine(4*i,i,d)

// synth used in hats
let noisey=(i,d)=>rand(0.04);

// synth sound used in melody notes, improv notes and snare lol
let noisey2=(i,d)=> rand(constrain(Math.round(sine(i,i,d)),0,0.130));

let constSine4=(i,d)=>
constrain(rand(0.1,0.2)+0.4*(sine(i,0,d)+0.3*sine(i,2,d)),0,0.10);


// synth used in chords
let constSine=(i,d)=>
constrain( sine(i,0,d),-0.1,0.1);

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

  if(sli==undefined){
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
  //console.log(fT,fF,fG)
  source.connect(f);

  f.connect(aCtx.destination);
  source.start(0);

}
