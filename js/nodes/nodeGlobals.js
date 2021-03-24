/********************************/
/************Colors**************/
/********************************/
var basicNodeColor  		  = "#FFFC99";
var basicTitleColor 		  = "#000000";
var basicSelectedTitleColor   = "#000000";
var spawnNodeColor            = "#8385C3";
var initNodeColor             = "#87C09F";
var forcesNodeColor           = "#FF7070";
var conditionsNodeColor       = "#FFAB5C";
var modifyPropertiesNodeColor = "#DE85FF";
var collisionsNodeColor       = "#A3B082";

/********************************/
/************Vectors*************/
/********************************/
var vector_2 = new Float32Array(2);
var vector_3 = new Float32Array(3);
var vector_4 = new Float32Array(4);
var default_particle_color = [1,1,1,1];

/********************************/
/*************Lists**************/
/********************************/
var forces_list    = [];
var system_list    = [];
var condition_list = [];
var objects_list   = [];
var modProp_list   = [];

/********************************/
/***********Mesh Stuff***********/
/********************************/
var default_centers    = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var default_coords     = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var square_vertices    = [0.5,0.5, -0.5,0.5, 0.5,-0.5, -0.5,-0.5, 0.5,-0.5, -0.5,0.5];//[0.5,0.5, -0.5,0.5, 0.5,0, -0.5,0., 0.5,0., -0.5,0.5];
var default_color      = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1];
var default_sizes      = [0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25];
var default_visibility = [0, 0, 0, 0, 0, 0];
var default_forces_mesh;

/********************************/
/***********Node Panel***********/
/********************************/
var panel_focus = false;
var nodePanel;

/*
* 	Make a linear interpolation between two vectors of the same component
*	@method lerpVec 
*	@params {Vector} The start of the interpolation
*	@params {Vector} The end of the interpolation
*	@params {Number} The value to be interpolated
*/
function lerpVec(s, e, x)
{
	var out = [];

	if(s.length != e.length)
		return;

	for(var i = 0; i < s.length; ++i)
		out.push(s[i] * ( 1 - x ) + e[i] * x);

	return out; 
}


/*
* 	Make a linear interpolation between two numbers
*	@method lerp 
*	@params {Number} The start of the interpolation
*	@params {Number} The end of the interpolation
*	@params {Number} The value to be interpolated
*/
function lerp(s, e, x)
{
	return s * ( 1 - x ) + e * x;
}


/*
* 	This method returns the cross product of two vectors
*	@method cross
*	@params {vector3} the first vector
*	@params {vector3} the second vector
*/
function cross(a, b)
{
    var c = new Float32Array(3);
    
    c[0] = a[1]*b[2] - a[2]*b[1];
    c[1] = a[2]*b[0] - a[0]*b[2];
    c[2] = a[0]*b[1] - a[1]*b[0];

    return c;
}


/*
* 	This method returns the multiplication of two vectors
*	@method mult
*	@params {vector3} the first vector
*	@params {vector3} the second vector
*/
function mult(a, b)
{
	var c = new Float32Array(3);
	
	c[0] = a[0] * b[0];
	c[1] = a[1] * b[1];
	c[2] = a[2] * b[2];

	return c;
}


/*
* 	This method returns a random number
*	@method mult
*	@params {Number} the minimum value of the random number
*	@params {Number} the maximum value of the random number
*/
function randomNumber(min, max)
{
  return Math.random() * (max - min) + min;
}


/*
* 	This method is for search a force in the force list
*	@method searchForce
*	@params {Number}  the id of the force
*	@params {Boolean} if is true the force will be deleted
*/
function searchForce(id, remove = false)
{
	for(x in forces_list){
	   	if (forces_list[x].id == id){
			if(!remove)
	        	return forces_list[x];
	        forces_list.splice(x, 1);
	   	}
    }
}


/*
* 	This method is for add a force to the force list
*	@method addForce
*	@params {Number}  the id of the force
*	@params {position} the position of the force
*	@params {type} the type of the force
*/
function addForce(id, position, type)
{
	var model = mat4.create();
	mat4.setTranslation(model, position);

	var force = new ForcesInfo(id, type, model, position);

	forces_list.push(force);

	return force;
}


