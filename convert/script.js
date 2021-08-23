const c1 = 48;
let filesdropped =0;
let resulttxt = "";
let colors = [];
// dropHandler()
//
// runs when file is dropped.
// loads the file and runs ProcessFile() on it.
function dropHandler(ev){
  console.log('File(s) dropped');
  filesloaded =0;
  filesdropped =0;
  resulttxt = "";
  colors = [];
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // load file:

  // method A
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {

      filesdropped ++;
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        ProcessFile(file);
      }
    }
  }

  // method B
  else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      filesdropped ++;
      ProcessFile(ev.dataTransfer.files[i]);
    }
  }
}


// dragOverHandler()
//
// while dragging,
// Prevent default behavior (Prevent file from being opened)
function dragOverHandler(ev) {
  ev.preventDefault();
}


// ProcessFile()
//
// read file as image before running ConvertImage
function ProcessFile(file){

  let fr = new FileReader();

  console.log(file);

  // handler for when file gets loaded
  fr.onload = function () {
      console.log(fr.result);
      ConvertImage(fr.result, file.name);
  }

  // load file as url
  let result = fr.readAsDataURL(file);
}



// ConvertImage()
//
// convert image to a lightweight string
function ConvertImage(input, filename){
  let img = new Image();
  img.src = input;

  img.onload = function(){

    let w = img.width;
    let h = img.height;
    let c = document.getElementById("canvas");
    c.width =w;
    c.height =h;

    let ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    let data = ctx.getImageData(0,0,w,h).data;


    let buffer = 0;
    let lastindex = 0;
    let result = "";
    let colorbuffer = [];
    let colortxt_temp = "[";

    for(let i=0; i<data.length; i+=4){

      let color = rgba2hex(`rgba(${data[i]},${data[i+1]},${data[i+2]},${data[i+3]})`)

      let index = colors.indexOf(color);
      if(index==-1){
        colors.push(color);
        index = colors.length-1;
      }

      let index2 = colorbuffer.indexOf(index);
      if(index2==-1){

        if(colorbuffer.length>0) colortxt_temp += ",";
        colorbuffer.push(index);
        colortxt_temp += index;
        index = colorbuffer.length-1;
      }
      else index = index2;

      if(index!=lastindex){
        result += String.fromCharCode(c1 + lastindex);
        result += String.fromCharCode(c1 + buffer);
        buffer =0;
      }
      else {
        buffer ++;
      }

      lastindex=index;
    }

    console.log("processed result: ");
    console.log(result);
    console.log(colors);

    colortxt_temp += "]";
    resulttxt += `
let ${filename.replace(".","_")} = {
  w:${w},
  t:"${result}",
  c:${colortxt_temp}
};`;

    filesloaded ++;

    if(filesloaded == filesdropped){

      let colortxt = "[";
      for(let i=0; i<colors.length; i++){
        if(i>0) colortxt += ",";
        colortxt += `"#${colors[i]}"`;
      }
      colortxt += "]";

      let finaltxt = `let all_colors = ${colortxt}
      ${resulttxt}
      `;

      console.log(finaltxt);
      copyToClipboard(finaltxt);
    }

    //console.log(txt);
    //copyToClipboard(txt);
  };


  document.body.appendChild(img);
}

function copyToClipboard(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}


function rgba2hex(orig) {
  var a, isPercent,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim(),
    hex = rgb ?
    (rgb[1] | 1 << 8).toString(16).slice(1) +
    (rgb[2] | 1 << 8).toString(16).slice(1) +
    (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = 01;
  }
  // multiply before convert to HEX
  a = ((a * 255) | 1 << 8).toString(16).slice(1)
  hex = hex + a;

  return hex;
}
