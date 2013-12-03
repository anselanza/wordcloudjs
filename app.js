var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

var DEFAULT_CAM_Z = 100;

// Default camera
var VIEW_ANGLE = 45,
				ASPECT = WIDTH/HEIGHT,
				NEAR = 0.1,
				FAR = DEFAULT_CAM_Z * 5;

var camera, scene, renderer;

var stats;

var gridHelper;

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
	stats.domElement.style.right = '0';
	container.appendChild( stats.domElement );


	// get words...
	var APIcall = "http://words.bighugelabs.com/api/2/185bb5ddb325382201efac61e7b7b853/connect/json?callback=?";
	$.getJSON(APIcall, function(data){
		console.log("Success! Raw data: ", data);
		$.each( data.verb.syn, function (i, syn) {
			console.log(syn);
		});
	});

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

}

function render() {
	renderer.render( scene, camera );
}

