

          // var myPath = new Path({
          // 	segments: [[40, 180], [80, 180], [85, 170], [200, 20]],
          // 	selected: true
          // });
          //
          // myPath.strokeColor = 'red';
          // myPath.strokeWidth = 10;
          // myPath.strokeCap = 'round';
          //
          // myPath.strokeJoin = 'round';

          // var path
          //
          // var tool = new Tool();
          //
          // tool.maxDistance = 10;
          // tool.minDistance = 10;
          //
          // tool.onMouseDown = function (event)  {
          //     path = new Path();
          //     path.strokeWidth = 10;
          //     path.fillColor = "red";
          //     path.strokeCap = 'square';
          // }
          //
          //
          // tool.onMouseDrag = function (event){
          //     var step = event.delta.rotate(90);
          //     var rightPoint = event.middlePoint + step;
          //     var leftPoint = event.middlePoint - step;
          //     path.insert(0,leftPoint);
          //     path.add(rightPoint);
          //     path.smooth();
          //
          //
          // }
          //
          // tool.onMouseUp = function (event) {
          //     path.closed = true;
          //     path.smooth();
          //
          // }
          // project.importSVG('img/rouge1.svg', function(svg) {
          //     var path = svg.getItem({
          //         class: Path
          //     });
          //
          //     var circle = new Path.Circle({
          //         center: [0, 0],
          //         radius: 10,
          //         fillColor: 'red'
          //     });
          //
          //     var pos = 0;
          //
          //     circle.onFrame = function() {
          //         this.position = path.getPointAt(pos);
          //         pos += 2;
          //         if (pos > path.length) {
          //             pos = 0;
          //         }
          //     }
          // });
