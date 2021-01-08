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
var demo;

var divisionButton;
var glCanvasOptionsButton;

var graphLi;
var glLi;
var root;
var widthCanvasContainer;
var navbar;

var camera;

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

	playButton.onclick = function() {
		graph.start();
	}

	stopButton.onclick = function() {
		graph.stop();
	}
}

/*
*	Addition of all the nodes created 
*	@method addNodes
*/
function addNodes () 
{
	LiteGraph.registerNodeType("basic/contant number", constantNumberNode);
	LiteGraph.registerNodeType("basic/random number" , randomNumberNode);
	LiteGraph.registerNodeType("basic/load texture"  , textureLoadNode);
	LiteGraph.registerNodeType("basic/load mesh"     , meshLoadNode);
	LiteGraph.registerNodeType("basic/2D geometry"   , geometry2DNode);
	LiteGraph.registerNodeType("basic/equation"      , equationNode);
	LiteGraph.registerNodeType("basic/vector 2"      , vector2Node);
	LiteGraph.registerNodeType("basic/vector 3"      , vector3Node);
	LiteGraph.registerNodeType("basic/vector 4"      , vector4Node);
	LiteGraph.registerNodeType("basic/color picker"  , colorPickerNode);
	
	LiteGraph.registerNodeType("particles/spawn", mySpawnNode);
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

	//Loading of the default demos 
	demo = {};
	graph.configure( demo ); //by default charging the first demo

	resizeElements(); //First time that the application is executed we need to resize both canvases

	//Listener for the window resize, this is for make the application responsive
	window.addEventListener( 'resize', function(){resizeElements()} );
}

init();

/**************************************************/
/**************************************************/
/**************************************************/
/**************************************************/
/**************************************************/
var vertex_shader_code_vortex = '\
					precision highp float;\
					attribute vec3 a_vertex;\
					varying vec4 v_color;\
					uniform mat4 u_mvp;\
					\
					void main() {\
						gl_Position = u_mvp * vec4(a_vertex, 1.0);\
						gl_PointSize = 200.0 / gl_Position.z;\
					}';

var fragment_shader_code_vortex = '\
					precision highp float;\
					uniform vec4 u_color;\
					\
					void main() {\
						gl_FragColor = u_color;\
					}';

//Creating the shader
var shader = new GL.Shader( vertex_shader_code_vortex, fragment_shader_code_vortex );

gl.ondraw = function() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND );
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.DEPTH_TEST);

	var my_uniforms2 = { 
		u_mvp: camera.mvp,
		u_color: [0,1,0,1]
	};

	shader.uniforms( my_uniforms2 ).draw( GL.Mesh.cube() );

	gl.disable(gl.BLEND);
}

gl.animate(); //calls the requestAnimFrame constantly, which will call ondraw