/*****************************************/
/************Utility functions************/
/*****************************************/
function cross(a, b){
    var c = {x:0, y:0, z:0};
    
    c.x = a.y*b.z - a.z*b.y;
    c.y = a.z*b.x - a.x*b.z;
    c.z = a.x*b.y - a.y*b.x;

    return c;
}

function mult(a, b){
	var c = {x:0, y:0, z:0};
	
	c.x = a.x * b.x;
	c.y = a.y * b.y;
	c.z = a.z * b.z;

	return c;
}

/*****************************************/
/************INIT the graph***************/
/*****************************************/
var graph = new LGraph();
var canvas = new LGraphCanvas("#graphcanvas", graph);
canvas.resize();
window.addEventListener("resize", function(){canvas.resize()});
graph.status = LGraph.STATUS_RUNNING;

/*****************************************/
/********INIT the particle visor**********/
/*****************************************/
var time_interval = 0;
var particles_list = [];
var meshes_list = [];
var vortex_list = [];
var system_list = [];

var DEG2RAD = Math.PI/180;

var gl = GL.create({width:742, height:608});

var texture = GL.Texture.fromURL("texture.png");
var particleContainer = document.getElementById("particlecontainer");
particleContainer.appendChild( gl.canvas );
particleContainer.style.display = "none";

var mesh = GL.Mesh.cube({size:10});

//Creation basic matrices for cameras and transformation
var proj  =  mat4.create();
var view  =  mat4.create();
var mvp   =  mat4.create(); //View Projection Matrix

var center = vec3.fromValues(0,0,0);
var mouse_blocked = false;

//Setting the camera
var cam_pos = vec3.fromValues(0,0,10);
mat4.perspective(proj, 45 * DEG2RAD, gl.canvas.width / gl.canvas.height, 0.1, 1000);
updateViewMatrix();

//Capture mouse movement
gl.captureMouse(true, true);
gl.onmousemove = function(e) { 
	if(e.dragging) {
		vec3.rotateY(cam_pos,cam_pos,e.deltax * 0.01);
		vec3.scale(cam_pos,cam_pos,1.0 + e.deltay * 0.01);
		//Updating the camera 
		updateViewMatrix();
	}
}

function updateViewMatrix(){
	mat4.lookAt(view, cam_pos, center, [0,1,0]);
	mat4.multiply(mvp, proj, view);
}

function getLocalVector(delta){
	var iView = mat4.create();
	mat4.invert(iView, view);
	var lv = vec4.fromValues(delta[0], delta[1], delta[2], 0.0); //Local vector
	vec4.transformMat4(lv, lv, iView);
	return vec3.fromValues(lv[0], lv[1], lv[2]);
}

function moveCamera(delta){
	var lv = getLocalVector(delta);

	cam_pos[0] = cam_pos[0] - lv[0];
	cam_pos[1] = cam_pos[1] - lv[1];
	cam_pos[2] = cam_pos[2] - lv[2];

	center[0] = center[0] - lv[0];
	center[1] = center[1] - lv[1];
	center[2] = center[2] - lv[2];

	updateViewMatrix();
}

gl.captureKeys();
gl.onkey = function(e){
	if(e.eventType == "keydown"){
		if(e.code == "KeyW")
			moveCamera(vec3.fromValues(0.0, 0.0, 1.0));

		if(e.code == "KeyS")
			moveCamera(vec3.fromValues(0.0, 0.0, -1.0));

		if(e.code == "KeyA") 
			moveCamera(vec3.fromValues(1.0, 0.0, 0.0));

		if(e.code == "KeyD")
			moveCamera(vec3.fromValues(-1.0, 0.0, 0.0));
	}
}

/************************************************/
/********Definition of important classes*********/
/************************************************/
function createMesh(particles){
	var vertices  = new Float32Array(particles * 6 * 3);
	var coords    = new Float32Array(particles * 6 * 2);
	var colors    = new Float32Array(particles * 6);

	var default_vertices  = [-0.5,-0.5,0, 0.5,-0.5,0, -0.5,0.5,0, 0.5,0.5,0, -0.5,0.5,0, 0.5,-0.5,0];
	var default_color     = [1,1,1,1];
	var default_coords    = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];

	for(var i = 0; i < particles; i ++)
	{
		colors.set(default_color, i*4);
		vertices.set(default_vertices, i*6*3)
		coords.set(default_coords, i*6*2);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({vertices : vertices, coords: coords, colors : colors}, null, gl.STREAM_DRAW);

	meshes_list.push(mesh)
}

function updateVertexs(mesh, particle_id, particle){
	var vertex_data = mesh.vertexBuffers.vertices.data;

	particle_id *= 18

	vertex_data[particle_id]   = particle.x
	vertex_data[particle_id+1] = particle.y
	vertex_data[particle_id+2] = particle.z

	vertex_data[particle_id+3] = particle.x + 0.25
	vertex_data[particle_id+4] = particle.y 
	vertex_data[particle_id+5] = particle.z

	vertex_data[particle_id+6] = particle.x 
	vertex_data[particle_id+7] = particle.y + 0.25
	vertex_data[particle_id+8] = particle.z

	vertex_data[particle_id+9]  = particle.x + 0.25 
	vertex_data[particle_id+10] = particle.y + 0.25
	vertex_data[particle_id+11] = particle.z

	vertex_data[particle_id+12] = particle.x
	vertex_data[particle_id+13] = particle.y + 0.25
	vertex_data[particle_id+14] = particle.z

	vertex_data[particle_id+15] = particle.x + 0.25
	vertex_data[particle_id+16] = particle.y
	vertex_data[particle_id+17] = particle.z
}

class Particle {
	constructor() {
		this.model = mat4.create();
		this.size  = 0.4;
	}
}

Particle.prototype.fill = function(system, properties) {
	vx = Math.random() * properties.max_speed_x + properties.min_speed_x;
	vy = Math.random() * properties.max_speed_y + properties.min_speed_y;
	vz = Math.random() * properties.max_speed_z + properties.min_speed_z;

	//Radom definition of the lifetime
	lifetime = Math.random() * properties.max_lifetime_value + properties.min_lifetime_value;

	this.x = system.x;
	this.y = system.y;
	this.z = system.z;

	this.vx = vx;
	this.vy = vy;
	this.vz = vz;

	this.lifetime = lifetime;
};

//Information that we want to assign to an identifier
class SystemInfo {
	constructor(id_) {
		this.id = id_;
		this.mesh_id = meshes_list.length - 1;
		this.particles_list = [];
	}
}

function InitSystemNode() {
	this.properties = {
		x: 0,
		y: 0,
		z: 0,
		maxParticles: 100
    };
    
    var that = this;
    this.size = [140, 40];

	this.particlenumber = this.addWidget("number", "Particle Number",
		this.properties.maxParticles, function(v) {
			that.properties.maxParticles = v;
		},{ min: 0, max: 1000000, step: 10});

	this.addInput("Position","vec3");

	this.addOutput("Particle System", "ParticleSystem");
}

InitSystemNode.title = "Init Particle System";

InitSystemNode.prototype.onAdded = function() {
	this.properties.id = this.id;
	createMesh(this.properties.maxParticles);
	system_list.push(new SystemInfo(this.id));
}

