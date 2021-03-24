/*
*	This node is for define te values of the particles
*	@method particleDataNode
*/
function particleDataNode() {
	this.properties = {
		max_speed: [1,1,1],
		min_speed: [-1,-1,-1],

		max_size: 0.25,
		min_size: 0.10,

		max_life_time: 10,
		min_life_time: 5,
		
		color: [1,1,1,1]
	};

	//Is outside properties because it can't be edited directly by te user in the properties window...
	this.texture = undefined;
    
    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows defining the values of the particles and assigns a texture to them.";

    this.prop_desc = {
    	max_speed: "The maximum speed of the particle",            
        min_speed: "The minimum speed of the particle",     		   
        
        max_size:  "The maximum size of the particle",
        min_size:  "The minimum size of the particle",
        
        max_life_time: "The maximum lifetime of the particle in seconds",
    	min_life_time: "The minimum lifetime of the particle in seconds",

        color: "The color of the particle"
    }

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/	
	this.addInput("Max speed"     , "vec3");
	this.addInput("Min speed"     , "vec3");
	
	this.addInput("Max life time" , "number");
	this.addInput("Min life time" , "number");

	this.addInput("Max size"      , "number");
	this.addInput("Min size"      , "number");
	
	this.addInput("Color"         , "color");
	this.addInput("Texture"       , "texture");

	this.addOutput("Particle data", "p_data");
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
particleDataNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch (property) {
		case "max_speed":
			if(properties.max_speed.length != 3)
				properties.max_speed = [0,0,0];
		break;

		case "min_speed":
			if(properties.min_speed.length != 3)
				properties.min_speed = [0,0,0];
		break;

		case "max_size":
			var max_size = properties.max_size;
			max_size = isNaN(max_size) ? 0 : max_size;
			properties.max_size = Math.max(max_size, 0.0);
		break;

		case "min_size":
			var min_size = properties.min_size;
			min_size = isNaN(min_size) ? 0 : min_size;
			properties.min_size = Math.max(min_size, 0.0);
		break;

		case "max_life_time":
			var max_life_time = properties.max_life_time;
			max_life_time = isNaN(max_life_time) ? 0 : max_life_time;
			properties.max_life_time = Math.max(max_life_time, 0.0);
		break;

		case "min_life_time":
			var min_life_time = properties.min_life_time;
			min_life_time = isNaN(min_life_time) ? 0 : min_life_time;
			properties.min_life_time = Math.max(min_life_time, 0.0);
		break;

		case "color":
			if(properties.color.length != 4)
				properties.color = [1,1,1,1];
			else
				for (var i = 0; i < 4; ++i)
					properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
		break;
	}
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
particleDataNode.prototype.onExecute = function()
{
	var input_max_speed = this.getInputData(0);
	var input_min_speed = this.getInputData(1);

	var input_max_life_time = this.getInputData(2);
	var input_min_life_time = this.getInputData(3);

	var input_max_size  = this.getInputData(4);
	var input_min_size  = this.getInputData(5);

	var input_color     = this.getInputData(6);
	var input_texture   = this.getInputData(7);

	//Get the properties 
	var properties = this.properties;

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.max_speed = input_max_speed || properties.max_speed;
	properties.min_speed = input_min_speed || properties.min_speed;

	properties.max_life_time = input_max_life_time || properties.max_life_time;
	properties.min_life_time = input_min_life_time || properties.min_life_time;
	
	properties.max_size = input_max_size || properties.max_size;
	properties.min_size = input_min_size || properties.min_size;

	properties.color = input_color || [1,1,1,1];
	this.texture = input_texture || {file: undefined, id: undefined};

	this.setOutputData(0, {data: properties, texture: this.texture});
}

particleDataNode.title = "Particle Data";
particleDataNode.title_color = spawnNodeColor;
particleDataNode.title_text_color = basicTitleColor;
particleDataNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for set the values of every particle of the system and set a default movement 
*	@method initParticlesNode
*/
function initParticlesNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.internal = {
		type: "",
		init_time_pased: 0.0,
		last_id: -1,
		last_sub_id: -1,
		last_texture: ""
	}

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node initializes every particle of the emitter or sub emitter,\
    given some particle data in the case that no data is given some default values will be used.";

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Emitter"        , "emitter");
	this.addInput("Particle data"  , "p_data");

	this.addOutput("Particle system", "particle_system");
}


