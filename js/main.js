/*	Guillem Martínez Jiménez		
*   In this file you can find the:
*		--> Inicialiation of the app
*		--> The behaviour of some buttons
*	Here is where the graph is executed and the particles are rendered 
*/

/* 
*	Global variables
*/
var graph;
var graphCanvas;
var gl;

var divisionButton;
var glCanvasOptionsButton;

var graphLi;
var glLi;
var root;
var widthCanvasContainer;
var navbar;

var camera;
var time_interval;

/* Demos */
var demo1 = {"last_node_id":10,"last_link_id":13,"nodes":[{"id":2,"type":"basic/constant number","pos":[3,89],"size":[210,58],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Number","type":"number","links":[1]}],"properties":{"number":32.09999999999999}},{"id":3,"type":"basic/constant number","pos":[2,185],"size":[210,58],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Number","type":"number","links":[2]}],"properties":{"number":9.999999999999986}},{"id":4,"type":"init/init","pos":[261,374],"size":[262,186],"flags":{},"order":9,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":3},{"name":"Max speed","type":"vec3","link":6},{"name":"Min speed","type":"vec3","link":7},{"name":"Max life time","type":"number","link":4},{"name":"Min life time","type":"number","link":5},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"max_speed":[0,0,0],"max_size":10,"max_life_time":10,"min_speed":[0,0,0],"min_size":10,"min_life_time":10,"color":[0,0,0,0]}},{"id":1,"type":"spawn/spawn","pos":[265,147],"size":[245.1999969482422,98],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":1},{"name":"Spawn rate","type":"number","link":2},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[3]}],"properties":{"id":1,"max_particles":100,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface"}},{"id":8,"type":"basic/vector 3","pos":[11,391],"size":[140,66],"flags":{},"order":8,"mode":0,"inputs":[{"name":"X","type":"number","link":11},{"name":"Y","type":"number","link":12},{"name":"Z","type":"number","link":13}],"outputs":[{"name":"Vec3","type":"vec3","links":[7]}],"properties":{"x":0,"y":0,"z":0}},{"id":7,"type":"basic/vector 3","pos":[66,290],"size":[140,66],"flags":{},"order":7,"mode":0,"inputs":[{"name":"X","type":"number","link":8},{"name":"Y","type":"number","link":9},{"name":"Z","type":"number","link":10}],"outputs":[{"name":"Vec3","type":"vec3","links":[6]}],"properties":{"x":0,"y":0,"z":0}},{"id":5,"type":"basic/constant number","pos":[-21,533],"size":[210,58],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Number","type":"number","links":[4]}],"properties":{"number":9.999999999999993}},{"id":6,"type":"basic/constant number","pos":[-25,632],"size":[210,58],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Number","type":"number","links":[5]}],"properties":{"number":4.000000000000002}},{"id":9,"type":"basic/constant number","pos":[-188,296],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[8,9,10]}],"properties":{"number":4.000000000000001}},{"id":10,"type":"basic/constant number","pos":[-215,420],"size":[210,58],"flags":{},"order":5,"mode":0,"outputs":[{"name":"Number","type":"number","links":[11,12,13]}],"properties":{"number":-4.000000000000002}}],"links":[[1,2,0,1,0,"number"],[2,3,0,1,1,"number"],[3,1,0,4,0,"particle_system"],[4,5,0,4,3,"number"],[5,6,0,4,4,"number"],[6,7,0,4,1,"vec3"],[7,8,0,4,2,"vec3"],[8,9,0,7,0,"number"],[9,9,0,7,1,"number"],[10,9,0,7,2,"number"],[11,10,0,8,0,"number"],[12,10,0,8,1,"number"],[13,10,0,8,2,"number"]],"groups":[],"config":{},"extra":{},"version":0.4};
var demo2 = {"last_node_id":16,"last_link_id":25,"nodes":[{"id":1,"type":"spawn/spawn","pos":[265,147],"size":[245.1999969482422,98],"flags":{},"order":10,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":1},{"name":"Spawn rate","type":"number","link":2},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[3]}],"properties":{"id":1,"max_particles":98,"spawn_rate":16,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface"}},{"id":8,"type":"basic/vector 3","pos":[11,391],"size":[140,66],"flags":{},"order":13,"mode":0,"inputs":[{"name":"X","type":"number","link":25},{"name":"Y","type":"number","link":12},{"name":"Z","type":"number","link":13}],"outputs":[{"name":"Vec3","type":"vec3","links":[7]}],"properties":{"x":4.000000000000001,"y":-4.000000000000002,"z":-4.000000000000002}},{"id":7,"type":"basic/vector 3","pos":[66,290],"size":[140,66],"flags":{},"order":12,"mode":0,"inputs":[{"name":"X","type":"number","link":8},{"name":"Y","type":"number","link":9},{"name":"Z","type":"number","link":10}],"outputs":[{"name":"Vec3","type":"vec3","links":[6]}],"properties":{"x":4.000000000000001,"y":4.000000000000001,"z":4.000000000000001}},{"id":5,"type":"basic/constant number","pos":[-21,533],"size":[210,58],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Number","type":"number","links":[4]}],"properties":{"number":9.999999999999993}},{"id":6,"type":"basic/constant number","pos":[-25,632],"size":[210,58],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Number","type":"number","links":[5]}],"properties":{"number":4.000000000000002}},{"id":4,"type":"init/init","pos":[364,377],"size":[262,186],"flags":{},"order":14,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":3},{"name":"Max speed","type":"vec3","link":6},{"name":"Min speed","type":"vec3","link":7},{"name":"Max life time","type":"number","link":4},{"name":"Min life time","type":"number","link":5},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[14]}],"properties":{"max_speed":[4,4,4],"max_size":10,"max_life_time":10,"min_speed":[4,-4,-4],"min_size":10,"min_life_time":4,"color":[0,0,0,0]}},{"id":11,"type":"forces/vortex","pos":[385,741],"size":[262,138],"flags":{},"order":15,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":14},{"name":"Position","type":"vec3","link":15},{"name":"Angular speed","type":"vec3","link":17},{"name":"Scale","type":"number","link":21},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"position":[5.900000095367432,0,0],"angular_speed":[19.299999237060547,0,0],"scale":26.09999999999998,"color":[0,0,0,0]}},{"id":12,"type":"basic/vector 3","pos":[83,772],"size":[140,66],"flags":{},"order":9,"mode":0,"inputs":[{"name":"X","type":"number","link":23},{"name":"Y","type":"number","link":null},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[15]}],"properties":{"x":5.900000000000002,"y":0,"z":0}},{"id":16,"type":"basic/constant number","pos":[-212,1053],"size":[210,58],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Number","type":"number","links":[21]}],"properties":{"number":26.09999999999998}},{"id":13,"type":"basic/constant number","pos":[-203,758],"size":[210,58],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Number","type":"number","links":[23]}],"properties":{"number":5.900000000000002}},{"id":3,"type":"basic/constant number","pos":[2,185],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[2]}],"properties":{"number":15.699999999999973}},{"id":2,"type":"basic/constant number","pos":[3,89],"size":[210,58],"flags":{},"order":5,"mode":0,"outputs":[{"name":"Number","type":"number","links":[1]}],"properties":{"number":97.80000000000001}},{"id":14,"type":"basic/vector 3","pos":[71,875],"size":[140,66],"flags":{},"order":11,"mode":0,"inputs":[{"name":"X","type":"number","link":24},{"name":"Y","type":"number","link":null},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[17]}],"properties":{"x":19.29999999999995,"y":0,"z":0}},{"id":15,"type":"basic/constant number","pos":[-220,912],"size":[210,58],"flags":{},"order":6,"mode":0,"outputs":[{"name":"Number","type":"number","links":[24]}],"properties":{"number":19.29999999999995}},{"id":10,"type":"basic/constant number","pos":[-285,426],"size":[210,58],"flags":{},"order":7,"mode":0,"outputs":[{"name":"Number","type":"number","links":[12,13]}],"properties":{"number":-4.000000000000002}},{"id":9,"type":"basic/constant number","pos":[-296,291],"size":[210,58],"flags":{},"order":8,"mode":0,"outputs":[{"name":"Number","type":"number","links":[8,9,10,25]}],"properties":{"number":4.000000000000001}}],"links":[[1,2,0,1,0,"number"],[2,3,0,1,1,"number"],[3,1,0,4,0,"particle_system"],[4,5,0,4,3,"number"],[5,6,0,4,4,"number"],[6,7,0,4,1,"vec3"],[7,8,0,4,2,"vec3"],[8,9,0,7,0,"number"],[9,9,0,7,1,"number"],[10,9,0,7,2,"number"],[12,10,0,8,1,"number"],[13,10,0,8,2,"number"],[14,4,0,11,0,"particle_system"],[15,12,0,11,1,"vec3"],[17,14,0,11,2,"vec3"],[21,16,0,11,3,"number"],[23,13,0,12,0,"number"],[24,15,0,14,0,"number"],[25,9,0,8,0,"number"]],"groups":[],"config":{},"extra":{},"version":0.4};
var demo3 = {"last_node_id":18,"last_link_id":28,"nodes":[{"id":2,"type":"basic/constant number","pos":[3,89],"size":[210,58],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Number","type":"number","links":[1]}],"properties":{"number":32.09999999999999}},{"id":3,"type":"basic/constant number","pos":[2,185],"size":[210,58],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Number","type":"number","links":[2]}],"properties":{"number":9.999999999999986}},{"id":8,"type":"basic/vector 3","pos":[11,391],"size":[140,66],"flags":{},"order":14,"mode":0,"inputs":[{"name":"X","type":"number","link":28},{"name":"Y","type":"number","link":12},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[7]}],"properties":{"x":0.5000000000000004,"y":-4.000000000000002,"z":0}},{"id":7,"type":"basic/vector 3","pos":[66,290],"size":[140,66],"flags":{},"order":13,"mode":0,"inputs":[{"name":"X","type":"number","link":27},{"name":"Y","type":"number","link":9},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[6]}],"properties":{"x":0.5000000000000004,"y":4.000000000000001,"z":0}},{"id":5,"type":"basic/constant number","pos":[-21,533],"size":[210,58],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Number","type":"number","links":[4]}],"properties":{"number":9.999999999999993}},{"id":6,"type":"basic/constant number","pos":[-25,632],"size":[210,58],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Number","type":"number","links":[5]}],"properties":{"number":4.000000000000002}},{"id":17,"type":"forces/magnet point","pos":[374.5019897460934,856.1559078216551],"size":[262,138],"flags":{},"order":16,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":26},{"name":"Position","type":"vec3","link":21},{"name":"Strength","type":"number","link":22},{"name":"Scale","type":"number","link":23},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"position":[9.699999809265137,3.9000000953674316,0],"strength":-7.399999999999954,"scale":18.29999999999998,"color":[0,0,0,0]}},{"id":12,"type":"basic/vector 3","pos":[79,828],"size":[140,66],"flags":{},"order":12,"mode":0,"inputs":[{"name":"X","type":"number","link":19},{"name":"Y","type":"number","link":16},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[21]}],"properties":{"x":9.7,"y":3.900000000000001,"z":0}},{"id":14,"type":"basic/constant number","pos":[-191,936],"size":[210,58],"flags":{},"order":5,"mode":0,"outputs":[{"name":"Number","type":"number","links":[22]}],"properties":{"number":-7.399999999999954}},{"id":16,"type":"basic/constant number","pos":[-210,738],"size":[210,58],"flags":{},"order":6,"mode":0,"outputs":[{"name":"Number","type":"number","links":[19]}],"properties":{"number":9.7}},{"id":13,"type":"basic/constant number","pos":[-209,829],"size":[210,58],"flags":{},"order":7,"mode":0,"outputs":[{"name":"Number","type":"number","links":[16]}],"properties":{"number":3.900000000000001}},{"id":10,"type":"basic/constant number","pos":[-247,443],"size":[210,58],"flags":{},"order":8,"mode":0,"outputs":[{"name":"Number","type":"number","links":[12]}],"properties":{"number":-4.000000000000002}},{"id":9,"type":"basic/constant number","pos":[-252,331],"size":[210,58],"flags":{},"order":9,"mode":0,"outputs":[{"name":"Number","type":"number","links":[9]}],"properties":{"number":4.000000000000001}},{"id":1,"type":"spawn/spawn","pos":[265,147],"size":[245.1999969482422,98],"flags":{},"order":11,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":1},{"name":"Spawn rate","type":"number","link":2},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[3]}],"properties":{"id":1,"max_particles":32,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface"}},{"id":4,"type":"init/init","pos":[317,425],"size":[262,186],"flags":{},"order":15,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":3},{"name":"Max speed","type":"vec3","link":6},{"name":"Min speed","type":"vec3","link":7},{"name":"Max life time","type":"number","link":4},{"name":"Min life time","type":"number","link":5},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[26]}],"properties":{"max_speed":[0.5,4,0],"max_size":10,"max_life_time":10,"min_speed":[0.5,-4,0],"min_size":10,"min_life_time":4,"color":[0,0,0,0]}},{"id":18,"type":"basic/constant number","pos":[-259,229],"size":[210,58],"flags":{},"order":10,"mode":0,"outputs":[{"name":"Number","type":"number","links":[27,28]}],"properties":{"number":0.5000000000000004}},{"id":15,"type":"basic/constant number","pos":[-160,1029],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[23]}],"properties":{"number":18.29999999999998}}],"links":[[1,2,0,1,0,"number"],[2,3,0,1,1,"number"],[3,1,0,4,0,"particle_system"],[4,5,0,4,3,"number"],[5,6,0,4,4,"number"],[6,7,0,4,1,"vec3"],[7,8,0,4,2,"vec3"],[9,9,0,7,1,"number"],[12,10,0,8,1,"number"],[16,13,0,12,1,"number"],[19,16,0,12,0,"number"],[21,12,0,17,1,"vec3"],[22,14,0,17,2,"number"],[23,15,0,17,3,"number"],[26,4,0,17,0,"particle_system"],[27,18,0,7,0,"number"],[28,18,0,8,0,"number"]],"groups":[],"config":{},"extra":{},"version":0.4};

