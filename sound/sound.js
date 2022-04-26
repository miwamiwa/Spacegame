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

let chordSynth;
let noteSynth;
let rev;
let limiter;
// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  if(!SoundEnabled) return;

  sound=true;

  //Tone.start();
  chordSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  chordSynth.volume.value = -15;


  rev = new Tone.Reverb(3).toDestination();
  noteSynth = new Tone.AMSynth();
  //noteSynth.volume.value = -4;

  limiter = new Tone.Gain(0.5).toDestination();
  noteSynth.fan(rev,limiter);

  chordSynth.fan(rev,limiter);



  // start beat
  playbar();
}


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

let playChordNotes=(notes,length,roll,moment)=>{
  for(let i=0; i<notes.length; i++)
  chordSynth.triggerAttack(notes[i], moment + i*roll);
  chordSynth.triggerRelease(notes, moment + length);
}


let toToneFormat=(note)=>{
  let octave = flo(note / m.Octave);
  let noteName = m.Keys[note%m.Octave];
  return noteName+octave;
}

// playbar()
//
// called at an interval, each bar.
// trigger every note in this bar for each instrument

let playbar = () =>{

  // WHILE ON PLANET

  if(nP){
    if(nP.isBarren){
      playBarrenPlanetMusic();
      spaceyRhythm();
    }
    else playJazzMusic();
  }

  // WHILE IN SPACE

  else {
    spaceMusic.t = rand(0.2,0.5);
    setScale(spaceMusic);
    spaceyRhythm();
  }


  // trigger next bar
  if(nP&&!nP.isBarren) setTimeout(playbar,nP.jazz.barLength);
  else setTimeout(playbar,mu.barlength);


  // update TIME:
  bars++;

  // if end of tune reached
  backToTop();
}



let spaceyRhythm=()=>{

  console.log("spacey rhythm!")

  // bass drum
  startBeat(
    [4,4,4,4],
    ()=>playDrumSound(),1,1,false
  );

  // snare
  startBeat(
    [4,2.7,8.2,16,16],
    ()=>playDrumSound(),0.88,1,true);

    // bass
    startBeat(
      [2,5.29,16,16,16],
      ()=>playDrumSound(),0.4,1);


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

    let constSine2=(i,d)=>
    constrain( sine(i,0,d)+sine(i*0.975,0,d)+rand(.1,.3),-0.1,0.1);

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
