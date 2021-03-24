/*
* 	Resize the mesh
*	@method resizeMesh
*	@params {Object} The system we want to edit
*	@params {Number} The new number of particles
*	@params {Object} The new number of subemissions
*/
function resizeMesh(system, num_particles, num_subemissions)
{
	if (num_particles != system.max_particles || num_subemissions != system.max_subemissions)
	{	

		system.total_particles = num_particles + num_particles * num_subemissions;

		if(num_particles < system.max_particles || num_subemissions < system.max_subemissions)	
		{
			var particles_list     = system.particles_list;
			var particles_ids      = system.particles_ids;

			//Splice the ids in order to get only the new size
			particles_ids.splice(num_particles, particles_ids.length); 

			var id, particle, n_particles = [], n_particles_ids = [], n_sub_emissions_ids = [];
			var n_particles_to_reset = [], n_sub_emissions_to_reset = [];
			var last_id = 0;
			
			//Reorganize the ids
			for (var i = 0; i < particles_ids.length; ++i)
			{
				id = particles_ids[i];
				particle = particles_list[id.id];

				n_particles_ids.push({id: last_id, distance_to_camera: id.distance_to_camera});
				particle.id         = last_id;

				if (particle.visibility == 0)
					n_particles_to_reset.push(last_id);

				last_id++;
				n_particles.push(particle); 
			}

			//For the sub_emittors is needed to look for every one
			for(var i = 0; i < system.sub_emittors.length; ++i)
			{
				system.sub_emittors[i].ids.splice(num_particles*system.sub_emittors[i].particles, system.sub_emittors[i].ids.length);
				system.sub_emittors[i].to_reset = [];

				for(var k = 0; k < system.sub_emittors[i].ids.length; ++k)
				{
					id = system.sub_emittors[i].ids[k];
					particle = particles_list[id.id];

					system.sub_emittors[i].ids[k].id = last_id;
					n_sub_emissions_ids.push({id: last_id, distance_to_camera: id.distance_to_camera})
					particle.id           = last_id;

					if (particle.visibility == 0)
						n_sub_emissions_to_reset.push(last_id);

					last_id++;
					n_particles.push(particle); 
				}

				system.sub_emittors[i].to_reset = n_sub_emissions_to_reset;
				n_sub_emissions_to_reset = [];
			}
			
			system.particles_list     = n_particles;
			system.particles_to_reset = n_particles_to_reset;
			system.particles_ids      = n_particles_ids;
			system.sub_emission_ids   = n_sub_emissions_ids;

			//Get the new order of the particles
			system.all_ids = n_particles_ids.concat(n_sub_emissions_ids);
			system.all_ids.sort(function(a,b){
				return b.distance_to_camera - a.distance_to_camera;
			});
		}

		system.max_particles     = num_particles;
		system.max_subemissions  = num_subemissions
		system.resizeBufferArray(system.particles_list);
	}
}


/*
* 	Get the index of an input in a node
*	@method getInputIndex
*	@params {String} The input we want to find
*	@params {List}   The inputs of the node
*/
function getInputIndex(name, inputs)
{
	var index = 0;

	for (var i = 0; i < inputs.length; ++i)
	{
		if(inputs[i].name == name)
			return index;

		index++;
	}

	return -1; //not found
}


