window.BillPoly = function(attr){


  //Check the attr (attributes) objcet and where it is possible a default value is given.

  if(attr.center)     this.center     = attr.center;      else throw("need 'center' proprety");
  if(attr.edgeNumber) this.edgeNumber = attr.edgeNumber;  else throw("need 'edgeNumber' proprety");
  if(attr.radius)     this.radius     = attr.radius;      else throw("need 'radius' proprety");
  if(attr.color)      this.color      = attr.color;       else this.color = extractColor(myPalette[(this.edgeNumber-3)%(myPalette.length)]);
  if(attr.visible)    this.visible    = attr.visible;     else this.visible = true;


  this.rotation = 0;

  this.currentPivot = 0;
  this.clockwise = (this.edgeNumber % 3 === 0);

  this.child = null;

  this.colorChange = {
    colorIndex      : (this.edgeNumber-3)%(myPalette.length),
    transitionTime  : 3.0 * 60,
    speed           : 1,
    active          : false,
    target          : extractColor(this.color),
  };
  this.alphaChange = {
    visible         : true,
    transitionTime  : 0.5 * 60,
    speed           : 1,
    active          : false,
    target          : 1,
  };

  this.ani = {
    rotation: 0,
    rotation_last: 0,
    duration : attr.duration ? attr.duration : 490
  };


  this.poly = new Path.RegularPolygon(this.center, this.edgeNumber, this.radius);
  this.polyUnitAngle = 360 / this.edgeNumber;
  this.poly.strokeColor = extractColor(this.color);
  // this.poly.shadowBlur = 15;
  // this.poly.shadowColor = 'black';
  // this.poly.firstSegment.selected = true;

  this.balls = [];
};