InitSystemNode.prototype.onExecute = function() {
	var position = this.getInputData(0);

	if(position != undefined){
		this.properties.x = position[0]
		this.properties.y = position[1]
		this.properties.z = position[2]
	}

	this.setOutputData(0, this.properties);	
}

/*
InitSystemNode.prototype.onRemoved = function(){
	for(x in meshes_list){
		if (meshes_list[x].id == this.id){
			meshes_list.splice(x, 1);
		}
	}
}*/

LiteGraph.registerNodeType("particles/Init System", InitSystemNode);

//*********************************************//
//  Este nodo inicializa todas las particulas  //
//*********************************************//

function InitParticlesNode() {
	this.properties = {
		min_lifetime_value: 0.5,
		max_lifetime_value: 10,

		min_speed_x: 0.5,
		max_speed_x: 0.5,
	
		min_speed_y: 0.5,
		max_speed_y: 0.5,

		min_speed_z: 0.5,
		max_speed_z: 0.5
	}

	//add some input slots
	this.addInput("Particle System","ParticleSystem");
	this.addInput("Min Lifetime","number");
	this.addInput("Max Lifetime","number");
	this.addInput("Min Speed","vec3");
	this.addInput("Max Speed","vec3");

	this.addOutput("Particle System", "ParticleSystem");
}

InitParticlesNode.prototype.onExecute = function() {
	var system = this.getInputData(0);

	var min_lifetime = this.getInputData(1);
	var max_lifetime = this.getInputData(2);
	var min_speed = this.getInputData(3);
	var max_speed = this.getInputData(4);

	if(min_lifetime != undefined && max_lifetime != undefined){
		this.properties.min_lifetime_value = Math.min(min_lifetime, max_lifetime);
		this.properties.max_lifetime_value = Math.max(min_lifetime, max_lifetime);
	}

	if(min_speed != undefined){
		this.properties.min_speed_x = min_speed[0];
		this.properties.min_speed_y = min_speed[1];
		this.properties.min_speed_z = min_speed[2];
	}

	if(max_speed != undefined){
		this.properties.max_speed_x = max_speed[0];
		this.properties.max_speed_y = max_speed[1];
		this.properties.max_speed_z = max_speed[2];
	}

	if(system != undefined){
		// *****************
	    // Adding the new particle to the global system
	    // *****************
	   	for(x in system_list){
	   		if (system_list[x].id == system.id){
	   			if(system.maxParticles > system_list[x].particles_list.length){	
					var particle = new Particle();
					particle.fill(system, this.properties);
		   			system_list[x].particles_list.push(particle);
				}
	   		}
	   	}
	    // *****************
	}

	this.setOutputData(0, {system: system, properties: this.properties});
}

InitParticlesNode.title = "Init Particles";
LiteGraph.registerNodeType("particles/Init Particles", InitParticlesNode);

/********************************************/
/*************VORTEX NOISE NODE**************/
/********************************************/

class VortexNoise {
	constructor(id_, position_, angularSpeed_, speed_, scale_, lifetime_, actualLife_) {
		this.id = id_;
		this.position = position_;
		this.angularSpeed = angularSpeed_;
		this.speed = speed_;
		this.scale = scale_;
		this.actualLife = actualLife_;
		this.lifetime = lifetime_;
	}
}

function VortexNoiseNode() {
	this.properties = {
		noise: undefined,
		show: true
	}

	var that = this;

	this.addWidget("toggle", "Show Vortex", this.properties.show, 
		function(v){
			that.properties.show = v;
			console.log(v);
		}
	);

	this.addInput("Position", "vec3");
	this.addInput("Speed", "vec3");
	this.addInput("Angular speed", "vec3");
	this.addInput("Scale", "number");
	this.addInput("Lifetime", "number")

	this.addOutput("Vertex Noise", "VortexNoise");
}

VortexNoiseNode.prototype.onAdded = function() {
	vortex_list.push({id: this.id, visible: this.properties.show, 
		mesh: new GL.Mesh({vertices: []})});
}

VortexNoiseNode.prototype.onRemoved = function(){
	for(x in vortex_list){
		if (vortex_list[x].id == this.id){
			vortex_list.splice(x, 1);
		}
	}
}

VortexNoiseNode.prototype.onExecute = function() {
	var position = {x:0, y:0, z:0};
	var speed = {x:0, y:0, z:0};
	var angularSpeed = {x:0, y:0, z:0};
	var scale = 1;
	var lifetime = 10;
	var prop = this.properties;

	if(this.getInputData(0) != undefined)
		position = this.getInputData(0);
	if(this.getInputData(1) != undefined)
		speed = this.getInputData(1);
	if(this.getInputData(2) != undefined)
		angularSpeed = this.getInputData(2);
	if(this.getInputData(3) != undefined)
		scale = this.getInputData(3); 
	if(this.getInputData(4) != undefined)
		lifetime = this.getInputData(4);

	if(this.properties.noise == undefined)
		this.properties.noise = new VortexNoise(this.id, position, angularSpeed, speed, scale, lifetime, lifetime);
	else {
	    this.properties.noise.position = position;
		this.properties.noise.angularSpeed = angularSpeed;
		this.properties.noise.speed = speed;
		this.properties.noise.scale = scale;
		this.properties.noise.lifetime = lifetime;
	}

	for(x in vortex_list){
		if (vortex_list[x].id == this.id){
			vortex_list[x].visible = this.properties.show;
			var buffer = vortex_list[x].mesh.getBuffer("vertices");
			buffer.data = new Float32Array(this.properties.noise.position);
			buffer.upload(gl.DYNAMIC_DRAW);
		}
	}

	this.setOutputData(0, this.properties.noise);	
}

VortexNoiseNode.title = "Vortex Noise";
LiteGraph.registerNodeType("particles/Vortex Noise", VortexNoiseNode);

/********************************************/
/********************************************/
/********************************************/

function BasicMoveNode() {
	this.addInput("Particle System","ParticleSystem");
	this.addInput("Vortex Noise", "VortexNoise");
}

function ApplyVertexNoise(noise, particle){
	var r = {x:0, y:0, z:0};

	var pos = noise.position;

	r.x = particle.x - pos[0];
	r.y = particle.y - pos[1];
	r.z = particle.z - pos[2];
	
	var aS = {x:0, y:0, z:0};
	aS.x = noise.angularSpeed[0];
	aS.y = noise.angularSpeed[1];
	aS.z = noise.angularSpeed[2];
	
	var s = {x:0, y:0, z:0};
	s.x = noise.speed[0];
	s.y = noise.speed[1];
	s.z = noise.speed[2];

	var v = mult(cross(aS, r), s);

	var factor=1/(1+(r.x*r.x+r.y*r.y+r.z*r.z)/noise.scale);

	particle.vx += (v.x)*factor;
	particle.vy += (v.y)*factor;
	particle.vz += (v.z)*factor;

	return particle;
}

