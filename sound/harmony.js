let ma7=[0,2,4,5,7,9,11];
let flatOrder=[6,2,5,1,4,0,3];

let newkey=(root,flats)=>{
  let d={
    root:root,
    degrees:Array.from(ma7)
  }

  for(let i=0; i<flats; i++)
    d.degrees[flatOrder[i]]--;

  if(flats==0&&ch(.5)) d.degrees[3]++;

  return d;
}

let nOf=(deg,rel)=>{
  let scale=[];
  for(let i=0; i<7; i++){
    let d = deg +i;
    scale[i]=+rel.degrees[d%7]+flo(d/7)*12;//-deg;
  }
  return{
    scale:scale,
    deg:deg, //rel.root+rel.degrees[deg],
    home:rel
  }
}
