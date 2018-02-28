var r = 120; // radius
var n = 70; // number of dashes
var l = 0.05; // length of dashes

var numDiscs = 13;

var Discs = [];
var Lines = [];
var smooth=false;

var zoom = false;

var way = 1;
for (var i = 1; i <= numDiscs + 1; ++i) { // creates circles
    var rotate = 10 * way;

    Discs.push(new Path({
        segments: new Circle(i * i * r * 0.02, n, l),
        closed: true,
        // position: view.center.add([0, -(i * i * 15 * 0.1)]),
        position: view.center,
        selected: false,
    }));

    way *= -1;
}

for (var j = 0; j < n; ++j) {
    Lines.push(new Path({
        segments: [],
        fillColor: 'black',
        closed: true,
    }));

    for (var k = 0; k <= numDiscs; ++k) {
        Lines[j].segments.push(Discs[k].segments[j*2]);
    }

    for (k = numDiscs; k >= 0; --k) {
        Lines[j].segments.push(Discs[k].segments[j*2 + 1]);
    }
}

var positionText= ((numDiscs + 1) * (numDiscs+1) * r * 0.02);
var margin = (view.size.width-positionText*2)/2;

project.importSVG('svg/SVG.svg', {
    onLoad: init,
});

function init(item) {
    item.position = [view.center.x, view.size.height*0.9];
    item.scale(2);

    item.onFrame = function(){
        
        if(view.size.height<1500) { item.position = [view.center.x, -500]
        } else {
            item.position = [view.center.x, view.size.height*0.9];
        } 

        item.opacity = zoom? 0 : 1;
    }
}

function Circle(r, n, l) { //circle generator
    var points = [];

    for (var a = 0; a < 2 * Math.PI; a += Math.PI * 2 / n) {
        var x = r * Math.cos(a);
        var y = r * Math.sin(a);
        points.push([x, y]);

        if (a + l < 2 * Math.PI) {
            x = r * Math.cos(a + l);
            y = r * Math.sin(a + l);
            points.push([x, y]);
        }
    }
    return points;
}

function onFrame(event) {


    var way=1;

    for (var i = 0; i <= numDiscs - 1; ++i) {

        var m = r/300+r/100;
        // var m = i > 1 ? 4 : i/((i+1)*0.4);
        // m = zoom  ? m : 4;

        if(zoom && smooth && i < 1){
            m = i/((i+1)*0.4);
        } 

        var x = m*(i+1) * Math.cos(event.count/30*i*0.3);
        var y = m*(i+1) * Math.sin(event.count/30*i*0.3);

        way == 1 ? Discs[i].position=view.center+[y,x]: Discs[i].position=view.center-[y,x];

        way *= -1;
    }

    Discs[numDiscs].position=view.center;

    for (var j = 0; j < n; ++j) { 
        Lines[j].segments=[];

        for (var k = 0; k <= numDiscs; ++k) {
            Lines[j].segments.push(Discs[k].segments[j*2]);
        }

        for (k = numDiscs; k >= 0; --k) {
            Lines[j].segments.push(Discs[k].segments[j*2 + 1]);
        }

        if(smooth) Lines[j].smooth({ from: -numDiscs-1, to: numDiscs });
    }
}

function onMouseDown(event) {
    smooth = !smooth;
    if (!smooth) {
        for (var j = 0; j < n; ++j) { 

            for (var i = 0, l = Lines[j].segments.length; i < l; i++) {
                Lines[j].segments[i].handleIn = Lines[j].segments[i].handleOut = null;
            }
        }
    }
}

function onKeyUp(event) {
    zoom = !zoom;
    console.log(zoom);

    r = zoom ? 300 : 120;


    Discs=[];

    for (var i = 1; i <= numDiscs + 1; ++i) { // creates circles
        var rotate = 10 * way;

        Discs.push(new Path({
            segments: new Circle(i * i * r * 0.02, n, l),
            closed: true,
            // position: view.center.add([0, -(i * i * 15 * 0.1)]),
            position: view.center,
            selected: false,
        }));

        way *= -1;
    }
}




