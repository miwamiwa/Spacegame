let elementCounter =0;

let make=(elementType,parent)=>{
  return new UIElement(elementType,parent);
}

class UIElement{
  constructor(elementType,parent){
    // create element
    this.element = document.createElement(elementType);
    // set parent
    if(parent==undefined) parent = document.body;
    else parent = parent.element;
    this.parent = parent;
    this.children = [];
    // set id
    let id = `el_${elementCounter}`;
    this.element.id= id;
    this.id = id;
    // add to document
    parent.appendChild(this.element);
  }
  setText(str){
    this.element.innerHTML = str;
    return this;
  }
  setClass(classOrClasses){
    this.element.setAttribute("class",classOrClasses);
    return this;
  }
  click(thingToDo){
    this.element.setAttribute("onclick",thingToDo);
    return this;
  }
  make(elementType){
    let el = make(elementType,this);
    this.children.push(el);
    return el;
  }
  clearChildren(){
    this.children.forEach(child=>{
      child.clear();
    });
  }
  clear(){
    this.element.innerHTML = "";
  }
  hide(){
    this.element.hidden = true;
  }
  show(){
    this.element.hidden = false;
  }
}
