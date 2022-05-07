
class MusicTheory {
  constructor(){
    this.i=0;
    this.bii=1;
    this.ii=2;
    this.biii=3;
    this.iii=4;
    this.iv=5;
    this.bv= 6;
    this.v=7;
    this.bvi=8;
    this.vi=9;
    this.bvii=10;
    this.vii=11;

    this.I=0;
    this.bII=1;
    this.II=2;
    this.bIII=3;
    this.III=4;
    this.IV=5;
    this.bV=6;
    this.V=7;
    this.bVI=8;
    this.VI=9;
    this.bVII=10;
    this.VII=11;

    this.Unisson=0;
    this.SecondeMineure=1;
    this.SecondeMajeure=2;
    this.SecondeAugmentee=3;
    this.TierceMineure=3;
    this.TierceMajeure=4;
    this.Quarte=5;
    this.QuarteAugmentee=6;
    this.QuinteDiminuee=6;
    this.Quinte=7;
    this.QuinteAugmentee=8;
    this.SixteMineure=8;
    this.SixteMajeure=9;
    this.SeptiemeDiminuee=9;
    this.SeptiemeMineure=10;
    this.SeptiemeMajeure=11;
    this.Octave=12;

    this.Keys=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    this.NoChord = "NoChord";

    // modezz <3
    this.Ionian=this.newScale(0,0,"Ionian");
    this.Dorian=this.newScale(2,0,"Dorian");
    this.Phrygian=this.newScale(4,0,"Phrygian");
    this.Lydian=this.newScale(0,1,"Lydian");
    this.Mixolydian=this.newScale(1,0,"Mixolydian");
    this.Aeolian=this.newScale(3,0,"Aeolian");
    this.NaturalMinor=this.newScale(3,0,"NaturalMinor"); // aka Aeolian
    this.Locrian=this.newScale(5,0,"Locrian");
    this.LydianDominant=this.scaleFromArray([0,2,4,6,8,9,10],"LydianDominant");
    this.LydianAugmented=this.scaleFromArray([0,2,4,6,8,9,11],"LydianAugmented");
    this.HalfWhole=this.scaleFromArray([0,1,3,4,6,7,9,10],"HalfWhole");
    this.WholeHalf=this.scaleFromArray([0,2,3,5,6,8,9,11],"WholeHalf");
    this.WholeTone=this.scaleFromArray([0,2,4,6,8,10],"WholeTone");
    this.Blues=this.scaleFromArray([0,3,5,6,7,10],"Blues");
    this.LocrianNatural2=this.scaleFromArray([0,2,3,5,6,8,10],"LocrianNatural2");
    this.AlteredDominant=this.scaleFromArray([0,1,3,4,6,8,10],"AlteredDominant");
    this.MelodicMinor=this.scaleFromArray([0,2,3,5,7,9,11],"MelodicMinor");
    this.MinorPentatonic=this.scaleFromArray([0,3,5,7,10],"MinorPentatonic");
    this.MajorBebop=this.scaleFromArray([0,2,4,5,7,8,9,11],"MajorBebop",8);
    this.MinorBebop=this.scaleFromArray([0,2,3,5,7,8,10,11],"MinorBebop",11);
    this.MixolydianBebop=this.scaleFromArray([0,2,4,5,7,9,10,11],"MixolydianBebop",11);
  }


  // scale()
  //
  // generate a scale given number of flats and sharps
  // and optional special indications
  newScale(flats,sharps,name,special){
    let degrees = [0,2,4,5,7,9,11];

    if(sharps==1) degrees[3] =6;
    for(let i=0; i<flats; i++)
    degrees[this.wrapToScaleDegrees(6 - i*4,degrees)] --;


    if(special!=undefined){
      if(special.includes("#5")) degrees[4] =8;
      if(special.includes("b5")) degrees[4] =6;
    }

    return new Scale(degrees,flats,sharps,name);

  }

  scaleFromArray(arr,name,pt){
    return new Scale(arr,-1,-1,name,pt);
  }

