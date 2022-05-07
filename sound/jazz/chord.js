
class Chord {
  constructor(chord, homekey){
    this.chordData=this.analyzeSymbol(chord);
    this.homeKey = homekey;
    this.absoluteNotes=this.getRelativeChordTonesFromChordData();
    this.notes=this.getTonesFromChordData(this.chordData,homekey,true);
    this.key= m.Keys[this.chordData.intervalToOrigin];
    this.origin= m.Keys[homekey];

    this.intervalToOrigin= this.chordData.intervalToOrigin;
    this.symbol=this.getChordSymbolFromChordData();
  }

  isDominant7(){
    return this.chordData.isDominant
  }

  // numeral()
  //
  // get roman numeral of this chord

  numeral(chord){
    return this.chordData.romanNumeral;
  }

  // analyzeSymbol()
  //
  // unpack a chord symbol
  analyzeSymbol(chord){
    let scaleDegree = -1;
    let chordname = chord;
    let romanNumeral = "";
    let chordColor = "";
    let isMajor = true;
    let isDiminished = false;

    for(let i=0; i<chord.length; i++){
      if(scaleDegree==-1){
        if(this.isNumeralCharacter(chord[i])){
          romanNumeral += chord[i];
          if(!this.isMajorKeyCharacter(chord[i])) isMajor = false;
        }
        else{
          scaleDegree = m[chord.substring(0,i)];
          chordColor = chord.substring(i, chord.length);
          break;
        }
      }
    }

    if(scaleDegree==-1){
      scaleDegree=m[chord];
      chordColor="";
    }

    // the CHORD DATA OBJECTS
    return {
      intervalToOrigin:scaleDegree,
      chordColor:chordColor,
      romanNumeral:romanNumeral,
      isMajor:isMajor,
      isDiminished:chordColor=="dim7",
      symbol:chord,
      isDominant: isMajor
        && (chordColor.includes("7")||chordColor.includes("9"))
        && !chordColor.includes("ma7")
        // if chord is Major and has a 7th
        // or a 9th (in which case the 7th is assumed)
        // but not a major 7th,
        // then it is a Dominant chord
    }
  }

  isNumeralCharacter(str){
    return str=="b"||str=="i"||str=="v"||this.isMajorKeyCharacter(str)
  }

  isMajorKeyCharacter(str){
    return str=="I"||str=="V"
  }


  // getChordSymbolFromChordData
  //
  // generate a legible chord symbol (as string) from chord data

  getChordSymbolFromChordData(){
    let symbol = m.Keys[m.wrap12tone(this.homeKey+this.chordData.intervalToOrigin)];
    if(!this.chordData.isDiminished&&!this.chordData.isMajor) symbol += "-";
    symbol += this.chordData.chordColor;
    return symbol;
  }

  // getTonesFromChordData()
  //
  // generate chord tones from chord data

  getTonesFromChordData(wrapit){

    // build chord
    let tones = this.absoluteNotes;

    // transpose
    for(let i=0; i<tones.length; i++){
      if(wrapit) tones[i] = this.homeKey +m.wrap12tone(tones[i] +  this.chordData.intervalToOrigin);
      else tones[i] = tones[i] + this.homeKey + this.chordData.intervalToOrigin;
    }

    return tones
  }

  getRelativeChordTonesFromChordData(){
    let tones = [0];
    let third = m.getThird(this.chordData);
    if(third!=undefined) tones.push(third)
    tones = tones.concat(m.getFifthAndSeventh(this.chordData.chordColor));
    return tones;
  }


}
