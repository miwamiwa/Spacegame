
const Invert = "Invert";
const NoInvert = "NoInvert";
const Reverse = "Reverse";
const NoReverse = "NoReverse";

let InitNotePatterns = [
  [0,1,2],
  [0,1,0],
  [0,0],
  [0,1],
  [0,2],
  [0,3,6],
  [0,2,4],
  [0,2,5],
  [1,2,0],
  [2,3,0],
  [3,4,0]
];

let NotePatterns = [];


let AscendingNotePatterns=[];

// refreshAscendingPatterns()
//
// find all ascending note patterns in
// NotePatterns, and add a couple too

let refreshAscendingPatterns=()=>{
  AscendingNotePatterns=[
    [0,3],
    [0,4]
  ];
  NotePatterns.forEach(pattern=>{
    if(pattern[pattern.length-1]>pattern[0]) AscendingNotePatterns.push(pattern);
  });
}


// addNewNotePattern()
//
// add one new note pattern, remove one.

let addNewNotePattern=(pattern,removeOldest)=>{
  NotePatterns.unshift(pattern);
  if(removeOldest==true) NotePatterns.pop();
  refreshAscendingPatterns();
}


// randomTransformation()
//
// transform a pattern randomly:
// either invert, reverse, both, or none.

let randomTransformation=(pattern)=>{
  // choose random transforms
  let inverted = Invert==chooseBetween([Invert,NoInvert]);
  let reversed = Reverse==chooseBetween([Reverse,NoReverse]);
  // apply
  let newpattern;
  if(reversed) newpattern = reversePattern(pattern);
  else newpattern = Array.from(pattern);
  if(inverted) newpattern = invertPattern(newpattern);
  // return
  return newpattern;
}

// reversePattern()
//
// reverse a note pattern, or make the beginning the end

let reversePattern=(pattern)=>{
  let newpattern = [];
  for(let i=0; i<pattern.length; i++) newpattern[pattern.length-1-i] = pattern[i];
  return newpattern;
}

// invertPattern()
//
// apply an inversion to this pattern, or make its highest note its lowest

let invertPattern=(pattern)=>{
  let highestnum = -999;
  let newpattern = [];
  pattern.forEach(num=>{if(num>highestnum) highestnum=num});
  for(let i=0; i<pattern.length; i++) newpattern[i] = highestnum-pattern[i];
  return newpattern;
}



// newRandomPattern()
//
//

let newRandomPattern=()=>{
  let pattern = chooseBetween(NotePatterns);
  pattern = randomTransformation(pattern);
  currentPatternIndex = 0;
  currentPatternOffset = -pattern[0];
  return pattern;
}


// newAscendingPattern()
//
//

let newAscendingPattern=()=>{
  let pattern = chooseBetween(AscendingNotePatterns);
  pattern = Array.from(pattern);
  currentPatternIndex = 0;
  currentPatternOffset = -pattern[0];
  //console.log("ascending")
  return pattern;
}


// newDescendingPattern()
//
//

let newDescendingPattern=()=>{
  let pattern = chooseBetween(AscendingNotePatterns);
  pattern = reversePattern(pattern);
  currentPatternIndex = 0;
  currentPatternOffset = -pattern[0];
  //console.log("descending")
  return pattern;
}

// setupNotePatterns()
//
// called in newMusic

let setupNotePatterns=(patternList)=>{
  NotePatterns = [];

  for(let i=0; i<patternList.length; i++){
    NotePatterns.push(patternList[i]);
  }

  refreshAscendingPatterns();

  console.log(NotePatterns, AscendingNotePatterns)
}
