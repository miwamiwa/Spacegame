let setupBarrenPlanetMusic=()=>{

  let tune = [];
  let feel=randi(4);
  let k= newkey(randi(12),feel);
  let k2=newkey(k.root+1+2*randi(3),feel);

  let l=randi(2,5)
  for(let i=0; i<l; i++)
  tune.push(nOf((i*6)%7,k).scale);

  l=randi(2,5);
  for(let i=l-1; i>=0; i--)
  tune.push(nOf((i*3)%7,k2).scale);
  // general settings
  let newmusic={
    scales:tune,
    nL:rand(0.5),
    cType:randi(2),
    pF:randi(280,450), // perc (bass) filter
    cF:randi(200,1125), // chord filter
    cDetune:rand(0.0000001,0.0000035), // chord detune
    t:rand(0.1,1) // "temperament" (drum rate)
  };

  newmusic.barlength=randi(3200,6600);
  getRhythm(newmusic,newmusic.barlength, rand(.3,1));
  newmusic.patt = getNotePattern(newmusic);

  if(ch(.09)) newmusic.patt2 = newmusic.patt;
  else if(ch(.26)) newmusic.patt2 = reverse(newmusic.patt);
  else newmusic.patt2 = getNotePattern(newmusic);

  return newmusic;
}
