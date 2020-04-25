/*****************************************/
/************INIT the graph***************/
/*****************************************/
var graph = new LGraph();
var canvas = new LGraphCanvas("#graphcanvas", graph);
canvas.resize();
window.addEventListener("resize", function(){canvas.resize()});
graph.status = LGraph.STATUS_RUNNING;

/*resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function resizeCanvas(){
	document.getElementById("graphcanvas").width = document.getElementById("graphcanvas").parentNode.offsetWidth;
	document.getElementById("graphcanvas").height = document.getElementById("graphcanvas").parentNode.offsetHeight;
}*/

/*****************************************/
/********INIT the particle visor**********/
/*****************************************/
var time_interval = 0;
var particles_list = []
var meshes_list = []

var DEG2RAD = Math.PI/180;

var gl = GL.create({width:742, height:608});

var particleContainer = document.getElementById("particlecontainer");
particleContainer.appendChild( gl.canvas );
particleContainer.style.display = "none";

var mesh = new GL.Mesh();

//Creation basic matrices for cameras and transformation
var proj  =  mat4.create();
var view  =  mat4.create();
var mvp   =  mat4.create(); //View Projection Matrix

//Setting the camera
var cam_pos = vec3.fromValues(0,0,10);
mat4.perspective(proj, 45 * DEG2RAD, gl.canvas.width / gl.canvas.height, 0.1, 1000);
mat4.lookAt(view, cam_pos, [0,0,0], [0,1,0]);
mat4.multiply(mvp, proj, view);

//Capture mouse movement
gl.captureMouse();
gl.onmousemove = function(e) { 
	if(e.dragging) {
		vec3.rotateY(cam_pos,cam_pos,e.deltax * 0.01);
		vec3.scale(cam_pos,cam_pos,1.0 + e.deltay * 0.01);
		//Updating the camera 
		mat4.lookAt(view, cam_pos, [0,0,0], [0,1,0]);
		mat4.multiply(mvp, proj, view);
	}
}

/************************************************/
/********Definition of important classes*********/
/************************************************/
class Particle {
	constructor(id_, x_, y_, z_, vx_, vy_, vz_, lifetime_) {
		this.id = id_;
		this.x = x_;
		this.y = y_;
		this.z = z_;

		this.vx = vx_;
		this.vy = vy_;
		this.vz = vz_;

		this.lifetime = lifetime_;
	}
}

//Information that we want to assign to an identifier
class SystemInfo {
	constructor(id_, mesh_){
		this.id = id_;
		this.mesh =  mesh_;
	}
}

/*****************************************/
/********Shader Definition****************/
/*****************************************/
var vertex_shader_code = '\
					precision highp float;\
					attribute vec3 a_vertex;\
					varying vec4 v_color;\
					uniform mat4 u_mvp;\
					\
					void main() {\
						gl_Position = u_mvp * vec4(a_vertex, 1.0);\
						gl_PointSize = 200.0 / gl_Position.z;\
					}';

var fragment_shader_code = '\
					precision highp float;\
					uniform vec4 u_color;\
					\
					void main() {\
						gl_FragColor = u_color;\
					}';


function InitSystemNode() {
	this.properties = {
		x: 0,
		y: 0,
		z: 0,
		maxParticles: 0, 
		particles: []
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
	//We set the id and push an empty list and a mesh asociated to this id
	this.properties.id = this.id;
	//particles_list.push(new Info(this.id, []));
	meshes_list.push(new SystemInfo(this.id, new GL.Mesh({vertices: []})));
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
		if (meshes_list[x].id == this.id){
			meshes_list.splice(x, 1);
		}
	}
}

LiteGraph.registerNodeType("particles/Init System", InitSystemNode);

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
		if(system.maxParticles > system.particles.length){		
			var vertices = [];

			//Add all the existing particles
			for (var i = 0 ; i < system.particles.length; i++) {
				vertices.push(system.particles[i].x);
				vertices.push(system.particles[i].y);
				vertices.push(system.particles[i].z);
			}

			//Random definition of the speed
			vx = Math.random() * this.properties.max_speed_x + this.properties.min_speed_x;
			vy = Math.random() * this.properties.max_speed_y + this.properties.min_speed_y;
			vz = Math.random() * this.properties.max_speed_z + this.properties.min_speed_z;

			//Radom definition of the lifetime
			lifetime = Math.random() * this.properties.max_lifetime_value + this.properties.min_lifetime_value;

			//Addition of the new  particle
			system.particles.push(new Particle(system.particles.length, system.x, system.y, system.z, vx, vy, vz, lifetime));
			
			//Push to the vertex array the init location of the particle
			vertices.push(system.x);
			vertices.push(system.y);
			vertices.push(system.z);

			// *****************
		    // UPDATING CHANGES
		    // *****************
		   	for(x in meshes_list){
		   		if (meshes_list[x].id == system.id){
		   			var buffer = meshes_list[x].mesh.getBuffer("vertices");
		   			buffer.data = new Float32Array(vertices);
		   			buffer.upload(gl.DYNAMIC_DRAW);
		   		}
		   	}
		    // *****************
		}
	}

	this.setOutputData(0, system);	
}