BillPoly.prototype = {

  setupBalls : function(firstRadius, polygonCount) {

    var ratio = this.poly.bounds.height/2 / firstRadius;
    ratio = (polygonCount + 2 - this.edgeNumber) / (polygonCount + 2);
    for (var c = 0; c < this.poly.curves.length; c++) {
      var v = this.poly.bounds.center - this.poly.curves[c].point1;
      var minDistance = view.center.getDistance(this.poly.bounds.center) + firstRadius + 60;
      var maxDistance = this.poly.bounds.center.y;
      v = v.normalize(minDistance + ratio * (maxDistance - minDistance));
      v += this.poly.bounds.center;
      var b_r = 5;
      var c1 = new Path.Circle({
            center: v,
            radius: b_r,
            fillColor: extractColor(myPalette[Math.floor(Math.random()*myPalette.length)]),
        });
      var c2 = new Path.Arc({
             from:   [v.x+b_r, v.y],
             to:     [v.x-b_r, v.y],
             through: [v.x+b_r/2, v.y+b_r],
             fillColor: extractColor(myPalette[Math.floor(Math.random()*myPalette.length)]),
        });

      this.balls.push(new Group([c1, c2]));

    }
  },

  setPivotPoint : function(tmpPivot) {
    var pivotPoint = new Point(0, 0);
    // Go find all the points that correspond to our common starting pivot point.
    for (var c = 0; c < this.poly.curves.length; c++) {
      if (tmpPivot.getDistance(this.poly.curves[c].point1) < 1) {
        pivotPoint = this.poly.curves[c].point1;
        this.currentPivot = c;
        break;
      }
    }
    if (!this.clockwise) {
      this.nextPivot();
    }
    // Pivot point debug
    // var path = new Path.Circle(pivotPoint, 5*(this.edgeNumber));
    // path.strokeColor = 'black';
  },



  step : function(){

    var a;
    if(this.poly.fillColor !== null) a = this.poly.fillColor.alpha;
    else a = 1;

    this.poly.fillColor = extractColor(this.color);
    this.poly.fillColor.alpha = a;
    this.poly.strokeColor = extractColor(this.color);
    this.stepColor();
    this.stepAlpha();
  },

  changeColor : function(step){
    //force a -1/+1 value on step
    if(step === 0) return;
    else{
      step = step > 0 ? 1 : -1;

      //add -1/+1 to the palette index and check that the index is looping throught the palette
      this.colorChange.colorIndex += step;
      if(this.colorChange.colorIndex == -1) this.colorChange.colorIndex = myPalette.length-1;
      var index = this.colorChange.colorIndex;
      index = (index) % myPalette.length;

      //applay
      this.colorChange.target = extractColor(myPalette[index]);
    }

  },

  changeAlpha : function(){
    this.alphaChange.visible = this.alphaChange.visible ? 0 : 1;
    this.alphaChange.target = this.alphaChange.visible;
  },


  startRotation : function(){
    this.poly.pivot = this.poly.curves[this.currentPivot].point1;

    anime({
      targets: this.ani,
      rotation: 360/(this.edgeNumber+1) - 360/(this.edgeNumber),
      easing: 'easeInOutBack',
      duration: this.ani.duration,

      update: function(){
        var angle = this.ani.rotation - this.ani.rotation_last;
        angle *= this.clockwise ? 1 : -1;
        this.rotateAll(angle);
        this.ani.rotation_last = this.ani.rotation;
      }.bind(this),

      complete: function() {
        var angle = this.ani.rotation - this.ani.rotation_last;
        angle *= this.clockwise ? 1 : -1;
        this.rotateAll(angle);
        this.ani.rotation = 0;
        this.ani.rotation_last = 0;
        this.nextPivot();
        Sounds.note((Math.floor(Math.random()*this.edgeNumber) % Sounds.sNumber));
      }.bind(this),
    });

  },

  nextPivot : function() {
    this.currentPivot += this.clockwise ? 1 : -1;
    this.currentPivot %= this.poly.curves.length;
    if(this.currentPivot < 0) {
      this.currentPivot = this.poly.curves.length - 1;
    }
  },

  doFullRotation : function(){
    this.poly.pivot = this.poly.curves[this.currentPivot].point1;
    var angle = 360/(this.edgeNumber+1) - 360/(this.edgeNumber);
    angle *= this.clockwise ? 1 : -1;
    this.rotateAll(angle);
    this.nextPivot();
  },



  rotateAll : function(angle, pivot) {
    // Default to the current pivot
    if (pivot) {
      this.poly.pivot = pivot;
    }
    // Rotate the poly
    this.poly.rotate(angle);
    for (var i in this.balls) {
      this.balls[i].pivot = this.poly.pivot;
      this.balls[i].rotate(angle);
    }
    // And tell all its child to do the same
    if (this.child) {
      this.child.rotateAll(angle, this.poly.pivot);
    }
    // Reset the pivot
    this.poly.pivot = this.poly.curves[this.currentPivot].point1;
  },


  stepColor : function() {
    //if color and target are identical this function is skipped
    if (
      this.color.red   === this.colorChange.target.red   &&
      this.color.green === this.colorChange.target.green &&
      this.color.blue  === this.colorChange.target.blue
    ) return;

    //look at the differences between the colors components
    var dr = this.color.red   - this.colorChange.target.red;
    var dg = this.color.green - this.colorChange.target.green;
    var db = this.color.blue  - this.colorChange.target.blue;

    //if it is the first step of a transition calculate the speed for the transition
    if(!this.colorChange.active){
      //look at the biggest difference in the color components
      var bigger = Math.abs(dr);
      bigger = Math.abs(dg) > bigger ? Math.abs(dg) : bigger;
      bigger = Math.abs(db) > bigger ? Math.abs(db) : bigger;

      this.colorChange.speed = bigger / this.colorChange.transitionTime;
      //this.colorChange.speed = 0.01;

      this.colorChange.active = true;
    }


    //Change the colors accordingly
    if(dr < 0)    this.color.red   += this.colorChange.speed;
    else          this.color.red   -= this.colorChange.speed;
    if(dg < 0)    this.color.green += this.colorChange.speed;
    else          this.color.green -= this.colorChange.speed;
    if(db < 0)    this.color.blue  += this.colorChange.speed;
    else          this.color.blue  -= this.colorChange.speed;

    //if the color is almost at its target color it make sure it is arrived
    if(Math.abs(dr) < this.colorChange.speed) this.color.red   = this.colorChange.target.red;
    if(Math.abs(dg) < this.colorChange.speed) this.color.green = this.colorChange.target.green;
    if(Math.abs(db) < this.colorChange.speed) this.color.blue  = this.colorChange.target.blue;

    // check if the transition is finished
    if (
      this.color.red  === this.colorChange.target.red   &&
      this.color.green  === this.colorChange.target.green &&
      this.color.blue   === this.colorChange.target.blue
    ) {
      this.colorChange.active = false;
    }
  },

  stepAlpha : function() {
    // if alpha and target are identical this function is skipped
    if (this.poly.fillColor.alpha === this.alphaChange.target) return;

    // look at the differences between the colors components
    var da = this.poly.fillColor.alpha - this.alphaChange.target;

    // if it is the first step of a transition calculate the speed for the transition
    if(!this.alphaChange.active){
      this.alphaChange.speed = da / this.alphaChange.transitionTime;
      this.alphaChange.active = true;
    }

    //Change the colors accordingly
    if(da < 0) {
      this.poly.fillColor.alpha -= this.alphaChange.speed;
    }
    else {
      this.poly.fillColor.alpha -= this.alphaChange.speed;
    }

    //if the color is almost at its target color it make sure it is arrived
    if(Math.abs(da) < this.alphaChange.speed) {
      this.poly.fillColor.alpha = this.alphaChange.target;
    }

    //check if the transition is finished
    if (this.poly.fillColor.alpha === this.alphaChange.target) {
      this.alphaChange.active = false;
    }
  },

};


window.extractColor = function(color){
  return new Color(color.red, color.green, color.blue);
};
