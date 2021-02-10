/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function mySpawnNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
        max_particles: 100,            //Maximum number of particles allowed
        max_trail_particles: 300,
        spawn_rate: 10,     		   //How many particles are spawned every frame
        position: new Float32Array(3), //The origin of the particles (in point mode)
        mode: "Point",      	 	   //The mode of spawn
        mesh_mode: "Surface",          //The mode of spawn in the mesh
    	color: [1,1,1,1],              //The color of the origin of the particle
        show_origin: true,
        trail: false
    };
   
    this.last_status = {
    	max_particles: 100,             //Which was the max_particles in the last change
    	max_trail_particles: 300        //Which was the max_trail_particles in the last change
    };

    this.modeValues = ["Point", "Mesh", "2D Geometry"];

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to enable/disable the visibility of the origin of the particles
	this.show_widget  = this.addWidget("toggle", "Show origin", true, this.toogleOriginVisibility.bind(this));
	//This widget allows to enable/disable a trail left by the particles
	this.trail_widget = this.addWidget("toggle", "Trail particles", false, this.toogleTrail.bind(this));
	//This widget allows to change the mode for spawning the particles of the system 
	this.mode_widget  = this.addWidget("combo", "Mode", "Point", this.setValue.bind(this), { values: this.modeValues});

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Max particles", "number");
	this.addInput("Max particles trail", "number");
	this.addInput("Spawn rate"   , "number");
	this.addInput("Color"        , "color")
	this.addInput("Position"     , "vec3");

	this.addOutput("Spawner", "spawner");
}

mySpawnNode.prototype.toogleOriginVisibility = function(){
	var properties              = this.properties;
	this.properties.show_origin = !properties.show_origin;
	this.system.visible = properties.show_origin;
}

mySpawnNode.prototype.toogleTrail = function(v) {
	var properties    = this.properties;
	this.properties.trail  = !properties.trail;
	this.system.trail = properties.trail;
}


mySpawnNode.prototype.setValue = function(v) {
	if (this.properties.mode == v)
		return;

	this.properties.mode = v;
	//The first two inputs will be always the same, so we have to disconect and delete the third
	this.disconnectInput(4);
	this.inputs.splice(4,1);
	//if a change is maked and a seconf widget exist in the node, it must be deleted
	this.widgets.splice(3,1); 

	if (v == "Point"){
		this.addInput("Position", "vec3"); //if the mode is point the new input must be a vector 3
		this.size[1] = 190;
	}
	else if (v == "Mesh")
	{
		//this.widgets.splice(3,1); //if a change is maked and a seconf widget exist in the node, it must be deleted
		this.addInput("Mesh", "mesh"); //if the mode is mesh the new input must be a mesh
		//This widget allow to change the spawn mode of the mesh
		this.addWidget("combo", "Mesh Spawn Mode", "Surface", function(){}, { values:["Surface", "Volume"] });
		this.size[0] = 252;
	}
	else if (v == "2D Geometry")
	{
		this.addInput("Geometry", "2dGeometry"); //if the mode is 2D geometry  the new input must be that geometry
		this.size[1] = 190;
	}
}


//For recover (in a visual way) the value when a graph is loaded
mySpawnNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch(property)
	{
		case "max_particles":
			var max_particles = Math.round(properties.max_particles);
			max_particles = isNaN(max_particles) ? 0 : max_particles;
			properties.max_particles = Math.max(max_particles, 0.0);
		break;

		case "max_trail_particles":
			var max_trail_particles =Math.round(properties.max_trail_particles);
			max_trail_particles = isNaN(max_trail_particles) ? 0 : max_trail_particles;
			properties.max_trail_particles = Math.max(max_trail_particles, 0.0);
		break;

		case "spawn_rate":
			var spawn_rate = properties.spawn_rate;
			spawn_rate = isNaN(spawn_rate) ? 0 : spawn_rate;
			properties.spawn_rate = Math.max(spawn_rate, 0.0);
		break;

		case "position":
			if(properties.position.length != 3)
				properties.position = [0,0,0];
		break;

		case "mode":
			var m = properties.mode;

			if(!this.modeValues.includes(m))
				m = "Point";

			this.mode_widget.value = m;
			this.setValue(m);	
		break;

		case "mesh_mode":
		break;

		case "color":
			if(properties.color.length != 4)
				properties.color = [1,1,1,1];

			for (var i = 0; i < 4; ++i)
				properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
		break;

		case "show_origin":
			this.show_widget.value = properties.show_origin;

			if(this.system == undefined)
			{
				this.system = new SystemInfo(graph.last_node_id+1, properties.position, properties.max_particles, properties.max_trail_particles);
				system_list.push(this.system);	
			}
			this.system.visible = properties.show_origin;
		break;

		case "trail":
			this.trail_widget.value = properties.trail;

			if(this.system == undefined)
			{
				this.system = new SystemInfo(graph.last_node_id+1, properties.position, properties.max_particles, properties.max_trail_particles);
				system_list.push(this.system);	
			}
			this.system.trail = properties.trail;
		break;
	}
}


