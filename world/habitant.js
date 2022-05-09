let teach=(l)=>{

  let t = "hello world"
  let str = "";
  for(let i=0; i<t.length; i++){
    let index = allLanguages.indexOf(l)+2;
    str += String.fromCharCode(t.charCodeAt(i)+index*100);
  }

  availableText2=["I can teach you "+l,"ok now learn...","learn...","learn harder!","good job. let's hear it.",str,"you're a natural!"];
  knownLanguages.push(l);
  refreshCharacterPanel();



  let prizeIndex =0;
  if(Scientist.prizeCount){
    Scientist.prizeCount++;
    prizeIndex = Scientist.prizeCount;
  }

  let prize = {name:"sick_upgrade #"+prizeIndex,type:"upgrade"};

  Scientist.setTandA(
    [
      "oh,\nyou learned a new language!",
    "so cooooooool omg!",
    "TEACH MEEEEEE",
    "...",
    ".........",
    "....",
    "..........",
    str+"!!!",
    "wow thanks bro. you win a "+prize.name,
    "well deserved.\nthanks again, and "+str,
    ""
  ],()=>{
    availableText=undefined;
    AddToInventory(prize);
    Scientist.setTandA([
      "i friggen love science","you.. go explore stuff!"
    ],undefined);
  }
  );
}


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
    this.id="habitant";
  }

  becomeSage(){
    // i am sage so i have hat
    this.hat=new AnimObject(0,-this.size*0.4,this.size*0.2,Hat);
    this.isSage = true;
    this.randomizeKnownLanguage();
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
      let h = haveType(1,"food");
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