/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function mySpawnNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
        max_particles: 100,            //Maximum number of particles allowed
        spawn_rate: 10,     		   //How many particles are spawned every frame
        particles_per_wave: 10,
        origin: "Point",      	 	   //The origin of spawn
        position: new Float32Array(3), //The origin of the particles (in point mode)
    	color: [1,1,1,1],              //The color of the origin of the particle
        show_origin: true,
        src_bfact: "Source alpha",
        dst_bfact: "One",
        spawn_mode: "Linear",
    };
   
    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows defining some default values for the particle system.";

    this.prop_desc = {
    	max_particles:      "Maximum number of particles allowed",            
        spawn_rate:         "How many particles are spawned every frame <br> or time between waves",     		   
        particles_per_wave: "How many particles are spawned per wave",
        position:           "The origin of the particles in point mode",
        origin: 			"The origin of the particles. Can be a point or a mesh",
    	color:         		"The color of the emitter",
        show_origin: 		"Enable/Disable showing the origin of the particles",
        src_bfact:          "Source blending factor",
        dst_bfact:          "Destination blending factor",
        spawn_mode:         "The spawn mode of the system. Can be waves or linear"
    }

    this.last_status = {
    	max_particles:       100,       //Which was the max_particles in the last change
    	particles_per_wave_index: -1
    };

    this.originValues = ["Point", "Mesh"];
    this.blending_factors = ["Zero","One","Source color","One minus source color","Destination color","One minus destination color",
    "Source alpha", "One minus source alpha", "Destination alpha", "One minus destination alpha"];
    this.spawnModeValues = ["Linear", "Waves"];
	
	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to enable/disable the visibility of the origin of the particles
	this.show_widget  = this.addWidget("toggle", "Show origin", true, this.toogleOriginVisibility.bind(this));
	//
	this.spawnMode_w  = this.addWidget("combo", "Spawn Mode", "Linear", this.setParticleSpawnMode.bind(this), { values: this.spawnModeValues });
	//This two widgets allow us to change the blending function for the system
	this.srcbl_widget = this.addWidget("combo", "Source bending factor", "Source alpha", this.setSrcFactor.bind(this), { values: this.blending_factors });
	this.dstbl_widget = this.addWidget("combo", "Destination blending factor", "One", this.setDstFactor.bind(this), { values: this.blending_factors });
	//This widget allows to change the mode for spawning the particles of the system 
	this.mode_widget  = this.addWidget("combo", "Origin", "Point", this.setSpawnOrigin.bind(this), { values: this.originValues});

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Max particles", "number");
	this.addInput("Spawn rate"   , "number");
	this.addInput("Color"        , "color");
	this.addInput("Position"     , "vec3");

	this.addOutput("Emitter", "emitter");
}


/*
*	Change the mode in which the particles are spawned
*	@method setParticleSpawnMode
*	@params {String} The new mode of spawning the particles (Linear or Waves)
*/
mySpawnNode.prototype.setParticleSpawnMode = function(v)
{
	if(this.properties.spawn_mode == v)
		return;

	if(!this.spawnModeValues.includes(v))
		v = "Linear";

	if (v == "Linear")
	{
		this.disconnectInput(2);
		this.inputs.splice(2,1);

		this.last_status.particles_per_wave_index = -1;
		this.size[1] = 214;
	}

	if (v == "Waves")
	{
		this.inputs.splice(2, 0, {name: "Particles per wave", type: "number", link: null});

		this.last_status.particles_per_wave_index = 0;
		this.size[1] = 234;
	}
		
	this.properties.spawn_mode = v;
	this.spawnMode_w.value     = v;
	this.size[0] = 389;
}


/*
*	Change the source factor from the blending function of the system
*	@method setSrcFactor
*	@params {String} The source factor for the blending function
*/
mySpawnNode.prototype.setSrcFactor = function(v)
{
	if(!this.blending_factors.includes(v))
		v = "Source Alpha";

	this.properties.src_bfact = v;
	this.srcbl_widget.value   = v;
	this.setBlendFactors(v)
}


/*
*	Change the destination factor from the blending function of the system
*	@method setSrcFactor
*	@params {String} The destination factor for the blending function
*/
mySpawnNode.prototype.setDstFactor = function(v)
{
	if(!this.blending_factors.includes(v))
		v = "One";

	this.properties.dst_bfact = v;
	this.dstbl_widget.value   = v;
	this.setBlendFactors(v, true)
}


