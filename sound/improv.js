let improBeat=[8,8,8,8,8,8,16,16,16,16,8,8,8,8];


let playImprov=()=>{
  let pat = nP.m.patt;
  let c=0;
  let l=0.2;
  if(nP.m) l=2*nP.m.nL
  if(bars%2==1) pat = nP.m.patt2;
  if(ch(0.25)) pat = nP.m.patt3;
  if(ch(0.14)) pat=getNotePattern(nP.m);

  for(let i=0; i<nP.m.rythme.length; i++){
    let j=nP.m.rythme[i]-nP.m.rythme[i-1];
    if(i<0&&ch(.1)) c+=j
    else c = nP.m.rythme[i];

    if(ch(0.2)&&i>0)
      c+= j;


    setTimeout(()=>{
      play(
        nToF(12+pat.octaves[i] + scale[pat.notes[i]%scale.length]),
        0.01,0.13,0.22,l,
        5,constSine2,
        1.6-0.0001*sq(pat.octaves[i]),
        'lowpass',6350,2
      );
    }, c);


  }
}

// getRhythm()
//
//

let getRhythm=(m,b,t)=>{

  m.barlength=b;
  if(ch(0.6)&&b>4000) b/=2;

  let r = [];
  let c;
  let count=0;

  for(let i=0; i<improBeat.length; i++){
    c = t;
    if(i%2==1) c = 0.6
    if(ch(c)) r.push(count);
    count += b/improBeat[i];
  }

  m.rythme=r;
}



// getNotePattern()
//
//

let getNotePattern=(m)=>{
  let pat = RandomFromArray(patterns);
  let note = randi(scale.length);
  let patcount=0;
  let deg;
  let res ={notes:[],octaves:[]};

  // for each note that will actually get played:
  for(let i=0; i<m.rythme.length; i++){
    // this is next scale degree
    deg = note+pat[patcount];
    res.octaves[i]=(2+flo(deg/scale.length))*12;

    while(deg<0) deg += scale.length;
    res.notes[i]=deg%scale.length;

    // move to next note in the current pattern
    patcount++;
    // remove pattern if end reached
    if(patcount==pat.length-1){
      pat = RandomFromArray(patterns);
      note = deg;
      patcount=1;
    }
  }

  if(ch(.3)) res = reverse(res);
  return res;
}

let reverse=(p)=>{
  return {
    notes:p.notes.reverse(),
    octaves:p.octaves.reverse()
  }
}
