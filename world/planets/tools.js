let randomPlanetName =()=>{
  let name = WorldRandom.randomFromArray(PlanetNames);
  while(usedPlanetNames.includes(name)) name += WorldRandom.randi(100);
  usedPlanetNames.push(name);
  return name;
}