/*
*	Convert the string of a blending factor to his value for webgl
*	@method setBlendFactors
*	@params {String} The blending factor 
*	@params {Bool}   If is true then will be edited the destination, if not the source 
*/
mySpawnNode.prototype.setBlendFactors = function(value, dst = false)
{
	var system = this.system;

	switch(value)
	{
		case "Zero":
			if(dst)
				system.dst_bfact = gl.ZERO;		
			else
				system.src_bfact = gl.ZERO;
		break;

		case "One":
			if(dst)
				system.dst_bfact = gl.ONE;		
			else
				system.src_bfact = gl.ONE;
		break;

		case "Source color":
			if(dst)
				system.dst_bfact = gl.SRC_COLOR;		
			else
				system.src_bfact = gl.SRC_COLOR;
		break;

		case "One minus source color":
			if(dst)
				system.dst_bfact = gl.ONE_MINUS_SRC_COLOR;		
			else
				system.src_bfact = gl.ONE_MINUS_SRC_COLOR;
		break;

		case "Destination color":
			if(dst)
				system.dst_bfact = gl.DST_COLOR;		
			else
				system.src_bfact = gl.DST_COLOR;
		break;

		case "One minus destination color":
			if(dst)
				system.dst_bfact = gl.ONE_MINUS_DST_COLOR;		
			else
				system.src_bfact = gl.ONE_MINUS_DST_COLOR;
		break;

		case "Source alpha":
			if(dst)
				system.dst_bfact = gl.SRC_ALPHA;		
			else
				system.src_bfact = gl.SRC_ALPHA;
		break;

		case "One minus source alpha":
			if(dst)
				system.dst_bfact = gl.ONE_MINUS_SRC_ALPHA;		
			else
				system.src_bfact = gl.ONE_MINUS_SRC_ALPHA;
		break;

		case "Destination alpha":
			if(dst)
				system.dst_bfact = gl.DST_ALPHA;		
			else
				system.src_bfact = gl.DST_ALPHA;
		break;

		case "One minus destination alpha":
			if(dst)
				system.dst_bfact = gl.ONE_MINUS_DST_ALPHA;		
			else
				system.src_bfact = gl.ONE_MINUS_DST_ALPHA;
		break;
	}
}


/*
*	Show or hide the origin of the particle system
*	@method toogleOriginVisibility
*/
mySpawnNode.prototype.toogleOriginVisibility = function()
{
	var properties              = this.properties;
	this.properties.show_origin = !properties.show_origin;
	this.system.visible         = properties.show_origin;
}