/*
*	Creation of an object with all the properties of a particle for the fill method 
*	@method generateParticleInfo
*   @params {Object} The properties of the particle
*   @params {Object} The system of the particle
*/
initParticlesNode.prototype.generateParticleInfo = function (properties, system)
{
	var max_life_time = Math.max(properties.min_life_time, properties.max_life_time);
	var min_life_time = Math.min(properties.min_life_time, properties.max_life_time);

	var max_size = Math.abs(Math.max(properties.max_size, properties.min_size));
	var min_size = Math.abs(Math.min(properties.max_size, properties.min_size));

	return {
				min_speed     : properties.min_speed,
				max_speed     : properties.max_speed,
				min_life_time : min_life_time,
				max_life_time : max_life_time,
				position      : properties.position || this.generateRandomPoint(system),
				color         : properties.color,
				min_size      : min_size,
				max_size      : max_size,
				origin_id     : properties.origin_id,
				texture       : this.texture,
				coords        : this.getCoords()
			};
}


/*
*	In the case that the particle is animated, this method allows to get the next frame
*	@method getNextFrame
*   @params {Object} The particle
*/
initParticlesNode.prototype.getNextFrame = function(particle)
{
	var texture = this.texture;

	if(texture.file == undefined)
		return;

	if(!texture.prop.animated || particle.c_frame < particle.frameRate)
		return;

	var sizeX = texture.prop.textures_x;
	var sizeY = texture.prop.textures_y; 

 	particle.c_frame = 0;
	particle.frameX++;

	if(particle.frameX == sizeX)
	{
		particle.frameY++;
		particle.frameX = 0;

		if(particle.frameX == sizeX)
			particle.frameY = 0;
	} 

	particle.coords = this.getCoords(particle.frameX, particle.frameY);
}


/*
*	Get the texture coordinates of the particle
*	@method getCoords
*   @params {Number} The particle frame in the X of the atlas
*   @params {Number} The particle frame in the Y of the atlas
*/
initParticlesNode.prototype.getCoords = function(frameX = 0, frameY = 0)
{
	var texture    = this.texture;
	var texture_id = this.texture_id;
	var atlas      = this.system_info.atlas;
 	var uvs, minuv_x, minuv_y, maxuv_x, maxuv_y;
    var minX, minY, maxX, maxY;

    //If there wasn't an atlas, the coordinates are the default ones
	if(atlas == undefined)
		return default_coords;

	//If is undefined the id will always be 0, a white texture with Alpha 1
	if(texture.file == undefined)
	{
		uvs =  this.system_info.uvs[0];
		minuv_x = uvs[0];
		minuv_y = uvs[1];
		maxuv_x = uvs[2];
		maxuv_y = uvs[3];

		return[maxuv_x,maxuv_y, minuv_x,maxuv_y, maxuv_x,minuv_y, minuv_x,minuv_y, maxuv_x,minuv_y, minuv_x,maxuv_y]; 
	}

	//Get the number of subtextures of the texture
	var sizeX = texture.prop.textures_x;
	var sizeY = texture.prop.textures_y; 
	uvs       = this.system_info.uvs[texture_id];

	//If there wasn't subtextures
	if(sizeX == 0 && sizeY == 0 || !this.subTextures)
	{
		minuv_x = uvs[0];
		minuv_y = uvs[1];
		maxuv_x = uvs[2];
		maxuv_y = uvs[3];

		return[maxuv_x,maxuv_y, minuv_x,maxuv_y, maxuv_x,minuv_y, minuv_x,minuv_y, maxuv_x,minuv_y, minuv_x,maxuv_y]; 
	}

	//If the texture is animated then get the corresponding frame
	if(texture.prop.animated)
	{
		var iSx = 1/sizeX;
		var iSy = 1/sizeY;
  
		minX = sizeX != 1 ? frameX * iSx : 0; 
		minY = sizeY != 1 ? frameY * iSy : 0; 

		maxX = sizeX != 1 ? (frameX+1) * iSx : 1; 
		maxY = sizeY != 1 ? (frameY+1) * iSy : 1; 

		//Interpolation (in order to get the correct frame)
		minX = lerp(uvs[0], uvs[2], minX);
		minY = lerp(uvs[1], uvs[3], minY);
		maxX = lerp(uvs[0], uvs[2], maxX);
		maxY = lerp(uvs[1], uvs[3], maxY);

		return [maxX,maxY, minX,maxY, maxX,minY, minX,minY, maxX,minY, minX,maxY];
	}

	//Get the basic Uvs in the case that the texture isn't animated or have subtextures
	minX = sizeX != 1 ? Math.floor(Math.random() * sizeX)/sizeX : 0;
	minY = sizeY != 1 ? Math.floor(Math.random() * sizeY)/sizeY : 0;

	maxX = sizeX != 1 ? minX + (1/sizeX) : 1; 
	maxY = sizeY != 1 ? minY + (1/sizeY) : 1; 

	//Interpolation (in order to get the correct frame)
	minX = lerp(uvs[0], uvs[2], minX);
	minY = lerp(uvs[1], uvs[3], minY);
	maxX = lerp(uvs[0], uvs[2], maxX);
	maxY = lerp(uvs[1], uvs[3], maxY);

	return [maxX,maxY, minX,maxY, maxX,minY, minX,minY, maxX,minY, minX,maxY];
}


