let windowIDCounter =0;
let allWindowsById = [];
let allWindowsByName = [];

class UIWindow {
  constructor(name){
    this.name = name;
    this.element = div();
    this.element.setAttribute("class","uiwindow");

    this.id = windowIDCounter;
    allWindowsById[this.id] = this;
    allWindowsByName[this.name] = this;
    windowIDCounter++;

    this.visible = false;
    this.element.style.hidden=true;
    this.updatePosition(50,50);

    this.closeButton = div();
    this.closeButton.innerHTML = "x";
    this.closeButton.setAttribute("class","uiwindow_closebutton");
    this.closeButton.setAttribute("onclick",`closeWindow(${this.id})`);
    this.element.appendChild(this.closeButton);

    this.titleElement = div();
    this.titleElement.setAttribute("class","uiwindow_title");
    this.titleElement.innerHTML = this.name;
    this.element.appendChild(this.titleElement);

    this.bodyElement = div();
    this.bodyElement.setAttribute("class","uiwindow_body");
    this.bodyElement.innerHTML = ""//"lorem ipsum etc wesh mec"
    this.element.appendChild(this.bodyElement);

    this.close()
  }

  toggle(){
    if(this.visible) this.close();
    else this.open();
  }

  open(){
    this.visible=true;
    this.element.hidden=false;
  }

  close(){
    this.visible=false;
    this.element.hidden=true;
  }

  updatePosition(x,y){
    this.x=x;
    this.y=y;
    this.element.style.left=`${this.x}px`;
    this.element.style.top=`${this.y}px`;
  }

  clearText(){
    this.bodyElement.innerHTML = "";
  }

  setText(txt){
    this.bodyElement.innerHTML = txt;
  }

  addText(txt){
    this.bodyElement.innerHTML += txt;
  }
}


let closeWindow=(id)=>{
  allWindowsById[id].close();
}
