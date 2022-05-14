class Rhythm {
  constructor(smallestSubdivision,numNotes,report){
    let ternary = false;
    let rng = MusicRng;
    if(smallestSubdivision%3==0) ternary = true;
    let measureSubdivision = smallestSubdivision / 2;
    if(ternary) measureSubdivision = smallestSubdivision / 3;

    let subsub = smallestSubdivision / measureSubdivision;

    //
    let fraction = numNotes / smallestSubdivision;
    let silence = smallestSubdivision - numNotes;
    let pattern = [];
    for(let i=0; i<smallestSubdivision; i++) pattern.push(false);

    // different rhythm styles:

    // if notes can be played in all quarter notes
    if(numNotes<=measureSubdivision && rng.ch(0.6)){
      for(let i=0; i<numNotes; i++) pattern[i*subsub]=true;
      if(report) console.log("quarter notes ")
    }
    // play all notes as leading to the next measure
    else if(numNotes>=smallestSubdivision-3 && rng.ch(0.5)){
      for(let i=silence; i<smallestSubdivision; i++) pattern[i] = true;
      if(report) console.log("leading to next")
    }
    // one full note
    else if(numNotes == 1){
      pattern[0] = true;
      if(report) console.log("full note")
    }
    // split in 2
    else if(numNotes > 1){
      let halfSub = flo(measureSubdivision/2);
      if(report) console.log("halfSub: "+halfSub)
      let i;
      for(i=0; i<halfSub; i++) pattern[i*subsub] = true;

      let startpoint2 = halfSub * subsub;
      silence = (smallestSubdivision - startpoint2) - (numNotes - i);

      for(i=startpoint2+silence; i<smallestSubdivision; i++) pattern[i] = true;
      if(report) console.log("split in 2")
    }
    // play it straight
    else{
      for(let i=0; i<numNotes; i++) pattern[i]=true;
      if(report) console.log("straight")
    }

    // done!
    if(report) console.log(numNotes,measureSubdivision,smallestSubdivision,subsub,pattern)
    this.pattern = pattern;

    // now calculate actual note lengths

    this.lengths = [];
    let index =-1;
    for(let i=0; i<pattern.length; i++){
      if(pattern[i]==false) this.lengths[index] ++;
      else {
        this.lengths[i] = 1;
        index=i;
      }
    }

    // generate note data

    this.beats = [];
    for(let i=0; i<pattern.length; i++){
      if(pattern[i]==true){
        this.beats.push(new Note(i/smallestSubdivision,0,this.lengths[i]/smallestSubdivision));
      }
    }

    if(report) console.log(this.lengths,this.beats)
  }


}
