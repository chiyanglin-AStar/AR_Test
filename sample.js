// Sample.js

var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;

init();
animate();

function init()
{
	scene = new THREE.Scene();
  console.log("init ")
	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );

	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	if(document.body != null){
    document.body.appendChild(renderer.domElement);
		console.log("document body not null")
	}else{console.log("document body is null")}
	//document.body.appendChild( renderer.domElement );

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
  console.log("create clock");
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////
  console.log("create ar tool source");
	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		console.log(" on resize ");
		arToolkitSource.onResize()
		console.log("ar tools source on resize ")
		arToolkitSource.copySizeTo(renderer.domElement)
		console.log("ar tools source on copy Size to ")
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
			console.log("ar tools source on copy Size to 2 ")
		}
	}

	arToolkitSource.init(function onReady(){
		onResize()
		console.log("ar tools source init ")
	});

	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});

	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////

	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono'
	});

  console.log("enter ar tool context init helli");
	// copy projection matrix to camera when initialization complete
	if ( arToolkitContext.arController != null )
	{
		 	console.log("ar tools context init ")
			arToolkitContext.init( function onCompleted(){
			camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );

		});
		arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
	}

	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////

	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "data/hiro.patt",
	})

	let geometry1	= new THREE.CubeGeometry(1,1,1);
	let material1	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	});

	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = 0.5;

	markerRoot1.add( mesh1 );
}


function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
	//console.log("update")
}


function render()
{
	renderer.render( scene, camera );
	//console.log("render")
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
