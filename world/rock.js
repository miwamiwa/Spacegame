class Rock extends StaticObject {
  constructor(size){
    super(0, 0, hill_png, size);
    this.name="rock";
    this.isFavorite=false;
    this.id="hill";
    this.collidersize = size * 0.35;


    // setup rock text
    this.setTandA(
      ["This rock...","..."],
      ()=>{
        textCounter=0;
        availableText=undefined;

        // if we dont have a fav yet
        if(player.favoriteRock==undefined){
          availableText2=["This is now your favorite rock!"];
          player.favoriteRock=this;
          this.isFavorite = true;
          this.name="favorite rock";
        }

        // if there is a fav
        else {
          if(player.favoriteRock==this) availableText2=["This rock is your *favorite* rock.","You love this rock!","<3"];
          else availableText2=["You already have a favorite rock!"];
        }
      }
    );
  }
}
