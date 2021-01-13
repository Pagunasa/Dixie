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

/********************************/
/*************Lists**************/
/********************************/
var meshes_list = [];
var vortex_list = [];
var system_list = [];

/********************************/
/***********Mesh Stuff***********/
/********************************/
var default_vertices  = [-0.25,-0.25,0, 0.25,-0.25,0, -0.25,0.25,0, 0.25,0.25,0, -0.25,0.25,0, 0.25,-0.25,0];
var default_coords    = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var default_color     = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1];
var default_init      = [0, 0, 0, 0, 0, 0];


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

//Information that we want to assign to an identifier
class SystemInfo {
	constructor(id_) {
		this.id                 = id_;
		this.mesh_id            = id_;
		this.particles_list     = [];
		this.particles_to_reset = [];
	}
}

class Particle {
	constructor() {
		this.size = 0.4;
	}
}

Particle.prototype.fill = function(properties) {
	var speed = new Float32Array(3);
	speed[0]  = Math.random() * properties.max_speed[0] + properties.min_speed[0];
	speed[1]  = Math.random() * properties.max_speed[1] + properties.min_speed[1];
	speed[2]  = Math.random() * properties.max_speed[2] + properties.min_speed[2];

	//Radom definition of the lifetime
	lifetime = Math.random() * properties.max_life_time + properties.min_life_time;

	this.position = new Float32Array(3);
	this.speed    = speed;
	this.lifetime = lifetime;
	this.to_reset = false;
};

/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {Number} the id of the mesh
*	@params {Number} the maximum number of particles
*/
function createMesh(id, particles){
	var vertices  = new Float32Array(particles * 6 * 3);
	var coords    = new Float32Array(particles * 6 * 2);
	var colors    = new Float32Array(particles * 6 * 4);
	var visible   = new Float32Array(particles * 6); //This array is for know with particles are not initialized

	for(var i = 0; i < particles; i ++)
	{
		colors.set(default_color, i*6*4);
		vertices.set(default_vertices, i*6*3)
		coords.set(default_coords, i*6*2);
		visible.set(default_init, i*6);
	}

	var mesh = new GL.Mesh();
	mesh.addBuffers({vertices : vertices, coords: coords, colors : colors, visible : visible}, null, gl.STREAM_DRAW);

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
	var data_Coords  = mesh.getBuffer("coords").data;
	var data_Colors  = mesh.getBuffer("colors").data;
	var data_Visible = mesh.getBuffer("visible").data;

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

    		data = data.slice(0, size);
        	mesh.getBuffer(x).data = data;
    	}

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
		+ ( i == 3 ? 0.25 
			: i == 7 ? 0.25 
			: i == 9 ? 0.25 
			: i == 10 ? 0.25 
			: i == 13 ? 0.25 
			: i == 15 ? 0.25 
			: 0 );

		j = (j + 1 ) % 3;
	}
} 


/*
* 	This method is for update the position of a particles
*	@method updateVertex
*	@params {Mesh} the mesh
*	@params {Number} the id of the particle
*	@params {Number} the particle
*/
function updateVisibility(mesh, particle, particle_id, visible = 0.0){
	var visibility_data = mesh.vertexBuffers.visible.data;
	particle_id *= 6
	particle.to_reset = false;

	for(var i = 0; i < 6; i++)
		visibility_data[particle_id + i] = visible;		
} 

function cross(a, b){
    var c = new Float32Array(3);
    
    c[0] = a[1]*b[2] - a[2]*b[1];
    c[1] = a[2]*b[0] - a[0]*b[2];
    c[2] = a[0]*b[1] - a[1]*b[0];

    return c;
}

function mult(a, b){
	var c = new Float32Array(3);
	
	c[0] = a[0] * b[0];
	c[1] = a[1] * b[1];
	c[2] = a[2] * b[2];

	return c;
}