BasicMoveNode.prototype.onExecute = function () {
	if(this.getInputData(0) == undefined)
		return;

	var system = this.getInputData(0).system;
	var noise = this.getInputData(1);
	var properties = this.getInputData(0).properties;

	if(system != undefined && properties != undefined){
		for(x in system_list){
			if (system_list[x].id == system.id){
				var mesh = meshes_list[system_list[x].mesh_id];
				var particles = system_list[x].particles_list;

				for (var i = 0; i < particles.length; i++) {
					particles[i].x += particles[i].vx * time_interval;
					particles[i].y += particles[i].vy * time_interval;
					particles[i].z += particles[i].vz * time_interval;
					
					if(noise != undefined)
						particles[i] = ApplyVertexNoise(noise, particles[i]);

					particles[i].lifetime -= time_interval;


					if(particles[i].lifetime <= 0){
						particles[i].fill(system, properties);
					}

					updateVertexs(mesh, i, particles[i]);
				}

				mesh.upload()
			}
		}
	}
}

BasicMoveNode.title = "Basic Movement";
LiteGraph.registerNodeType("particles/Basic Move Particles", BasicMoveNode);

/****************************************************/
/**********Shader and render definition**************/
/****************************************************/
/*****************************************/
/*************Shader Codes****************/
/*****************************************/
var vertex_shader_code_particles = '\
					precision highp float;\
					\
					attribute vec3 a_vertex;\
					attribute vec3 a_normal;\
					attribute vec2 a_coord;\
					\
					varying vec4 v_color;\
					varying vec3 v_normal;\
					varying vec3 v_world_position;\
					varying vec3 v_pos;\
					varying vec2 v_coord;\
					\
					uniform mat4 u_model;\
					uniform mat4 u_viewprojection;\
					uniform mat4 u_mvp;\
					\
					\
					void main() {\
						v_coord = a_coord;\
						v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\
						v_world_position = (u_model * vec4(a_vertex, 1.0)).xyz;\
						gl_Position = u_mvp * vec4(v_world_position, 1.0);\
					}';

var fragment_shader_code = '\
					precision highp float;\
					uniform vec4 u_color;\
					uniform sampler2D u_texture;\
					varying vec2 v_coord;\
					\
					void main() {\
						vec4 color = u_color * texture2D(u_texture, v_coord);\
						if (color.a < 0.1)\
							discard;\
						gl_FragColor = color;\
					}';

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
var shader_part = new GL.Shader( vertex_shader_code_particles, fragment_shader_code );

//Render
gl.ondraw = function() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND );
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.DEPTH_TEST);

	var vp = mat4.create();
	mat4.multiply(vp, view, proj);
	
	var model    = mat4.create();
	var rotation = []
	mat4.getRotation(rotation, view)
	for (var i = 0; i < 4; i++)
		rotation[i] *= -1
	
	mat4.fromRotationTranslation(model, rotation, [])

	
	mat4.lookAt(model, cam_pos, center, [0,1,0]);
	
	texture.bind(0);

	var my_uniforms = { 
		u_viewprojection: vp,
		u_mvp: mvp,
		u_color: [1,1,1,1],
		u_model: model,
		u_texture: 0
	};

	for(x in system_list){
		shader_part.uniforms( my_uniforms ).draw( meshes_list[system_list[x].mesh_id] );
	}

	var my_uniforms2 = { 
		u_mvp: mvp,
		u_color: [0,1,0,1]
	};

	for(vortexid in vortex_list)
		if(vortex_list[vortexid].visible)
			shader.uniforms( my_uniforms2 ).draw(vortex_list[vortexid].mesh, gl.POINTS );

	gl.disable(gl.BLEND);
}

gl.onupdate = function( dt ) {
	time_interval = dt;
	if(graph.status == LGraph.STATUS_RUNNING)
	graph.runStep();
}

gl.animate(); //calls the requestAnimFrame constantly, which will call ondraw


/*********************************************/
/*************Menu Buttons********************/
/*********************************************/
var showWebGL = document.getElementById("showWebGL");
showWebGL.onclick = function(){
	(particleContainer.style.display == "none") ?  
		particleContainer.style.display = "block" :
		particleContainer.style.display = "none";
}

document.getElementById("loadGraph").onmouseover = function() {
	document.getElementById("loadButton").style.background = "#eceff1";
	document.getElementById("loadButton").style.color = "#455a64";
};

document.getElementById("loadGraph").onmouseout = function() {
	document.getElementById("loadButton").style.background = "#455a64";
	document.getElementById("loadButton").style.color = "#eceff1";
};

var saveButton = document.getElementById("saveGraph");
saveButton.onclick = function(){
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

var playButton = document.getElementById("play");
playButton.onclick = function(){
	graph.status = LGraph.STATUS_RUNNING;
}

var stopButton = document.getElementById("stop");
stopButton.onclick = function(){
	graph.status = LGraph.STATUS_STOPPED;
}

var resetButton = document.getElementById("reset");
resetButton.onclick = function(){
	for(node in graph._nodes){
		if(graph._nodes[node].title = "Init Particle System")
			graph._nodes[node].properties.particles = [];
	}
};

var loadFile = document.getElementById("loadGraph");
loadFile.addEventListener("change", loadGraph, false);

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
	document.getElementById("loadGraph").value = "";
};

/*********************************************/
/*********************************************/
/*********************************************/