InitParticlesNode.title = "Init Particles";

LiteGraph.registerNodeType("particles/Init Particles", InitParticlesNode);

function BasicMoveNode() {
	this.addInput("Particle System","ParticleSystem");
}

BasicMoveNode.prototype.onExecute = function () {
	var system = this.getInputData(0);

	if(system != undefined){
		var particles = this.getInputData(0).particles;
		var vertices = [];

		for (var i = 0; i < particles.length; i++) {
			particles[i].x += particles[i].vx * time_interval;
			particles[i].y += particles[i].vy * time_interval;
			particles[i].z += particles[i].vz * time_interval;
			particles[i].lifetime -= time_interval;

			if(particles[i].lifetime > 0){
				vertices.push(particles[i].x);
				vertices.push(particles[i].y);
				vertices.push(particles[i].z);
			} else {
				particles.splice(i,1);
			}
		}

		// *****************
	    // UPDATING CHANGES
	    // *****************
		for(x in meshes_list){
	   		if (meshes_list[x].id == system.id){
	   			var buffer = meshes_list[x].mesh.getBuffer("vertices");
		   		buffer.data = new Float32Array(vertices);
		   		buffer.upload(gl.DYNAMIC_DRAW);
	   		}
		}
	    // *****************
	}
}

BasicMoveNode.title = "Basic Movement";

LiteGraph.registerNodeType("particles/Basic Move Particles", BasicMoveNode);

/****************************************************/
/**********Shader and render definition**************/
/****************************************************/

//Creating the shader
var shader = new GL.Shader( vertex_shader_code, fragment_shader_code );

//Render
gl.ondraw = function() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.DST_COLOR);
	
	var my_uniforms = { 
		u_mvp: mvp,
		u_color: [1,1,1,0.5]
	};

	for(meshid in meshes_list)
		shader.uniforms( my_uniforms ).draw( meshes_list[meshid].mesh, gl.POINTS );

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
	//Permite volver a cargar el mismo documento sin reiniciar
	document.getElementById("loadGraph").value = "";

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
}

/*********************************************/
/*********************************************/
/*********************************************/