/*
* 	This method is for search a object in the objects list
*	@method searchObject
*	@params {Number}  the id of the object
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchObject(id, remove = false)
{
    for(x in objects_list){
		if (objects_list[x].id == id){
			if(!remove)
				return objects_list[x];
			objects_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a condition in the objects list
*	@method searchCondition
*	@params {Number}  the id of the object
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchCondition(id, remove = false)
{
    for(x in condition_list){
		if (condition_list[x].id == id){
			if(!remove)
				return condition_list[x];
			condition_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a condition in the objects list
*	@method searchCondition
*	@params {Number}  the id of the object
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchModification(id, remove = false)
{
    for(x in modProp_list){
		if (modProp_list[x].id == id){
			if(!remove)
				return modProp_list[x];
			modProp_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a mesh in the meshes list
*	@method searchMesh
*	@params {Number}  the id of the mesh
*	@params {Boolean} if is true the mesh will be deleted
*/
function searchMesh(id, remove = false)
{
    for(x in meshes_list){
		if (meshes_list[x].id == id){
			if(!remove)
				return meshes_list[x].mesh;
			meshes_list.splice(x, 1);
		}
	}
}


/*
* 	This method is for search a system in the system list
*	@method searchSystem
*	@params {Number}  the id of the system
*	@params {Boolean} if is true the system will be deleted
*/
function searchSystem(id, remove = false)
{
	for(x in system_list){
	   	if (system_list[x].id == id){
			if(!remove)
	        	return system_list[x];
	        system_list.splice(x, 1);
	   	}
    }
}


/*
* 	This class is for save information about the forces
*	@class ForcesInfo
*/
class ForcesInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number}  the id of the force
	*	@params {String}  the kind of force
	*/
	constructor(id_, type_, model_, position_) {
		this.id          = id_;
		this.type        = type_;
		this.reciever    = -1;      //The system that recieves the force
		this.subReciever = -1;      //The sub emitter that recieves the force
		this.position    = position_;
		this.model       = model_;
		this.condition   = -1;
		this.visible     = true;

		switch (type_)
		{
			case "gravity":
				this.direction = [0,0,0];
				this.strength  = 1;
			break;

			case "vortex":
				this.angular_speed = [0,0,0];
				this.scale 		   = 10;
				this.color 		   = [1,1,1,1]
			break;

			case "magnet":
				this.strength = 10;
				this.scale    = 10; 
				this.color    = [1,1,1,1];
			break;
		}
	}
}


/*
* 	This class is for save information about the conditions
*	@class ForcesInfo
*/
class ConditionInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number}  the id of the condition
	*	@params {Object}  the properties of the condition
	*/
	constructor(id_, properties_) {
		this.id          = id_;
		this.type        = "c";
		this.property    = properties_.system_property;
		this.one_time    = properties_.is_one_time;
		this.value       = properties_.value;
		this.operator    = properties_.condition;
	}
}


/*
* 	This class is for save information about the merged conditions
*	@class ForcesInfo
*/
class MergedConditionInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number}  the id of the merged condition
	*	@params {Number}  the id of the first condition
	*	@params {Number}  the id of the second condition
	*	@params {String}  the merge mode
	*/
	constructor(id_, idC1_, idC2_, mode_)
	{
		this.id    = id_;
		this.type        = "m";
		this.id_C1 = idC1_;
		this.id_C2 = idC2_;
		this.mode  = mode_
	}
}


/*
* 	This class is for save information about the properties changes
*	@class ModifyPropertiesInfo ªª!ª"ª!"ª!"ª!"ª"ª!"modProp_listª!ª!ª!ª!ª!ªª!!ª!ª!ª!ª
*/
class ModifyPropertiesInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number}  the id of the merged condition
	*	@params {Object}  the id of the first condition
	*/
	constructor(id_, props_)
	{
		this.id                   = id_;
		this.reciever    		  = -1; //The system that recieves the modification
		this.subReciever		  = -1; //The sub emitter that recieves the modification
		this.equation             = undefined;
		this.condition            = -1;
		this.changed_property     = props_.changed_property;
		this.application_mode     = props_.application_mode;
		this.modification_mode    = props_.modification_mode;
		this.user_defined_seconds = props_.user_defined_seconds;
		this.user_defined_start   = props_.user_defined_start;
		this.new_value            = props_.new_value;
	}
}