/*
*	Retuns a the origin of the particle, if is a mesh will return a random point
*   of the surface and if not will return the origin point defined by the user
*	@method getCoords
*   @params {Object} The system of the particle
*/
initParticlesNode.prototype.generateRandomPoint = function(system)
{
	var origin      = system.origin;
	var position    = system.position;
	var origin_mesh = system.origin_mesh;
	var system_info = this.system_info;

	if(origin == "Point" || origin_mesh == undefined || origin_mesh.vertices == undefined)
		return position;

	var triangle_num = origin_mesh.triangle_num;

	//I generate a random ambdas
	var ambda1 = Math.random();
	var ambda2 = Math.random();
	var ambda3;

	if(ambda1 + ambda2 > 1)
	{
		ambda1 = 1 - ambda1;
		ambda2 = 1 - ambda2;
	}

	ambda3 = 1 - ambda1 - ambda2;

	//Then I pick a random triangle and his asigned points
	var div_value = origin_mesh.name != "plane" ? 9 : 6;
	var triangle = Math.floor(Math.random()*triangle_num) * div_value;
	var points;

	if(div_value == 9)
		points = origin_mesh.vertices.slice(triangle, triangle + div_value);
	else
		points = origin_mesh.vertices.slice(triangle == 0 ? 0 : 3, triangle == 0 ? 9 : 12);

	var random_point = [0,0,0];

	//Apply the barycenter coordinate formula to get the point
	for (var i = 0; i < 3; ++i)
		random_point[i] = points[i] * ambda1 + points[i+3] * ambda2 + points[i+6] * ambda3;

	//And finaly I multiply the new point by the mesh model 
	mat4.multiplyVec3(random_point, system_info.external_model, random_point)

	return random_point;
}


/*
*	Add new particles to the system, first will add particles until the maximum number 
*   is archieved and then start to reuse the dead particles Return -1 if the particle 
*   is added and his id is reused
*	@method addParticle
*   @params {Object} The properties of the particle
*   @params {List}   The ids of the particles
*   @params {List}   The list of the particles
*   @params {List}   The ids of the particles
*   @params {Number} The maximum number of particles
*   @params {Object} The system of the particle
*   @params {String} The type of the particle "emitter" or "subemitter"
*/
initParticlesNode.prototype.addParticle = function(particle_data, ids, particles, particles_to_reset, max_particles, system, type)
{
	var particle_info;

	if( max_particles > ids.length )
	{
		
		this.internal.init_time_pased = 0.0;
		
		particle_info = this.generateParticleInfo(particle_data, system);

		particle = new Particle();
		particle.fill(particle_info);
		particle.id   = particles.length;
		particle.type = type;
		ids.push({id : particles.length, distance_to_camera : 0.0});
		particles.push(particle);

		return -1;
	}
	else if (particles_to_reset.length > 0)
	{
		this.internal.init_time_pased = 0.0;
		
		var id = particles_to_reset[0];
					
		while(particles_to_reset[0] > particles.length - 1)
		{
			particles_to_reset.splice(0,1);
			id = particles_to_reset[0];
		}

		if(id != undefined)
        {
			particle_info = this.generateParticleInfo(particle_data, system);

        	particle = particles[id];
			particle.fill(particle_info);
			particles_to_reset.splice(0,1);

			return id;
		}
	}
}