/*    Default Textures    */
var spawner_text;
var vortex_text;
var magnet_text;

/*
* 	Change the width of both canvases depending of the division button position.
*	@method changeCanvasWidth
*	@params {Number} the position of the division button
*/
function changeCanvasSize ( dBPosition ) 
{
	divisionButton.style.left = dBPosition + 'px';

	var canvasHeight = root.height() - navbar.offsetHeight; 
	var graphWidth = dBPosition + divisionButton.halfSize; 	//For repositionate both canvas, use the half of the size of the button
	
	graphLi.width( graphWidth );
	graphLi.height( canvasHeight );

	glLi.width( widthCanvasContainer - graphWidth );
	glLi.height( canvasHeight );
	
	gl.canvas.width  = glLi.width();
	gl.canvas.height = canvasHeight;
	
	camera.resize();
	graphCanvas.resize();
}

/*
* 	Calculus for get the correct position, using percentages, of the division button when the screen is resized.
*	@method reizeElements
*/
function resizeElements ()
{
	//save the old width of the container to know the % that the button was occupying  
	var oldWidthCanvasContainer = widthCanvasContainer;

	//Every time that the screen changes his size, get the size of the container in wich the canvas are inside
	widthCanvasContainer = root.width();
	dBLimit = widthCanvasContainer * 0.15;

	//In order to get the position, and parse to float because in the style is saved as a string
	var posDivisionButton = parseFloat(divisionButton.style.left.split('px')[0]);

	//The % that represent the actual position of the
	//divisionButton over the width of the container 
	//normaly, it will be multiplied by 100 but in the
	//next step is divided by 100 so we can delete both
	//to avoid unnecessary operations
	var percentageValue = posDivisionButton / oldWidthCanvasContainer;
	
	//The value in pixels of the % of the divisionButton in the new width of the container
	var dBPosition = percentageValue * widthCanvasContainer;
	dBPosition = Math.min(Math.max(dBPosition, dBLimit),  widthCanvasContainer - divisionButton.offsetWidth - dBLimit);

	changeCanvasSize(dBPosition);

//	glCanvasOptionsButton.style.top  = $('#menu').height() + 25 + 'px';
//	glCanvasOptionsButton.style.left = widthCanvasContainer - glCanvasOptionsButton.offsetWidth - 10 + 'px';
}

