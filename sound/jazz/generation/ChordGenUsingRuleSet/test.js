let songHarmony = m.Dorian;

// makeSomething()
//
// generate a song
let makeSomething=(hk,harm)=>{

  let homeKey = hk;

  let mode = harm;
  let scaleDegrees = mode.degrees;
  let chordList = [wrap12tone(homeKey+m.Quinte+m.Quinte),wrap12tone(homeKey+m.Quinte),homeKey];
  let currentOrigin = homeKey;
  let origins = [homeKey,homeKey,homeKey];

  let key = chordList[0];

  let returnedToHome = false;
  let abortGeneration = false;
  let specialMotion = "";
  while(!returnedToHome&&!abortGeneration){

    // check if we reached homekey
    if(key==homeKey&&currentOrigin==homeKey){
      returnedToHome=true;
      continue;
    }

    if(specialMotion ==""&&ch(.3)){
      key = wrap12tone(key + m.Quinte);
      chordList.unshift(key);
      currentOrigin=key;
      origins.unshift(currentOrigin);
      console.log("& move by fifth")
      continue;
    }
    else {

      let scaleDegree = getScaleDegree(key, homeKey, mode);
      //console.log(key,homeKey,mode,scaleDegree)
      // this is a scale degree
      if(scaleDegree>=0){
        // up or down a third
        if(!specialMotion&&ch(.4)){
          if(ch(.5)){
            console.log("down a third");
            key = mode.degrees[wrapToScaleDegrees(scaleDegree-2, mode.degrees)]
            chordList.unshift(key);
            currentOrigin = homeKey;
            origins.unshift(currentOrigin);
            specialMotion="third"
            continue;
          }
          else {
            console.log("up a third");
            key = mode.degrees[wrapToScaleDegrees(scaleDegree+2, mode.degrees)]
            chordList.unshift(key);
            currentOrigin = homeKey;
            origins.unshift(currentOrigin);
            specialMotion="third"
            continue;
          }
        }
        else specialMotion="";
        // 2-5 of ? ... specialMotion = "2to5of"
        if(specialMotion ==""&&ch(.2)){
          console.log("2=5 of")
          specialMotion = "2to5of"
          origins.unshift(key);
          origins.unshift(key);
          currentOrigin = key;
          key = wrap12tone(key+ m.Quinte);
          let key2 = wrap12tone(key + m.Quinte);
          chordList.unshift(key);
          chordList.unshift(key2);
          key = key2;
          continue;
        }
        else specialMotion = ""

        // resolve up or down
          let interval = key-homeKey;
          if(ch(.2)&&interval>=-2&&interval<=2){
            chordList.unshift(homeKey);
            origins.unshift(homeKey);
            currentOrigin = homeKey;
            returnedToHome = true;
            console.log("resolve by step/halfstep")
            continue;
          }
        else {
          // last case just move by fifth

          console.log("move by 5th")
          key = mode.degrees[wrapToScaleDegrees(scaleDegree+4, mode.degrees)]
          chordList.unshift(key);
          origins.unshift(currentOrigin);
          continue;

          console.log("lol")
        }

      }
      // this isn't a scale degree
      else {

      // resolve up or down
        let interval = key-homeKey;
        if(ch(.2)&&interval>=-2&&interval<=2){
          chordList.unshift(homeKey);
          currentOrigin=homeKey;
          origins.unshift(currentOrigin);
          returnedToHome = true;
          console.log("*resolve by step/halfstep")
          continue;
        }


        // try tt sub
        if(ch(.5)){

          key = wrap12tone(key+1);
          origins.unshift(key);
          origins.unshift(key);
          currentOrigin = key;
          chordList.unshift(key);
          key = wrap12tone(key+m.Quinte);
          chordList.unshift(key)
          console.log("*tt sub")
          continue;
        }

        // descending 2-5 of ? ... specialMotion = "2to5of"
        else if(ch(.5)){
          console.log("*descending 2=5 of")
          // transpose
          currentOrigin = wrap12tone(key - 2);
          origins.unshift(currentOrigin);
          origins.unshift(currentOrigin);

          //key = wrap12tone(key);
          let key2 = wrap12tone(key + m.Quinte);
          chordList.unshift(key);
          chordList.unshift(key2);
          key = key2;
          continue;
        }

        // otherwise move by 5ths
        key = wrap12tone(key+m.Quinte);
        chordList.unshift(key);
        origins.unshift(key);
        currentOrigin=key;
        console.log("*move by 5th")
        continue;

        console.log("lel")
      }
    }

    // if we found no options abort
    console.log("generation aborted");
    abortGeneration = true;
  }

  console.log("chord list: ",chordList);

  let actualChords = [];
  let result = [];

  for(let i=0; i<chordList.length; i++){
    let chord = getChordUsingDegreeAndOrigin(chordList[i],origins[i],mode);
    for(let j=0; j<chord.length; j++)
      chord[j] = wrap12tone(chord[j])
    actualChords.push(chord);
    console.log(m.Keys[chordList[i]] +" ("+ m.Keys[origins[i]] +")", chord)

    result.push({
      notes:chord,
      key:m.Keys[chordList[i]],
      origin:m.Keys[origins[i]]
    })
  }

  return result;
}