/*
*	Spawn a particle from the system emitter
*	@method spawnEmitter
*   @params {Object} The particle system
*   @params {Object} The system input data 
*   @params {Object} The particle data
*/
initParticlesNode.prototype.spawnEmitter = function(system, system_input, p_prop)
{
	var particle;
	var particles             = system.particles_list;
	var particles_ids         = system.particles_ids;
	var particles_to_reset    = system.particles_to_reset;
	var sub_emission_to_reset = system.sub_emission_to_reset;

	//Spawn in normal mode
	if (system.spawn_mode == "Linear" && this.internal.init_time_pased >= this.internal.spawn_period)
		this.addParticle(p_prop.data, particles_ids, particles, particles_to_reset, system.max_particles, system, "emitter")
	//Spawn in waves mode
	if (system.spawn_mode == "Waves" && this.internal.init_time_pased >= system.spawn_rate)
		for (var i = 0; i < system.particles_per_wave; ++i)
			this.addParticle(p_prop.data, particles_ids, particles, particles_to_reset, system.max_particles, system, "emitter")	

	this.moveParticles(system, particles_ids, particles, particles_to_reset);
	system_input.ids = particles_ids;
	return;
}


/*
*	Apply a default movement for all the particles
*	@method moveParticles
*   @params {Object} The particle system
*   @params {List}   The ids of the particles
*   @params {List}   The list of the particles
*   @params {List}   The particles to be reseted
*/
initParticlesNode.prototype.moveParticles = function(system, ids, particles, to_reset)
{
	var id, particle;

	//Default movement of the particles
	for (var i = 0; i < ids.length; i++)
	{
		id       = ids[i].id;
		particle = particles[id];

		if(particle.visibility == 0)
			continue;

		particle.c_lifetime += time_interval;
		particle.c_frame += time_interval;
		this.getNextFrame(particle);

		if(particle.c_lifetime >= particle.lifetime && particle.visibility == 1)
		{
			particle.visibility = 0;
			to_reset.push(id);
		}
		else
		{
			particle.aSpeed = [0,0,0];

			for(var j = 0; j < 3; j++)
			{
				particle.position[j] += particle.speed[j] * time_interval;
				particle.aSpeed[j]   += particle.speed[j];
			}
		}
	}
}


