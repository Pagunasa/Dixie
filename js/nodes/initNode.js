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
		max_size: 0.25,
		max_life_time: 10,
		
		min_speed: vector_3,
		min_size: 0.25,
		min_life_time: 10,
		
		color: vector_4,	
		texture: undefined
	};

	this.internal = {
		init_time_pased: 0.0
	}

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
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

initParticlesNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.max_speed = this.getInputData(1) || vector_3;
	this.properties.min_speed = this.getInputData(2) || vector_3;
	var max_life_time         = (this.getInputData(3)) || 10;
	var min_life_time         = (this.getInputData(4)) || 5;
	var max_size              = (this.getInputData(5)) || 0.25;
	var min_size              = (this.getInputData(6)) || 0.25;
	this.properties.color     = this.getInputData(7) || default_particle_color;
	this.properties.texture   = this.getInputData(8) || undefined;

	this.properties.max_life_time = Math.max(min_life_time, max_life_time);
	this.properties.min_life_time = Math.min(min_life_time, max_life_time);

	this.properties.max_size      = Math.abs(Math.max(max_size, min_size));
	this.properties.min_size      = Math.abs(Math.min(max_size, min_size));

	if (system != undefined)
	{
		var particles_spawned = 0;
		var system_info = searchSystem(system.id);

		if(this.properties.texture != undefined)
			system_info.texture = this.properties.texture.file;
		else
			system_info.texture = undefined;

		var particles = system_info.particles_list;
		var particles_to_reset = system_info.particles_to_reset;
		var mesh = searchMesh(system.id);
		
		this.internal.init_time_pased += time_interval;
		//The inverse of the spawn rate is how many ms we have to wait until spawn the next particle
		this.internal.spawn_period = 1.0 / system.spawn_rate; 

		//Updating the position (Render finality)
		this.properties.position = system.position;

		//Spawn in normal mode
		if (this.internal.init_time_pased >= this.internal.spawn_period)
		{
			if( system.max_particles > particles.length )
			{
				this.internal.init_time_pased = 0.0;
				
				var particle = new Particle();
				particle.fill(this.properties);
				particles.push(particle);

				updateVisibility(mesh, particle, particles.length - 1, 1.0);
				updateColor(mesh, particle, particles.length - 1);
				updateSize(mesh, particle, particles.length - 1);
			}
			else if (particles_to_reset.length > 0)
			{
				this.internal.init_time_pased = 0.0;
				var i = particles_to_reset[0];
				
				particles[i].fill(this.properties);
				updateVisibility(mesh, particles[i], i, 1.0);				
				updateColor(mesh, particles[i], i);
				updateSize(mesh, particles[i], i);

				particles_to_reset.splice(0,1);
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

		if (particles_spawned > 0)
			mesh.upload();

		//Default movement of the particles
		var particle;

		for (var i = 0; i < particles.length; i++)
		{
			particle = particles[i];

			particle.c_lifetime += time_interval;

			if(particle.c_lifetime >= particle.lifetime && !particle.to_reset)
			{
				updateVisibility(mesh, i);
				particle.to_reset = true;
				particles_to_reset.push(i);
			}
			else
			{
				for(var j = 0; j < 3; j++)
					particle.position[j] += particle.speed[j] * time_interval;

				updateVertexs(mesh, i, particle);
			}
		}

		mesh.upload()
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

initParticlesNode.prototype.onRemoved = function(){
	//When the node is deleted is necesary to search in the list and delete is asigned mesh and information
	searchMesh(this.id, true);
    searchSystem(this.id, true);
}

initParticlesNode.title = "Initialize Particles";
initParticlesNode.title_color = spawnNodeColor;
initParticlesNode.title_text_color = basicTitleColor;
initParticlesNode.title_selected_color = basicSelectedTitleColor;