/*
* 	This class is for save information about every system
*	@class SystemInfo
*/
class SystemInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number}  the id of the system
	*	@params {Vector3} the position of the system
	*	@params {Number}  the maximum number of particles
	*/
	constructor(id_, position_, max_particles_) {
		this.id                 = id_;
		this.mesh_id            = id_;
		this.distance_to_camera = 0;

		this.total_particles    = 0;
		this.position           = position_;
		this.model              = mat4.create();
		this.point_mode         = true;
		this.external_model     = undefined;
		this.color              = [1,1,1,1];
		this.visible            = true;
		this.visibility         = 1;
		this.coords             = default_coords;

		this.src_bfact          = gl.SRC_ALPHA;
		this.dst_bfact          = gl.ONE;

		//Textures
		this.texture            = {file: undefined, id: undefined};
		this.texture_change     = false;
		this.atlas              = undefined;
		this.uvs 				= [];

		//Spawn Info
		this.spawn_rate			= 0;
		this.spawn_mode			= "Linear";
		this.particles_per_wave = 0;
		this.origin 			= "Point";
		this.origin_mesh        = undefined;

		//Particle data
		this.particle_data      = undefined;
	
		//Ids list
		this.particles_ids      = [];	

		//Reset list
		this.particles_to_reset = [];
	
		//Max elements
		this.max_particles      = max_particles_;
		this.sub_emission_part  = 0;
		this.max_subemissions   = 0;
		this.sub_emittors       = [];

		this.particles_list     = [];
		this.particles_mesh     = createMesh(max_particles_);
		this.line_mesh  	    = createLineMesh(max_particles_);
	}
}

/*
* 	This class is for save information about every sub emitter
*	@class SubEmitterInfo
*/
class SubEmitterInfo {
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {Number} the id of the system
	*	@params {Number} the maximum number of particles
	*	@params {Number} how time are between the spawn of the particles
	*	@params {Number} how many particles are every wave
	*/
	constructor(id_, max_particles_, spawn_rate_, particles_per_wave_) {
		this.id = id_;

		//Spawn Info
		this.spawn_rate			= spawn_rate_;
		this.spawn_mode			= "Waves";
		this.particles_per_wave = particles_per_wave_;
		this.origin 			= "Point";
		this.texture            = {file: undefined, id: undefined};
		this.condition 			= -1;

		this.ids      = []; //Ids list	
		this.to_reset = []; //Reset list

		this.max_particles = max_particles_; //Max elements
	}
}


/*
* 	This class is for save information about every particle
*	@class SystemInfo
*/
class Particle {
	/*
	* 	The constructor of the class
	*	@method constructor
	*/
	constructor() {
		this.size = 0.25;
	}
}


