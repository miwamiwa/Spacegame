// grabbed from my last js13k project

class Envelope{

  constructor(a,d,s,r){
    this.a=a;
    this.d=d;
    this.r=r;
    this.s=s;
    this.aS=a*samp; // attack length in samples
    this.dS=d*samp; // decay length in samples
    this.rS=r*samp; // release length in samples
    this.rT=this.aS+this.dS; // release time is attack + decay
  }
  // return envelope level at given time point
  level(i){
    // if during attack
    if(i<this.aS) return i/this.aS;
    // if during decay
    else if(i<this.rT) return 1 - (1-this.s) * (i-this.aS)/this.dS;
    // if during release
    else return this.s*( 1 - (i-this.rT)/this.rS );
  }
}