let getChordUsingDegreeAndOrigin=(homeDegree,actualOrigin,mode)=>{
  let originDegree = wrap12tone(homeDegree)// - actualOrigin);
  let originScaleDegree = getScaleDegree(originDegree,actualOrigin,mode);
  if(originScaleDegree!=-1){
    let chordTones = [];

    if(wrap12tone(homeDegree - actualOrigin)==m.v){
      chordTones.push(wrap12tone(actualOrigin+m.Quinte+0))
      chordTones.push(wrap12tone(actualOrigin+m.Quinte+m.TierceMajeure))
      chordTones.push(wrap12tone(actualOrigin+m.Quinte+m.Quinte))
      chordTones.push(wrap12tone(actualOrigin+m.Quinte+m.SeptiemeMineure))
      console.log("dominant")
    }
    else
    for(let i=0; i<7; i+=2){
      chordTones.push(actualOrigin + mode.degrees[wrapToScaleDegrees(i+originScaleDegree, mode.degrees)])
    }
    //console.log(chordTones);
    return chordTones;
  }
  else {
    // find a mode that fits??
    //console.log("no solution ;(")
    let tmpDegree = wrap12tone(homeDegree - actualOrigin);
    // just pick something that has that scale degree loooool
    if(tmpDegree==1) mode = m.Phrygian;
    else if(tmpDegree==2) mode = m.Dorian;
    else if(tmpDegree==3) mode = m.Dorian;
    else if(tmpDegree==4) mode = m.LydianDominant;
    else if(tmpDegree==5) mode = m.Ionian;
    else if(tmpDegree==6) mode = m.LydianDominant;
    else if(tmpDegree==7) mode = m.Phrygian;
    else if(tmpDegree==8) mode = m.Aeolian;
    else if(tmpDegree==9) mode = m.LydianDominant;
    else if(tmpDegree==10) mode = m.Mixolydian;
    else if(tmpDegree==11) mode = m.Ionian;
    console.log("switched to "+mode.name)
    let originScaleDegree2 = getScaleDegree(originDegree,actualOrigin,mode);
    if(originScaleDegree2!=-1){
      let chordTones = [];
      for(let i=0; i<7; i+=2){
        chordTones.push(actualOrigin + mode.degrees[wrapToScaleDegrees(i+originScaleDegree2, mode.degrees)])
      }
      //console.log(chordTones);
      return chordTones;
    }
    else console.log("goddamn!")
  }
  return "";
}

let copyMode=(mode)=>{
  return {
    degrees: Array.from(mode.degrees),
    name: mode.name,

    flats: mode.flats,
    sharps: mode.sharps,
    major: mode.major,
    diminished: mode.diminished,
    augmented: mode.augmented
  }
}

let getScaleDegree=(num,key,mode,reportError)=>{
  let degree = -1;
  for(let i=0; i<mode.degrees.length; i++)
    if(wrap12tone(key+mode.degrees[i])==num) degree = i;

    // error message
    if(degree==-1&&reportError==true){
      console.log(m.Keys[num]+" not a scale degree in "+m.Keys[key]+" "+mode.name)
      //for(let i=0; i<mode.degrees.length; i++)
      //  console.log(num,key,mode.degrees[i],wrap12tone(key+mode.degrees[i]))
    }


  return degree;
}
