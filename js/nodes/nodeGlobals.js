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
//var meshes_list  = [];
var forces_list  = [];
var system_list  = [];
var objects_list = [];

/********************************/
/***********Mesh Stuff***********/
/********************************/
var default_centers    = [0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0];
var default_coords     = [1,1, 0,1, 1,0, 0,0, 1,0, 0,1];
var square_vertices    = [-0.5,0.5, 0.5,0.5, -0.5,-0.5, 0.5,-0.5, -0.5,-0.5, 0.5,0.5];//[0.5,0.5, -0.5,0.5, 0.5,0, -0.5,0., 0.5,0., -0.5,0.5];
var default_color      = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1];
var default_sizes      = [0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25];
var default_visibility = [0, 0, 0, 0, 0, 0];
var default_forces_mesh;


/********************************/
/*************Modals*************/
/********************************/
var texture_modal = $('#texturesModal');
var def_texture_1 = document.getElementById("def_texture1");
var def_texture_2 = document.getElementById("def_texture2");
var def_texture_3 = document.getElementById("def_texture3");
var def_texture_4 = document.getElementById("def_texture4");
var def_texture_5 = document.getElementById("def_texture5");
var local_texture = document.getElementById("texture_local");


/********************************/
/*************Meshes*************/
/********************************/
var mesh_modal = $('#meshesModal');
var def_mesh_1 = document.getElementById("def_mesh1");
var def_mesh_2 = document.getElementById("def_mesh2");
var def_mesh_3 = document.getElementById("def_mesh3");
var def_mesh_4 = document.getElementById("def_mesh4");
var def_mesh_5 = document.getElementById("def_mesh5");
var def_mesh_6 = document.getElementById("def_mesh6");
var def_mesh_7 = document.getElementById("def_mesh7");
var def_mesh_8 = document.getElementById("def_mesh8");
var def_mesh_9 = document.getElementById("def_mesh9");


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
	constructor(id_, position_, max_particles_, max_trail_particles_) {
		this.id                 = id_;
		this.mesh_id            = id_;
		
		this.particles_ids      = [];		
		this.particles_list     = [];
		this.particles_mesh     = createMesh(max_particles_);

		this.trails             = false;
		this.trails_ids         = [];
		this.trails_list        = [];
		this.trails_mesh        = createMesh(max_trail_particles_);

		this.particles_to_reset = [];
		this.trails_to_reset    = [];

		this.position           = position_;
		this.model              = mat4.create();
		this.point_mode         = true;
		this.external_model     = undefined;
		this.color              = [1,1,1,1];
		this.visible            = true;
		this.visibility         = 1;
		this.texture            = undefined;
		this.trails_texture     = undefined;
		this.coords             = default_coords;
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
	this.iSpeed = [0,0,0];
	for (var i = 0; i < 3; ++i)
		this.iSpeed[i] = speed[i];

	this.lifetime   = lifetime;
	this.c_lifetime = 0.0; //How many life time the particle lived
	this.visibility = 1;

	this.animated  = false;
	this.frameRate = 0;
	this.c_frame   = 0;
	this.frameX    = 0;  
	this.frameY    = 0;  

	var texture = properties.texture; 
	if(texture.prop.animated)
	{
		this.animated = true;

		var t = lifetime;

		if(texture.prop.anim_loop)
		{
			var anim_d = texture.prop.anim_duration;
			t = anim_d == 0 ? lifetime : anim_d;
		}

		var frame_number = Math.floor(texture.ntx + texture.nty) - 1; 
		this.frameRate = (t / frame_number);
	}
};