//LOAD DEMO
/*var demo = {"last_node_id":3,"last_link_id":2,"nodes":[{"id":1,"type":"particles/Init System","pos":[53,150],"size":[210,58],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[1]}],"properties":{"x":0,"y":0,"z":0,"maxParticles":42,"particles":[{"id":3,"x":3.039758100738044,"y":4.057779690581853,"z":4.372834366532603,"vx":0.6317942724121904,"vy":0.8433835464070883,"vz":0.9088656450365922,"lifetime":1.9557236616446527},{"id":5,"x":2.6535186639262025,"y":4.313571820653299,"z":4.180404715690148,"vx":0.549191154612045,"vy":0.8927675998258783,"vz":0.8652063856820718,"lifetime":4.962879267892072},{"id":6,"x":3.866076555551039,"y":4.022628547436367,"z":2.925216617648562,"vx":0.7973725086317877,"vy":0.8296611228656867,"vz":0.6033215533088105,"lifetime":0.6903662044445555},{"id":9,"x":3.649196560492484,"y":3.0051768444452716,"z":3.870448032913014,"vx":0.7552356203092125,"vy":0.6219496704631349,"vz":0.8010256977270469,"lifetime":0.026114054373765683},{"id":11,"x":2.8221019491837995,"y":3.9550653603812322,"z":2.920282148632476,"vx":0.5840696613890122,"vy":0.8185507566363364,"vz":0.6043892943716831,"lifetime":1.6828718614857152},{"id":14,"x":4.172018479790861,"y":3.7847880831789524,"z":4.321855235856675,"vx":0.8664007417709585,"vy":0.7859848221181677,"vz":0.8975172570090407,"lifetime":5.120731472073576},{"id":17,"x":3.8136156902064338,"y":3.8231742471480747,"z":3.8221409404746445,"vx":0.7920347604580961,"vy":0.7940199393467401,"vz":0.7938053359702977,"lifetime":0.9627887410785032},{"id":19,"x":2.589798633323252,"y":3.581218693785106,"z":3.859292400581645,"vx":0.5358917359377463,"vy":0.7410404337585669,"vz":0.7985805836128514,"lifetime":2.8276235252043307},{"id":22,"x":3.213220119218586,"y":3.9038791104075314,"z":2.910905690761871,"vx":0.6672571378974897,"vy":0.8106793513236824,"vz":0.6044785379906156,"lifetime":1.9098280662129739},{"id":24,"x":3.509643507136839,"y":4.3036389402974935,"z":3.6004391427803455,"vx":0.7263861221506551,"vy":0.8907182722753285,"vz":0.7451779708239394,"lifetime":4.737509466827557},{"id":26,"x":4.763518872859673,"y":2.6947639219687676,"z":2.6871470592022026,"vx":0.9858286014047761,"vy":0.5576917860967145,"vz":0.5561154469724936,"lifetime":0.9153577537779451},{"id":28,"x":2.759214016321484,"y":3.94773864240704,"z":4.2853842072669766,"vx":0.5711830617425381,"vy":0.8172187555554448,"vz":0.8871145397822876,"lifetime":5.321687589521513},{"id":30,"x":3.297136569385506,"y":2.5560795359613477,"z":4.802125069783893,"vx":0.6822859397124459,"vy":0.528936879462706,"vz":0.9937175324420452,"lifetime":3.0584722473369705},{"id":32,"x":3.1569737984041626,"y":2.8077334754205756,"z":4.783145432429588,"vx":0.653353987187377,"vy":0.5810766823762707,"vz":0.9898996124562961,"lifetime":3.5758293338689526},{"id":33,"x":3.7871438099748818,"y":4.114108281868067,"z":3.928429051726466,"vx":0.7810927478849694,"vy":0.848528681302427,"vz":0.8102326177321799,"lifetime":1.777760652565016},{"id":35,"x":2.9151702936124675,"y":4.443038837570612,"z":3.3568012496710873,"vx":0.603303861886662,"vy":0.9195011677678391,"vz":0.6947008076852197,"lifetime":2.6437397681853536},{"id":36,"x":2.8741400454480845,"y":3.7771886292804617,"z":2.62630421880389,"vx":0.5927870866673439,"vy":0.7790395067527431,"vz":0.5416713180112972,"lifetime":1.68774966965257},{"id":38,"x":4.781185444617485,"y":4.7064514151972165,"z":3.6040632515170907,"vx":0.9894253845967862,"vy":0.9739598171850761,"vz":0.7458300268938289,"lifetime":3.1265176922236826},{"id":39,"x":4.746533679256059,"y":2.4705439734594363,"z":3.4721587582429225,"vx":0.978965473846967,"vy":0.5095460003175535,"vz":0.7161275519629169,"lifetime":1.5016925718356742},{"id":41,"x":3.5418119364147755,"y":2.4828709766996133,"z":3.0811860729660667,"vx":0.7330197041062628,"vy":0.5138593977738632,"vz":0.6376877553211303,"lifetime":5.082068552726749},{"id":41,"x":2.857540981511918,"y":2.304737775914203,"z":2.8363399160938996,"vx":0.6681680606230234,"vy":0.5389081661262575,"vz":0.6632106952325872,"lifetime":3.86271799700242},{"id":41,"x":2.2840969361063004,"y":2.8460552328504183,"z":2.664238035777657,"vx":0.5534199455503412,"vy":0.6895783217862685,"vz":0.6455253476267527,"lifetime":3.3598245985260444},{"id":41,"x":2.103896995372515,"y":2.274428173911698,"z":3.3914082116982516,"vx":0.5450277372582019,"vy":0.5892049106538642,"vz":0.8785656083954356,"lifetime":5.280122152114778},{"id":41,"x":2.0099496604358853,"y":2.6681756336785845,"z":2.0735103683820046,"vx":0.5594763783564829,"vy":0.7426958344945698,"vz":0.577168719307826,"lifetime":5.514973841156612},{"id":41,"x":1.9662983409594943,"y":3.426629825560009,"z":2.794543780920865,"vx":0.5601742204960358,"vy":0.9762047047880241,"vz":0.7961311625556814,"lifetime":2.8052793845360666},{"id":41,"x":2.7893110910607506,"y":2.355902120247195,"z":1.6861313675180574,"vx":0.8505955154539887,"vy":0.7184282114508546,"vz":0.5141827974203268,"lifetime":7.04502688704965},{"id":41,"x":3.0171421542766357,"y":3.127817227067923,"z":2.974992918191968,"vx":0.9496663275572067,"vy":0.9845020709711684,"vz":0.9363995644432681,"lifetime":2.2357629007133424},{"id":41,"x":1.5418352504732784,"y":2.5327734250994807,"z":2.2460473832095027,"vx":0.568415382204815,"vy":0.9337361913500178,"vz":0.8280313226625636,"lifetime":5.075047803499102},{"id":41,"x":2.1952239211427007,"y":1.88447661473411,"z":1.1995137426043827,"vx":0.9279050806028627,"vy":0.7965544691125824,"vz":0.5070256775610316,"lifetime":5.489684651519365},{"id":41,"x":0.877430108653442,"y":1.1721137397680215,"z":1.1464884796189398,"vx":0.6268723605036504,"vy":0.8374065348119375,"vz":0.8190987890897998,"lifetime":7.0205901903464305},{"id":41,"x":1.1078726339540634,"y":1.2768005006623622,"z":1.2375935666680722,"vx":0.8207375885877198,"vy":0.9458832467782312,"vz":0.9168378461823665,"lifetime":4.328028987392453},{"id":41,"x":1.104329918653268,"y":0.8211552552899839,"z":0.9261498290013066,"vx":0.8284545526379481,"vy":0.6160204465864495,"vz":0.6947860682762992,"lifetime":7.715539290410243},{"id":41,"x":1.1307289727380792,"y":0.7900861919595437,"z":1.1410253599987783,"vx":0.9835975353990384,"vy":0.6872794895158587,"vz":0.9925541477945038,"lifetime":3.358303758951796},{"id":41,"x":0.7709498889568391,"y":0.5413031178556118,"z":0.49969021717095224,"vx":0.784067335505016,"vy":0.5505132037724023,"vz":0.5081922739301223,"lifetime":6.0152965478497755},{"id":41,"x":0.5605796368696998,"y":0.41906972719877694,"z":0.5010514216656713,"vx":0.9348213367160892,"vy":0.6988397308628364,"vz":0.8355522194500838,"lifetime":0.4336162836800588},{"id":41,"x":0.38163518120457823,"y":0.24425594479885526,"z":0.3854559223241521,"vx":0.7901513098964192,"vy":0.5057163601207519,"vz":0.7980619107767611,"lifetime":3.1118152801593904},{"id":40,"x":0.3658460164610155,"y":0.2781576548193118,"z":0.37334931988550346,"vx":0.8786876979172848,"vy":0.6680780939903893,"vz":0.896709106149676,"lifetime":4.711266077912821},{"id":41,"x":0.3155531623591662,"y":0.2327162551415499,"z":0.356088306170482,"vx":0.7897812820052066,"vy":0.5824531782696778,"vz":0.8912345446067322,"lifetime":3.1825595330123773},{"id":41,"x":0.2049867953483658,"y":0.24425060254133935,"z":0.18420752781922115,"vx":0.6151418528412248,"vy":0.7329680331336665,"vz":0.5527856551805963,"lifetime":5.566722776438699},{"id":41,"x":0.16379017516601085,"y":0.22587723594591666,"z":0.224293631971053,"vx":0.5463041380416656,"vy":0.7533887094363089,"vz":0.7481067723261594,"lifetime":7.860159371235458},{"id":41,"x":0.10290389072450551,"y":0.09853644012294502,"z":0.0894020653680411,"vx":0.7705847736415111,"vy":0.7378795871855,"vz":0.6694777993297939,"lifetime":8.987780667269568},{"id":41,"x":0.051811180858320725,"y":0.06609591821666946,"z":0.0895738502358058,"vx":0.5191501089713406,"vy":0.6622837498835754,"vz":0.8975335697918763,"lifetime":0.40799819059678377}],"id":1}},{"id":3,"type":"particles/Init Particles","pos":[308,189],"size":[262,106],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":1},{"name":"Min Lifetime","type":"number","link":null},{"name":"Max Lifetime","type":"number","link":null},{"name":"Min Speed","type":"vec3","link":null},{"name":"Max Speed","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[2]}],"properties":{"min_lifetime_value":0.5,"max_lifetime_value":10,"min_speed_x":0.5,"max_speed_x":0.5,"min_speed_y":0.5,"max_speed_y":0.5,"min_speed_z":0.5,"max_speed_z":0.5}},{"id":2,"type":"particles/Basic Move Particles","pos":[613,264],"size":[140,26],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":2}],"properties":{}}],"links":[[1,1,0,3,0,"ParticleSystem"],[2,3,0,2,0,"ParticleSystem"]],"groups":[],"config":{},"version":0.4};
var demoVortex = {"last_node_id":23,"last_link_id":34,"nodes":[{"id":3,"type":"particles/Init Particles","pos":[308,189],"size":[262,106],"flags":{},"order":20,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":1},{"name":"Min Lifetime","type":"number","link":32},{"name":"Max Lifetime","type":"number","link":33},{"name":"Min Speed","type":"vec3","link":24},{"name":"Max Speed","type":"vec3","link":28}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[2]}],"properties":{"min_lifetime_value":2.9000000000000004,"max_lifetime_value":4.300000000000006,"min_speed_x":2.700000047683716,"max_speed_x":3.4000000953674316,"min_speed_y":-1.399999976158142,"max_speed_y":1.399999976158142,"min_speed_z":-1.399999976158142,"max_speed_z":1.399999976158142}},{"id":10,"type":"math3d/xyz-to-vec3","pos":[45,809],"size":[140,66],"flags":{},"order":18,"mode":0,"inputs":[{"name":"x","type":"number","link":14},{"name":"y","type":"number","link":13},{"name":"z","type":"number","link":15}],"outputs":[{"name":"vec3","type":"vec3","links":[16]}],"properties":{"x":0,"y":0,"z":0}},{"id":8,"type":"math3d/xyz-to-vec3","pos":[47,699],"size":[140,66],"flags":{},"order":15,"mode":0,"inputs":[{"name":"x","type":"number","link":7},{"name":"y","type":"number","link":8},{"name":"z","type":"number","link":9}],"outputs":[{"name":"vec3","type":"vec3","links":[10]}],"properties":{"x":0,"y":0,"z":0}},{"id":5,"type":"math3d/xyz-to-vec3","pos":[48,588],"size":[140,66],"flags":{},"order":19,"mode":0,"inputs":[{"name":"x","type":"number","link":4},{"name":"y","type":"number","link":31},{"name":"z","type":"number","link":30}],"outputs":[{"name":"vec3","type":"vec3","links":[3]}],"properties":{"x":0,"y":0,"z":0}},{"id":13,"type":"basic/const","pos":[20,1010],"size":[180,30],"flags":{},"order":0,"mode":0,"outputs":[{"name":"value","type":"number","links":[18],"label":"9.300"}],"properties":{"value":9.299999999999828}},{"id":7,"type":"basic/const","pos":[-230,710],"size":[180,30],"flags":{},"order":1,"mode":0,"outputs":[{"name":"value","type":"number","links":[7,8,9],"label":"0.300"}],"properties":{"value":0.30000000000000093}},{"id":6,"type":"basic/const","pos":[-477,560],"size":[180,30],"flags":{},"order":2,"mode":0,"outputs":[{"name":"value","type":"number","links":[4],"label":"10.900"}],"properties":{"value":10.900000000000011}},{"id":2,"type":"particles/Basic Move Particles","pos":[612,418],"size":[179,60],"flags":{},"order":22,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":2},{"name":"Vortex Noise","type":"VortexNoise","link":34}],"properties":{}},{"id":16,"type":"basic/const","pos":[-473,198],"size":[180,30],"flags":{},"order":3,"mode":0,"outputs":[{"name":"value","type":"number","links":[23],"label":"2.700"}],"properties":{"value":2.7000000000000015}},{"id":14,"type":"basic/const","pos":[-514,281],"size":[180,30],"flags":{},"order":4,"mode":0,"outputs":[{"name":"value","type":"number","links":[21,22],"label":"-1.400"}],"properties":{"value":-1.3999999999999997}},{"id":15,"type":"math3d/xyz-to-vec3","pos":[-164,238],"size":[140,66],"flags":{},"order":16,"mode":0,"inputs":[{"name":"x","type":"number","link":23},{"name":"y","type":"number","link":21},{"name":"z","type":"number","link":22}],"outputs":[{"name":"vec3","type":"vec3","links":[24]}],"properties":{"x":0,"y":0,"z":0}},{"id":17,"type":"basic/const","pos":[-354,363],"size":[180,30],"flags":{},"order":5,"mode":0,"outputs":[{"name":"value","type":"number","links":[25],"label":"3.400"}],"properties":{"value":3.4000000000000083}},{"id":18,"type":"basic/const","pos":[-377,455],"size":[180,30],"flags":{},"order":6,"mode":0,"outputs":[{"name":"value","type":"number","links":[26,27],"label":"1.400"}],"properties":{"value":1.4000000000000008}},{"id":19,"type":"math3d/xyz-to-vec3","pos":[-63,380],"size":[140,66],"flags":{},"order":17,"mode":0,"inputs":[{"name":"x","type":"number","link":25},{"name":"y","type":"number","link":26},{"name":"z","type":"number","link":27}],"outputs":[{"name":"vec3","type":"vec3","links":[28]}],"properties":{"x":0,"y":0,"z":0}},{"id":1,"type":"particles/Init System","pos":[-183,-65],"size":[210,58],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[1]}],"properties":{"x":0,"y":0,"z":0,"maxParticles":80,"particles":[{"id":79,"x":43.49284282670012,"y":-6.900622652883452,"z":11.247048768111169,"vx":7.214040745714968,"vy":-0.9434993996607984,"vz":0.9990779941414247,"lifetime":0.355429460760611},{"id":79,"x":36.37249543807183,"y":-9.356427607407893,"z":13.32291298299773,"vx":6.49529496704519,"vy":-1.3247324386492587,"vz":1.4978011475111617,"lifetime":0.6125325787701064},{"id":79,"x":48.90391863231806,"y":-1.0249011567865134,"z":2.751830557870927,"vx":7.5924827894296145,"vy":-0.13741648756528754,"vz":-0.5832115553992125,"lifetime":0.6631893100141406},{"id":79,"x":35.39801549116055,"y":-7.738364638125327,"z":-2.165786660564945,"vx":5.758120895443563,"vy":-1.2227587517253418,"vz":-1.6063525087693917,"lifetime":1.6181519864492007},{"id":79,"x":40.3655759876413,"y":-0.8666685307029702,"z":3.256469727081399,"vx":7.471520774547645,"vy":-0.14163015873011495,"vz":-0.3525951448207594,"lifetime":0.16599133483085282},{"id":79,"x":20.621469937411785,"y":-8.506729039669766,"z":5.3894124019060925,"vx":4.38281184672299,"vy":-1.4781552233166368,"vz":1.0139848498311717,"lifetime":0.061968131768783685},{"id":79,"x":29.53206315217349,"y":-2.694083182266346,"z":9.475000743585289,"vx":7.141924926403855,"vy":-0.5334796100013147,"vz":1.7789643589026531,"lifetime":0.1456973645636932},{"id":79,"x":35.16263902179154,"y":-6.22369000140115,"z":4.268665626669976,"vx":7.287314076028052,"vy":-1.129772551825938,"vz":0.09500224542029931,"lifetime":1.631247529477183},{"id":79,"x":34.738294744233016,"y":-3.115828034597674,"z":8.165088417632523,"vx":7.878407763709442,"vy":-0.6078901250421698,"vz":1.4586483119627562,"lifetime":1.160870539761067},{"id":79,"x":37.12277185071177,"y":-1.6208281132241822,"z":0.9540760579703742,"vx":7.35584227843505,"vy":-0.28231824394672483,"vz":-0.8429033668166618,"lifetime":0.25146842570899786},{"id":79,"x":33.455467747315666,"y":-4.846723322984967,"z":4.487444442491874,"vx":7.1713996498363555,"vy":-0.9027685622756585,"vz":0.25082960258619813,"lifetime":2.173822224317764},{"id":79,"x":24.469034249618186,"y":-4.705685201365417,"z":8.23898710839277,"vx":6.4921817494221665,"vy":-0.9541805974496576,"vz":1.892606965087427,"lifetime":0.9765573727862566},{"id":79,"x":30.228510839046816,"y":-0.8772780547526381,"z":6.389738128834402,"vx":7.420801288794703,"vy":-0.20612655017426323,"vz":0.9263522108257334,"lifetime":1.5013125399082057},{"id":79,"x":21.329048596853713,"y":-4.559566274005454,"z":6.898273891044227,"vx":6.077090290072315,"vy":-0.989921901272968,"vz":1.9853936575920426,"lifetime":1.4767805471139797},{"id":79,"x":21.830468930112616,"y":-1.5230014592533385,"z":7.347594335693143,"vx":6.77432323531169,"vy":-0.4079998901895099,"vz":2.3784117755947065,"lifetime":2.3823784354031456},{"id":79,"x":21.66345348741039,"y":-1.040904393979749,"z":5.294901197576077,"vx":6.491915992006602,"vy":-0.293026218991501,"vz":1.6303643349737005,"lifetime":2.682719729977693},{"id":79,"x":16.57702315109017,"y":-6.124298694375935,"z":3.1709083347219225,"vx":4.331345777288465,"vy":-1.420693876062322,"vz":1.143701526472667,"lifetime":0.6452062461956931},{"id":78,"x":16.14970920491618,"y":-1.5205041465514055,"z":6.198387362654738,"vx":6.023743432804496,"vy":-0.46784346075725086,"vz":3.02030918042437,"lifetime":0.405734819395712},{"id":79,"x":24.532248229185388,"y":-6.145938005445467,"z":4.343687048564012,"vx":6.873204457575594,"vy":-1.4799217763987458,"vz":0.7367150091383676,"lifetime":2.018377402144642},{"id":79,"x":30.873687961358907,"y":-2.1911725182443575,"z":5.1817271098561255,"vx":8.763041979587346,"vy":-0.55170640381921,"vz":0.7823818462274169,"lifetime":0.9272707941024727},{"id":79,"x":21.76248268275135,"y":-3.8413782798600833,"z":5.499678991048095,"vx":6.994726025396803,"vy":-0.9851415733563955,"vz":1.6295179236697832,"lifetime":2.8582397987221198},{"id":79,"x":18.353972714228433,"y":-3.40440068018042,"z":5.714211665523257,"vx":6.433789081938876,"vy":-0.9128124228377705,"vz":2.288722399257237,"lifetime":1.6291960828709193},{"id":79,"x":19.17951571026722,"y":-2.962373582051809,"z":5.481866706320089,"vx":6.835315374994905,"vy":-0.8260079291873811,"vz":2.2040874824415737,"lifetime":1.8709578274859844},{"id":78,"x":24.60665323499228,"y":-2.928291029407092,"z":4.951433415074488,"vx":8.149377596875453,"vy":-0.8152908503970354,"vz":1.2571001022744326,"lifetime":0.7977056076046658},{"id":79,"x":18.364237858016068,"y":-2.1394128761970035,"z":5.79948939793729,"vx":6.922506467131578,"vy":-0.6447907250504734,"vz":2.268892435223341,"lifetime":2.3835940027155473},{"id":79,"x":25.464542944310285,"y":-3.6542358440615863,"z":4.894836753538419,"vx":8.513634583139932,"vy":-1.0494874017830826,"vz":1.1109603547550073,"lifetime":3.527971033849602},{"id":78,"x":16.709716299926363,"y":-5.059701778909755,"z":2.79190031063773,"vx":5.49363678974678,"vy":-1.4648994738991281,"vz":1.1553548097524697,"lifetime":2.81855170442922},{"id":78,"x":18.545423486356583,"y":-1.137258780407532,"z":4.630512231380373,"vx":7.308522561562883,"vy":-0.40028424139848906,"vz":1.946739882124013,"lifetime":1.423104385622418},{"id":77,"x":14.826575726417527,"y":-1.61807208609164,"z":4.708274579272104,"vx":6.350701388527112,"vy":-0.5657914421310999,"vz":2.8164822776295937,"lifetime":1.1010381050949105},{"id":77,"x":18.696796287847306,"y":-2.946962163628894,"z":4.116691737751728,"vx":7.180225457009599,"vy":-0.9166908510998333,"vz":1.8162971369039016,"lifetime":2.0692458758085293},{"id":78,"x":10.85048613733022,"y":-2.081888240652559,"z":4.566917508201399,"vx":4.534323281758161,"vy":-0.6975551248678651,"vz":3.272931287244595,"lifetime":2.244767001577177},{"id":79,"x":24.377407433682862,"y":-1.036116326136805,"z":4.3349612605651435,"vx":8.514505309681578,"vy":-0.334036641460087,"vz":0.9762100677287066,"lifetime":1.1881743560024125},{"id":79,"x":12.440717655619578,"y":-3.586462798431558,"z":3.2612944843912413,"vx":4.8702069322712775,"vy":-1.142471956829724,"vz":2.7809830603279946,"lifetime":1.1442191281948313},{"id":79,"x":9.015485144710166,"y":-3.9361031193753844,"z":3.270454962191109,"vx":3.4675018279797296,"vy":-1.3000043251178615,"vz":2.7847570743600176,"lifetime":1.8836712282163592},{"id":79,"x":18.318954636178674,"y":-0.9313927677063563,"z":4.915422644417768,"vx":7.5883665464355,"vy":-0.35606649601515833,"vz":1.895699831943021,"lifetime":1.0629789169838766},{"id":79,"x":11.188636387793231,"y":-3.938197847422767,"z":2.608676348942043,"vx":4.59116999228733,"vy":-1.4067851369384126,"vz":2.5696190975646696,"lifetime":2.719731424437361},{"id":79,"x":11.553015704333513,"y":-2.3201600025700317,"z":2.195541237062175,"vx":5.1391295001646515,"vy":-0.898363587521462,"vz":3.263685892747537,"lifetime":2.627655843293798},{"id":79,"x":17.721385769398918,"y":-2.1225086084376037,"z":3.768310704520736,"vx":8.035354888540873,"vy":-0.804298336197215,"vz":1.7792950789285524,"lifetime":1.7935791927983038},{"id":79,"x":9.722058856498991,"y":-3.5009544497839276,"z":0.1651745807395648,"vx":3.058571047471877,"vy":-1.2960431221900446,"vz":2.0515952568558293,"lifetime":2.5149240794115917},{"id":79,"x":10.358152934411672,"y":-3.6056702168792163,"z":1.7158282434670429,"vx":4.221361066397983,"vy":-1.3854973881836437,"vz":2.487708452098834,"lifetime":2.6331322324179727},{"id":79,"x":10.507841849673877,"y":-3.4724651600834573,"z":1.37186760042161,"vx":4.5136775251347085,"vy":-1.4415313322071692,"vz":2.336623667117873,"lifetime":2.408046794210742},{"id":79,"x":7.943295719952335,"y":-1.870472054843944,"z":1.8345922253230562,"vx":3.5420834721327368,"vy":-0.8199855049201898,"vz":2.403602857455137,"lifetime":1.6981179234510586},{"id":78,"x":12.507767134840485,"y":-0.5067265780205481,"z":0.7247118483274934,"vx":4.969910851538793,"vy":-0.22958523189871993,"vz":1.170023867925531,"lifetime":1.534534366265186},{"id":79,"x":7.23051908741419,"y":-1.420357646986962,"z":1.0765190591217466,"vx":3.1399996959579344,"vy":-0.6468723469664087,"vz":1.9851778782149472,"lifetime":4.4681796787008246},{"id":79,"x":8.229352971150055,"y":-0.9691488834452421,"z":0.08363649190225637,"vx":3.292868259930001,"vy":-0.45862485589013685,"vz":1.8436071140117825,"lifetime":2.24430660801727},{"id":79,"x":11.000902314870201,"y":-2.8491620199143517,"z":0.5981672703824945,"vx":4.643576354055215,"vy":-1.2831367686020387,"vz":2.2044730805120483,"lifetime":1.3843736780522393},{"id":79,"x":9.340243682107728,"y":-2.277324392116555,"z":1.5989394964571662,"vx":4.486824489110262,"vy":-1.0564441624496375,"vz":2.5569185670526084,"lifetime":2.9165066571782177},{"id":79,"x":9.381254109219219,"y":-0.42255704003875266,"z":2.2981956059864137,"vx":4.822798829766693,"vy":-0.25498949834575035,"vz":2.6870174583066975,"lifetime":4.285600409184113},{"id":79,"x":9.198768484944873,"y":-1.6305884761805223,"z":-0.1724729031519589,"vx":3.8040201741036626,"vy":-0.7930687659296863,"vz":1.9285331203502556,"lifetime":1.8651171220703207},{"id":78,"x":10.685115073404182,"y":-1.2632601859019998,"z":0.04673041596002371,"vx":3.459487832454877,"vy":-0.6522807123412095,"vz":3.5320800435381345,"lifetime":3.699882155191352},{"id":78,"x":9.676256589924273,"y":-2.294076653662618,"z":0.012705094672670565,"vx":4.2789991149558695,"vy":-1.1394278581034278,"vz":1.9636941990168504,"lifetime":1.1741669791793243},{"id":79,"x":9.071640992437239,"y":-0.8918942588804022,"z":-0.5456011757440244,"vx":3.8491164371626465,"vy":-0.4657902172011234,"vz":1.548736142909946,"lifetime":3.0212699137885988},{"id":79,"x":8.047853292461461,"y":-0.11512593391143375,"z":-0.2635444859029428,"vx":3.6751273411238046,"vy":-0.09141072642046638,"vz":1.3295553455479978,"lifetime":1.779809404163323},{"id":79,"x":9.120622256334903,"y":-1.839316040942697,"z":1.584819942708584,"vx":4.957027485498002,"vy":-0.9780454784959265,"vz":2.4136226345321705,"lifetime":3.9972208070001125},{"id":79,"x":9.272149239544031,"y":-2.674749886838464,"z":1.8822097398145414,"vx":5.1591287741763505,"vy":-1.4142302887780447,"vz":2.383361115492,"lifetime":2.564715933195248},{"id":79,"x":9.292900724701894,"y":-0.9265614422375626,"z":1.6452215786543596,"vx":5.644712429035779,"vy":-0.5750632671899985,"vz":2.408492289424795,"lifetime":4.812235616452579},{"id":79,"x":8.657488393791672,"y":-0.1781032862687646,"z":-0.7066093476030382,"vx":5.13004522432988,"vy":-0.1381118430292687,"vz":0.7682614986717212,"lifetime":4.4920992037081895},{"id":77,"x":4.787784004533799,"y":-0.10559321521421254,"z":0.09921594902359762,"vx":2.9998618203673,"vy":-0.08799780462248105,"vz":0.8252646852823964,"lifetime":3.90720076311188},{"id":78,"x":8.06901115598609,"y":-1.0565863900699115,"z":-0.5226110746612174,"vx":4.966590493667219,"vy":-0.7021851760636372,"vz":0.8078984966098749,"lifetime":4.068596857260488},{"id":79,"x":6.832172376523066,"y":-0.35282477679403457,"z":0.5983817586165512,"vx":4.432441825247264,"vy":-0.25536915963792994,"vz":1.3229468867045258,"lifetime":4.485799523508783},{"id":79,"x":6.475709485884241,"y":-1.0374538298253781,"z":-0.20331523091984213,"vx":4.158939159804265,"vy":-0.7008813206908439,"vz":0.7652393077743128,"lifetime":4.334466012588699},{"id":78,"x":6.214101219160119,"y":-1.7948066317561138,"z":0.3691523087035459,"vx":4.239354223342223,"vy":-1.247640335253423,"vz":1.081634619972591,"lifetime":5.485292130129785},{"id":79,"x":4.622852114691583,"y":-1.097313359996006,"z":0.21837855875190254,"vx":3.179706156969684,"vy":-0.7767245454029987,"vz":0.8468000138365596,"lifetime":4.241680127281737},{"id":79,"x":7.713578310990045,"y":-0.4465310111452219,"z":-0.8376324105726802,"vx":5.331085682079903,"vy":-0.3406343727715846,"vz":0.33246495725241343,"lifetime":4.0801146409509945},{"id":79,"x":5.503708738462192,"y":-0.6114975033687126,"z":-0.4181588411084392,"vx":3.919406022618759,"vy":-0.4610568818740751,"vz":0.4158132417273328,"lifetime":3.672293192707544},{"id":78,"x":3.6805541386628926,"y":-0.26125784007549985,"z":-0.9793376136172636,"vx":2.852647279236504,"vy":-0.220781549804471,"vz":-0.22945627535318744,"lifetime":2.3849676700420632},{"id":79,"x":4.544926535766525,"y":-0.4834541597017326,"z":-0.6458598590570147,"vx":3.58318099354499,"vy":-0.40220675497846203,"vz":0.06996268689732849,"lifetime":2.2301872817395285},{"id":79,"x":4.262303655750544,"y":-0.15936532214878785,"z":0.20323329613783497,"vx":3.449437506320111,"vy":-0.14532478932984352,"vz":0.7297897926659667,"lifetime":2.4390125139583554},{"id":78,"x":3.5703688446929083,"y":-0.6708610056799166,"z":-0.6086302539464077,"vx":3.3127882808612346,"vy":-0.6411743579500888,"vz":-0.11000949680714392,"lifetime":2.6094691541074675},{"id":79,"x":5.098930237229643,"y":-0.06006182278506601,"z":-0.5966882785918989,"vx":4.809609091231509,"vy":-0.07068358708454675,"vz":-0.054805798141551634,"lifetime":4.793767373611123},{"id":79,"x":1.9514271436960413,"y":-0.4427959544322294,"z":0.05142828495841534,"vx":2.851481504013994,"vy":-0.6551244185847089,"vz":0.334188268982906,"lifetime":4.908576815726955},{"id":79,"x":1.841717040849462,"y":-0.2966134348640385,"z":-0.4062202345462319,"vx":2.7505294994017038,"vy":-0.4516494495735152,"vz":-0.3593588987418478,"lifetime":6.28522729405277},{"id":78,"x":2.4865185137060957,"y":-0.3954585199876354,"z":-0.4835062864258218,"vx":4.506210944298486,"vy":-0.7242995152906242,"vz":-0.6637910647191406,"lifetime":6.38725758384363},{"id":78,"x":1.8226479716529296,"y":-0.5449910588905856,"z":-0.27669437495988,"vx":3.4090977113890992,"vy":-1.0268980684944713,"vz":-0.31977039642632904,"lifetime":5.953662935407666},{"id":78,"x":3.0550575424293775,"y":-0.42550478091848276,"z":-0.3093830667967758,"vx":5.905037429378507,"vy":-0.8294390831732115,"vz":-0.38881277476615816,"lifetime":3.6092901878441594},{"id":79,"x":1.75552148483634,"y":-0.4765750424942769,"z":-0.2247066947960504,"vx":3.50501249840641,"vy":-0.9581832353365114,"vz":-0.2644039257650129,"lifetime":4.365332466503744},{"id":79,"x":2.5837489476621007,"y":-0.5308364218477134,"z":-0.0595044798756164,"vx":5.745711878569755,"vy":-1.1861308459036952,"vz":0.043321164851219486,"lifetime":5.7367988569788855},{"id":79,"x":0.9468758068692122,"y":-0.12326507860588139,"z":-0.25342210387242925,"vx":3.5483798261824053,"vy":-0.46480126079245965,"vz":-0.8601173440078665,"lifetime":6.028214412501846},{"id":79,"x":1.0160401298490405,"y":-0.15914399659468673,"z":-0.27585889088609056,"vx":4.062553631239139,"vy":-0.6390951954512105,"vz":-1.0190829388637788,"lifetime":6.859211053900974},{"id":79,"x":0.7195641129656827,"y":-0.05846430724209252,"z":-0.01334014833489632,"vx":4.79246209486068,"vy":-0.3907893044457658,"vz":-0.0413605705026569,"lifetime":5.997164698655604}],"id":1}},{"id":9,"type":"basic/const","pos":[-232,793],"size":[180,30],"flags":{},"order":10,"mode":0,"outputs":[{"name":"value","type":"number","links":[13],"label":"10.400"}],"properties":{"value":10.399999999999999}},{"id":11,"type":"basic/const","pos":[-244,880],"size":[180,30],"flags":{},"order":11,"mode":0,"outputs":[{"name":"value","type":"number","links":[14,15],"label":"0.300"}],"properties":{"value":0.30000000000000027}},{"id":4,"type":"particles/Vortex Noise","pos":[320,716],"size":[231,140],"flags":{},"order":21,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":3},{"name":"Speed","type":"vec3","link":10},{"name":"Angular speed","type":"vec3","link":16},{"name":"Scale","type":"number","link":17},{"name":"Lifetime","type":"number","link":18}],"outputs":[{"name":"Vertex Noise","type":"VortexNoise","links":[34]}],"properties":{"noise":{"id":4,"position":[10.899999618530273,-1.100000023841858,0.10000000149011612],"angularSpeed":[0.30000001192092896,10.399999618530273,0.30000001192092896],"speed":[0.30000001192092896,0.30000001192092896,0.30000001192092896],"scale":0.0400000000000003,"actualLife":10,"lifetime":9.299999999999828},"show":true}},{"id":12,"type":"basic/const","pos":[6,933],"size":[180,30],"flags":{},"order":13,"mode":0,"outputs":[{"name":"value","type":"number","links":[17],"label":"0.040"}],"properties":{"value":0.0400000000000003}},{"id":21,"type":"basic/const","pos":[-472,625],"size":[180,30],"flags":{},"order":14,"mode":0,"outputs":[{"name":"value","type":"number","links":[31],"label":"-1.100"}],"properties":{"value":-1.0999999999999996}},{"id":20,"type":"basic/const","pos":[-474,689],"size":[180,30],"flags":{},"order":12,"mode":0,"outputs":[{"name":"value","type":"number","links":[30],"label":"0.100"}],"properties":{"value":0.09999999999999942}},{"id":22,"type":"basic/const","pos":[-186,42],"size":[180,30],"flags":{},"order":8,"mode":0,"outputs":[{"name":"value","type":"number","links":[32],"label":"2.900"}],"properties":{"value":2.9000000000000004}},{"id":23,"type":"basic/const","pos":[-183,123],"size":[180,30],"flags":{},"order":9,"mode":0,"outputs":[{"name":"value","type":"number","links":[33],"label":"4.300"}],"properties":{"value":4.300000000000006}}],"links":[[1,1,0,3,0,"ParticleSystem"],[2,3,0,2,0,"ParticleSystem"],[3,5,0,4,0,"vec3"],[4,6,0,5,0,"number"],[7,7,0,8,0,"number"],[8,7,0,8,1,"number"],[9,7,0,8,2,"number"],[10,8,0,4,1,"vec3"],[13,9,0,10,1,"number"],[14,11,0,10,0,"number"],[15,11,0,10,2,"number"],[16,10,0,4,2,"vec3"],[17,12,0,4,3,"number"],[18,13,0,4,4,"number"],[21,14,0,15,1,"number"],[22,14,0,15,2,"number"],[23,16,0,15,0,"number"],[24,15,0,3,3,"vec3"],[25,17,0,19,0,"number"],[26,18,0,19,1,"number"],[27,18,0,19,2,"number"],[28,19,0,3,4,"vec3"],[30,20,0,5,2,"number"],[31,21,0,5,1,"number"],[32,22,0,3,1,"number"],[33,23,0,3,2,"number"],[34,4,0,2,1,"VortexNoise"]],"groups":[],"config":{},"version":0.4}
graph.configure(demoVortex);*/