//LOAD DEMO
var demo = {"last_node_id":3,"last_link_id":2,"nodes":[{"id":1,"type":"particles/Init System","pos":[53,150],"size":[210,58],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[1]}],"properties":{"x":0,"y":0,"z":0,"maxParticles":42,"particles":[{"id":3,"x":3.039758100738044,"y":4.057779690581853,"z":4.372834366532603,"vx":0.6317942724121904,"vy":0.8433835464070883,"vz":0.9088656450365922,"lifetime":1.9557236616446527},{"id":5,"x":2.6535186639262025,"y":4.313571820653299,"z":4.180404715690148,"vx":0.549191154612045,"vy":0.8927675998258783,"vz":0.8652063856820718,"lifetime":4.962879267892072},{"id":6,"x":3.866076555551039,"y":4.022628547436367,"z":2.925216617648562,"vx":0.7973725086317877,"vy":0.8296611228656867,"vz":0.6033215533088105,"lifetime":0.6903662044445555},{"id":9,"x":3.649196560492484,"y":3.0051768444452716,"z":3.870448032913014,"vx":0.7552356203092125,"vy":0.6219496704631349,"vz":0.8010256977270469,"lifetime":0.026114054373765683},{"id":11,"x":2.8221019491837995,"y":3.9550653603812322,"z":2.920282148632476,"vx":0.5840696613890122,"vy":0.8185507566363364,"vz":0.6043892943716831,"lifetime":1.6828718614857152},{"id":14,"x":4.172018479790861,"y":3.7847880831789524,"z":4.321855235856675,"vx":0.8664007417709585,"vy":0.7859848221181677,"vz":0.8975172570090407,"lifetime":5.120731472073576},{"id":17,"x":3.8136156902064338,"y":3.8231742471480747,"z":3.8221409404746445,"vx":0.7920347604580961,"vy":0.7940199393467401,"vz":0.7938053359702977,"lifetime":0.9627887410785032},{"id":19,"x":2.589798633323252,"y":3.581218693785106,"z":3.859292400581645,"vx":0.5358917359377463,"vy":0.7410404337585669,"vz":0.7985805836128514,"lifetime":2.8276235252043307},{"id":22,"x":3.213220119218586,"y":3.9038791104075314,"z":2.910905690761871,"vx":0.6672571378974897,"vy":0.8106793513236824,"vz":0.6044785379906156,"lifetime":1.9098280662129739},{"id":24,"x":3.509643507136839,"y":4.3036389402974935,"z":3.6004391427803455,"vx":0.7263861221506551,"vy":0.8907182722753285,"vz":0.7451779708239394,"lifetime":4.737509466827557},{"id":26,"x":4.763518872859673,"y":2.6947639219687676,"z":2.6871470592022026,"vx":0.9858286014047761,"vy":0.5576917860967145,"vz":0.5561154469724936,"lifetime":0.9153577537779451},{"id":28,"x":2.759214016321484,"y":3.94773864240704,"z":4.2853842072669766,"vx":0.5711830617425381,"vy":0.8172187555554448,"vz":0.8871145397822876,"lifetime":5.321687589521513},{"id":30,"x":3.297136569385506,"y":2.5560795359613477,"z":4.802125069783893,"vx":0.6822859397124459,"vy":0.528936879462706,"vz":0.9937175324420452,"lifetime":3.0584722473369705},{"id":32,"x":3.1569737984041626,"y":2.8077334754205756,"z":4.783145432429588,"vx":0.653353987187377,"vy":0.5810766823762707,"vz":0.9898996124562961,"lifetime":3.5758293338689526},{"id":33,"x":3.7871438099748818,"y":4.114108281868067,"z":3.928429051726466,"vx":0.7810927478849694,"vy":0.848528681302427,"vz":0.8102326177321799,"lifetime":1.777760652565016},{"id":35,"x":2.9151702936124675,"y":4.443038837570612,"z":3.3568012496710873,"vx":0.603303861886662,"vy":0.9195011677678391,"vz":0.6947008076852197,"lifetime":2.6437397681853536},{"id":36,"x":2.8741400454480845,"y":3.7771886292804617,"z":2.62630421880389,"vx":0.5927870866673439,"vy":0.7790395067527431,"vz":0.5416713180112972,"lifetime":1.68774966965257},{"id":38,"x":4.781185444617485,"y":4.7064514151972165,"z":3.6040632515170907,"vx":0.9894253845967862,"vy":0.9739598171850761,"vz":0.7458300268938289,"lifetime":3.1265176922236826},{"id":39,"x":4.746533679256059,"y":2.4705439734594363,"z":3.4721587582429225,"vx":0.978965473846967,"vy":0.5095460003175535,"vz":0.7161275519629169,"lifetime":1.5016925718356742},{"id":41,"x":3.5418119364147755,"y":2.4828709766996133,"z":3.0811860729660667,"vx":0.7330197041062628,"vy":0.5138593977738632,"vz":0.6376877553211303,"lifetime":5.082068552726749},{"id":41,"x":2.857540981511918,"y":2.304737775914203,"z":2.8363399160938996,"vx":0.6681680606230234,"vy":0.5389081661262575,"vz":0.6632106952325872,"lifetime":3.86271799700242},{"id":41,"x":2.2840969361063004,"y":2.8460552328504183,"z":2.664238035777657,"vx":0.5534199455503412,"vy":0.6895783217862685,"vz":0.6455253476267527,"lifetime":3.3598245985260444},{"id":41,"x":2.103896995372515,"y":2.274428173911698,"z":3.3914082116982516,"vx":0.5450277372582019,"vy":0.5892049106538642,"vz":0.8785656083954356,"lifetime":5.280122152114778},{"id":41,"x":2.0099496604358853,"y":2.6681756336785845,"z":2.0735103683820046,"vx":0.5594763783564829,"vy":0.7426958344945698,"vz":0.577168719307826,"lifetime":5.514973841156612},{"id":41,"x":1.9662983409594943,"y":3.426629825560009,"z":2.794543780920865,"vx":0.5601742204960358,"vy":0.9762047047880241,"vz":0.7961311625556814,"lifetime":2.8052793845360666},{"id":41,"x":2.7893110910607506,"y":2.355902120247195,"z":1.6861313675180574,"vx":0.8505955154539887,"vy":0.7184282114508546,"vz":0.5141827974203268,"lifetime":7.04502688704965},{"id":41,"x":3.0171421542766357,"y":3.127817227067923,"z":2.974992918191968,"vx":0.9496663275572067,"vy":0.9845020709711684,"vz":0.9363995644432681,"lifetime":2.2357629007133424},{"id":41,"x":1.5418352504732784,"y":2.5327734250994807,"z":2.2460473832095027,"vx":0.568415382204815,"vy":0.9337361913500178,"vz":0.8280313226625636,"lifetime":5.075047803499102},{"id":41,"x":2.1952239211427007,"y":1.88447661473411,"z":1.1995137426043827,"vx":0.9279050806028627,"vy":0.7965544691125824,"vz":0.5070256775610316,"lifetime":5.489684651519365},{"id":41,"x":0.877430108653442,"y":1.1721137397680215,"z":1.1464884796189398,"vx":0.6268723605036504,"vy":0.8374065348119375,"vz":0.8190987890897998,"lifetime":7.0205901903464305},{"id":41,"x":1.1078726339540634,"y":1.2768005006623622,"z":1.2375935666680722,"vx":0.8207375885877198,"vy":0.9458832467782312,"vz":0.9168378461823665,"lifetime":4.328028987392453},{"id":41,"x":1.104329918653268,"y":0.8211552552899839,"z":0.9261498290013066,"vx":0.8284545526379481,"vy":0.6160204465864495,"vz":0.6947860682762992,"lifetime":7.715539290410243},{"id":41,"x":1.1307289727380792,"y":0.7900861919595437,"z":1.1410253599987783,"vx":0.9835975353990384,"vy":0.6872794895158587,"vz":0.9925541477945038,"lifetime":3.358303758951796},{"id":41,"x":0.7709498889568391,"y":0.5413031178556118,"z":0.49969021717095224,"vx":0.784067335505016,"vy":0.5505132037724023,"vz":0.5081922739301223,"lifetime":6.0152965478497755},{"id":41,"x":0.5605796368696998,"y":0.41906972719877694,"z":0.5010514216656713,"vx":0.9348213367160892,"vy":0.6988397308628364,"vz":0.8355522194500838,"lifetime":0.4336162836800588},{"id":41,"x":0.38163518120457823,"y":0.24425594479885526,"z":0.3854559223241521,"vx":0.7901513098964192,"vy":0.5057163601207519,"vz":0.7980619107767611,"lifetime":3.1118152801593904},{"id":40,"x":0.3658460164610155,"y":0.2781576548193118,"z":0.37334931988550346,"vx":0.8786876979172848,"vy":0.6680780939903893,"vz":0.896709106149676,"lifetime":4.711266077912821},{"id":41,"x":0.3155531623591662,"y":0.2327162551415499,"z":0.356088306170482,"vx":0.7897812820052066,"vy":0.5824531782696778,"vz":0.8912345446067322,"lifetime":3.1825595330123773},{"id":41,"x":0.2049867953483658,"y":0.24425060254133935,"z":0.18420752781922115,"vx":0.6151418528412248,"vy":0.7329680331336665,"vz":0.5527856551805963,"lifetime":5.566722776438699},{"id":41,"x":0.16379017516601085,"y":0.22587723594591666,"z":0.224293631971053,"vx":0.5463041380416656,"vy":0.7533887094363089,"vz":0.7481067723261594,"lifetime":7.860159371235458},{"id":41,"x":0.10290389072450551,"y":0.09853644012294502,"z":0.0894020653680411,"vx":0.7705847736415111,"vy":0.7378795871855,"vz":0.6694777993297939,"lifetime":8.987780667269568},{"id":41,"x":0.051811180858320725,"y":0.06609591821666946,"z":0.0895738502358058,"vx":0.5191501089713406,"vy":0.6622837498835754,"vz":0.8975335697918763,"lifetime":0.40799819059678377}],"id":1}},{"id":3,"type":"particles/Init Particles","pos":[308,189],"size":[262,106],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":1},{"name":"Min Lifetime","type":"number","link":null},{"name":"Max Lifetime","type":"number","link":null},{"name":"Min Speed","type":"vec3","link":null},{"name":"Max Speed","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[2]}],"properties":{"min_lifetime_value":0.5,"max_lifetime_value":10,"min_speed_x":0.5,"max_speed_x":0.5,"min_speed_y":0.5,"max_speed_y":0.5,"min_speed_z":0.5,"max_speed_z":0.5}},{"id":2,"type":"particles/Basic Move Particles","pos":[613,264],"size":[140,26],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":2}],"properties":{}}],"links":[[1,1,0,3,0,"ParticleSystem"],[2,3,0,2,0,"ParticleSystem"]],"groups":[],"config":{},"version":0.4};
graph.configure(demo);