  wrapToScaleDegrees(input,degrees){
    while(input<0) input += degrees.length;
    return input%degrees.length;
  }

  wrap12tone(input){
    while(input<0) input += m.Octave;
    return input%m.Octave;
  }

  isV7toI(chord1,chord2){
    return chord1.isDominant7() && this.isPossibleDominant(this.intervalToChord(chord1,chord2))
  }

  // intervalToChord()
  //
  // get the interval from chord1 to chord2

  intervalToChord(chord1,chord2){
    if(chord1.chordData!=undefined){
      chord1 = chord1.chordData.intervalToOrigin;
      chord2 = chord2.chordData.intervalToOrigin;
    }
    return m.wrap12tone(chord1 - chord2);
  }

  // isPossibleDominant()
  //
  // (accepted dominant relationships are TTsub of V7 of I, V7 of I OR bVII7 of I)

  isPossibleDominant(interval){
    return interval==m.bII||interval==m.V||interval==m.bVII
  }



  // getAvoidNotes()
  //
  //

  getAvoidNotes(scale){
    let avoidNotes = [];
    switch(scale.name){
      case "Ionian": avoidNotes = [3]; break;
      case "Dorian": avoidNotes = [5]; break;
      case "Phrygian": avoidNotes = [1,5]; break;
      case "Lydian": avoidNotes = []; break;
      case "Mixolydian": avoidNotes = [3]; break;
      case "Aeolian": avoidNotes = [5]; break;
      case "NaturalMinor": avoidNotes = [5]; break;
      case "Locrian": avoidNotes = [1]; break;
      case "MelodicMinor": avoidNotes = []; break;
      case "LydianAugmented": avoidNotes = [5]; break;
      case "LocrianNatural2": avoidNotes = []; break;
      case "MajorBebop": avoidNotes = [3]; break;
      case "MinorBebop": avoidNotes = [5]; break;
      case "MixolydianBebop": avoidNotes = [3]; break;
    }
    return avoidNotes;
  }


  getScaleFromChordData(chordData){
    let options=[m.Blues]; // when in doubt, use a blues scale.
    let major = chordData.isMajor;

    switch(chordData.chordColor){

      case "6":
      if(major) options = [m.Mixolydian,m.Ionian];
      else options = [m.Dorian,m.MelodicMinor];
      break;

      case "7":
      if(major) options = [m.Mixolydian,m.LydianDominant];
      else options = [m.Dorian,m.Aeolian,m.Phrygian];
      break;

      case "ma7":
      if(major) options = [m.Ionian,m.Lydian];
      else options = [m.MelodicMinor];
      break;

      case "7b5":
      if(major) options = [m.LydianDominant,m.WholeTone];
      else options = [m.Locrian,m.LocrianNatural2,m.Blues,m.AlteredDominant];
      // more options: WholeTone for minor? euhhh
      break;

      case "dim7":
      options = [m.WholeHalf];
      break;

      case "7b9":
      if(major) options = [m.AlteredDominant,m.HalfWhole];
      else options = [m.Phrygian];
      break;

      case "9":
      if(major) options = [m.Mixolydian];
      else options = [m.Dorian,m.Aeolian];
      break;

      case "":
      if(major) options = [m.Ionian];
      else options = [m.Aeolian];
      break;

      case "7sharp5":
      if(major) options = [m.LydianDominant];
      else options = [m.AlteredDominant];
      break;

      case "7sharp11":
      if(major) options = [m.LydianDominant,m.AlteredDominant];
      else options = [m.AlteredDominant];
      break;

      case "7sharp9":
      if(major) options = [m.AlteredDominant];
      else options = [m.AlteredDominant];
      break;

      case "ma7b5":
      if(major) options = [m.Lydian];
      else options = [m.WholeHalf];
      break;

      case "7sus4": /// uuuhhhh
      if(major) options = [m.Mixolydian];
      else options = [m.Mixolydian];
      break;

      default: console.log("Unrecognized chord color: "+chordData.symbol);
    }

    // make a choice out of the available options
    let pick = randi(options.length);
    return options[pick];
  }

