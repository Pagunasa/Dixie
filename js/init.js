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

var default_vertices  = [-0.25,-0.25,0, 0.25,-0.25,0, -0.25,0.25,0, 0.25,0.25,0, -0.25,0.25,0, 0.25,-0.25,0];
var default_coords    = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var default_color     = [1,1,1,1];

function createMesh(id, particles){
	var vertices  = new Float32Array(particles * 6 * 3);
	var coords    = new Float32Array(particles * 6 * 2);
	var colors    = new Float32Array(particles * 6);

	for(var i = 0; i < particles; i ++)
	{
		colors.set(default_color, i*4);
		vertices.set(default_vertices, i*6*3)
		coords.set(default_coords, i*6*2);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({vertices : vertices, coords: coords, colors : colors}, null, gl.STREAM_DRAW);

	meshes_list.push({id: id, mesh: mesh})
}

function resizeBufferArray(system_id, mesh, newSize) {
	var data_Vertex = mesh.getBuffer("vertices").data;
	var data_Coords = mesh.getBuffer("coords").data;
	var data_Colors = mesh.getBuffer("colors").data;

	//The -1 is because in JS the arrays start in 0
	var vertexSize = newSize * 6 * 3;
	var coordsSize = newSize * 6 * 2;
	var colorsSize = newSize * 4;

	var size;
	var data;
	var data_size;
	var default_data;

	if (vertexSize == data_Vertex.length)
		return;

    if (vertexSize < data_Vertex.length){

    	for (x in meshes_list[0].mesh.vertexBuffers) { 
    		if (x == "vertices") {
    			size = vertexSize;
    			data = data_Vertex;
    		}
    		else if (x == "coords") {
    			size = coordsSize;   
    			data = data_Coords; 		
    		}
    		else if (x == "colors") {
    			size = colorsSize;
    			data = data_Colors;
    		}

    		data = data.slice(0, size);
        	mesh.getBuffer(x).data = data;
    	}

       for(x in system_list)
	       if (system_list[x].id == system_id)
				system_list[x].particles_list.splice(0, newSize);
	   
    } else {

    	for (x in meshes_list[0].mesh.vertexBuffers) { 
    		if (x == "vertices") {
    			size = vertexSize;
    			data_size = 6 * 3;
    			data = data_Vertex;
    			default_data = default_vertices;
    		}
    		else if (x == "coords") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_Coords; 	
    			default_data = default_coords;	
    		}
    		else if (x == "colors") {
    			size = colorsSize;
    			data_size = 4;
    			data = data_Colors;
    			default_data = default_color;
    		}

        	var nBuff = new Float32Array(size);

	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	            
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        mesh.getBuffer(x).data = nBuff
    	}

	}	
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

	this.x = 0;
	this.y = 0;
	this.z = 0;

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
			resizeBufferArray(that.properties.id, meshes_list[that.properties.mesh_id].mesh, v)
		},{ min: 0, max: 1000000, step: 10});

	this.addInput("Position","vec3");

	this.addOutput("Particle System", "ParticleSystem");
}

InitSystemNode.prototype.onAdded = function() {
	this.properties.id = this.id;
	createMesh(this.id, this.properties.maxParticles);
	this.properties.mesh_id = meshes_list.length - 1;
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

InitSystemNode.prototype.onRemoved = function(){
	for(x in meshes_list){
		if (meshes_list[x].id == this.properties.id){
			meshes_list.splice(x, 1);
		}
	}
    
    for(x in system_list){
	   	if (system_list[x].id == this.properties.id){
	        system_list.splice(x, 1);
	   	}
    }
}

InitSystemNode.title = "Init Particle System";
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

/********************************************/
/********************************************/
/********************************************/

function BasicMoveNode() {
	this.addInput("Particle System","ParticleSystem");
	this.addInput("Vortex Noise", "VortexNoise");
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
				var mesh = meshes_list[system_list[x].mesh_id].mesh;
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
	/*var rotation = []
	mat4.getRotation(rotation, view)
	for (var i = 0; i < 4; i++)
		rotation[i] *= -1
	
	mat4.fromRotationTranslation(model, rotation, [])*/
	
	//mat4.lookAt(model, [0,0,0], center, [0,1,0]);
	
	texture.bind(0);

	var my_uniforms = { 
		u_viewprojection: vp,
		u_mvp: mvp,
		u_color: [1,1,1,1],
		u_model: [],
		u_texture: 0
	};

	for(x in system_list){
		mat4.translate(my_uniforms.u_model, model, [0,0,0])
		shader_part.uniforms( my_uniforms ).draw( meshes_list[system_list[x].mesh_id].mesh );
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
var demo = {"last_node_id":3,"last_link_id":2,"nodes":[{"id":2,"type":"particles/Init Particles","pos":[18,256],"size":[262,106],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":1},{"name":"Min Lifetime","type":"number","link":null},{"name":"Max Lifetime","type":"number","link":null},{"name":"Min Speed","type":"vec3","link":null},{"name":"Max Speed","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[2]}],"properties":{"min_lifetime_value":0.5,"max_lifetime_value":10,"min_speed_x":0.5,"max_speed_x":0.5,"min_speed_y":0.5,"max_speed_y":0.5,"min_speed_z":0.5,"max_speed_z":0.5}},{"id":3,"type":"particles/Basic Move Particles","pos":[78,462],"size":[140,46],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":2},{"name":"Vortex Noise","type":"VortexNoise","link":null}],"properties":{}},{"id":1,"type":"particles/Init System","pos":[42,120.20000076293945],"size":[210,58],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[1]}],"properties":{"x":0,"y":0,"z":0,"maxParticles":424,"id":1,"mesh_id":0}}],"links":[[1,1,0,2,0,"ParticleSystem"],[2,2,0,3,0,"ParticleSystem"]],"groups":[],"config":{},"version":0.4}
graph.configure(demo);
