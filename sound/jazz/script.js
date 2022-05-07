let currentBGM;

let playJazzMusic=()=>{

  if(nP!=undefined){
    currentBGM = nP.bgm;
    nP.bgm.play();
  }
}

let playNote=(num,length,isChord)=>{
  //console.log(note)
  noteSynth.triggerAttackRelease(
    toToneFormat(num), length);
}


let setBGM=(bgm)=>{
  currentBGM = bgm;
  harmony = currentBGM.harmony;
  playMusic(currentBGM.bpm);
}


let getRandomBGM=()=>{
  let bgm;
  let pick=randi(3);
  switch(pick){
    case 0: bgm = createType1BGM(); break;
    case 1: bgm = createType2BGM(); break;
    case 2: bgm = createType3BGM(); break;
    default: bgm = createType1BGM();
  }
  return bgm
}



let createType1BGM=()=>{
  let params = {
    bpm:randi(150,400),
    homeKey:randi(12),
    generationType: "generate-piece-1",
    harmonicFidelity: 2
  }

  return new BGM(params);
}



let createType2BGM=()=>{
  let params = {
    bpm:randi(150,400),
    homeKey:randi(12),
    generationType: "generate-piece-2",
    harmonicFidelity: 3,
    melodicFidelity: 2
  }

  return new BGM(params);
}



let createType3BGM=()=>{
  let params = {
    bpm:randi(200,500),
    homeKey:randi(12),
    generationType:"generate-piece-with-improviser",
    patterns:Impro.InitNotePatterns,
    // markov
    harmonicFidelity:2,
    // harmony structure
    doublingFactor:randi(1,4),
    chanceOfNoChord:rand(.0,.9)
  }
  // create markov object
  return new BGM(params);
}