/*
* 	For create or reset every particle
*	@method fill
*	@params {Object} the properties of the particle
*/
Particle.prototype.fill = function(properties, is_Trail = false) 
{
	var speed = new Float32Array(3);
	speed[0]  = randomNumber(properties.min_speed[0], properties.max_speed[0]);
	speed[1]  = randomNumber(properties.min_speed[1], properties.max_speed[1]);
	speed[2]  = randomNumber(properties.min_speed[2], properties.max_speed[2]);

	//Radom definition of the lifetime
	lifetime = randomNumber(properties.min_life_time, properties.max_life_time);

	this.position = [0,0,0];
	for (var i = 0; i < 3; ++i)
		this.position[i] = properties.position[i];

	this.color  = [0,0,0,0];
	this.iColor = [0,0,0,0];
	for (var i = 0; i < 4; ++i)
	{
		this.iColor[i] = properties.color[i];
		this.color[i]  = properties.color[i];
	}
	
	this.coords = properties.coords;

	var s = randomNumber(properties.min_size, properties.max_size);
	this.size  = s;
	this.iSize = s;
	
	this.speed  = speed;
	this.aSpeed = [0,0,0];
	this.iSpeed = [0,0,0];

	for (var i = 0; i < 3; ++i)
		this.iSpeed[i] = speed[i];

	this.lifetime   = lifetime;
	this.iLifetime  = lifetime;
	this.c_lifetime = 0.0; //How many life time the particle lived
	this.visibility = 1;

	this.animated  = false;
	this.frameRate = 0;
	this.c_frame   = 0;
	this.frameX    = 0;  
	this.frameY    = 0;  

	/************************/
	/********CONDITION*******/
	/************************/
	this.conditions_meet = [];

	/************************/
	/*********TRAILS*********/
	/************************/
	if(!is_Trail)
	{
		this.num_trails = 0;
		this.trails = [];
		//In this array I will save the last 2 positions of the particle 
		//var p = this.position.slice(0);
		//this.old_positions.unshift(p);
		//this.old_positions.unshift(p);
	}
	else
		this.parent_particle = properties.origin_id; 

	var texture = properties.texture; 
	
	if(texture.file == undefined)
		return;

	if(texture.prop.animated)
	{
		this.animated = true;

		var t = lifetime;
		var t_prop = texture.prop;

		if(texture.prop.anim_loop)
		{
			var anim_d = t_prop.anim_duration;
			t = anim_d == 0 ? lifetime : anim_d;
		}

		var frame_number = Math.floor(t_prop.textures_x + t_prop.textures_y) - 1; 
		this.frameRate = (t / frame_number);
	}
}


