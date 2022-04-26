// general chords
// https://www.learnjazzstandards.com/blog/the-16-most-important-scales-in-jazz/
// https://www.learnjazzstandards.com/blog/learning-jazz/jazz-theory/guide-scales-use-7th-chords/

// more comprehensive list if ever i wanna complicate things even more
// (would need to implement passing tones, transposed modes etc)
// https://www.apassion4jazz.net/jazz-chords-scales.html


// getScaleFromChordData()
//
// get an appropriate scale or mode for a given chord
let getScaleFromChordData=(chordData)=>{
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
