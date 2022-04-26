const Major = "major";
const Minor = "minor";

const Turnarounds = [
  {
    from: "I",
    to: "I",
    chords: "I6 bIIIdim7 ii7 V7"
  },
  {
    from: "I",
    to: "I",
    chords: "I VI7b9 ii7 V7"
  },
  {
    from:"I",
    to:"I",
    chords: "iii7 VI7 ii7 V7"
  }
]

const Tunes = [
  {
    name:"All Of Me",
    composers:["Seymour Simons","Gerald Marks"],
    feel:Major,
    chords:"I6 III7 VI7 ii7 III7 vi7 II7 ii7 V7 I6 III7 VI7 ii7 IV6 iv6 Ima7 iii7b5 VI7 ii7 V7 I6 biiidim7 ii7 V7 I6",
    chords_long:"I6 I6 I6 I6 III7 III7 III7 III7 VI7 VI7 VI7 VI7 ii7 ii7 ii7 ii7 III7 III7 III7 III7 vi7 vi7 vi7 vi7 II7 II7 II7 II7 ii7 ii7 V7 V7 "
              +"I6 I6 I6 I6 III7 III7 III7 III7 VI7 VI7 VI7 VI7 ii7 ii7 ii7 ii7 IV6 IV6 iv6 iv6 Ima7 iii7b5 VI7 VI7 ii7 ii7 V7 V7 I6 biiidim7 ii7 V7",
    originalKey: "C"
  },
  {
    name:"All Of You",
    composers:["Cole Porter"],
    feel:Major,
    chords:"iv6 Ima7 ii7b5 V7b9 iv6 Ima7 iv7 bVII7 iii7 biiidim7 ii7 V7 Ima7 VII7 iii7b5 VI7b9 ii7 V7 iv6 Ima7 ii7b5 V7b9 iv6 Ima7 iii7 VI7b9 IVma7 bv7b5 VII7b9 iii7 bVII9 VI7 ii7 VI7 ii7 V7 I6",
    chords_long:"iv6 iv6 Ima7 Ima7 ii7b5 ii7b5 V7b9 V7b9 iv6 iv6 Ima7 Ima7 iv7 iv7 bVII7 bVII7 "
              +"iii7 iii7 biiidim7 biiidim7 ii7 ii7 V7 V7 Ima7 VII7 iii7b5 VI7b9 ii7 ii7 V7 V7 "
              +"iv6 iv6 Ima7 Ima7 ii7b5 ii7b5 V7b9 V7b9 iv6 iv6 Ima7 Ima7 iii7 iii7 VI7b9 VI7b9 "
              +"IVma7 IVma7 bv7b5 VII7b9 iii7 bVII9 VI7 VI7 ii7 VI7 ii7 V7 I6 I6 I6 I6",
    originalKey:"Eb"
  },
  {
    name:"Au Privave",
    composers:["Charlie Parker"],
    feel:Major,
    chords:"I ii7 V7 I ii7 v7 I7sharp5 IV7 iv7 bVII7 I ii7 iii7 VI7 ii7 V7 I VI7b9 ii7 V7 I",
    originalKey:"F"
  },
  {
    name:"Autumn Leaves",
    composers:["Joseph Kosma","Johnny Mercer","Jacques Prevert"],
    feel:Minor,
    chords:"iv7 bVII7 bIIIma7 bVIma7 ii7b5 V7 i ii7b5 V7b9 i iv7 bVII7 bIIIma7 ii7b5 V7b9 i7 IV7 bvii7 bIII7 ii7b5 V7b9 i",
    originalKey:"E"
  },
  {
    name:"Beautiful Love",
    composers:["Victor Young","Wayne King","Egbert Van Alstyne","Haven Gillespie"],
    feel:Minor,
    chords:"ii7b5 V7sharp5 i iv7 bVII7 IIIma7 ii7b5 V7 i iv7 bVI7sharp11 V7 i IV7sharp11 ii7b5 V7 ii7b5 V7sharp5 i iv7 bVII7 IIIma7 ii7b5 V7 i iv7 bVI7sharp11 V7 i VI7sharp9 bVI7 V7 i",
    originalKey:"D"
  },
  {
    name:"Black Narcissus",
    composers:["Joe Henderson"],
    feel:Minor,
    chords:"i7 ii7 i7 ii7 i7 ii7 i7 bIIIma7b5 bvii7 i bvii7 i bvii7 i bvii7 VIIma7b5 Vma7b5 VIma7b5 IIma7b5 IIIma7b5 Vma7b5 VIma7b5 IIma7b5 VIIma7b5 Ima7b5 IIma7b5 IIIma7b5 i7",
    originalKey:"Ab"
  },
  {
    name:"Black Orpheus",
    composers:["Luiz Bonfa"],
    feel:Minor,
    chords:"i ii7b5 V7b9 i ii7b5 V7b9 "
          +"i iv7 bVII7 bIIIma7 iiidim7 "
          +"iv7 bVII7 bIII6 bVIma7 "
          +"ii7b5 V7b9 i ii7b5 V7b9 "
          +"i ii7b5 V7b9 i ii7b5 V7b9 "
          +"v7b5 I7b9 iv "
          +"iv iv7 ii7b5 V7b9 i i7 bVIma7 "
          +"ii7b5 V7b9 i ii7b5 V7b9 i",
    originalKey:"A"
  },
  {
    name:"Call Me Irresponsible",
    composers:["James Van Heusen","Sammy Cahn"],
    feel:Major,
    chords:"I I6 biidim7 ii7 ii6 biiidim7 "
           +"iii7 vi7 III7 vii7b5 III7b9 VI7sharp5 VI7 "
           +"ii7 V7 iii7b5 VI7b9 "
           +"vi7 II7 vi7 II7 ii7 V7 ii7 V7 "
           +"I I6 biidim7 ii7 ii6 biiidim7 iii7 vi7 "
           +"III7 iii7 VI7 ii7 V7 "
           +"iii7b5 VI7 ii7 V7 VII7sus4 III7 "
           +"iii7b5 VI7 ii7 V7 I6",
    originalKey:"F"
  },
  {
    name:"Dancing On The Ceiling",
    composers:["Richard Rodgers","Lorenz Hart"],
    feel:Major,
    chords:"Ima7 v7 I7 IVma7 bvdim7 iii7 biii7 "
           +"ii7 V7 iii7 VI7b9 ii7 V7 I6 ii7 V7 "
           +"Ima7 v7 I7 IVma7 bvdim7 iii7 biii7 "
           +"ii7 V7 iii7 VI7b9 ii7 V7 I6 "
           +"ii7 V7 Ima7 v7 I7 "
           +"IV6 bVII7 iii7 VI7b9 ii7 V7 "
           +"Ima7 v7 I7 IVma7 bvdim7 iii7 biii7 "
           +"ii7 V7 I6",
    originalKey:"F"
  },
  {
    name:"Darn That Dream",
    composers:["Jimmy Van Heusen","Eddie De Lange"],
    feel:Major,
    chords:"Ima7 biii7 bvi7 ii7 III7 vi7 II7 iv6 III7b5 VI7 "
           +"ii7 bVII7 iii7 biii7 ii7 V7 iii7 VI7 ii7 V7 "
           +"Ima7 biii7 bvi7 ii7 III7 vi7 II7 iv6 III7b5 VI7 "
           +"ii7 bVII7 iii7 biii7 ii7 V7 I6 bvii7 bIII7 "
           +"bVIma7 iv7 bvii7 bIII7 "
           +"i7 vii7 bvii7 bIII7 bVIma7 iv7 ii7b5 V7 i7 "
           +"ii7 V7 bVI7 V7 "
           +"Ima7 biii7 bvi7 ii7 III7 vi7 II7 iv6 III7b5 VI7 "
           +"ii7 bVII7 iii7 biii7 ii7 V7 I6",
    originalKey:"G"
  }
]
