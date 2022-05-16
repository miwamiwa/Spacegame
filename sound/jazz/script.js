let currentBGM;

let playJazzMusic=(time)=>{

  if(nP!=undefined){
    currentBGM = nP.bgm;
    nP.bgm.play(time);
  }
}



let setBGM=(bgm)=>{
  currentBGM = bgm;
  harmony = currentBGM.harmony;
  playMusic(currentBGM.bpm);
}


let getRandomBGM=()=>{
  let bgm;
  let pick=MusicRng.randi(2);
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
    bpm:MusicRng.randi(150,400),
    homeKey:MusicRng.randi(12),
    generationType: "generate-piece-1",
    harmonicFidelity: 2
  }

  return new BGM(params);
}



let createType2BGM=()=>{
  let params = {
    bpm:MusicRng.randi(150,400),
    homeKey:MusicRng.randi(12),
    generationType: "generate-piece-2",
    harmonicFidelity: 3,
    melodicFidelity: 2
  }

  return new BGM(params);
}



let createType3BGM=()=>{
  let params = {
    bpm:MusicRng.randi(200,500),
    homeKey:MusicRng.randi(12),
    generationType:"generate-piece-with-improviser",
    patterns:Impro.InitNotePatterns,
    // markov
    harmonicFidelity:2,
    // harmony structure
    doublingFactor:MusicRng.randi(1,4),
    chanceOfNoChord:MusicRng.rand(.0,.9)
  }
  // create markov object
  return new BGM(params);
}
