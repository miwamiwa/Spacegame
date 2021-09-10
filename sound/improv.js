let improBeat=[8,8,8,8,8,8,16,16,16,16];


let playImprov=()=>{
  let pat = nP.m.patt;
  if(bars%2==1) pat = nP.m.patt2;

  for(let i=0; i<nP.m.rythme.length; i++){
    setTimeout(()=>{
      play(
        2*nToF(pat.octaves[i] + scale[pat.notes[i]%scale.length]),
        0.01,0.1,0.22,nP.m.nL,
        5,constSine,
        2,
        'highpass',450,8
      );
    }, nP.m.rythme[i]);
  }
}

// getRhythm()
//
//

let getRhythm=(m,b,t)=>{

  m.barlength=b;
  if(rand()<0.4&&b>3000) b/=2;

  let r = [];
  let c;
  let count=0;

  for(let i=0; i<improBeat.length; i++){
    c = t;
    if(i%2==1) c = 0.4
    if(rand()<c) r.push(count);
    count += b/improBeat[i];
  }

  m.rythme=r;
}



// getNotePattern()
//
//

let getNotePattern=(m)=>{
  let pat = RandomFromArray(patterns);
  let note = flo(rand(7));
  let patcount=0;
  let deg;
  let res ={notes:[],octaves:[]};

  // for each note that will actually get played:
  for(let i=0; i<m.rythme.length; i++){
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
      patcount=1;
    }
  }

  if(rand()<0.3) res = reverse(res);
  return res;
}

let reverse=(p)=>{
  return {
    notes:p.notes.reverse(),
    octaves:p.octaves.reverse()
  }
}
