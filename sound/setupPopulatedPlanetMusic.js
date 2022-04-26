let setupPopulatedPlanetMusic=(planet)=>{

  //
  newMusic(planet);

  planet.jazz.bpm = randi(190,440);
  planet.jazz.beatLength = OneMinute / planet.jazz.bpm;
  planet.jazz.measure = {
    numerator: 4,
    denominator: 4
  }
  planet.jazz.barLength = planet.jazz.measure.numerator * planet.jazz.beatLength;
  planet.jazz.chanceOfShortNote = rand(.2,.9);
  planet.m={}
  planet.m.barlength=planet.jazz.barLength;
}
