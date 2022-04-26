


// music params
let mainInterval;
let harmony = [];
let bpm = 300;
let barLength = 0;
let beatLength = 0;
let barCounter =0;
let measure = {
  numerator: 4,
  denominator: 4
}
let headsPlayed=0;
let chanceOfShortNote;
let chanceOfNoChord;
let playingMelody = true;


// startsound()
//
// creates the audio context and starts the bgm

let startSound=()=>{

  if(!SoundEnabled) return;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  aCtx = new AudioContext();
  samp = aCtx.sampleRate;
  sound=true;

  bpm = randi(60,540);
  initializeImprov();
  playMusic(bpm);
  console.log(`bpm: ${bpm}`);

}

// playMusic()
//
//

let playMusic=(_bpm)=>{
  // updateButtons
  ui.startButton.hide();
  ui.stopButton.show();
  // update bpm if specified
  if(_bpm) setBpm(_bpm);
  // reset play
  clearInterval(mainInterval);
  barCounter =0;
  currentMelodySection =0;
  headsPlayed=0;
  playingMelody = true;
  mainInterval = setInterval(playBar,barLength);
}


let setBpm=(input)=>{
  bpm = input;
  beatLength = OneMinute / bpm;
  barLength = measure.numerator * beatLength;
}



// stopMusic()
//
//

let stopMusic=()=>{
  ui.startButton.show();
  ui.stopButton.hide();
  clearInterval(mainInterval);
}