/*
* 	Initialization of the division button.
*	@method initDivisionButton
*/
function initDivisionButton () 
{
	divisionButton = document.getElementById('divisionButton');
	divisionButton.halfSize = divisionButton.offsetWidth * 0.5;
	divisionButton.style.left = (divisionButton.parentElement.offsetWidth - divisionButton.offsetWidth) * 0.5 + 'px';
	divisionButton.limit = widthCanvasContainer * 0.15; //For limit how long we can move the division button
	divisionButton.drag = false; //In order to make the button dragable a new variable is created, by default will be false
	divisionButton.onmousedown = function () { this.drag = true; } //onclick his value will change to true

	document.addEventListener('mousemove', function(e){
		if (divisionButton.drag == true){
			var dBPosition = Math.min(Math.max(e.pageX, divisionButton.limit),  widthCanvasContainer - divisionButton.offsetWidth - divisionButton.limit);
			changeCanvasSize(dBPosition);
		}
	});

	document.addEventListener('mouseup', function(e){
		if (divisionButton.drag == true)
			divisionButton.drag = false;
	});
}

/*
*	Initialization of the buttons in the menu bar
*	@method initMenuButtons
*/
function initMenuButtons ()
{
	var loadInput    = document.getElementById("graphLoader");
	var loadButton   = document.getElementById("load");
	var saveButton   = document.getElementById("save");
	var exportButton = document.getElementById("export");

	var playButton   = document.getElementById("play");
	var resetButton  = document.getElementById("reset");
	var stopButton   = document.getElementById("stop");

	var demoButton   = document.getElementById("demos");
	var helpButton   = document.getElementById("help");

	var showDemo1Button = document.getElementById("defaultDemo");
	var showDemo2Button = document.getElementById("vortexDemo");
	var showDemo3Button = document.getElementById("magnetDemo");

	loadInput.onmouseover = function() {
		loadButton.style.background = "#eceff1";
		loadButton.style.color      = "#455a64";
		loadInput.style.cursor      = "pointer";
	};

	loadInput.onmouseout = function() {
		loadButton.style.background = "#455a64";
		loadButton.style.color      = "#eceff1";
		loadInput.style.cursor      = "default";
	};

	loadInput.addEventListener("change", loadGraph, false);

	function loadGraph(e){
		var file = e.target.files[0];
		  if (!file) {
		    return;
		  }
		
		var reader = new FileReader();
		reader.onload = function(e) {
		    var contents = e.target.result;
		    var ok = graph.configure(JSON.parse(contents));
		    console.log(ok);
		};
		reader.readAsText(file);

	    //Permite volver a cargar el mismo documento sin reiniciar
		loadInput.value = "";
	};

	saveButton.onclick = function() {
		var jsonGraph = graph.serialize();
		jsonGraph = JSON.stringify(jsonGraph);
		jsonGraph = [jsonGraph];

		var blobl = new Blob(jsonGraph, {type: "text/plain;charset=utf-8"});
		
		var url = window.URL || window.webkitURL;
		link = url.createObjectURL(blobl);

		var savedGraph = document.createElement("a");
		savedGraph.download = "Graph.txt";
		savedGraph.href = link;

		document.body.appendChild(savedGraph);
		savedGraph.click();
		document.body.removeChild(savedGraph);
	}

	playButton.onclick = function() {
		graph.start();
	}

	stopButton.onclick = function() {
		graph.stop();
	}

	showDemo1Button.onclick =function() {
		graph.configure( demo1 ); 
		$('#demosModal').modal('hide');
	}

	showDemo2Button.onclick =function() {
		graph.configure( demo2 ); 
		$('#demosModal').modal('hide');
	}

	showDemo3Button.onclick =function() {
		graph.configure( demo3 ); 
		$('#demosModal').modal('hide');
	}
}

