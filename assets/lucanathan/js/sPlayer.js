window.sPlayer = function(){
  this.N0 = new Audio('sounds/N1.mp3');
  this.N1 = new Audio('sounds/N2.mp3');
  this.N2 = new Audio('sounds/N3.mp3');
  this.N3 = new Audio('sounds/N4.mp3');
  this.N4 = new Audio('sounds/N5.mp3');
  this.N5 = new Audio('sounds/N6.mp3');
  this.active = true;
  this.sNumber = 5;
};

sPlayer.prototype = {

  note : function(n){
    if(this.active){
      this["N"+n].currentTime = 0;
      this["N"+n].play();
    }
  },

};

window.Sounds = new sPlayer();