mySpawnNode.prototype.onAdded = function() 
{
	//Every time that a spawn node is created a new mesh and information about the system have to be added to the list in order to work properly
	var properties = this.properties;

	if(this.system == undefined)
	{
		this.system = new SystemInfo(this.id, properties.position, properties.max_particles, properties.max_trail_particles);
		system_list.push(this.system);	
	}
};

mySpawnNode.prototype.onExecute = function() 
{
	var properties     = this.properties;
	var max_particles  = properties.max_particles;
	var max_trail      = properties.max_trail_particles;
	var spawn_rate     = properties.spawn_rate;
	var color          = properties.color;
	var position       = properties.position;
	var mode           = properties.mode;
	var system         = this.system;
	var last_status    = this.last_status;
	var origin_mesh;
	var origin_2d_geometry;

	//When is executed the inputs are gotten 
	var input_max_particles   = this.getInputData(0);
	var input_max_t_particles = this.getInputData(1);
	var input_spawn_rate      = this.getInputData(2);
	var input_color           = this.getInputData(3);
	var input_origin          = this.getInputData(4);

	//and if they are undefined a default value is setted
	properties.max_particles       = input_max_particles   == undefined ? max_particles : Math.abs(Math.round(input_max_particles));
	properties.max_trail_particles = input_max_t_particles == undefined ? max_trail     : Math.abs(Math.round(input_max_t_particles));
	properties.spawn_rate          = input_spawn_rate      == undefined ? spawn_rate    : Math.abs(Math.round(input_spawn_rate));
	properties.color               = input_color || color;
	
	if(mode == "Point")
		position = input_origin || position;

	mode == "Mesh"        ? origin_mesh        = input_origin : undefined;
	mode == "2D Geometry" ? origin_2d_geometry = input_origin : undefined;

	//It's necesary update the system position and color for render te origin of the particles
	system.position = position;
	system.color    = color;
	
	//Check if the maximum number of particles change, if is true then the array of the particles have to be resized
	if (max_particles != last_status.max_particles)
	{	
		var particles_list = system.particles_list;

		if(max_particles < last_status.max_particles)	
		{
			particles_list.splice(max_particles, particles_list.length);
			system.particles_ids = system.particles_ids.filter(p => p.id < max_particles); //I no put particles_ids in other variable because it didn't work
		}
			
		last_status.max_particles = max_particles;	
		resizeBufferArray(system.particles_mesh, max_particles);
	}

	//Same for the trails
	if(properties.trail && max_trail != last_status.max_trail_particles)
	{
		var particles_trail = system.trails_list;

		if(max_trail < last_status.max_trail_particles)	
		{
			particles_trail.splice(max_trail, particles_trail.length);
			system.trails_ids = system.trails_ids.filter(p => p.id < max_trail); //I no put particles_ids in other variable because it didn't work
		}
			
		last_status.max_trail_particles = max_trail;	
		resizeBufferArray(system.trails_mesh, max_trail);
	}

	//The properties of the node are the output plus some extras
	var out_data = {
		id                  : this.id,
		trails              : properties.trail,
		modify_trails       : false,
		max_particles 		: max_particles,
		max_trails          : max_trail,
		spawn_rate    		: spawn_rate,
		position      		: position,
		mode          		: mode,
		origin_mesh   		: origin_mesh,
		mesh_mode 	        : properties.mode,
		origin_2d_geometry  : origin_2d_geometry,
		color               : color
	}

	this.setOutputData(0, out_data);
}

mySpawnNode.prototype.onRemoved = function(){
	//When the node is deleted is necesary to search in the list and delete is asigned mesh and information
	//searchMesh(this.id, true);
    searchSystem(this.id, true);
}

mySpawnNode.title = "Spawn Particles";
mySpawnNode.title_color = spawnNodeColor;
mySpawnNode.title_text_color = basicTitleColor;
mySpawnNode.title_selected_color = basicSelectedTitleColor;