/*
*	Addition of all the nodes created 
*	@method addNodes
*/
function addNodes () 
{
	LiteGraph.registerNodeType("basic/constant number", constantNumberNode);
	LiteGraph.registerNodeType("basic/random number"  , randomNumberNode);
	LiteGraph.registerNodeType("basic/load texture"   , textureLoadNode);
	LiteGraph.registerNodeType("basic/load mesh"      , meshLoadNode);
	LiteGraph.registerNodeType("basic/2D geometry"    , geometry2DNode);
	LiteGraph.registerNodeType("basic/equation"       , equationNode);
	LiteGraph.registerNodeType("basic/vector 2"       , vector2Node);
	LiteGraph.registerNodeType("basic/vector 3"       , vector3Node);
	LiteGraph.registerNodeType("basic/vector 4"       , vector4Node);
	LiteGraph.registerNodeType("basic/color picker"   , colorPickerNode);
	
	LiteGraph.registerNodeType("spawn/spawn"          , mySpawnNode);
	LiteGraph.registerNodeType("init/init"            , initParticlesNode);

	LiteGraph.registerNodeType("forces/gravity"       , gravityNode);
	LiteGraph.registerNodeType("forces/vortex"        , vortexNode);
	LiteGraph.registerNodeType("forces/magnet point"  , magnetNode);
	LiteGraph.registerNodeType("forces/noise"         , noiseNode);
	LiteGraph.registerNodeType("forces/path"          , pathNode);

	LiteGraph.registerNodeType("conditions/create condition", createConditionNode);
	LiteGraph.registerNodeType("conditions/merge conditions", mergeConditionsNode);

	LiteGraph.registerNodeType("modify/modify property", modifyPropertyNode);
	
	LiteGraph.registerNodeType("collisions/collisions"            , collisionsNode);
	LiteGraph.registerNodeType("collisions/collidable object list", collidableObjectsListNode);
}

