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
		max_speed: vector_3,
		min_speed: vector_3,

		max_size: 0.25,
		min_size: 0.25,

		max_life_time: 10,
		min_life_time: 10,
		
		color: default_particle_color
	};

	this.internal = {
		init_time_pased: 0.0
	}

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Spawner"        , "spawner");
	this.addInput("Max speed"      , "vec3");
	this.addInput("Min speed"      , "vec3");
	
	this.addInput("Max life time"  , "number");
	this.addInput("Min life time"  , "number");

	this.addInput("Max size"       , "number");
	this.addInput("Min size"       , "number");
	
	this.addInput("Color"          , "color");
	this.addInput("Texture"        , "texture");

	this.addOutput("Particle system", "particle_system");
}

//For recover (in a visual way) the value when a graph is loaded
initParticlesNode.prototype.onPropertyChanged = function()
{
	var max_size = this.properties.max_size;
	max_size = isNaN(max_size) ? 0 : max_size;
	this.properties.max_size = Math.max(max_size, 0.0);

	var min_size = this.properties.min_size;
	min_size = isNaN(min_size) ? 0 : min_size;
	this.properties.min_size = Math.max(min_size, 0.0);

	var max_life_time = this.properties.max_life_time;
	max_life_time = isNaN(max_life_time) ? 0 : max_life_time;
	this.properties.max_life_time = Math.max(max_life_time, 0.0);

	var min_life_time = this.properties.min_life_time;
	min_life_time = isNaN(min_life_time) ? 0 : min_life_time;
	this.properties.min_life_time = Math.max(min_life_time, 0.0);

	if(this.properties.max_speed.length != 3)
		this.properties.max_speed = [0,0,0];

	if(this.properties.min_speed.length != 3)
		this.properties.min_speed = [0,0,0];

	if(this.properties.color.length != 4)
		this.properties.color = [1,1,1,1];

	for (var i = 0; i < 4; ++i)
		this.properties.color[i] = Math.min(Math.max(this.properties.color[i], 0.0), 1.0);
}

initParticlesNode.prototype.generateParticleInfo = function (properties, system, system_info)
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
				position      : this.generateRandomPoint(system, system_info),
				color         : properties.color,
				min_size      : min_size,
				max_size      : max_size,
				coords        : this.getCoords()
			};
}

initParticlesNode.prototype.getCoords = function()
{
	if(this.texture == undefined)
		return default_coords;

	var sizeX = this.texture.ntx;
	var sizeY = this.texture.nty; 

	if(sizeX == 0 && sizeY == 0)
		return default_coords;

	var new_coord = [0,0, 1,1];

	new_coord[0] = sizeX != 0 ? Math.floor(Math.random() * sizeX)/sizeX : 0;
	new_coord[1] = sizeY != 0 ? Math.floor(Math.random() * sizeY)/sizeY : 0;

	new_coord[2] = sizeX != 0 ? new_coord[0] + (1/sizeX) : 1; 
	new_coord[3] = sizeY != 0 ? new_coord[1] + (1/sizeY) : 1; 

	return [new_coord[2],new_coord[3], new_coord[0],new_coord[3], new_coord[2],new_coord[1], 
	new_coord[0],new_coord[1], new_coord[2],new_coord[1], new_coord[0],new_coord[3]];
}

initParticlesNode.prototype.generateRandomPoint = function(system, system_info)
{
	var mode          = system.mode;
	var position      = system.position;
	var origin_mesh   = system.origin_mesh;

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

initParticlesNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	var input_max_speed = this.getInputData(1);
	var input_min_speed = this.getInputData(2);

	var input_max_life_time = this.getInputData(3);
	var input_min_life_time = this.getInputData(4);

	var input_max_size  = this.getInputData(5);
	var input_min_size  = this.getInputData(6);

	var input_color     = this.getInputData(7);
	var input_texture   = this.getInputData(8);

	//Get the properties
	var properties = this.properties;

	var texture  = this.texture;

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.max_speed = input_max_speed || properties.max_speed;
	properties.min_speed = input_min_speed || properties.min_speed;

	properties.max_life_time = input_max_life_time || properties.max_life_time;
	properties.min_life_time = input_min_life_time || properties.min_life_time;
	
	properties.max_size = input_max_size || properties.max_size;
	properties.min_size = input_min_size || properties.min_size;

	properties.color   = input_color || properties.color;
	this.texture = input_texture || undefined;

	if (system != undefined)
	{
		var particles_spawned = 0;
		var system_info = searchSystem(system.id);

		if(texture == undefined)
			system_info.texture = undefined;
		else if (texture.prop.file != "")
			system_info.texture = texture.prop.file;
		else
			system_info.texture = undefined;

		var particle;
		var particles          = system_info.particles_list;
		var particles_ids      = system_info.particles_ids;
		var particles_to_reset = system_info.particles_to_reset;
		var mesh = searchMesh(system.id);
		
		this.internal.init_time_pased += time_interval;
		//The inverse of the spawn rate is how many ms we have to wait until spawn the next particle
		this.internal.spawn_period = 1.0 / system.spawn_rate; 

		//Spawn in normal mode
		if (this.internal.init_time_pased >= this.internal.spawn_period) {

			var particle_info;

			if( system.max_particles > particles.length )
			{
				this.internal.init_time_pased = 0.0;
				
				particle_info = this.generateParticleInfo(properties, system, system_info);

				particle = new Particle();
				particle.fill(particle_info);
				particles_ids.push({id : particles.length, distance_to_camera : 0.0});
				particles.push(particle);
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
     				
					particle_info = this.generateParticleInfo(properties, system, system_info);

                	particle = particles[id];
					particle.fill(particle_info);
					particles_to_reset.splice(0,1);
				}
			}

		}

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

		for (var i = 0; i < particles_ids.length; i++)
		{
			id = particles_ids[i].id;
			particle = particles[id];

			particle.c_lifetime += time_interval;

			if(particle.c_lifetime >= particle.lifetime && particle.visibility == 1)
			{
				particle.visibility = 0;
				particles_to_reset.push(id);
			}
			else
			{
				for(var j = 0; j < 3; j++)
					particle.position[j] += particle.speed[j] * time_interval;
			}
		}

		//The porperties of the node are the output
		this.setOutputData(0, system);
	}
}

initParticlesNode.title = "Initialize Particles";
initParticlesNode.title_color = spawnNodeColor;
initParticlesNode.title_text_color = basicTitleColor;
initParticlesNode.title_selected_color = basicSelectedTitleColor;