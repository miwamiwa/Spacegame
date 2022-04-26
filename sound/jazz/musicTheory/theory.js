const Keys = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const Ionian = {degrees:[0,2,4,5,7,9,11],flats:0,sharps:0,major:true,name:"ionian"};
const Dorian = {degrees:[0,2,3,5,7,9,10],flats:2,sharps:0,major:false,name:"dorian"};
const Phrygian = {degrees:[0,1,3,5,7,8,10],flats:4,sharps:0,major:false,name:"phrygian"};
const Lydian = {degrees:[0,2,4,6,7,9,11],flats:0,sharps:1,major:false,name:"lydian"};
const Mixolydian = {degrees:[0,2,4,5,7,9,10],flats:1,sharps:0,major:true,name:"mixolydian"};
const Aeolian = {degrees:[0,2,3,5,7,8,10],flats:3,sharps:0,major:false,name:"aeolian"};
const Locrian = {degrees:[0,1,3,5,6,8,10],flats:5,sharps:0,major:false,name:"locrian"};
const MainModes = [Ionian,Dorian,Phrygian,Lydian,Mixolydian,Aeolian];
const AllModes = [Ionian,Dorian,Phrygian,Lydian,Mixolydian,Aeolian,Locrian];

const Progressions = {
  major:[
    ["ii","V","I"],
    ["I","vi","ii","V"],
    ["I","IV7","iii","VI7"],//leading to ,"ii","V","I"]
    ["#ii","#V","ii","V"],
    ["Ima7","vi7","ii7","V7","iii7","VI7","ii7","V7"], // rhythm changes
    //["Ima7","i7","IV7","bVIIma7","bvii7","bIII7","bVIma7","bvi7","bII7"] // descending ii-V-of
    ["Ima7","#idim7","ii7"], // passing diminished chord
    ["Ima7","II7","ii7","V7","I"], // II7 to ii7
    ["Ima7","I7","IVma7","iv7","iii7","VI7","ii7","V7","I"], // IV to iv
    ["I7","IV7"]
  ],
  minor:[
    ["ii","V","i"],
    ["i","vi","ii","V"],
    ["III7","VI7","II7","V7"], // rhythm changes
    ["ii7b5","V7","i7"],
    ["i7","i7/b7","bVI7","V7"]
  ]
}

let Substitutions = [];
Substitutions["I"] = ["iii"];
Substitutions["VI7"] = ["#i"];
Substitutions["V7"] = ["bII7"];
Substitutions["bII7"] = ["V7"]

// vocabulary
const Tonic = "tonic";
const Subdominant = "subdominant";
const Dominant = "dominant";
const Sentence = "sentence"; // tonic theme1, subdom theme2, return to tonic
const Period = "period";  // theme1 leading to subdom/dom, theme1 leading to tonic
const AABA = "aaba"; //
const ABAC = "abac";
const AB = "ab";
const ABCD = "abcd";
const Step="step";
const Intervallic="intervallic";
const Ascending="ascending";
const Descending="descending";

// chord colors
const Flat5 = "flat5";
const Flat6 = "flat6";
const Flat9 = "flat9";
const Sharp11 = "sharp11";
const Ma7 = "ma7";
const Ma6 = "ma6";
const Dom7 = "mi7";
const Dom9 = "dom9";

// generateSong()
//
// derprecated

let generateSong =()=>{
  let mode = chooseBetween(MainModes);
  let key = chooseBetween(Keys);
  let songStructure = chooseBetween([AABA,ABAC]);
  let phraseStructure = chooseBetween([Sentence,Period]);
  let idea1 = newIdea();
  let idea2 = contrastingIdea(idea1);

  let homekey = getChordDataFromSymbol("I");
  let chords = moveFromChordToChord(homekey,homekey);
}

let moveFromChordToChord=(chordAdata,chordBdata)=>{
  let chords = [chordBdata];
}


let newIdea=()=>{
  return {
    motion:chooseBetween([Step,Intervallic]),
    direction:chooseBetween([Ascending,Descending])
  }
}

let contrastingIdea=(referenceIdea)=>{
  let motion = chooseBetween([Step,Intervallic]);
  let direction = Ascending;
  if(referenceIdea.direction==Ascending) direction = Descending;
  return {
    motion: motion,
    direction: direction
  }
}