/*
* 	Initialization of both canvases, menu and division buttons.
*	@method init
*/
function init () 
{
	//Inicialization of the graph canvas
	graph = new LGraph();
	graphCanvas = new LGraphCanvas( '#graphCanvas', graph );
	graph.stop(); //by default always will be stoped
	addNodes();

	//Inicialization of the litegl canvas
	gl = GL.create( {width:100, height:100} );
	particleCanvas = document.getElementById( 'particleContainer' );
	particleCanvas.appendChild( gl.canvas );
	particleCanvas.children[0].classList.add( 'gl-canvas' );

	//Canvas containers inicilization
	graphLi = $( '#graphLi' );
	glLi = $( '#particleLi' );
	root = $( '#root' );
	widthCanvasContainer = root.width();	
	navbar = document.getElementById( 'menu' );

	//buttons inicialization
	glCanvasOptionsButton = document.getElementById( 'glOptionButton' );
	initMenuButtons();
	initDivisionButton();

	camera = new Camera( gl ); /**************************************************/

	//Set the default mesh for the forces
	default_forces_mesh = new GL.Mesh({vertices: [0,0,0]});

	//Load the default textures
	spawner_text = GL.Texture.fromURL("default_textures/spawner.png");
	vortex_text  = GL.Texture.fromURL("default_textures/vortex.png");
	magnet_text  = GL.Texture.fromURL("default_textures/magnet_point.png");

	resizeElements(); //First time that the application is executed we need to resize both canvases

	//Listener for the window resize, this is for make the application responsive
	window.addEventListener( 'resize', function(){resizeElements()} );
}

