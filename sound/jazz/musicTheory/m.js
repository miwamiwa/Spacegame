// scale()
//
// generate a scale given number of flats and sharps
// and optional special indications
let newScale = (flats,sharps,name,special)=>{
  let degrees = [0,2,4,5,7,9,11];

  if(sharps==1) degrees[3] =6;
  for(let i=0; i<flats; i++)
    degrees[wrapToScaleDegrees(6 - i*4,degrees)] --;


  if(special!=undefined){
    if(special.includes("#5")) degrees[4] =8;
    if(special.includes("b5")) degrees[4] =6;
  }

  return {degrees:degrees,flats:flats,sharps:sharps,major:degrees[2]==4,diminished:degrees[4]==6,augmented:degrees[4]==8,name:name}
}

let scaleFromArray=(arr,name,pt)=>{
  return {
    degrees:arr,
    flats:-1,
    sharps:-1,
    major:arr.indexOf(4)!=-1,
    diminished:arr.indexOf(6)!=-1,
    augmented:arr.indexOf(8)!=-1,
    pt:pt, // passing tone (optional)
    name:name
  }
}

// wrapToScaleDegrees
//
// wrap number from 0 to scale length
let wrapToScaleDegrees =(input,degrees)=>{
  while(input<0) input += degrees.length;
  return input%degrees.length;
}


let wrap12tone =(input)=>{
  while(input<0) input += m.Octave;
  return input%m.Octave;
}


// m{}
//
// useful musical vocabulary
const m = {
  i:0,
  bii:1,
  ii:2,
  biii:3,
  iii:4,
  iv:5,
  bv: 6,
  v:7,
  bvi:8,
  vi:9,
  bvii:10,
  vii:11,

  I:0,
  bII:1,
  II:2,
  bIII:3,
  III:4,
  IV:5,
  bV:6,
  V:7,
  bVI:8,
  VI:9,
  bVII:10,
  VII:11,

  Unisson:0,
  SecondeMineure:1,
  SecondeMajeure:2,
  SecondeAugmentee:3,
  TierceMineure:3,
  TierceMajeure:4,
  Quarte:5,
  QuarteAugmentee:6,
  QuinteDiminuee:6,
  Quinte:7,
  QuinteAugmentee:8,
  SixteMineure:8,
  SixteMajeure:9,
  SeptiemeDiminuee:9,
  SeptiemeMineure:10,
  SeptiemeMajeure:11,
  Octave:12,

  Keys:["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],

  // modezz <3
  Ionian:newScale(0,0,"Ionian"),
  Dorian:newScale(2,0,"Dorian"),
  Phrygian:newScale(4,0,"Phrygian"),
  Lydian:newScale(0,1,"Lydian"),
  Mixolydian:newScale(1,0,"Mixolydian"),
  Aeolian:newScale(3,0,"Aeolian"),
  NaturalMinor:newScale(3,0,"NaturalMinor"), // aka Aeolian
  Locrian:newScale(5,0,"Locrian"),
  LydianDominant:scaleFromArray([0,2,4,6,8,9,10],"LydianDominant"),
  LydianAugmented:scaleFromArray([0,2,4,6,8,9,11],"LydianAugmented"),
  HalfWhole:scaleFromArray([0,1,3,4,6,7,9,10],"HalfWhole"),
  WholeHalf:scaleFromArray([0,2,3,5,6,8,9,11],"WholeHalf"),
  WholeTone:scaleFromArray([0,2,4,6,8,10],"WholeTone"),
  Blues:scaleFromArray([0,3,5,6,7,10],"Blues"),
  LocrianNatural2:scaleFromArray([0,2,3,5,6,8,10],"LocrianNatural2"),
  AlteredDominant:scaleFromArray([0,1,3,4,6,8,10],"AlteredDominant"),
  MelodicMinor:scaleFromArray([0,2,3,5,7,9,11],"MelodicMinor"),
  MinorPentatonic:scaleFromArray([0,3,5,7,10],"MinorPentatonic"),
  MajorBebop:scaleFromArray([0,2,4,5,7,8,9,11],"MajorBebop",8),
  MinorBebop:scaleFromArray([0,2,3,5,7,8,10,11],"MinorBebop",11),
  MixolydianBebop:scaleFromArray([0,2,4,5,7,9,10,11],"MixolydianBebop",11)
}
