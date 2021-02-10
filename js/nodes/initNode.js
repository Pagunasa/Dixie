function particleDataNode()
{
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

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/	
	this.addInput("Max speed"      , "vec3");
	this.addInput("Min speed"      , "vec3");
	
	this.addInput("Max life time"  , "number");
	this.addInput("Min life time"  , "number");

	this.addInput("Max size"       , "number");
	this.addInput("Min size"       , "number");
	
	this.addInput("Color"          , "color");
	this.addInput("Texture"        , "texture");

	this.addOutput("Particle data", "p_data");
}

//For recover (in a visual way) the value when a graph is loaded
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

	//Get the properties and the texture
	var properties = this.properties;
	var texture  = this.texture;

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.max_speed = input_max_speed || properties.max_speed;
	properties.min_speed = input_min_speed || properties.min_speed;

	properties.max_life_time = input_max_life_time || properties.max_life_time;
	properties.min_life_time = input_min_life_time || properties.min_life_time;
	
	properties.max_size = input_max_size || properties.max_size;
	properties.min_size = input_min_size || properties.min_size;

	properties.color = input_color || properties.color;
	this.texture = input_texture || undefined;

	this.setOutputData(0, {data: properties, texture: texture});
}

particleDataNode.title = "Particle Data";
particleDataNode.title_color = spawnNodeColor;
particleDataNode.title_text_color = basicTitleColor;
particleDataNode.title_selected_color = basicSelectedTitleColor;

/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function initParticlesNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		trail_u_size    : true,
		trail_u_color   : true,
		trail_u_texture : true
	}

	this.internal = {
		init_time_pased: 0.0,
		last_id: -1
	}

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Spawner"        , "spawner");
	this.addInput("Particle data"  , "p_data");

	this.addOutput("Particle system", "particle_system");
}

initParticlesNode.prototype.toogleTrailSize = function()
{
	this.properties.trail_u_size = !this.properties.trail_u_size;
}

initParticlesNode.prototype.toogleTrailColor = function()
{
	this.properties.trail_u_color = !this.properties.trail_u_color;
}

initParticlesNode.prototype.toogleTrailTexture = function()
{
	this.properties.trail_u_texture = !this.properties.trail_u_texture;
}

initParticlesNode.prototype.toogleTrail = function()
{
	this.internal.is_trail = !this.internal.is_trail;
}

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
				texture       : this.texture,
				coords        : this.getCoords()
			};
}

initParticlesNode.prototype.getNextFrame = function(particle)
{
	var texture = this.texture;

	if(!texture.prop.animated || particle.c_frame < particle.frameRate)
		return;

	var sizeX = texture.ntx;
	var sizeY = texture.nty; 

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

initParticlesNode.prototype.getCoords = function(frameX = 0, frameY = 0)
{
	var texture = this.texture;

	if(texture == undefined)
		return default_coords;

	var sizeX = texture.ntx;
	var sizeY = texture.nty; 

	if(sizeX == 0 && sizeY == 0 || !this.subTextures)
		return default_coords;

	if(texture.prop.animated)
	{
		var iSx = 1/sizeX;
		var iSy = 1/sizeY;
  
		var minX = sizeX != 0 ? frameX * iSx : 0; 
		var minY = sizeY != 0 ? frameY * iSy : 0; 

		var maxX = sizeX != 0 ? (frameX+1) * iSx : 1; 
		var maxY = sizeY != 0 ? (frameY+1) * iSy : 1; 

		return [maxX,maxY, minX,maxY, maxX,minY, minX,minY, maxX,minY, minX,maxY];
	}

	var new_coord = [0,0, 1,1];

	new_coord[0] = sizeX != 0 ? Math.floor(Math.random() * sizeX)/sizeX : 0;
	new_coord[1] = sizeY != 0 ? Math.floor(Math.random() * sizeY)/sizeY : 0;

	new_coord[2] = sizeX != 0 ? new_coord[0] + (1/sizeX) : 1; 
	new_coord[3] = sizeY != 0 ? new_coord[1] + (1/sizeY) : 1; 

	return [new_coord[2],new_coord[3], new_coord[0],new_coord[3], new_coord[2],new_coord[1], 
	new_coord[0],new_coord[1], new_coord[2],new_coord[1], new_coord[0],new_coord[3]];
}

initParticlesNode.prototype.generateRandomPoint = function(system)
{
	var mode        = system.mode;
	var position    = system.position;
	var origin_mesh = system.origin_mesh;
	var system_info = this.system_info;

	if (mode == "Point" || mode == "2D Geometry" || origin_mesh == undefined 
		|| origin_mesh == undefined ? true : origin_mesh.vertices == undefined)
	{
		system_info.point_mode     = true;
		system_info.external_model = undefined;		
		return position;
	}

	system_info.point_mode     = false;
	system_info.external_model = origin_mesh.model;

	var triangle_num = origin_mesh.triangle_num;

	var ambda1 = Math.random();
	var ambda2 = Math.random();
	var ambda3;

	if(ambda1 + ambda2 > 1)
	{
		ambda1 = 1 - ambda1;
		ambda2 = 1 - ambda2;
	}

	ambda3 = 1 - ambda1 - ambda2;

	var triangle = Math.floor(Math.random()*triangle_num) * 9;
	var points = origin_mesh.vertices.slice(triangle, triangle+9);

	var random_point = [0,0,0];

	for (var i = 0; i < 3; ++i)
		random_point[i] = points[i] * ambda1 + points[i+3] * ambda2 + points[i+6] * ambda3;

	return random_point;
}

initParticlesNode.prototype.addParticle = function(particle_data, ids, particles, particles_to_reset, max_particles, system, is_trail = false)
{
	var particle_info;

	if( max_particles > particles.length )
	{
		if(!is_trail)
			this.internal.init_time_pased = 0.0;
		
		particle_info = this.generateParticleInfo(particle_data, system);

		particle = new Particle();
		particle.fill(particle_info);
		ids.push({id : particles.length, distance_to_camera : 0.0});
		particles.push(particle);
	}
	else if (particles_to_reset.length > 0)
	{
		if(!is_trail)
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
		}
	}
}

initParticlesNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	if (system != undefined)
	{
		var particles_spawned = 0;

		//Retieve the particle and trail data
		var p_prop  = this.getInputData(1) || {
			data : { max_speed: [1,1,1],min_speed: [-1,-1,-1],  max_size: 0.25,min_size: 0.10, max_life_time: 10,min_life_time: 5, color: [1,1,1,1] },
			texture : undefined
		};

 		//If there was not default info, then the trail will allways 
 		//spawn at the particle position with no speed and with this particle data
		var t_prop = this.getInputData(2);  

		//Only is necessary to search the system when the id changes
		if(this.internal.last_id != system.id)
		{
			this.system_info = searchSystem(system.id);
			this.internal.last_id = system.id;
		}

		//If trails is enabled, then the input is displayed
		if(system.trails && this.inputs.length != 3)
		{
			this.addInput("Particle data (trails)" , "p_data");
			this.addOutput("Trail system", "particle_system");

			this.trail_u_size    = this.addWidget("toggle", "Trail use particle size"   , true, this.toogleTrailSize.bind(this));
			this.trail_u_color   = this.addWidget("toggle", "Trail use particle color"  , true, this.toogleTrailColor.bind(this));
			this.trail_u_texture = this.addWidget("toggle", "Trail use particle texture", true, this.toogleTrailTexture.bind(this));
		}
		else if (!system.trails && this.inputs.length == 3)
		{
			this.disconnectOutput(1);
			this.outputs.splice(1,1); 

			this.disconnectInput(2);
			this.inputs.splice(2,1); 
			this.size[1] = 46;

			this.widgets = [];
		}

		var system_info = this.system_info;

		if(p_prop.texture == undefined)
			system_info.texture = undefined;
		else if (p_prop.texture.file != "")
			system_info.texture = p_prop.texture.file;
		else
			system_info.texture = undefined;

		this.texture = p_prop.texture;
		
		if(this.texture != undefined)
			this.subTextures  = this.texture.prop.subtextures;

		var particle;
		var particles          = system_info.particles_list;
		var particles_ids      = system_info.particles_ids;
		var particles_to_reset = system_info.particles_to_reset;
		
		this.internal.init_time_pased += time_interval;
		//The inverse of the spawn rate is how many ms we have to wait until spawn the next particle
		this.internal.spawn_period = 1.0 / system.spawn_rate; 

		//Spawn in normal mode
		if (this.internal.init_time_pased >= this.internal.spawn_period)
			this.addParticle(p_prop.data, particles_ids, particles, particles_to_reset, system.max_particles, system)
		
		//Spawn in waves mode
		/*if(system.max_particles > particles.length && this.internal.init_time_pased >= 1.0)
		{
			this.internal.init_time_pased = 0.0;
			
			for (particles_spawned; particles_spawned <= system.spawn_rate; particles_spawned++)
			{
				var particle = new Particle();
				particle.fill(this.properties);
				particles.push(particle);
				updateVisibility(mesh, particles.length - 1, 1.0);
			}
		}*/

		//Default movement of the particles
		var id;
		var trails_list = system_info.trails_list;
		var trails_ids  = system_info.trails_ids;
		var trails_to_reset =  system_info.trails_to_reset;
		var trails_prop = {
				min_speed     : [0,0,0],
				max_speed     : [0,0,0],
				min_life_time : 1,
				max_life_time : 1
			};

		for (var i = 0; i < particles_ids.length; i++)
		{
			id = particles_ids[i].id;
			particle = particles[id];

			particle.c_lifetime += time_interval;
			particle.c_frame += time_interval;
			this.getNextFrame(particle);

			if(particle.c_lifetime >= particle.lifetime && particle.visibility == 1)
			{
				particle.visibility = 0;
				particles_to_reset.push(id);
			}
			else
			{
				for(var j = 0; j < 3; j++)
					particle.position[j] += particle.speed[j] * time_interval;
				
				if(system.trails)
				{
					trails_prop.min_size = particle.size;
					trails_prop.max_size = particle.size;
					trails_prop.color    = particle.color;
					trails_prop.coords   = particle.coords;
					trails_prop.position = particle.position;

					this.addParticle(trails_prop, trails_ids, trails_list, trails_to_reset, system.max_trails, system, true)
				}
			}
		}

		//Modify lifetime of the trails
		for (var i = 0; i < trails_ids.length; i++)
		{
			id = trails_ids[i].id;
			particle = trails_list[id];

			particle.c_lifetime += time_interval;

			if(particle.c_lifetime >= particle.lifetime && particle.visibility == 1)
			{
				particle.visibility = 0;
				trails_to_reset.push(id);
			}
		}

		//The system definition is the output
		this.setOutputData(0, system);

		if(system.trails)
		{
			system.modify_trails = true;
			this.setOutputData(1, system);	
		}
	}
}

initParticlesNode.title = "Initialize Particles";
initParticlesNode.title_color = spawnNodeColor;
initParticlesNode.title_text_color = basicTitleColor;
initParticlesNode.title_selected_color = basicSelectedTitleColor;