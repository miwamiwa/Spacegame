
// playBar()
//
//

let playJazzMusic=()=>{

  console.log("space jazzzz")

  if(!nP) return;


  if(nP.jazz.harmony[nP.jazz.barCounter]!=NoChord){
    let chord = nP.jazz.harmony[nP.jazz.barCounter].notes;
    currentChord = nP.jazz.harmony[nP.jazz.barCounter];
    //console.log(chord)
    let baseNote = AccompanimentOctave*m.Octave;
    let noteLength = nP.jazz.barLength*.0006;

    if(rand()<nP.jazz.chanceOfShortNote) noteLength/=3;
/*
    for(let i=0; i<chord.length; i++)
    playJazzNote(baseNote+chord[i], noteLength,true);

    if(rand()<.3)
    setTimeout(()=>{
      for(let i=0; i<chord.length; i++)
      playJazzNote(baseNote+chord[i], .1,true);
    }, nP.jazz.barLength * 0.77);
*/

    let now = Tone.now()

    let notes = [
      toToneFormat(baseNote + randomVoicing() + chord[0]),
      toToneFormat(baseNote + randomVoicing() + chord[1]),
      toToneFormat(baseNote + randomVoicing() + chord[2])
    ];

  //  console.log(notes)

    if(ch(.3)) setTimeout(()=>{
      playChordNotes(notes, nP.jazz.barLength*0.0002, 0.0, now);
    }, nP.jazz.barLength * 0.77);

    playChordNotes(notes, nP.jazz.barLength*0.0008, 0.0, now);


    //console.log("bar "+barCounter+" ("+harmony[barCounter].symbol+")");
  }
  //else console.log("bar "+barCounter+" ("+NoChord+")");

  if(melodyExists&&nP.jazz.playingMelody){
    //ui.currentInfo.status.setText(`Playing Melody (part ${getSectionIndex(nP.jazz.currentMelodySection)})`);
    playTheMelody();
  }
  else {
    //ui.currentInfo.status.setText("Improving...");
    improvise();
  }


  // kick drum
  startJazzBeat(
    [3,6],
    ()=>playDrumSound(),1,1,false
  );

  // hats
  startJazzBeat(
    [3,6,3,6,3,6],
    ()=>playDrumSound(),.92,1,true
  );

  //updateCurrentInfo();

  nP.jazz.barCounter++;
  if(nP.jazz.barCounter==nP.jazz.harmony.length){
    nP.jazz.headsPlayed++;
    nP.jazz.barCounter=0;
    if(nP.jazz.headsPlayed==1) nP.jazz.playingMelody=true;
    else if(nP.jazz.playingMelody){
      if(ch(0.7)) nP.jazz.playingMelody=false;
    }
    else {
      if(ch(0.5) || (nP.jazz.headsPlayed%2==0&&ch(0.8))) nP.jazz.playingMelody=true;
    }
  }
}


let playDrumSound=()=>{

}



let playJazzNote=(num,length,isChord)=>{
  //console.log(nToF(num))
  if(isChord) noteSynth.triggerAttackRelease(toToneFormat(num),length);

  else noteSynth.triggerAttackRelease(toToneFormat(num),length);


}


// startBeat()
//
// play a beat pattern (one measure of beat)

let startJazzBeat =(beat,sound,min,max,mute1)=>{
  let chance = .8*rand(min,max) * .5;
  let c =0;
  for(let i=0; i<beat.length; i++){
    if(!(i==0&&mute1)&&rand()<chance)
    setTimeout(sound,c);
    c += nP.jazz.barLength/beat[i];
  }
}
