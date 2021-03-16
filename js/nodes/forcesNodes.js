/*
* 	This method enables/disables the visibility of the force
*	@method toogleForceVisibility
*/
function toogleForceVisibility()
{
	this.force.visible = !this.force.visible;
}


/*
*	This node is for define a constant force that is applied to all particles
*	@method gravityNode
*/
function gravityNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		direction: vector_3,
		strength: 1
	};

	this.last_state = {
		direction: vector_3,
		direction_normalized: vector_3
	}

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node creates a global force that affects all the particles of a given system.\
     It will only affect a sub emitter if the connection comes from a init node that initializes his particles.";

    this.prop_desc = {
    	direction: "The direction in which the particles will be moved",            
        strength:  "The strength that will displace the particles"
    }

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Direction"      , "vec3");
	this.addInput("Stength"        , "number");

	this.addOutput("Particle system", "particle_system");
}

//For recover (in a visual way) the values when a graph is loaded
gravityNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch (property)
	{
		case "strength":
			var strength = properties.strength;
			properties.strength = isNaN(strength) ? 1 : strength;
		break;

		case "direction":
			if (properties.direction.length != 3)
				properties.direction = [0,0,0];

			if(!vec3.equals(this.last_state.direction, properties.direction))
			{
				this.last_state.direction = properties.direction;

				if(!vec3.equals(properties.direction, [0,0,0]))
					vec3.normalize(this.last_state.direction_normalized, properties.direction);
				else
					this.last_state.direction_normalized = [0,0,0];			}
		break;
	}
}

