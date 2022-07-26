class Tribe {
  constructor(planet){
    this.numHomes=randi(1,3);
    this.habitantSize = rand(30,70);
    this.sage=undefined;

    this.reputation =0;
    this.planet=planet;
    this.homes = [];
    this.people = [];
    this.peopleAdded=0;

    // create each home and add habitants to occupy them
    for(let i=0; i<this.numHomes; i++) this.populate(i);
  }

  populate(index){

    // create a home
    let home = new StaticObject(0,0,home_png,70);
    this.homes.push(home);
    this.planet.addFeature(home, this.habitantSize+5);

    // add people
    home.numPpl = randi(1,3);
    if(ch(.15)) home.numPpl=randi(1,4);


    for(let i=0; i<home.numPpl; i++) this.addPerson(home);
  }

  addPerson(home){
    let bob = this.planet.addFeature(new Habitant(0,0,this.habitantSize+randi(-5,5),poses[0], this.planet, this), this.habitantSize);
    this.people.push(bob);
    this.peopleAdded ++;

    if(this.numHomes==1&&home.numPpl==1){
      bob.becomeSage();
      this.sage = bob;
    }
    else {
      if(ch(0.1)) bob.becomeCartographer();
      else bob.becomeRegularDude();
      this.planet.totalBobs++;
    }
  }

  everyoneGotAMuffin(){
    //console.log("ALL THE MUFFINS");
    if(!this.planet.prizeAwarded){
      this.planet.prizeAwarded=true;
      let spice=this.planet.language+" "+rBerry()+" spice";
      popupText([
        "Everyone on this planet\nloves you!",
        "You deserve a prize",
        "Obtained a "+spice
      ]);
      AddToInventory({name:spice,type:"spice"});
    }
  }
}
