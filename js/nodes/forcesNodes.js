/*
* 	This method enables/disables the visibility of the force
*	@method toogleForceVisibility
*/
function toogleForceVisibility(){
	this.force.visible = !this.force.visible;
}


/*
*	This node is for define a constant force that is applied to all particles
*	@method gravityNode
*/
function gravityNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		direction: vector_3,
		strength: 10
	};

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Direction"      , "vec3");
	this.addInput("Stength"        , "number");

	this.addOutput("Particle system", "particle_system");
}

gravityNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.direction = this.getInputData(1) || this.properties.direction;
	this.properties.strength  = this.getInputData(2) || this.properties.strength;

	if (system != undefined)
	{
		var particles = searchSystem(system.id).particles_list;
		
		if(particles.length > 0)
		{
			var mesh = searchMesh(system.id);
			
			var particle;
			var direction = this.properties.direction;
			var strength  = this.properties.strength;

			direction[0] = direction[0] * strength;
			direction[1] = direction[1] * strength;
			direction[2] = direction[2] * strength;

			for (var i = 0; i < particles.length; i++)
			{
				particle = particles[i];
				
				//For the gravity only is needed to add to the position of the particle the direction
				for(var j = 0; j < 3; j++)
						particle.position[j] += direction[j] * time_interval;
				
				updateVertexs(mesh, i, particle);
			}

			mesh.upload()
		}

	}

	this.setOutputData(0, system);
}

gravityNode.title = "Gravity";
gravityNode.title_color = forcesNodeColor;
gravityNode.title_text_color = basicTitleColor;
gravityNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a vortes that is applied at all particles inside his area of effect (defined by the scale)
*	@method vortexNode
*/
function vortexNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		position: vector_3,
		angular_speed: vector_3,
		scale: 10,
		color: vector_4
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows enable/disable the visibility of the force
	this.addWidget("toggle", "Show vortex", true, toogleForceVisibility.bind(this));

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Position"       , "vec3");
	this.addInput("Angular speed"  , "vec3");
	this.addInput("Scale"          , "number");
	this.addInput("Color"          , "color");

	this.addOutput("Particle system", "particle_system");
}

vortexNode.prototype.onAdded = function() {
 	this.force = addForce(this.id, this.properties.position, "vortex")
};

vortexNode.prototype.onRemoved = function() {
 	searchForce(this.id, true);
};

vortexNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.position       = this.getInputData(1) || this.properties.position;
	this.properties.angular_speed  = this.getInputData(2) || this.properties.angular_speed;
	this.properties.scale          = this.getInputData(3) || this.properties.scale;
	this.properties.color          = this.getInputData(4) || this.properties.color;

	//It's necesary update the force position and color for 
	//render te origin of the vortex
	this.force.position = this.properties.position;
	this.force.color    = this.properties.color;

	if (system != undefined)
	{
		var particles = searchSystem(system.id).particles_list;
		
		if(particles.length > 0)
		{
			var mesh = searchMesh(system.id);

			var particle;
			var position = this.properties.position;
			var angular_speed = this.properties.angular_speed;
			var scale = this.properties.scale;
			var distance = new Float32Array(3);
			var v_vortex;
			var distance_factor;

			for (var i = 0; i < particles.length; i++)
			{
				particle = particles[i];
				
				//First to all the distance between the particle and the vortex is calculated
				for(var j = 0; j < 3; j++)
					distance[j] = particle.position[j] - position[j];

				//Then the cross product and the distance factor are computed
				v_vortex = cross(angular_speed, distance);
				distance_factor =1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/scale);
				//The distance factor uses a formula which is based on inverse square distance, avoiding singularity at the center

				//At the end, we add the cross product multiplied by the distance factor
				for(var j = 0; j < 3; j++)
						particle.position[j] += v_vortex[j] * distance_factor * time_interval;
				
				updateVertexs(mesh, i, particle);
			}

			mesh.upload()
		}
	}

	this.setOutputData(0, system);
}

vortexNode.title = "Vortex";
vortexNode.title_color = forcesNodeColor;
vortexNode.title_text_color = basicTitleColor;
vortexNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a constant force that is applied to all particles
*	@method magnetNode
*/
function magnetNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		position: vector_3,
		strength: 10,
		scale: 10,
		color: vector_4
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows enable/disable the visibility of the force
	this.addWidget("toggle", "Show magnet point", true, toogleForceVisibility.bind(this));

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Position"       , "vec3");
	this.addInput("Strength"       , "number");
	this.addInput("Scale"          , "number");
	this.addInput("Color"          , "color");

	this.addOutput("Particle system", "particle_system");
}

magnetNode.prototype.onAdded = function() {
	this.force = addForce(this.id, this.properties.position, "magnet")
};

magnetNode.prototype.onRemoved = function() {
 	searchForce(this.id, true);
};

magnetNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.position = this.getInputData(1) || this.properties.position;
	this.properties.strength = this.getInputData(2) || this.properties.strength;
	this.properties.scale    = this.getInputData(3) || this.properties.scale;
	this.properties.color    = this.getInputData(4) || this.properties.color;

	//It's necesary update the force position and color for 
	//render te origin of the magnet point
	this.force.position = this.properties.position;
	this.force.color    = this.properties.color;

	if (system != undefined)
	{
		var particles = searchSystem(system.id).particles_list;
		
		if(particles.length > 0)
		{
			var mesh = searchMesh(system.id);

			var particle;
			var position = this.properties.position;
			var strength = this.properties.strength;
			var scale    = this.properties.scale;
			var distance = new Float32Array(3);
			var new_pos  = new Float32Array(3);
			var distance_factor;

			for (var i = 0; i < particles.length; i++)
			{
				particle = particles[i];
				
				//First to all the distance between the particle and the magnet point is calculated
				for(var j = 0; j < 3; j++)
					distance[j] = particle.position[j] - position[j];

				//Then the distance factor is computed
				distance_factor =1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/scale);
				distance_factor *= strength;

				//Here the distance is transformed to the values of -1, 1 and 0
				for(var j = 0; j < 3; j++)
					distance[j] = distance[j] < 0 ? -1 : distance[j] > 0 ? 1 : 0;

				for(var j = 0; j < 3; j++)
					particle.position[j] += (distance[j] * distance_factor * time_interval);
			
				updateVertexs(mesh, i, particle);
			}

			mesh.upload()
		}
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

magnetNode.title = "Magnet Point";
magnetNode.title_color = forcesNodeColor;
magnetNode.title_text_color = basicTitleColor;
magnetNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a noise that will affect all the particles of the system
*	@method mySpawnNode
*/
function noiseNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		noise_texture: undefined
	};

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Noise texture"  , "texture");

	this.addOutput("Particle system", "particle_system");
}

noiseNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.noise_texture = this.getInputData(1) || undefined;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

noiseNode.title = "Noise";
noiseNode.title_color = forcesNodeColor;
noiseNode.title_text_color = basicTitleColor;
noiseNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for create a path that the particles will follow
*	@method mySpawnNode
*/
function pathNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		path: undefined,
		strength: 10
	};

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Path"           , "path");
	this.addInput("Strength"       , "number");

	this.addOutput("Particle system", "particle_system");
}

pathNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.path     = this.getInputData(1) || undefined;
	this.properties.strength = this.getInputData(2) || 10;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

pathNode.title = "Path";
pathNode.title_color = forcesNodeColor;
pathNode.title_text_color = basicTitleColor;
pathNode.title_selected_color = basicSelectedTitleColor;