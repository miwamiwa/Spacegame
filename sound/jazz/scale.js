
class Scale{
  constructor(degrees,flats,sharps,name,pt){
    this.degrees=degrees;
    this.flats=flats;
    this.sharps=sharps;
    this.major=degrees.indexOf(4)!=-1;
    this.diminished=degrees.indexOf(6)!=-1;
    this.augmented=degrees.indexOf(8)!=-1;
    this.pt=pt; // passing tone (optional)
    this.name=name;
  }

  // removeAvoidNotes()
  //
  // returns a new array with no avoid notes

  removeAvoidNotes(){
    if(this.lessAvoidNotes==undefined){
      let avoidNotes = m.getAvoidNotes(this);
      let newscale = [];
      for(let i=0; i<this.degrees.length; i++){
        if(avoidNotes.includes(i)) continue;
        newscale.push(this.degrees[i]);
      }
      this.lessAvoidNotes = newscale;
    }

    return this.lessAvoidNotes;
  }
}