/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {List} the particles of the system
*/
function createMesh(particles)
{
	var vertices = new Float32Array(particles * 6 * 3); //Save information about the center of the particle
	var coords   = new Float32Array(particles * 6 * 2); //The "possible changed" coordinates of the particle
	var icoord   = new Float32Array(particles * 6 * 2); //The original coordinates of the particle
	var sizes    = new Float32Array(particles * 6 * 2); //
	var colors   = new Float32Array(particles * 6 * 4); //
	var visible  = new Float32Array(particles * 6);     //This array is for know with particles are not visible

	for(var i = 0; i < particles; i ++)
	{
		visible.set(default_visibility, i*6);
		vertices.set(default_centers,   i*6*3);
		coords.set(default_coords,      i*6*2);
		icoord.set(square_vertices,     i*6*2);
		colors.set(default_color,       i*6*4);
		sizes.set(default_sizes,        i*6*2);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({ 
					  vertices : vertices, 
					  coords   : coords, 
					  icoord   : icoord,
		              colors   : colors, 
		              visible  : visible,
		              size     : sizes
		            }, null, gl.STREAM_DRAW);

	return mesh;
}


/*
* 	This method is for create the mesh of the lines that go form the particle to the ground plane
*	@method createLineMesh
*	@params {List} the particles of the system
*/
function createLineMesh(particles)
{
	var vertices = new Float32Array(particles * 2 * 3); //Save information about the center of the particle
	var visible  = new Float32Array(particles * 2 * 3); //Save information about the center of the particle

	for(var i = 0; i < particles; i ++)
		visible.set(default_visibility, i*6);

	var mesh = new GL.Mesh();
	mesh.addBuffers({vertices : vertices, visible : visible}, null, gl.STREAM_DRAW);

	return mesh;
}


/*
* 	Order the buffers of the particle mesh in order to avoid problems with the transparencies
*	@method orderBuffers
*	@params {List} the particles of the system
*/
SystemInfo.prototype.orderBuffers = function(particles)
{
	var all_ids  = this.all_ids;
	var mesh     = this.particles_mesh;
	var lineMesh = this.line_mesh;

	var length  = all_ids.length;

	//If there are no particles then retun
	if(length == 0)
		return;

	var particle, id;

	var vertex_data      = mesh.getBuffer("vertices").data;
	var visibility_data  = mesh.getBuffer("visible").data;
	var color_data       = mesh.getBuffer("colors").data;
	var size_data        = mesh.getBuffer("size").data;
	var coord_data       = mesh.getBuffer("coords").data;

	var line_vertex_data  = lineMesh.getBuffer("vertices").data;
	var line_visible_data = lineMesh.getBuffer("visible").data;
	var pos = 0;

	for (var i = 0; i < length; ++i)
	{
		id = all_ids[i].id;
		particle = particles[id];

		for(var j = 0; j < 18; ++j)
			vertex_data[i*18 + j] = particle.position[j % 3];

		for(var j = 0; j < 12; ++j){
			coord_data[i*12 + j] = particle.coords[j];
			size_data[i*12 + j]  = particle.size;
		}

		for(var j = 0; j < 6; ++j)
			visibility_data[i*6 + j] = particle.visibility;
		
		for(var j = 0; j < 24; ++j)
			color_data[i*24 + j] = particle.color[j % 4];

		if(showLines)
		{
			line_vertex_data[pos]   = particle.position[0];
			line_vertex_data[pos+1] = particle.position[1] 
			+ (particle.position[1] < 0 ? (particle.size*0.5) : -(particle.size*0.5)) 
			+ (this.origin == "Point" ? this.position[1] : 0); 
			line_vertex_data[pos+2] = particle.position[2];

			line_vertex_data[pos+3] = particle.position[0];
			line_vertex_data[pos+4] = 0;
			line_vertex_data[pos+5] = particle.position[2];

			for(var j = 0; j < 6; ++j)
				line_visible_data[pos+j] = particle.visibility;

			pos += 6;
		}
	}

	mesh.upload();

	if(showLines)
		lineMesh.upload();
}


/*
* 	This method is for change the maximum number of particles of a system
*	@method resizeBufferArray
*	@params {List} the particles of the system
*/
SystemInfo.prototype.resizeBufferArray = function(particles)
{
	var mesh      = this.particles_mesh;
	var line_mesh = this.line_mesh; 
	var newSize   = this.total_particles;

	var data_Vertex  = mesh.getBuffer("vertices").data;
	var data_Visible = mesh.getBuffer("visible").data;
	var data_Coords  = mesh.getBuffer("coords").data;
	var data_iCoords = mesh.getBuffer("icoord").data;
	var data_Colors  = mesh.getBuffer("colors").data;
	var data_Size    = mesh.getBuffer("size").data;

	var data_linesVertex  = line_mesh.getBuffer("vertices").data;
	var data_linesVisible = line_mesh.getBuffer("visible").data;

	var vertexSize  = newSize * 6 * 3;
	var coordsSize  = newSize * 6 * 2;
	var colorsSize  = newSize * 6 * 4;
	var visibleSize = newSize * 6;

	var vertexLineSize = newSize * 2 * 3;

	var size, data, data_size, default_data;

	if (vertexSize == data_Vertex.length)
		return;

	var vertexBuffers = mesh.vertexBuffers;

    if (vertexSize < data_Vertex.length){

        mesh.getBuffer("vertices").data = data_Vertex.slice(0, vertexSize);
        mesh.getBuffer("visible").data  = data_Visible.slice(0, visibleSize);
        mesh.getBuffer("colors").data   = data_Colors.slice( 0, colorsSize);
        mesh.getBuffer("coords").data   = data_Coords.slice(0, coordsSize);
        mesh.getBuffer("icoord").data   = data_iCoords.slice(0, coordsSize);
        mesh.getBuffer("size").data     = data_Size.slice(0, coordsSize);

        line_mesh.getBuffer("vertices").data = data_linesVertex.slice(0, vertexLineSize);
        line_mesh.getBuffer("visible").data   = data_linesVisible.slice(0, visibleSize);

        this.orderBuffers(particles);
    } else {

    	for (x in mesh.vertexBuffers) { 
    		if (x == "vertices") {
    			size = vertexSize;
    			data_size = 6 * 3;
    			data = data_Vertex;
    			default_data = default_centers;
    		}
    		else if (x == "coords") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_Coords; 	
    			default_data = default_coords;	
    		}
    		else if (x == "colors") {
    			size = colorsSize;
    			data_size = 6 * 4;
    			data = data_Colors;
    			default_data = default_color;
    		}
    		else if (x == "visible") {
    			size = visibleSize;
    			data_size = 6;
    			data = data_Visible;
    			default_data = [0.0];
    		}
			else if (x == "size") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_Size; 	
    			default_data = default_sizes;	
    		}
    		else if (x == "icoord") {
    			size = coordsSize;   
    			data_size = 6 * 2;
    			data = data_iCoords; 	
    			default_data = square_vertices;	
    		}

        	var nBuff = new Float32Array(size);

        	//Copying the old data
	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	        
	        //Filling the new information in the buffers
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        mesh.getBuffer(x).data = nBuff
    	}

    	for (x in line_mesh.vertexBuffers) {
			if (x == "vertices") {
    			size = vertexLineSize;
    			data_size = 2 * 3;
    			data = data_linesVertex;
    			default_data = [0,0,0, 0,0,0];
    		}
    		else if (x == "visible") {
    			size = visibleSize;
    			data_size = 6;
    			data = data_linesVisible;
    			default_data = [0.0];
    		}

			var nBuff = new Float32Array(size);

        	//Copying the old data
	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	        
	        //Filling the new information in the buffers
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        line_mesh.getBuffer(x).data = nBuff
    	}
	}	
}


