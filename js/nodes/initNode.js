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
		max_size: 10,
		max_life_time: 10,
		
		min_speed: vector_3,
		min_size: 10,
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
	var max_life_time         = Math.round(this.getInputData(3)) || 10;
	var min_life_time         = Math.round(this.getInputData(4)) || 5;
	var max_size              = Math.round(this.getInputData(5)) || 10;
	var min_size              = Math.round(this.getInputData(6)) || 10;
	this.properties.color     = this.getInputData(7) || vector_4;
	this.properties.texture   = this.getInputData(8) || undefined;

	this.properties.max_life_time = Math.max(min_life_time, max_life_time);
	this.properties.min_life_time = Math.min(min_life_time, max_life_time);

	this.properties.max_size      = Math.max(max_size, min_size);
	this.properties.min_size      = Math.min(max_size, min_size);

	if (system != undefined)
	{
		var particles_spawned = 0;
		var particles = searchSystem(system.id).particles_list;
		var mesh = searchMesh(system.id);
		
		this.internal.init_time_pased += time_interval;
		this.internal.spawn_period = 1.0 / system.spawn_rate;

		//Spawn in normal mode
		if(system.max_particles > particles.length && this.internal.init_time_pased >= this.internal.spawn_period)
		{
			console.log(this.internal.init_time_pased);

			this.internal.init_time_pased = 0.0;
			
			var particle = new Particle();
			particle.fill(this.properties);
			particles.push(particle);
			updateVisibility(mesh, particles.length - 1, 1.0);
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
		var particles_to_delete = [];

		for (var i = 0; i < particles.length; i++)
		{
			particle = particles[i];

			particle.lifetime -= time_interval;

			if(particle.lifetime <= 0){
				updateVisibility(mesh, i);
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