
window.PointDrawing = function(point){
  this.point = point;
  this.path = new Path({
		segments: [this.point],
		strokeColor: 'black',
		fullySelected: false,
    opacity: 0,
	});
  this.ani = null;
};

PointDrawing.prototype = {

  onFrame : function(){
    if (!this.path.segments[this.path.segments.length-1].point.isClose(this.point, 1)) {
      this.path.add(this.point);
    }
    if (this.path.segments.length > 100) {
      this.path.removeSegment(0);
    }
  },

  setVisibility : function(visible) {

    if(visible){
      this.path.removeSegments(0,this.path.segments.length -2);
    }

    if (this.ani) {
      this.ani.pause();
    }
    this.ani = anime({
      targets: this.path,
      opacity: visible ? 1 : 0,
      easing: 'easeInOutCirc',
      duration: 500
    });
  }

};
