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
var meshes_list  = [];
var forces_list  = [];
var system_list  = [];

/********************************/
/***********Mesh Stuff***********/
/********************************/
var default_centers    = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var default_coords     = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var default_color      = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1];
var default_sizes      = [0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25];
var default_visibility = [0, 0, 0, 0, 0, 0];
var default_forces_mesh;


function lerp(s, e, x){
	return s * ( 1 - x ) + e * x; 
}

/*
* 	This method returns the cross product of two vectors
*	@method cross
*	@params {vector3} the first vector
*	@params {vector3} the second vector
*/
function cross(a, b){
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
function mult(a, b){
	var c = new Float32Array(3);
	
	c[0] = a[0] * b[0];
	c[1] = a[1] * b[1];
	c[2] = a[2] * b[2];

	return c;
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
function addForce(id, position, type){
	var model = mat4.create();
	mat4.setTranslation(model, position);

	var force = {
			id    : id,
			type  : type,
			model : model,
			position : position,
			color : [1,1,1,1],
			visible : true
		};

	forces_list.push( force );

	return force;
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
* 	This class is for save information about every system
*	@class SystemInfo
*/
class SystemInfo {
	constructor(id_, position_) {
		this.id                 = id_;
		this.mesh_id            = id_;
		this.particles_list     = [];
		this.particles_to_reset = [];
		this.position           = position_;
		this.model              = mat4.create();
		this.color              = [1,1,1,1];
		this.visible            = true;
		this.texture            = undefined;
	}
}


function randomNumber(min, max){
  return Math.random() * (max - min) + min;
}

/*
* 	This class is for save information about every particle
*	@class SystemInfo
*/
class Particle {
	constructor() {
		this.size = 0.25;
	}
}

Particle.prototype.fill = function(properties) {
	var speed = new Float32Array(3);
	speed[0]  = randomNumber(properties.min_speed[0], properties.max_speed[0]);
	speed[1]  = randomNumber(properties.min_speed[1], properties.max_speed[1]);
	speed[2]  = randomNumber(properties.min_speed[2], properties.max_speed[2]);

	//Radom definition of the lifetime
	lifetime = randomNumber(properties.min_life_time, properties.max_life_time);

	this.position = new Float32Array(3);
	for (var i = 0; i < 3; ++i)
		this.position[i] = properties.position[i];

	this.color  = new Float32Array(4);
	this.iColor = new Float32Array(4);
	for (var i = 0; i < 4; ++i)
	{
		this.iColor[i] = properties.color[i];
		this.color[i] = properties.color[i];
	}

	var s = randomNumber(properties.min_size, properties.max_size);
	this.size  = s;
	this.iSize = s;
	
	this.speed  = speed;
	this.iSpeed = new Float32Array(3);
	for (var i = 0; i < 3; ++i)
		this.iSpeed[i] = speed[i];

	this.lifetime   = lifetime;
	this.c_lifetime = 0.0; //How many life time the particle lived
	this.to_reset   = false;
};


/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {Number} the id of the mesh
*	@params {Number} the maximum number of particles
*/
function createMesh(id, particles){
	var vertices = new Float32Array(particles * 6 * 3); //Save information about the center of the particle
	var coords   = new Float32Array(particles * 6 * 2);
	var sizes    = new Float32Array(particles * 6 * 2);
	var colors   = new Float32Array(particles * 6 * 4);
	var visible  = new Float32Array(particles * 6); //This array is for know with particles are not initialized

	for(var i = 0; i < particles; i ++)
	{
		visible.set(default_visibility, i*6);
		vertices.set(default_centers, i*6*3);
		coords.set(default_coords, i*6*2);
		colors.set(default_color, i*6*4);
		sizes.set(default_sizes, i*6*2);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({ 
					  vertices : vertices, 
					  coords   : coords, 
		              colors   : colors, 
		              visible  : visible,
		              size     : sizes
		            }, null, gl.STREAM_DRAW);

	meshes_list.push({id: id, mesh: mesh})
}


/*
* 	This method is for change the maximum number of particles of a system
*	@method createMesh
*	@params {Mesh} the mesh
*	@params {Number} the new maximum 
*/
function resizeBufferArray(mesh, newSize) {
	var data_Vertex  = mesh.getBuffer("vertices").data;
	var data_Visible = mesh.getBuffer("visible").data;
	var data_Coords  = mesh.getBuffer("coords").data;
	var data_Colors  = mesh.getBuffer("colors").data;
	var data_Size    = mesh.getBuffer("size").data;

	var vertexSize  = newSize * 6 * 3;
	var coordsSize  = newSize * 6 * 2;
	var colorsSize  = newSize * 6 * 4;
	var visibleSize = newSize * 6;

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
    		else if (x == "visible") {
    			size = visibleSize;
    			data = data_Visible;
    		} 
    		else if (x == "size") {
    			size = coordsSize;
    			data = data_Size;
    		}

    		data = data.slice(0, size);
        	mesh.getBuffer(x).data = data;
    	}

    } else {

    	for (x in meshes_list[0].mesh.vertexBuffers) { 
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

        	var nBuff = new Float32Array(size);

	        for (var i = 0; i < data.length; i++)
	            nBuff[i] = data[i];
	            
			for(var i = data.length / data_size; i < nBuff.length / data_size; i ++)
			    nBuff.set(default_data, i*data_size);

	        mesh.getBuffer(x).data = nBuff
    	}

	}	
}


/*
* 	This method is for update the position of a particles
*	@method updateVertex
*	@params {Mesh} the mesh
*	@params {Number} the id of the particle
*	@params {Number} the particle
*/
function updateVertexs(mesh, particle_id, particle){
	var vertex_data = mesh.vertexBuffers.vertices.data;

	particle_id *= 18
	var j = 0;

	for(var i = 0; i < 18; i++)
	{
		vertex_data[particle_id + i] = particle.position[j]
		j = (j + 1) % 3;
	}

} 


/*
* 	This method is for update the visibility of a particle
*	@method updateVisibility
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*	@params {Number} enable or disable the visibility
*/
function updateVisibility(mesh, particle, particle_id, visible = 0.0){
	var visibility_data = mesh.vertexBuffers.visible.data;
	particle_id *= 6
	particle.to_reset = false;

	for(var i = 0; i < 6; i++)
		visibility_data[particle_id + i] = visible;		
} 


/*
* 	This method is for update the color of a particle
*	@method updateColor
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*/
function updateColor(mesh, particle, particle_id){
	var color_data = mesh.vertexBuffers.colors.data;
	particle_id *= 24

	var j = 0;

	for(var i = 0; i < 24; i++)
	{
		color_data[particle_id + i] = particle.color[j];		
		j = (j + 1) % 4;
	}
} 


/*
* 	This method is for update the size of a particle
*	@method updateColor
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*/
function updateSize(mesh, particle, particle_id){
	var size_data = mesh.vertexBuffers.size.data;
	particle_id *= 12

	var j = 0;

	for(var i = 0; i < 12; i++)
	{
		size_data[particle_id + i] = particle.size;		
		j = (j + 1) % 2;
	}
} 