/*
* 	This method is for show a panel when a user makes double click in the node
*	@method onShowNodePanel
*	@params {Node} the node which the user make double click
*   @source https://github.com/jagenjo/litegraph.js/blob/master/src/litegraph-editor.js
*/
function onShowNodePanel(node)
{
	window.SELECTED_NODE = node;
    var panel = document.querySelector("#node-panel");
    if(panel)
        panel.close();
    var ref_window = this.graphCanvas.getCanvasWindow();
    panel = this.graphCanvas.createPanel(node.title || "",{closable: true, window: ref_window });
    panel.id = "node-panel";
    panel.node = node;
    panel.classList.add("dialog");
    var that = this.graphCanvas;
    var graphcanvas = this.graphCanvas;

    var aux_panel = this.graphCanvas.createPanel(node.title || "",{closable: true, window: ref_window });

    function inner_refresh()
    {
        panel.content.innerHTML = ""; //clear
       	
        if(Object.keys(node.properties).length == 0)
        	panel.addHTML("<span class='node_desc'> (" + node.type + ") <br>" + (node.constructor.desc || ""));
        else 
        {
	  		panel.addHTML("<span class='node_desc'> (" + node.type + ") <br>" + (node.constructor.desc || "")
	        			  +"</span><span class='separator'></span>");

	        panel.addHTML("<h3>Properties</h3>");
	        panel.addHTML("", "node_properties");

	        for(var i in node.properties)
	        {
	            var value = node.properties[i];
	            var info = node.getPropertyInfo(i);
	            var type = info.type || "string";

	            //in case the user wants control over the side panel widget
	            if( node.onAddPropertyToPanel && node.onAddPropertyToPanel(i,panel) )
	                continue;

	            var elem = aux_panel.addWidget( info.widget || info.type, i, value, info, function(name,value){
			                graphcanvas.graph.beforeChange(node);
			                node.setProperty(name,value);
			                graphcanvas.graph.afterChange();
			                graphcanvas.dirty_canvas = true;
			                
			                document.querySelectorAll('[data-property="'+name+'"]')[0].children[1].innerHTML = String(node.properties[name]);
			            });

                if(isArray(value))
                {               	    
               	    var value_element = elem.querySelector(".property_value");
                    value_element.setAttribute("contenteditable",true);
					value_element.addEventListener("keydown", function(e){ 
						if(e.code == "Enter")
						{
							e.preventDefault();
							this.blur();
						}
					});

					value_element.addEventListener("blur", function(){ 
						var v = this.innerText;
						var propname = this.parentNode.dataset["property"];
						var proptype = this.parentNode.dataset["type"];

						v = v.split(",");

						for(var i = 0; i < v.length; i++)
							v[i] = parseFloat(v[i]) || 0;
						
						graphcanvas.graph.beforeChange(node);
			            node.setProperty(propname,v);
			            graphcanvas.graph.afterChange();
			            graphcanvas.dirty_canvas = true;
			            this.innerText = String(node.properties[propname]);
					});    	
               }

	            if( node.prop_desc != undefined )
	            	if ( node.prop_desc[i] != undefined ) 
	            	{
	            		var desc = document.createElement('div');
	            		desc.className = "tooltiptext";
	            		desc.innerHTML = node.prop_desc[i];
	           			elem.appendChild(desc);	            		
	            	}
	           
	            panel.content.appendChild(elem);
	        }
        }

        if(node.onShowCustomPanelInfo)
            node.onShowCustomPanelInfo(panel);

        panel.addButton("Delete",function(){
            if(node.block_delete)
                return;
            node.graph.remove(node);
            panel.close();
        }).classList.add("delete");
    }

    function inner_showCodePad( node, propname )
    {
        panel.style.top = "calc( 50% - 250px)";
        panel.style.left = "calc( 50% - 400px)";
        panel.style.width = "900px";
        panel.style.height = "500px";

        if(window.CodeFlask) //disabled for now
        {
            panel.content.innerHTML = "<div class='code'></div>";
            var flask = new CodeFlask( "div.code", { language: 'js' });
            flask.updateCode(node.properties[propname]);
            flask.onUpdate( function(code) {
                node.setProperty(propname, code);
            });
        }
        else
        {
            panel.content.innerHTML = "<textarea class='code'></textarea>";
            var textarea = panel.content.querySelector("textarea");
            textarea.value = node.properties[propname];
            textarea.addEventListener("keydown", function(e){
                //console.log(e);
                if(e.code == "Enter" && e.ctrlKey )
                {
                    console.log("Assigned");
                    node.setProperty(propname, textarea.value);
                }
            });
            textarea.style.height = "calc(100% - 40px)";
        }
        var assign = that.createButton( "Assign", null, function(){
            node.setProperty(propname, textarea.value);
        });
        panel.content.appendChild(assign);
        var button = that.createButton( "Close", null, function(){
            panel.style.height = "";
            inner_refresh();
        });
        button.style.float = "right";
        panel.content.appendChild(button);
    }

    inner_refresh();

    document.getElementById("nodeDisplay").appendChild( panel );
}