gravityNode.prototype.onExecute = function() 
{
	var system_input = this.getInputData(0);
	var properties   = this.properties;

	var direction_input = this.getInputData(1);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.direction = direction_input == undefined ? properties.direction : direction_input.slice(0);
	properties.strength  = this.getInputData(2) || properties.strength;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		if(system_input.type == "emitter")
			ids = system.particles_ids;
		else if(system_input.type == "sub_emitter")
			ids = system.sub_emittors[system_input.index].ids;

		if(ids.length > 0)
		{	
			if(!vec3.equals(properties.direction, this.last_state.direction))
			{
				this.last_state.direction = properties.direction.slice(0);

				if(!vec3.equals(properties.direction, [0,0,0]))
					vec3.normalize(this.last_state.direction_normalized, properties.direction);
				else
					this.last_state.direction_normalized = [0,0,0];
			}

			var particle;
			var direction = this.last_state.direction_normalized.slice(0);
			var strength  = properties.strength;

			direction[0] = direction[0] * strength;
			direction[1] = direction[1] * strength;
			direction[2] = direction[2] * strength;

			for (var i = 0; i < ids.length; i++)
			{
				particle = particles[ids[i].id];
				
				//For the gravity only is needed to add to the position of the particle the direction
				for(var j = 0; j < 3; j++)
					particle.position[j] += direction[j] * time_interval;
			}
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
function vortexNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		position: vector_3,
		angular_speed: vector_3,
		scale: 10,
		color: [1,1,1,1]
	};

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node creates a circular force that affects the particles of a given system\
    depending on how far they are from the origin of the vortex.\
    It will only affect a sub emitter if the connection comes from a init node that initializes his particles.";

    this.prop_desc = {
    	position:      "The origin of the vortex",            
        angular_speed: "The rotative strength that will displace the particles",
        scale:         "The vortex area of effect",
        color:         "The color of the vortex origin"
    }

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

//For recover (in a visual way) the values when a graph is loaded
vortexNode.prototype.onPropertyChanged = function()
{
	var properties = this.properties;

	var scale = properties.scale;
	scale = isNaN(scale) ? 10 : scale;
	properties.scale = Math.max(scale, 0);

	if (properties.position.length != 3)
		properties.position = [0,0,0];

	if (properties.angular_speed.length != 3)
		properties.angular_speed = [0,0,0];

	if (properties.color.length != 4)
		properties.color = [1,1,1,1];	
	else
		for (var i = 0; i < 4; ++i)
			properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
}

vortexNode.prototype.onAdded = function() 
{
 	this.force = addForce(this.id, this.properties.position, "vortex")
};

vortexNode.prototype.onRemoved = function() 
{
 	searchForce(this.id, true);
};

vortexNode.prototype.onExecute = function() 
{
	var properties     = this.properties;
	var system_input   = this.getInputData(0);
	var position_input = this.getInputData(1);
	var angular_input  = this.getInputData(2);
	var color_input    = this.getInputData(4);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.position       = position_input == undefined ? properties.position      : position_input.slice(0);
	properties.angular_speed  = angular_input  == undefined ? properties.angular_speed : angular_input.slice(0);
	properties.scale          = Math.max(this.getInputData(3),0) || properties.scale;
	properties.color          = color_input    == undefined ? properties.color         : color_input.slice(0);

	//It's necesary update the force position and color for 
	//render te origin of the vortex
	this.force.position = properties.position;
	this.force.color    = properties.color;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		if(system_input.type == "emitter")
			ids = system.particles_ids;
		else if(system_input.type == "sub_emitter")
			ids = system.sub_emittors[system_input.index].ids;

		if(ids.length > 0)
		{
			var particle;
			var position = properties.position;
			var angular_speed = properties.angular_speed;
			var scale = properties.scale;
			var distance = [0,0,0];
			var v_vortex;
			var distance_factor;

			for (var i = 0; i < ids.length; i++)
			{
				particle = particles[ids[i].id];
				
				//First to all the distance between the particle and the vortex is calculated
				for(var j = 0; j < 3; j++)
					distance[j] = particle.position[j] - position[j];

				//Then the cross product and the distance factor are computed
				v_vortex = cross(angular_speed, distance);
				distance_factor = 1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/scale);
				//The distance factor uses a formula which is based on inverse square distance, avoiding singularity at the center

				//At the end, we add the cross product multiplied by the distance factor
				for(var j = 0; j < 3; j++)
						particle.position[j] += v_vortex[j] * distance_factor * time_interval;
			}
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
function magnetNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		position: vector_3,
		strength: 10,
		scale: 10,
		color: [1,1,1,1]
	};

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node defines a point that creates a force repelling or attracting the\
    particles of a given system depending on how far they are from their origin.\
    It will only affect a sub emitter if the connection comes from a init node that initializes his particles.";

    this.prop_desc = {
    	position: "The origin of the magnet point",            
        strength: "The strength that will displace the particles. If is positive will reppel and negative attract",
        scale:    "The magnet point area of effect",
        color:    "The color of the magnet point origin"
    }

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

//For recover (in a visual way) the values when a graph is loaded
magnetNode.prototype.onPropertyChanged = function()
{
	var properties = this.properties;

	var scale = properties.scale;
	scale = isNaN(scale) ? 10 : scale;
	properties.scale = Math.max(scale, 0);

	var strength = properties.strength;
	properties.strength = isNaN(strength) ? 10 : strength;

	if (properties.position.length != 3)
		properties.position = [0,0,0];

	if (properties.color.length != 4)
		properties.color = [1,1,1,1];	
	else
		for (var i = 0; i < 4; ++i)
			properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
}

magnetNode.prototype.onAdded = function() 
{
	this.force = addForce(this.id, this.properties.position, "magnet")
};

magnetNode.prototype.onRemoved = function() 
{
 	searchForce(this.id, true);
};

magnetNode.prototype.onExecute = function() 
{
	var system_input = this.getInputData(0);
	var properties = this.properties;

	var position_input = this.getInputData(1);
	var color_input    = this.getInputData(4);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.position = position_input == undefined ? properties.position : position_input.slice(0);
	properties.strength = this.getInputData(2) || properties.strength;
	properties.scale    = Math.max(this.getInputData(3),0) || properties.scale;
	properties.color    = color_input    == undefined ? properties.color    : color_input.slice(0);

	//It's necesary update the force position and color for 
	//render te origin of the magnet point
	this.force.position = properties.position;
	this.force.color    = properties.color;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		if(system_input.type == "emitter")
			ids = system.particles_ids;
		else if(system_input.type == "sub_emitter")
			ids = system.sub_emittors[system_input.index].ids;

		if(ids.length > 0)
		{
			var particle;
			var position = properties.position;
			var strength = properties.strength;
			var scale    = properties.scale;
			var distance = [0,0,0];
			var new_pos  = [0,0,0];
			var distance_factor;

			for (var i = 0; i < ids.length; i++)
			{
				particle = particles[ids[i].id];
				
				//First to all the distance between the particle and the magnet point is calculated
				for(var j = 0; j < 3; j++)
					distance[j] = particle.position[j] - position[j];

				//Then the distance factor is computed
				distance_factor = 1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/scale);
				distance_factor *= strength;

				for(var j = 0; j < 3; j++)
					particle.position[j] += (distance[j] * distance_factor * time_interval);
			}
		}
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

magnetNode.title = "Magnet Point";
magnetNode.title_color = forcesNodeColor;
magnetNode.title_text_color = basicTitleColor;
magnetNode.title_selected_color = basicSelectedTitleColor;