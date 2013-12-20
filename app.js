var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var DEFAULT_CAM_Z = 100;

// "Default" camera...
var VIEW_ANGLE = 45,
				ASPECT = WIDTH/HEIGHT,
				NEAR = 0.1,
				FAR = DEFAULT_CAM_Z * 5;

var camera, scene, renderer;
var geometry, threeParticleSystem;

var time;

var stats;

var gridHelper;

// Physics...
var physics;
var PHYS_GRAVITY = 0;
var PHYS_DRAG = 0.01;

var rootWord;
var words = [];
var pendingRecursions = 1;

var MAX_LEVELS = 2;
// var MAX_PARTICLES = 10;
var countQueries = 0;

var DEBUG_LEVEL_COLOURS = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff"];


var video = $("#video")[0];
video.loop	= true;
video.volume	= 0;
video.autoplay= true;

var canvas = $("#trackerCanvas")[0];

if( !navigator.getUserMedia )	throw new Error("navigator.getUserMedia not found.");
if( !window.URL )		throw new Error("window.URL not found.");
if(!window.URL.createObjectURL)	throw new Error("window.URL.createObjectURL not found.");
navigator.getUserMedia(
	{
		video: true,
		audio: false
	},
		function(stream) {
			video.src	= window.URL.createObjectURL(stream);
	}, function(error) {
			alert("Couldn't access webcam.");
	}
);


// Initial values only, can be overridden manually using mouse click...
var targetRed = 150,
	targetGreen = 30,
	targetBlue = 50;



function updateTargetColor(r, g, b) {
    bc = "rgba(" + r + ", " + g + ", " + b + ", 1)";
    $("#targetColor").css("background-color", bc);
}


canvas.addEventListener("click", function(evt) {
    var pos = relMouseCoords(evt, canvas);
    console.log("Clicked " + pos.x + ", " + pos.y);

    ctx.drawImage(video, 0, 0, 320, 240);

    var pixel = ctx.getImageData(parseInt(pos.x), parseInt(pos.y), 1, 1).data;
    targetRed = pixel[0];
    targetGreen = pixel[1];
    targetBlue = pixel[2];

    console.log("BC: " + bc);
    bc = "rgba(" + targetRed + ", " + targetGreen + ", " + targetBlue + ", 1)";
    updateTargetColor(targetRed, targetGreen, targetBlue);
    evt.preventDefault();
    return false;
});



function relMouseCoords(e, elem){
    var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    return {x:mouseX, y:mouseY};
}





var bc;
updateTargetColor(targetRed, targetGreen, targetBlue);

var sensitivity, scale;
var ctx = canvas.getContext("2d");

var trackingRegionleft, trackingRegionRight, trackRegionTop, trackingRegionBottom;
trackingRegionleft=trackingRegionRight=trackRegionTop=trackingRegionBottom = -1;



init();
animate();


function init() {

	console.log("init()");

	document.body.style.background="black";

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.set(0,0,DEFAULT_CAM_Z); // default
	scene.add(camera);

	window.addEventListener( 'resize', onWindowResize, false );

	Mousetrap.bind(['option+h','ctrl+h'], toggleGuiVisibility);

	// helpers
	gridHelper = new THREE.GridHelper( DEFAULT_CAM_Z, 10 );
				gridHelper.setColors( 0x0000ff, 0x808080 );
				gridHelper.position.y = -DEFAULT_CAM_Z/10;
				scene.add( gridHelper );

	// stats
	console.log("Initialising stats...");
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.trackingRegionRight = '0';
	container.appendChild( stats.domElement );


	// setup physics...
	physics = new ParticleSystem(PHYS_GRAVITY, PHYS_DRAG);

	// Get root word (and recursively get other words)...
	geometry = new THREE.Geometry();
	// rootWord = new WC.Word({ text:"connect", startLevel:0 } );


    time = new THREE.Clock( true );
	timedChunk(words, 25);
}


function makeParticles() {
	var sprite = THREE.ImageUtils.loadTexture( "assets/star.png" );
	var material = new THREE.ParticleSystemMaterial ( {
		size:10,
		map:sprite,
		transparent:true
	});
	console.log("Creating particle system with "+geometry.vertices.length+" vertices...");
	threeParticleSystem = new THREE.ParticleSystem( geometry, material );
	scene.add(threeParticleSystem);
}



function onWindowResize() {

	console.log("window resized!");

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize( WIDTH, HEIGHT );
	// TODO: update canvas object size as well?

}


function toggleGuiVisibility() {
	console.log("Toggling GUI...");
	$('#my-gui').toggle();
}



function animate() {

	requestAnimationFrame( animate );
	update();
	render();
	stats.update(); // TODO: only update when stats are ON

}


function update() {
	physics.tick();

	trackingRegionleft=trackingRegionRight=trackRegionTop=trackingRegionBottom = -1;
    ctx.drawImage(video, 0, 0, 320, 240);

	var imageData = ctx.getImageData(0, 0, 320, 240);

	var x, y;

	for(var i = 0, l = imageData.data.length; i < l;i+=4) {
		var red = imageData.data[i];
		var green = imageData.data[i + 1];
		var blue = imageData.data[i + 2];

		x = (i / 4) % 320;
		y = (i / 4) / 320;

		var diff = Math.sqrt(Math.pow(targetRed - red, 2) +
			Math.pow(targetGreen - green, 2) +
			Math.pow(targetBlue - blue, 2));

		if (diff < sensitivity) {

			trackingRegionleft = trackingRegionleft == -1 ? x : Math.min(trackingRegionleft, x);
			trackingRegionRight = trackingRegionRight == -1 ? x : Math.max(trackingRegionRight, x);

			trackRegionTop = trackRegionTop == -1 ? y : Math.min(trackRegionTop, y);
			trackingRegionBottom = trackingRegionBottom == -1 ? y : Math.max(trackingRegionBottom, y);

		}
	}

	ctx.putImageData(imageData, 0, 0);

	if(trackingRegionleft != -1) {

		ctx.strokeStyle = '#ff0000';
		ctx.lineWidth = 2;
		ctx.beginPath();

		var pixelPerScaleValue = scale*10;

		x  = trackingRegionleft*2 - pixelPerScaleValue;
		x2 = trackingRegionRight*2 + pixelPerScaleValue;
		y = trackRegionTop*2 - pixelPerScaleValue;
		y2 = trackingRegionBottom*2 + pixelPerScaleValue;

		var width = x2-x;
		var height = y2-y;

		ctx.rect(x/2, y/2, width/2, height/2);
		ctx.stroke();

	}





	if (pendingRecursions == 0) {
		console.log("done!");
	}
}

function render() {
	renderer.render( scene, camera );
}


function timedChunk(items, timeout) {
    var todo = items.concat();   //create a clone of the original

    setTimeout(function(){
        var start = +new Date();

        do {
             //process.call(context, todo.shift());
            var w = todo.shift();

            if (w != null) {
                w.update(time.getElapsedTime());
            }

        } while (todo.length > 0 && (+new Date() - start < 50));

        if (todo.length > 0){
            setTimeout(arguments.callee, timeout);
        }
        else {
            timedChunk(words, 25);
        }

    }, timeout);
}