/*
* 	This method is for charge a texture
*	@method onShowNodePanel
*	@params {Node}   the node that charges the texture
*   @params {Object} the properties of the node
*   @params {String} the url of the texture
*   @params {String} the name of the texture (only applied if is one of the default ones)
*/
function chargeTexture(node, node_properties, url, def_text = "NONE")
{
	texture_modal.modal('hide');

	GL.Texture.fromURL(url, {}, function(t,u){node.afterLoading(t,u)});
	node_properties.default_texture = def_text;
}


/*
* 	This method is for show the modal of the textures and define what does every button
*	@method loadTexture
*	@params {Node} the node that charges the texture
*/
function loadTexture(node)
{
	texture_modal.modal('show');
	var node_properties = node.properties;

	def_texture_1.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/smoke.png', 'smoke');
	}

	def_texture_2.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/smoke2.png', 'smoke2');
	}
	
	def_texture_3.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/fire.png', 'fire');
	}
	
	def_texture_4.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/light.png', 'light');
	}

	def_texture_5.onclick = function(){
		chargeTexture(node, node_properties, 'default_textures/particles/AnimatedExplosion.png', 'AnimatedExplosion');
	}

	local_texture.onclick = function(){
		var input = document.createElement("input");
		input.type = "file";

		input.addEventListener("change", function(e){
			var file = e.target.files[0];
			var name = file.name; 

			if (!file || file.type.split("/")[0] != "image")
			{
				createAlert("Holy Guacamole!", "Loading error", "Please insert an image...", "danger", true, true, "pageMessages");
			    return;	
			}
		
			var reader = new FileReader();
			reader.onload = function(e) {
				chargeTexture(node, node_properties, reader.result, name);
			};

			reader.readAsDataURL(file);

		}, false);

		input.click();
	}
}


