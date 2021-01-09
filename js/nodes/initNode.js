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
		max_speed: new Float32Array(3),
		max_size: 10,
		max_life_time: 10,
		
		min_speed: new Float32Array(3),
		min_size: 10,
		min_life_time: 10,
		
		color: new Float32Array(4),	
		texture: undefined	
	};

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
	this.properties.max_speed = Math.round(this.getInputData(1)) || vector_3;
	this.properties.min_speed = Math.round(this.getInputData(2)) || vector_3;
	var max_life_time         = Math.round(this.getInputData(3)) || vector_3;
	var min_life_time         = Math.round(this.getInputData(4)) || vector_3;
	var max_size              = Math.round(this.getInputData(5)) || 10;
	var min_size              = Math.round(this.getInputData(6)) || 10;
	this.properties.color     = Math.round(this.getInputData(7)) || vector_4;
	this.properties.texture   = this.getInputData(8) || undefined;

	this.properties.max_life_time = Math.max(min_life_time, max_life_time);
	this.properties.min_life_time = Math.min(min_life_time, max_life_time);

	this.properties.max_size      = Math.max(max_size, min_size);
	this.properties.min_size      = Math.min(max_size, min_size);

	if (system != undefined)
	{
		var particles_spawned = 0;
		var particles = searchSystem(system.id).particles_list;

		if(system.max_particles > particles.length && particles_spawned < system.spawn_rate)
		{
			particles_spawned += 1;
			var particle = new Particle();
			particle.fill(this.properties);
		}
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