/*
*	Change the origin for the spawn of the particles
*	@method setBlendFactors
*	@params {String} The new origin type
*/
mySpawnNode.prototype.setSpawnOrigin = function(v)
{
	//if there was no change in the origin then return
	if (this.properties.origin == v)
		return;
	
	if(!this.originValues.includes(v))
		v = "Point";

	this.properties.origin = v;
	var index = getInputIndex(v == "Point" ? "Mesh" : "Point", this.inputs);

	//The first two inputs will be always the same, so we have to disconect and delete the third
	this.disconnectInput(index);
	this.inputs.splice(index,1);

	if (v == "Point")
		this.addInput("Position", "vec3"); //if the mode is point the new input must be a vector 3
	else if (v == "Mesh")
		this.addInput("Mesh", "mesh"); //if the mode is mesh the new input must be a mesh
	
	this.size[0] = 389;
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
mySpawnNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch(property)
	{
		case "max_particles":
			var max_particles = Math.round(properties.max_particles);
			max_particles = isNaN(max_particles) ? 0 : max_particles;
			properties.max_particles = Math.max(max_particles, 0.0);

			if(this.system == undefined)
			{
				this.system = new SystemInfo(graph.last_node_id+1, properties.position, properties.max_particles);
				system_list.push(this.system);	
			}
		break;

		case "particles_per_wave":
			var particles_per_wave = Math.round(properties.particles_per_wave);
			particles_per_wave = isNaN(particles_per_wave) ? 0 : particles_per_wave;
			properties.particles_per_wave = Math.max(particles_per_wave, 0.0);
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

		case "origin":
			var m = properties.origin;

			if(!this.originValues.includes(m))
				m = "Point";

			this.mode_widget.value = m;
			this.setSpawnOrigin(m);	
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

		case "dst_bfact":
			this.setDstFactor(this.properties.dst_bfact);
		break;

		case "src_bfact":
			this.setSrcFactor(this.properties.src_bfact);
		break;

		case "spawn_mode":
			var m = properties.spawn_mode;

			if(!this.spawnModeValues.includes(m))
				m = "Linear";

			this.spawnMode_w.value = m;
			this.setParticleSpawnMode(m);

			if(m == "Waves")	
				this.last_status.particles_per_wave_index = 0;
		
		break;
	}
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
mySpawnNode.prototype.onAdded = function()
{
	//Every time that a spawn node is created a new mesh and information about the system have to be added to the list in order to work properly
	var properties = this.properties;
	this.size[0] = 389;

	if(this.system == undefined)
	{
		this.system = new SystemInfo(this.id, properties.position, properties.max_particles);
		system_list.push(this.system);
	}
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
mySpawnNode.prototype.onExecute = function()
{
	var properties    = this.properties;
	var max_particles = properties.max_particles;
	var spawn_rate    = properties.spawn_rate;
	var color         = properties.color;
	var position      = properties.position;
	var origin        = properties.origin;
	var per_wave      = properties.particles_per_wave;
	var system        = this.system;
	var origin_mesh;

	//When is executed the inputs are gotten 
	var input_max_particles   = this.getInputData(0);
	var input_spawn_rate      = this.getInputData(1);
	var input_color, input_origin, input_per_wave;
	
	if (this.last_status.particles_per_wave_index != -1)
	{
		input_per_wave        = this.getInputData(2);
		input_color           = this.getInputData(3);
		input_origin          = this.getInputData(4);
	}
	else
	{
		input_color           = this.getInputData(2);
		input_origin          = this.getInputData(3);
	}

	//and if they are undefined a default value is setted
	properties.max_particles       = input_max_particles == undefined ? max_particles : Math.abs(Math.round(input_max_particles));
	properties.spawn_rate          = input_spawn_rate    == undefined ? spawn_rate    : Math.abs(Math.round(input_spawn_rate));
	properties.particles_per_wave  = input_per_wave      == undefined ? per_wave      : Math.abs(Math.round(input_per_wave));
	properties.color               = input_color         == undefined ? color         : input_color.slice(0);
	
	if(origin == "Point")
		position = input_origin || position;

	origin == "Mesh" ? origin_mesh = input_origin : undefined;

	//Update of the system info 
	system.position   		  = position;
	system.color      		  = color;
	system.spawn_rate 		  = spawn_rate;    		   
    system.particles_per_wave = properties.particles_per_wave;
    system.origin             = origin;
    system.origin_mesh		  = origin_mesh;

    system.mesh_mode		  = properties.mesh_mode;
    system.spawn_mode		  = properties.spawn_mode;

    //Get how many particles the sub_emittors have
    var sub_emittors  = this.system.sub_emittors;
    var emission_part = 0;
    for(var i = 0; i < sub_emittors.length; ++i)
		emission_part += sub_emittors[i].max_particles;

    //Check if the maximum number of particles change, if is true then the array of the particles and the mesh have to be resized
	resizeMesh(this.system, max_particles, emission_part);

	//The properties of the node are the output plus some extras
	var out_data = {
		id   : this.id,
		data : this.system,
		type : "emitter"
	}

	this.setOutputData(0, out_data);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
mySpawnNode.prototype.onRemoved = function()
{
	//When the node is removed is necesary to search in the list and delete the system
    searchSystem(this.id, true);
}

mySpawnNode.title = "Emitter";
mySpawnNode.title_color = spawnNodeColor;
mySpawnNode.title_text_color = basicTitleColor;
mySpawnNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define how the subemitters of the particle system spawns the particles
*	@method mySpawnNode
*/
function subEmitterNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
        max_particles: 10,            //Maximum number of particles allowed
        particles_per_wave: 10
    };
   
    this.last_status = {
    	max_particles: 10,            //Which was the max_particles in the last change
    	particles_per_wave: 10,
    	id: -1,
    	index: -1
    };

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows defining a customizable sub emitter given a system and a condition.\
    The particles will spawn when the condition is meted, by default is when a particle dies.";

    this.prop_desc = {
    	max_particles:      "Maximum number of particles allowed",            
        particles_per_wave: "How many particles are spawned per wave"
    }

   	/**************************************/
	/***************Widgets****************/
	/**************************************/

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system"    , "particle_system");
	this.addInput("Max particles"      , "number");
	this.addInput("Particles per wave" , "number");

	this.addInput("Condition"      , "condition_list");

	this.addOutput("Emitter", "emitter");
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
subEmitterNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch(property)
	{
		case "max_particles":
			var max_particles = Math.round(properties.max_particles);
			max_particles = isNaN(max_particles) ? 0 : max_particles;
			properties.max_particles = Math.max(max_particles, 0.0);
		break;

		case "particles_per_wave":
			var particles_per_wave = Math.round(properties.particles_per_wave);
			particles_per_wave = isNaN(particles_per_wave) ? 0 : particles_per_wave;
			properties.particles_per_wave = Math.max(particles_per_wave, 0.0);
		break;
	}
}


/*
* 	Behaviour for when a connection of the node is changed
*	@method onConnectionsChange 
*	@params {Number} The type of the slot (input or output)
*   @params {Number} The slot that has been changed
*   @params {Bool}   If the slot is connected  
*/
subEmitterNode.prototype.onConnectionsChange = function(type, slot, connected)
{
	//Detect when the subsystem is disconected and delete it from the system
	if(slot == 0 && !connected && type == 1)
	{
		//In the case that the graph is loaded and without starting disconnect a node
		if(this.system_info == undefined)
			return;

		this.system_info.sub_emittors.splice(this.last_status.index,1);
		this.last_status.index = -1;
		this.last_status.id    = -1;
		//this.system_info.max_subemissions -= this.properties.max_particles;

		for (var i = 0; i < this.system_info.sub_emittors.length; ++i)
			this.system_info.sub_emittors[i].index = i;
	}
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
subEmitterNode.prototype.onAdded = function()
{
	var properties   = this.properties;
	this.sub_emittor = new SubEmitterInfo(this.id, properties.max_particles, properties.spawn_rate, properties.particles_per_wave);
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
subEmitterNode.prototype.onExecute = function()
{
	var system = this.getInputData(0);

	if(system == undefined)
	{
		this.sub_emittor.ids = [];
		this.setOutputData(0, {type : "sub_emitter", id: -1});
		return;
	}
		
	var input_max_particles 	 = Math.max(this.getInputData(1), 0) || this.properties.max_particles;
	var input_particles_per_wave = Math.max(this.getInputData(2), 0) || this.properties.particles_per_wave;

	var input_condition     = this.getInputData(3) || {id: -1, condition: undefined};
	var system_info         = this.system_info;
	var last_status 		= this.last_status;

	//Only is necessary to search the system when the id changes
	if(last_status.id != system.id)
	{
		var last_system = system_list[last_status.id];
		if(last_system != undefined)
			last_system.sub_emittors = last_system.sub_emittors.filter(p => p != this.id);

		this.system_info = searchSystem(system.id);
		this.last_status.index = this.system_info.sub_emittors.length;
		this.system_info.sub_emittors.push(this.sub_emittor);
		this.sub_emittor.ids = [];

		this.last_status.id = system.id;
		system_info = this.system_info;
	}

	//Check if the maximum number of particles change, if is true then the array of the particles have to be resized
	if (input_max_particles != last_status.max_particles)
	{
		if(last_status.index != -1)
			this.system_info.sub_emittors[last_status.index].particles = input_max_particles;
		
		this.last_status.max_particles = input_max_particles;
		this.sub_emittor.max_particles = input_max_particles;
	}

	if(input_particles_per_wave != last_status.particles_per_wave)
	{
		if(last_status.index != -1)
			this.system_info.sub_emittors[last_status.index].particles_per_wave = input_particles_per_wave;
	
		this.last_status.particles_per_wave = input_particles_per_wave;
		this.sub_emittor.particles_per_wave = input_particles_per_wave;
	}
	
	this.sub_emittor.condition = input_condition.id;

	//The properties of the node are the output plus some extras
	var out_data = {
		id                  : this.id,
		data  				: this.system_info,
		index				: this.last_status.index,
		type                : "sub_emitter",
		condition           : input_condition.condition
	}

	this.setOutputData(0, out_data);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
subEmitterNode.prototype.onRemoved = function()
{
	if(this.system_info != undefined)
		this.system_info.sub_emittors = this.system_info.sub_emittors.filter(p => p != this.id);
}

subEmitterNode.title = "Sub Emitter";
subEmitterNode.title_color = spawnNodeColor;
subEmitterNode.title_text_color = basicTitleColor;
subEmitterNode.title_selected_color = basicSelectedTitleColor;