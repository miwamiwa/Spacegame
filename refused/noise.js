const StoragePath = "spacegamestorage";

class Noise{
  constructor(){

    this.size = 20;
    this.grid = [];
    this.grid1d = [];

    let data = localStorage.getItem(StoragePath);
    if(data!=undefined){
      this.grid = data;
      for(let i=0; i<this.grid.length; i++){
        for(let j=0; j<this.grid[i].length; j++){
          this.grid1d.push(this.grid[i][j]);
        }
      }
    }
    else this.newSeed();

    this.count =0;
  }

  newSeed(){
    for(let i=0; i<this.size; i++){
      this.grid[i] = [];
      for(let j=0; j<this.size; j++){
        let num = rand();
        this.grid[i][j] = num;
        this.grid1d.push(num);
      }
    }
    localStorage.setItem(StoragePath, this.grid);
  }

  get(){
    let result = this.grid[this.count];
    this.count = (this.count + 1)%this.grid1d.length;
    return result;
  }
}
