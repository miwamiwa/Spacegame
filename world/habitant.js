class Habitant extends AnimObject{
  constructor(x,y,size,frames, planet, tribe){
    console.log("new hab")
    console.log(x,y,size,frames, planet, tribe)
    super(0,0,size,frames,undefined,undefined);
    planetMode(this,true);
    this.muffin=false;
    this.planet = planet;
    this.tribe = tribe;
    this.isSage = false;
    this.name="habitant";
  }

  becomeSage(){
    // i am sage so i have hat
    this.hat=new AnimObject(0,-this.size*0.4,this.size*0.2,Hat);
    this.isSage = true;
    // text and interaction
    this.setTandA(
      ["I am a sage","..."],
      ()=>{
        textCounter=0;
        availableText=undefined;
        this.teachLanguage();
      });
  }

  becomeRegularDude(){
    this.setTandA(NegGreetings,()=>{

      if(!know(this.planet.language)) return;
      let h = haveType(1,"muffin");
      console.log("have muffin: "+h)
      if(!this.muffin){
        if(h){

          this.setFrames(poses[randi(1,4)]);
          this.muffin=true;
          inventory[h.name].num --;
          RefreshInventory();
          this.planet.bobsMuffined++;

          this.setTandA(["Oh!\nA muffin! For me?","Thank you!"],()=>{
            this.setTandA([RandomFromArray(Greetings)],()=>{
              if(this.planet.bobsMuffined==this.planet.tribe.totalBobs){
                this.planet.tribe.everyoneGotAMuffin();
              }
            });
          });
          textCounter=0;
          doneAction=false;
        }
      }
    });
  }

  randomizeKnownLanguage(){
    this.knownLanguage=RandomFromArray(allLanguages);
    while(this.knownLanguage==this.planet.language) this.knownLanguage=RandomFromArray(allLanguages);
  }

  teachLanguage(){
    let k=know(this.planet.language);
    let k2=know(this.knownLanguage);

    if(k&&!k2) teach(this.knownLanguage);
    else if(!k&&k2) teach(this.planet.language);
  }
}