/*
* 	This method is for create a mesh
*	@method createMesh
*	@params {Number} the id of the mesh
*	@params {Number} the maximum number of particles
*/
function createMesh(particles){
	var vertices = new Float32Array(particles * 6 * 3); //Save information about the center of the particle
	var coords   = new Float32Array(particles * 6 * 2); //The "possible changed" coordinates of the particle
	var icoord   = new Float32Array(particles * 6 * 2); //The original coordinates of the particle
	var sizes    = new Float32Array(particles * 6 * 2); //
	var colors   = new Float32Array(particles * 6 * 4); //
	var visible  = new Float32Array(particles * 6);     //This array is for know with particles are not visible

	for(var i = 0; i < particles; i ++)
	{
		visible.set(default_visibility, i*6);
		vertices.set(default_centers, i*6*3);
		coords.set(default_coords, i*6*2);
		icoord.set(square_vertices, i*6*2);
		colors.set(default_color, i*6*4);
		sizes.set(default_sizes, i*6*2);
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

function orderBuffers(new_order, particles, mesh) {
	var length = new_order.length;

	//If there are no particles then retun
	if(length == 0)
		return;

	var particle, id;

	var vertex_data      = mesh.getBuffer("vertices").data;
	var visibility_data  = mesh.getBuffer("visible").data;
	var color_data       = mesh.getBuffer("colors").data;
	var size_data        = mesh.getBuffer("size").data;
	var coord_data       = mesh.getBuffer("coords").data;;

	for (var i = 0; i < length; ++i)
	{
		id = new_order[i].id;
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
	}

	mesh.upload();
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
	var data_iCoords = mesh.getBuffer("icoord").data;
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

	var vertexBuffers = mesh.vertexBuffers;

    if (vertexSize < data_Vertex.length){

        mesh.getBuffer("vertices").data = data_Vertex.slice(0, vertexSize);
        mesh.getBuffer("visible").data  = data_Visible.slice(0, visibleSize);
        mesh.getBuffer("colors").data   = data_Colors.slice( 0, colorsSize);
        mesh.getBuffer("coords").data   = data_Coords.slice(0, coordsSize);
        mesh.getBuffer("icoord").data   = data_iCoords.slice(0, coordsSize);
        mesh.getBuffer("size").data     = data_Size.slice(0, coordsSize);

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
*	@method updateSize
*	@params {Mesh} the mesh
*	@params {particle} the particle
*	@params {Number} the id of the particle
*/
function updateSize(mesh, particle, particle_id){
	var size_data = mesh.vertexBuffers.size.data;
	particle_id *= 12

	//var j = 0;

	for(var i = 0; i < 12; i++)
	{
		size_data[particle_id + i] = particle.size;		
	//	j = (j + 1) % 2;
	}
} 


function updateCoord(mesh, particle, particle_id, new_coord){
	var coord_data = mesh.vertexBuffers.coords.data;
	var lowX  = new_coord[0];
	var lowY = new_coord[1];
	var highX  = new_coord[2];
	var highY = new_coord[3];
	
	particle_id *= 12

	coord_data[particle_id]   = highX;
	coord_data[particle_id+1] = highY;

	coord_data[particle_id+2] = lowX;
	coord_data[particle_id+3] = highY;

	coord_data[particle_id+4] = highX;
	coord_data[particle_id+5] = lowY;

	coord_data[particle_id+6] = lowX;
	coord_data[particle_id+7] = lowY;

	coord_data[particle_id+8] = highX;
	coord_data[particle_id+9] = lowY;

	coord_data[particle_id+10] = lowX;
	coord_data[particle_id+11] = highY;

} 


function onShowNodePanel(node){
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

    function inner_refresh()
    {
        panel.content.innerHTML = ""; //clear
        panel.addHTML("<span class='node_type'>"+node.type+"</span><span class='node_desc'>"+(node.constructor.desc || "")+"</span><span class='separator'></span>");

        panel.addHTML("<h3>Properties</h3>");

        for(var i in node.properties)
        {
            var value = node.properties[i];
            var info = node.getPropertyInfo(i);
            var type = info.type || "string";

            //in case the user wants control over the side panel widget
            if( node.onAddPropertyToPanel && node.onAddPropertyToPanel(i,panel) )
                continue;

            panel.addWidget( info.widget || info.type, i, value, info, function(name,value){
                graphcanvas.graph.beforeChange(node);
                node.setProperty(name,value);
                graphcanvas.graph.afterChange();
                graphcanvas.dirty_canvas = true;
            });
        }

        panel.addSeparator();

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
        panel.style.width = "800px";
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

function chargeTexture(node, node_properties, url, def_text = "NONE"){
	if(!node.data_loaded)
		node.size[1] += 112;

	node.data_loaded = true;
	texture_modal.modal('hide');

	GL.Texture.fromURL(url, {}, function(t,u){node.afterLoading(t,u)});
	node_properties.default_texture = def_text;
}

function loadTexture(node){
	
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
		chargeTexture(node, node_properties, 'default_textures/particles/AnimatedExplosion.png', 'light');
	}

	local_texture.onclick = function(){
		var input = document.createElement("input");
		input.type = "file";

		input.addEventListener("change", function(e){
			var file = e.target.files[0];
			
			if (!file || file.type.split("/")[0] != "image")
			{
				createAlert("Holy Guacamole!", "Loading error", "Please insert an image...", "danger", true, true, "pageMessages");
			    return;	
			}
		
			var reader = new FileReader();
			reader.onload = function(e) {
				chargeTexture(node, node_properties, reader.result);
			};

			reader.readAsDataURL(file);

		}, false);

		input.click();
	}
}


function chargeMesh(node, url){
	GL.Mesh.fromURL(url, node.onMeshLoaded.bind(node));
	mesh_modal.modal('hide');
}

function loadMesh(node){
	
	mesh_modal.modal('show');

	//Pango
	def_mesh_1.onclick = function(){
		chargeMesh(node, 'default_meshes/pango.obj');
	}

	//Cylinder
	def_mesh_2.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cylinder({radius:0.5}));
		mesh_modal.modal('hide');
	}
	
	//Torus
	def_mesh_3.onclick = function(){
		node.onMeshLoaded(GL.Mesh.torus({innerradius:0.25,outerradius:1,innerslices:8}));
		mesh_modal.modal('hide');
	}
	
	//Dodo
	def_mesh_4.onclick = function(){
		chargeMesh(node, 'default_meshes/dodo.obj');
	}

	//Cube
	def_mesh_5.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cube());
		mesh_modal.modal('hide');
	}

	//Cone
	def_mesh_6.onclick = function(){
		node.onMeshLoaded(GL.Mesh.cone({radius:0.5,height:1}));
		mesh_modal.modal('hide');
	}

	//PI
	def_mesh_7.onclick = function(){
		chargeMesh(node, 'default_meshes/pi.obj');
	}

	//Sphere
	def_mesh_8.onclick = function(){
		node.onMeshLoaded(GL.Mesh.sphere());
		mesh_modal.modal('hide');
	}

	//Icosahedron
	def_mesh_9.onclick = function(){
		node.onMeshLoaded(GL.Mesh.icosahedron({size:1,subdivisions:1}));
		mesh_modal.modal('hide');
	}
}