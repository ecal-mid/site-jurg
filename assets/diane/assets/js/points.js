var scale = 1

window.onload = () => {
  var canvas = document.getElementById('canvas')
  paper.setup(canvas);

  var circles = _.range(0, 20000)
    .map(circle => paper.Path.Circle({
      center: [
        _.random(0, 1000),
        _.random(0, 700),
      ],
      radius: 2,
      fillColor: 'red',
    }))

//zoomUnzoomLoop();
}

var count = 1;
var direction = 1;

function zoomUnzoomLoop() {
  if (count >= 110) {
    direction = -1 * direction;
    count = 0;
  }
  count++
  scale = 1 + direction * 0.01;
  paper.view.scale(scale);
  requestAnimationFrame(zoomUnzoomLoop);
}
