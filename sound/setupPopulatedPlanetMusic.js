let setupPopulatedPlanetMusic=(planet)=>{

  let bgm = getRandomBGM();

  planet.bgm=bgm;
  //
  //newMusic(planet);

  planet.jazz.bpm = planet.bgm.bpm;
  planet.jazz.beatLength = OneMinute / planet.jazz.bpm;
  planet.jazz.measure = {
    numerator: 4,
    denominator: 4
  }
  planet.jazz.barLength = planet.jazz.measure.numerator * planet.jazz.beatLength;
  planet.jazz.chanceOfShortNote = rand(.2,.9);

  // setup an "m" object for the bar length
  planet.m={}
  planet.m.barlength=planet.bgm.barLength;
}