init();

/*************************************************/
/****************SHADER DEFINITION****************/
/*************************************************/
var flatShader     =  new GL.Shader( vs_basic, fs_flat );
var texturedShader =  new GL.Shader( vs_basic, fs_texture );

var particleShaderTextured =  new GL.Shader( vs_particles, fs_texture );
var particleShaderFlat     =  new GL.Shader( vs_particles, fs_flat_p  );

/*************************************************/
/********************RENDER***********************/
/*************************************************/
gl.ondraw = function() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND );
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.DEPTH_TEST);

	//default particles uniforms
	var particles_uniforms = { 
		u_viewprojection : camera.vp,
		u_mvp            : camera.mvp,
		u_right          : camera.getRightVector(),
		u_up             : camera.getUpVector(),
		u_color          : [1,1,1,1]
	};

	//default sytem uniforms
	var system_uniforms = { 
		u_mvp: camera.mvp,
		u_texture: spawner_text,
		model: undefined
	};

	//Render the particles
	for(x in system_list){
		var mesh = searchMesh(system_list[x].mesh_id);
		
		if(system_list[x].texture == undefined)
			particleShaderFlat.uniforms( particles_uniforms ).draw( mesh );
		else
		{
			particles_uniforms.u_texture = system_list[x].texture;
			particles_uniforms.u_texture.bind(0);
			particleShaderTextured.uniforms( particles_uniforms ).draw( mesh );
		}

		if(!system_list[x].visible)
			continue;
		
		system_uniforms.u_model = system_list[x].model;
		system_uniforms.u_color = system_list[x].color;
		system_uniforms.u_texture.bind(0);
		texturedShader.uniforms( system_uniforms ).draw( default_forces_mesh, GL.POINTS );
	}

	//default forces uniforms
	var forces_uniforms = {
		u_mvp: camera.mvp,
		u_model: undefined
	}

	for (x in forces_list){
		var force = forces_list[x];

		if(!force.visible)
			continue;

		forces_uniforms.u_model = force.model;
		forces_uniforms.u_color = force.color;
		
		if (force.type == "vortex")
			forces_uniforms.u_texture = vortex_text;
		else
			forces_uniforms.u_texture = magnet_text;

		forces_uniforms.u_texture.bind(0);
		texturedShader.uniforms( forces_uniforms ).draw( default_forces_mesh, GL.POINTS );
	}

	gl.disable(gl.BLEND);
}

gl.onupdate = function( dt ) {
	time_interval = dt;

	for (x in forces_list)
		mat4.setTranslation(forces_list[x].model, forces_list[x].position);

	for (x in system_list)
		mat4.setTranslation(system_list[x].model, system_list[x].position);

	if(graph.status == LGraph.STATUS_RUNNING)
	graph.runStep();
}

gl.animate(); //calls the requestAnimFrame constantly, which will call ondraw