/*
*	Spawn a particle from a sub emitter (other particle)
*	@method spawnSubEmitter
*   @params {Object} The particle system
*   @params {Object} The system input data 
*   @params {Object} The particle data
*/
initParticlesNode.prototype.spawnSubEmitter = function(system, system_input, p_prop)
{
	var particle;
	var particles             = system.particles_list;
	var sub_emittor           = this.sub_emitter;
	var sub_emission_ids      = sub_emittor.ids;
	var sub_emission_to_reset = sub_emittor.to_reset;

	var condition             = system_input.condition;

	//If there was no condition, then by default the emissions will spawn when the particle dies
    if(condition == undefined)
    {
    	condition = [];
      	var particles_ids = system.particles_ids;
		var id, diff;
		for (var i = 0; i < particles_ids.length; ++i)
		{
			id = particles_ids[i].id;
			particle = particles[id];
		    diff = particle.lifetime - particle.c_lifetime;
		    if(diff <= time_interval && particle.visibility != 0)
		        condition.push({id: id})
		}
    }

    //For every particle that meets the condition spawn (if possible) the particles
	for (var i = 0; i < condition.length; ++i)
	{
		particle = particles[condition[i].id];
		p_prop.data.position = particle.position;

		for (var j = 0; j < sub_emittor.particles_per_wave; ++j)
			this.addParticle(p_prop.data, sub_emission_ids, particles, sub_emission_to_reset,
			system.max_particles * sub_emittor.max_particles, system, "sub_emitter");
	}

	this.moveParticles(system, sub_emission_ids, particles, sub_emission_to_reset);
	sub_emittor.ids = sub_emission_ids;
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
initParticlesNode.prototype.onExecute = function() 
{
	var system_input = this.getInputData(0);

	if (system_input != undefined)
	{
		var type  = system_input.type; 
		this.internal.type = type;

		if (type == "sub_emitter" && system_input.id == -1)
		{
			this.setOutputData(0, undefined);
			return;
		}

		var particles_spawned = 0;

		//Retieve the particle data
		var p_prop  = this.getInputData(1) || {
			data : { max_speed: [1,1,1],min_speed: [-1,-1,-1],  max_size: 0.25,min_size: 0.10, max_life_time: 10,min_life_time: 5, color: [1,1,1,1] },
			texture : { file: undefined }
		};

		//Only is necessary to update the system when the id changes
		if(this.internal.last_id != system_input.id)
		{
			this.system_info = system_input.data;
			this.internal.last_id = system_input.id;
		}

		var system = this.system_info;
		system.particle_data = p_prop.data;

		if (type == "sub_emitter" && this.internal.last_sub_id != system_input.id)
		{
			var sub_emittors = system.sub_emittors;
			this.sub_emitter = sub_emittors[system_input.index];
		}

		var sub_emitter = this.sub_emitter;

		if(p_prop.texture == undefined)
		{
			if( system_input.type == "emitter" )
				system.texture.file = undefined;
			else if ( system_input.type == "sub_emitter")
				sub_emitter.texture.file = undefined;

			if(this.internal.last_texture != "")
			{
				system.texture_change = true;
				this.internal.last_texture = "";
			}	
		}
		else if (p_prop.texture.file != "" && p_prop.texture.file != undefined)
		{
			if( system_input.type == "emitter" )
				system.texture.file = p_prop.texture.file;
			else if ( system_input.type == "sub_emitter")
				sub_emitter.texture.file = p_prop.texture.file;

			if(this.internal.last_texture != p_prop.texture.file.data.src)
			{
				system.texture_change = true;
				this.internal.last_texture = p_prop.texture.file.data.src;
			}	
		}
		else
		{
			if( system_input.type == "emitter" )
				system.texture.file = undefined;
			else if ( system_input.type == "sub_emitter")
				sub_emitter.texture.file = undefined;

			if(this.internal.last_texture != "")
			{
				system.texture_change = true;
				this.internal.last_texture = "";
			}
		}

		this.texture = p_prop.texture;
        
        if(type == "emitter")
		    this.texture_id = system.texture.id;
        else if ( system_input.type == "sub_emitter")
            this.texture_id = sub_emitter.texture.id;

		if(this.texture.file != undefined)
			this.subTextures  = this.texture.prop.subtextures;
		else if(p_prop.texture.file != undefined)
			this.subTextures  = p_prop.texture.prop.subtextures;
		else
			this.subTextures  = false;

		var origin      = system.origin;
		var origin_mesh = system.origin_mesh;

		if (origin == "Point"	|| origin_mesh == undefined ? true : origin_mesh.vertices == undefined)
			system.external_model = undefined;		
		else 
			system.external_model = origin_mesh.model;
		
		this.internal.init_time_pased += time_interval;
		//The inverse of the spawn rate is how many ms we have to wait until spawn the next particle
		this.internal.spawn_period = 1.0 / system.spawn_rate; 

		//If it was an emitter then the particles have to spawn normaly 
		if( system_input.type == "emitter" )
			this.spawnEmitter(system, system_input, p_prop);
		else if ( system_input.type == "sub_emitter")
			this.spawnSubEmitter(system, system_input, p_prop);

		//The system is the output
		this.setOutputData(0, system_input);
	}
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
initParticlesNode.prototype.onRemoved = function()
{
	if(this.system_info != undefined && this.internal.type != "sub_emitter")
		resetSystem(this.system_info);
}

initParticlesNode.title = "Initialize Particles";
initParticlesNode.title_color = spawnNodeColor;
initParticlesNode.title_text_color = basicTitleColor;
initParticlesNode.title_selected_color = basicSelectedTitleColor;