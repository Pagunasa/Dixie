var basicNodeColor  		= "#FFFC99";
var basicTitleColor 		= "#000000";
var basicSelectedTitleColor = "#000000";

var meshes_list = [];
var vortex_list = [];
var system_list = [];

var default_vertices  = [-0.25,-0.25,0, 0.25,-0.25,0, -0.25,0.25,0, 0.25,0.25,0, -0.25,0.25,0, 0.25,-0.25,0];
var default_coords    = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var default_color     = [1,1,1,1];

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
		this.id      = id_;
		this.mesh_id = id_;
	}
}

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
