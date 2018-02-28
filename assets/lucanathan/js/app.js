
window.App = function(){

  this.mouse = view.center;
  this.polygons = [];

  this.firstRadius = Math.min(canvas.width, canvas.height)/2 * 0.6;
  this.polygonCount = 6;
  this.firstAngle = 360 / (2 + this.polygonCount);
  this.pointDrawings = [];

  this.setup();

  //Used to activate differents rotation at different intervals
  this.clock = {
    current_time : 0,
    interval : 0.5 * 60,
    situation : 0,
    totalSituations : 33,
  };
};

App.prototype = {

  //Generate all the polygon and resize them in order they share the same side length.
  //It also rotate some of them in order to correct a paper.js irregularity.
  //Ultimetly it moves all of them to the bottom of the biggest one.
  //Call createHierarchy() at the end.
  setup : function(){
    // Create the biggest element first and use it as a starting point for the rest.
    var firstPoly = new BillPoly({
      center: view.center,
      edgeNumber : this.polygonCount + 2,
      radius : this.firstRadius
    });
    // Correct potential paper rotation
    if (firstPoly.edgeNumber % 6 === 0) {
      firstPoly.poly.rotate(firstPoly.polyUnitAngle / 2);
    }
    // Calculate the pivot point for all.
    var tmpPivot = new Point(0, this.firstRadius).rotate(this.firstAngle / 2);
    tmpPivot += view.center;
    firstPoly.setPivotPoint(tmpPivot); // not used
    this.polygons.push(firstPoly);

    // Calculate from this poly the data for the next ones
    this.edgeLength = this.getEdgeLength(firstPoly.edgeNumber);
    this.basePosition = firstPoly.poly.bounds.bottomCenter; // tmp value

    var p;
    for (var i = firstPoly.edgeNumber - 1; i >= 3; i--) {
      // Scale the polygon to the defined side length.
      var l = this.getEdgeLength(i);
      var r = this.firstRadius * (this.edgeLength / l);

      p = new BillPoly({
        center: view.center,
        edgeNumber : i,
        radius : r
      });

      // Rotate the polygons so that they are all downward oriented
      if ((i) % 6 === 0) {
        p.poly.rotate(p.polyUnitAngle / 2);
      }
      // Align their bottom
      p.poly.translate(this.basePosition - p.poly.bounds.bottomCenter);
      // Find their common pivot point.
      p.setPivotPoint(tmpPivot);
      p.setupBalls(this.firstRadius, this.polygonCount);

      this.polygons.push(p);
    }

    // Setup the drawing :
    for (var j = 0; j < p.poly.curves.length; j++) {
      this.pointDrawings.push(new PointDrawing(
        p.poly.curves[j].point1
      ));
    }


    this.createHierarchy();

    // The hitBox that control the changing of the colors
    this.hitBox = new Path.Circle({
      center: view.center,
      radius: this.firstRadius,
      fillColor: 'white',
    });
    this.hitBox.fillColor.alpha = 0.00000001; //HAHAHAHAHAH THE INSIDE JOKE

    this.hitBox.on('mouseenter', function(){
      for(var i in this.polygons){
        this.polygons[i].alphaChange.active = false;
        this.polygons[i].changeAlpha();
      }
      for (var j in this.pointDrawings){
        this.pointDrawings[j].setVisibility(true);
      }
    }.bind(this));
    this.hitBox.on('mouseleave', function(){
      for(var i in this.polygons){
        this.polygons[i].alphaChange.active = false;
        this.polygons[i].changeAlpha();
      }
      for (var j in this.pointDrawings){
        this.pointDrawings[j].setVisibility(false);
      }
    }.bind(this));
  },


  //Give to each polygon a reference of the polygon he contains
  createHierarchy : function(){
    var child;
    for(var i = this.polygons.length-1; i >= 0; i--){
      if (i !== this.polygons.length-1)
        this.polygons[i].child = child;
        child = this.polygons[i];
    }
  },


  //Math calculation of the edge length based on the edge number and radius
  getEdgeLength : function(numberOfEdges) {
    var y1 = Math.sin(2*Math.PI / (numberOfEdges)) * this.firstRadius;
    var x1 = Math.cos(2*Math.PI / (numberOfEdges)) * this.firstRadius;
    return (new Point(this.firstRadius, 0)).getDistance(new Point(x1, y1));
  },


  onFrame : function(){//called by paper event hendler each frame
    for (var i in this.polygons) {
      this.polygons[i].step();
    }
    this.clockStep();
    // Update point drawings.
    for (var j in this.pointDrawings) {
      this.pointDrawings[j].onFrame();
    }
  },


  clockStep : function(){
    this.clock.current_time += 0.8;
    if(this.clock.current_time >= this.clock.interval) this.clockTic();
  },


  clockTic : function(){
    this.clock.current_time = 0;
    // this.clock.situation %= this.clock.totalSituations;
    var i;
    // if(this.clock.situation%2 === 0){
    //   for(i = 0; i < this.polygons.length; i++){
    //     this.polygons[i].changeColor(1);
    //   }
    // }
    if(this.clock.situation % 4 === 1){
      for(i = 0; i < this.polygons.length; i+= 3){
        if(i !== 0) this.polygons[i].startRotation();
      }
    }
    if(this.clock.situation % 4 === 3){
      for(i = 1; i < this.polygons.length; i+= 2){
        if(i !== 0) this.polygons[i].startRotation();
      }
    }
    if(this.clock.situation % 8 === 0) {
      for(i = 0; i < this.polygons.length; i++){
        if(i !== 0) this.polygons[i].startRotation();
      }
    }
    if (this.clock.situation % 60 === 59 && this.clock.situation % 2 === 0) {
        for(i = 0; i < this.polygons.length; i++){
          this.polygons[i].changeColor(1);
        }
    }

    this.clock.situation++;
  },


  onMouseDown : function(){
  },


  onMouseMove : function(_mouse){
    this.mouse = _mouse;
  },

};

//Paper.js event handlers
function onFrame(event) {
  myApp.onFrame();
}
function onMouseDown(event) {
  myApp.onMouseDown();
}
function onMouseMove(event){
  myApp.onMouseMove(event.point);
}


//Instantiating the application
var myApp = new App();