/*
* 	This method is for check if a string is a valid url
*	@method validURL
*	@params {String} the string to check
*   @source https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
*/
function validURL(str) 
{
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}


/*
* 	This method is for charge a mesh
*	@method onShowNodePanel
*	@params {Node}   the node that charges the texture
*   @params {String} the url of the mesh
*/
function chargeMesh(node, url)
{
	GL.Mesh.fromURL(url, node.onMeshLoaded.bind(node));
	mesh_modal.modal('hide');
}


/*
* 	This method is for show the modal of the mesh and define what does every button
*	@method loadMesh
*	@params {Node} the node that charges the texture
*/
function loadMesh(node)
{
	
	mesh_modal.modal('show');

	//Pango
	def_mesh_1.onclick = function(){
		chargeMesh(node, 'default_meshes/pango.obj');
		node.properties.name = "pango";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Cylinder
	def_mesh_2.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cylinder({radius:0.5}));
		node.properties.name = "cylinder";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}
	
	//Plane
	def_mesh_3.onclick = function(){
		node.onMeshLoaded(GL.Mesh.plane(), true);
		node.properties.name = "plane";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}
	
	//Dodo
	def_mesh_4.onclick = function(){
		chargeMesh(node, 'default_meshes/dodo.obj');
		node.properties.name = "dodo";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Cube
	def_mesh_5.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cube());
		node.properties.name = "cube";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Cone
	def_mesh_6.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cone({radius:0.5,height:1}));
		node.properties.name = "cone";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//PI
	def_mesh_7.onclick = function(){
		chargeMesh(node, 'default_meshes/pi.obj');
		node.properties.name = "pi";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
	}

	//Sphere
	def_mesh_8.onclick = function(){
		node.onMeshLoaded(GL.Mesh.sphere());
		node.properties.name = "sphere";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Icosahedron
	def_mesh_9.onclick = function(){
		node.onMeshLoaded(GL.Mesh.icosahedron({size:1,subdivisions:1}));
		node.properties.name = "ico";
		node.last_name = node.properties.name;
		node.size[1]   = node.n_size;
		mesh_modal.modal('hide');
	}

	//Custom mesh
	custom_mesh.onclick = function(){
		var url = url_mesh.value;
		chargeMesh(node, url);

		//Check if the url is valid
		if(!validURL(url))
		{
        	createAlert('Holy Guacamole!','Loading error','URL not valid...','danger',true,true,'pageMessages')
            return;
        }

		url = url.split("/");
		var name = url[url.length - 1];
		name = name.split(".");
		var extension = name[name.length - 1];
		
		//Check if the extension is valid
        if(GL.Mesh.parsers[extension] == undefined)
        {
        	createAlert('Holy Guacamole!','Loading error','Extension not valid...','danger',true,true,'pageMessages')
            return;
        }
		
		//Get the name of the mesh
		var n_name = "";
		for(var i = 0; i < name.length - 1; ++i)
            n_name += name[i];
            
		if(n_name.length > 7)
			n_name = n_name.substring(0, 7);
        
		node.temp_name = n_name;
	}
}


/*
* 	This method is for reset all the particles of a system
*	@method resetSystem
*	@params {SystemInfo} the information of the system
*/
function resetSystem(system)
{
	var particles, ids, toReset, particle;
	var subEmittors, subEmitter;

	particles   = system.particles_list;
	subEmittors = system.sub_emittors;

	toReset = [];
	ids = system.particles_ids;
	for (var j = 0; j < ids.length; ++j) 
	{
		particle = particles[ids[j].id];
		particle.visibility = 0;

		toReset.push(particle.id);
	}

	system.particles_to_reset = toReset;

	toReset = [];
	for (var j = 0; j < subEmittors.length; ++j) 
	{
		subEmitter = subEmittors[j];
		ids = subEmitter.ids;

		for (var k = 0; k < ids.length; ++k) 
		{
			particle = particles[ids[k].id];
			particle.visibility = 0;

			toReset.push(particle.id);
		}

		subEmitter.to_reset = toReset;
	}
}