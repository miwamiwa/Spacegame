//currentBGM
let recordingHead = false;

let finishRecording=()=>{

  recordNote({note:0,time:barCounter});

  if(!recordingHead) return;
  createMidiFile();
  recordingHead = false;
}

let createMidiFile=()=>{

  // record last note

  let events = [];
  let tracks = [];
  let maxtracks =0
  for(let i=0; i<noteEvents.length; i++){

    for(let k=0; k<5; k++){
      if(tracks[k]==undefined){
        tracks[k] = [];
      }
      // filler notes
      if(noteEvents[i].pitch[k]==undefined) tracks[k].push(new MidiWriter.NoteEvent({pitch:noteEvents[i].pitch[0], duration:noteEvents[i].duration}))
    }

    for(let j=0; j<noteEvents[i].pitch.length; j++){
      if(j>maxtracks){
        maxtracks =j
      }



      let ev = {pitch:noteEvents[i].pitch[j], duration:noteEvents[i].duration}
      tracks[j].push(new MidiWriter.NoteEvent(ev))
    }

  }
  let recordingTracks = [];
  for(let i=0; i<maxtracks+1; i++){
    var track = new MidiWriter.Track();

    track.addEvent(tracks[i], function(event, index) {
        return {sequential:true};
      }
    );
    recordingTracks.push(track);
  }

  console.log(track);
//  return;


  var write = new MidiWriter.Writer(recordingTracks);
  //console.log(track);
  //console.log(write.base64())
  console.log(write.dataUri());
}

let noteEvents =[];
let runningList = [];
let lastRecordedNote;

let recordNotes=()=>{
  if(!recordingHead) return;

  let templist = [];
  for(let i=0; i<recordedNotes.length; i++){
    let found = false;
    for(let j=0; j<templist.length; j++){
      if(!found && recordedNotes[i].time<templist[j].time){
        templist.splice(j,0,recordedNotes[i]);
        found=true;
      }
    }
    if(!found) templist.push(recordedNotes[i])
  }

  for(let i=0; i<templist.length; i++){
    recordNote(templist[i]);
  }
}

let recordNote=(note)=>{
  if(lastRecordedNote==undefined){
    lastRecordedNote = note;
  }
  else {
    let length = note.time - lastRecordedNote.time;
    if(length==0) runningList.push(lastRecordedNote);
    else {
      let pitches = [];
      for(let i=0; i<runningList.length; i++) pitches.push(toToneFormat(runningList[i].note));

      let duration = `T${flo(length * 4 * 128)}`;
      let ev = {pitch: pitches, duration: duration};
    //  if(pitches.length==1) ev.pitch = pitches[0];
      //console.log(ev, `time: ${note.time} - last time: ${lastRecordedNote.time} =  Length : ${length}`)
      noteEvents.push(ev);
      runningList = [lastRecordedNote];
    }


    lastRecordedNote = note;
  }
}

let convertListToTones=(arr)=>{
  for(let i=0; i<arr.length; i++){
    arr[i] = toToneFormat(arr[i]);
  }
  return arr;
}

let toToneFormat=(note)=>{
  let octave = flo(note / m.Octave) -1;
  let noteName = m.Keys[note%m.Octave];
  return noteName+octave;
}