  toLetter(note){
    return m.Keys[note%m.Octave];
  }

  bothChordsAreHomeKey(first,last){

    let chord1 = Zik.chord.analyzeSymbol(first);
    let chord2 = Zik.chord.analyzeSymbol(last);

    return chord1.romanNumeral == chord2.romanNumeral
    || (chord1.romanNumeral=="i" && (chord2.romanNumeral=="bIII"||chord2.romanNumeral=="bVI"))
    || (chord1.romanNumeral=="I" && (chord2.romanNumeral=="iii"||chord2.romanNumeral=="vi"))
  }

  numeralIsHomeKey(hkNumeral,otherNumeral){
    return hkNumeral == otherNumeral
    || (hkNumeral=="i" && (otherNumeral=="bIII"||otherNumeral=="bVI"))
    || (hkNumeral=="I" && (otherNumeral=="iii"||otherNumeral=="vi"))
  }


    // getThird()
    //
    // get chord's third (unless this is a sus4 chord)

    getThird(chordData){
      if(chordData.chordColor.indexOf("sus4")==-1){
        if(chordData.isMajor) return this.TierceMajeure;
        else return this.TierceMineure;
      }
    }





    // getFifthAndSeventh()
    //
    //

    getFifthAndSeventh(color){
      let features = [];
      switch(color){
        case "6": features.push(m.SixteMajeure); features.push(m.Quinte); break;
        case "7": features.push(m.SeptiemeMineure); break;
        case "ma7": features.push(m.SeptiemeMajeure); break;
        case "7b5": features.push(m.QuinteDiminuee); features.push(m.SeptiemeMineure); break;
        case "dim7": features.push(m.QuinteDiminuee); features.push(m.SeptiemeDiminuee); break;
        case "7b9": features.push(m.SeptiemeMineure); features.push(m.SecondeMineure); break;
        case "9": features.push(m.SeptiemeMineure); features.push(m.SecondeMajeure); break;
        case "": features.push(m.Quinte); break;
        case "7sharp5": features.push(m.SeptiemeMineure); features.push(m.QuinteAugmentee); break;
        case "7sharp11": features.push(m.SeptiemeMineure); features.push(m.QuarteAugmentee); break;
        case "7sharp9": features.push(m.SeptiemeMineure); features.push(m.SecondeAugmentee); break;
        case "ma7b5": features.push(m.SeptiemeMajeure); features.push(m.QuinteDiminuee); break;
        case "7sus4": features.push(m.SeptiemeMineure); features.push(m.Quarte); break;
        case "sharp5": features.push(m.QuinteAugmentee); break;
        case "ma": features.push(m.Quinte); break;
        default: console.log("Unrecognized chord color: "+color);
      }
      return features;
    }



}


const m = new MusicTheory();


// documentation

// general chords
// https://www.learnjazzstandards.com/blog/the-16-most-important-scales-in-jazz/
// https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/guide-scales-use-7th-chords/

// more comprehensive list if ever i wanna complicate things even more
// (would need to implement passing tones, transposed modes etc)
// https://www.apassion4jazz.net/jazz-chords-scales.html


/*
MORE POSSIBLE CHORD-SCALE RELATIONSHIPS
ma7,ma9,ma11,ma13: Ionian
mi7,mi9,mi11,mi13: NaturalMinor, Dorian
dominant7,9,11,13: Mixolydian
dominant7 with b9,#9,#11,#5,b13: Altered, HalfWhole (but not b13/#5)
dominant7 with b13/#5: WholeTone
dominant7 with b9sus: Phrygian
ma7sharp5, ma7#5: LydianAugmented
(minor or major) 13b9: HalfWhole
(major) 7#9b13 or 7alt: AlteredDominant,
bebop options (with added pt - passing tone)
major: MajorBebop,
minor: MinorBebop,
unaltered dominant: MixolydianBebop

// see https://www.apassion4jazz.net/jazz-chords-scales.html
*/
