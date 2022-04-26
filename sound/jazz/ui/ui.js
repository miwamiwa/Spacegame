let ui = {};
const Div = "div";

let setupInterface=()=>{

  ui.header = make(Div).setClass("section");
  ui.newTuneButton = ui.header.make("button").setText("New Tune").click("newMusic()");
  ui.stopButton = ui.header.make("button").setText("Stop").click("stopMusic()");
  ui.startButton = ui.header.make("button").setText("Start").click("playMusic()");

  ui.generalInfo = make(Div).setClass("section");//.setText("General Info");
  ui.generalInfo.homeKey = ui.generalInfo.make(Div);
  ui.generalInfo.bars = ui.generalInfo.make(Div);
  ui.generalInfo.bpm = ui.generalInfo.make(Div);

  ui.currentInfo = make(Div).setClass("section");//.setText("Current Status");
  ui.currentInfo.status = ui.currentInfo.make(Div);
  ui.currentInfo.bar = ui.currentInfo.make(Div);
  ui.currentInfo.chord = ui.currentInfo.make(Div);
  ui.currentInfo.chordSymbol = ui.currentInfo.make(Div);
  ui.currentInfo.melodyNotes = ui.currentInfo.make(Div);
  ui.currentInfo.scale = ui.currentInfo.make(Div);
}

let updateGeneralInfo=()=>{
  ui.generalInfo.homeKey.setText(`Home key: ${harmony[0].symbol}`);
  ui.generalInfo.bars.setText(`Tune length: ${harmony.length} bars`);
  ui.generalInfo.bpm.setText(`BPM: ${bpm/2}`);
}

let updateCurrentInfo=()=>{
  ui.currentInfo.bar.setText(`Bar: ${barCounter}`);
  ui.currentInfo.chord.setText(`Current chord: ${currentChord.symbol}`);
  ui.currentInfo.chordSymbol.setText(`Numeral: ${currentChord.chordData.romanNumeral+currentChord.chordData.chordColor}`);
  if(!playingMelody)
  ui.currentInfo.scale.setText(`Scale: ${currentScale}`);
}

let displayLastNotePlayed=(note)=>{
  ui.currentInfo.melodyNotes.setText(note);
}
