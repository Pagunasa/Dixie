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
		direction: [0,0,0],
		strength: 1
	};

	this.last_state = {
		direction: [0,0,0],
		direction_normalized: [0,0,0]
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
	this.addInput("Condition"      , "condition_list");
	this.addInput("Direction"      , "vec3");
	this.addInput("Stength"        , "number");

	this.addOutput("Particle system", "particle_system");
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
gravityNode.prototype.onAdded = function() 
{
	if(this.force != undefined)
	{
		this.force.id = this.id
		return;
	}

 	this.force = addForce(this.id, [0,0,0], "gravity")
};


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*   @params {String} The name of the changed value
*/
gravityNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;
	
	if(this.force == undefined)
 		this.force = addForce(this.id, [0,0,0], "gravity")

	var force = this.force;

	switch (property)
	{
		case "strength":
			var strength = properties.strength;
			properties.strength = isNaN(strength) ? 1 : strength;
			force.strength = properties.strength;
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
					this.last_state.direction_normalized = [0,0,0];		

			 	force.direction = this.last_state.direction_normalized;
			}
		break;
	}
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
gravityNode.prototype.onExecute = function() 
{
	var system_input = this.getInputData(0);
	var properties   = this.properties;

	var condition       = this.getInputData(1);
	var direction_input = this.getInputData(2);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.direction = direction_input == undefined ? properties.direction : direction_input.slice(0);
	properties.strength  = this.getInputData(3) || properties.strength;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		//Update the force reciever
		this.force.reciever = system.id;

		if(condition != undefined)
		{
			ids = condition.condition;
			this.force.condition = condition.id;
		}
		else
			if(system_input.type == "emitter")
				ids = system.particles_ids;
			else if(system_input.type == "sub_emitter")
			{
				ids = system.sub_emittors[system_input.index].ids;
				this.force.subReciever = system_input.index;
			}

		if(ids.length > 0)
		{	
			if(!vec3.equals(properties.direction, this.last_state.direction))
			{
				this.last_state.direction = properties.direction.slice(0);

				if(!vec3.equals(properties.direction, [0,0,0]))
					vec3.normalize(this.last_state.direction_normalized, properties.direction);
				else
					this.last_state.direction_normalized = [0,0,0];

				this.force.direction = this.last_state.direction_normalized;
			}

			var particle;
			var direction = this.last_state.direction_normalized.slice(0);
			var strength  = properties.strength;
			this.force.strength = strength;

			for (var i = 0; i < ids.length; i++)
			{
				particle = particles[ids[i].id];
				
				//For the gravity only is needed to add to the position of the particle the direction
				for(var j = 0; j < 3; j++)
					particle.position[j] += direction[j] * strength * time_interval;
			}
		}
	}
	else
	{
		this.force.reciever    = -1;
		this.force.subReciever = -1;
		this.force.condition   = -1;
	}

	this.setOutputData(0, system);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
gravityNode.prototype.onRemoved = function() 
{
 	searchForce(this.id, true);
}


gravityNode.title = "Gravity";
gravityNode.title_color = forcesNodeColor;
gravityNode.title_text_color = basicTitleColor;
gravityNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a vortes that is applied at all particles inside his area of effect (defined by the scale)
*	@method vortexNode
*   @source https://gamedevelopment.tutsplus.com/tutorials/adding-turbulence-to-a-particle-system--gamedev-13332
*/
function vortexNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		position: [0,0,0],
		angular_speed: [0,0,0],
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
	this.addInput("Condition"      , "condition_list");
	this.addInput("Position"       , "vec3");
	this.addInput("Angular speed"  , "vec3");
	this.addInput("Scale"          , "number");
	this.addInput("Color"          , "color");

	this.addOutput("Particle system", "particle_system");
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
vortexNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	if(this.force == undefined)
 		this.force = addForce(this.id, this.properties.position, "vortex")
	
	var force = this.force;

	switch (property)
	{
		case "position":
			if (properties.position.length != 3)
				properties.position = [0,0,0];

			force.position = properties.position;
		break;

		case "angular_speed":
			if (properties.angular_speed.length != 3)
				properties.angular_speed = [0,0,0];

			force.angular_speed = properties.angular_speed;
		break;

		case "scale":
			var scale = properties.scale;
			scale = isNaN(scale) ? 10 : scale;
			properties.scale = Math.max(scale, 0);
			force.scale    = properties.scale;
		break;

		case "color":
			if (properties.color.length != 4)
				properties.color = [1,1,1,1];	
			else
				for (var i = 0; i < 4; ++i)
					properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
			
			force.color = properties.color;
		break;
	}
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
vortexNode.prototype.onAdded = function() 
{
	if(this.force != undefined)
	{
		this.force.id = this.id
		return;
	}

 	this.force = addForce(this.id, this.properties.position, "vortex")
};


/*
* 	What the node does every frame
*	@method onExecute 
*/
vortexNode.prototype.onExecute = function() 
{
	var properties     = this.properties;
	var system_input   = this.getInputData(0);
	var condition      = this.getInputData(1);
	var position_input = this.getInputData(2);
	var angular_input  = this.getInputData(3);
	var color_input    = this.getInputData(5);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.position       = position_input == undefined ? properties.position      : position_input.slice(0);
	properties.angular_speed  = angular_input  == undefined ? properties.angular_speed : angular_input.slice(0);
	properties.scale          = Math.max(this.getInputData(4),0) || properties.scale;
	properties.color          = color_input    == undefined ? properties.color         : color_input.slice(0);

	//It's necesary update the force angular speed, scale and color
	var force = this.force;
	force.color = properties.color;
	force.angular_speed = properties.angular_speed;
	force.scale = properties.scale;
	force.position = properties.position;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		//Update the force reciever
		this.force.reciever = system.id;

		if(condition != undefined)
		{
			ids = condition.condition;
			this.force.condition = condition.id;
		}
		else
			if(system_input.type == "emitter")
				ids = system.particles_ids;
			else if(system_input.type == "sub_emitter")
			{
				ids = system.sub_emittors[system_input.index].ids;
				this.force.subReciever = system_input.index;
			}

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
	else
	{
		this.force.reciever    = -1;
		this.force.subReciever = -1;
		this.force.condition   = -1;
	}

	this.setOutputData(0, system);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
vortexNode.prototype.onRemoved = function() 
{
 	searchForce(this.id, true);
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
		position: [0,0,0],
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
	this.addInput("Condition"      , "condition_list");
	this.addInput("Position"       , "vec3");
	this.addInput("Strength"       , "number");
	this.addInput("Scale"          , "number");
	this.addInput("Color"          , "color");

	this.addOutput("Particle system", "particle_system");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
magnetNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;
	
	if(this.force == undefined)
 		this.force = addForce(this.id, this.properties.position, "magnet");

	var force = this.force;

	switch (property){
		case "position":
			if (properties.position.length != 3)
				properties.position = [0,0,0];
			force.position = properties.position;
		break;

		case "strength":
			var strength = properties.strength;
			properties.strength = isNaN(strength) ? 10 : strength;
			force.strength = properties.strength;
		break;

		case "scale":
			var scale = properties.scale;
			scale = isNaN(scale) ? 10 : scale;
			properties.scale = Math.max(scale, 0);
			force.scale = properties.scale;
		break;

		case "color":
			if (properties.color.length != 4)
				properties.color = [1,1,1,1];	
			else
				for (var i = 0; i < 4; ++i)
					properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);

			force.color = properties.color;
		break;
	}
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
magnetNode.prototype.onAdded = function() 
{
	if(this.force != undefined)
	{
		this.force.id = this.id
		return;
	}

	this.force = addForce(this.id, this.properties.position, "magnet")
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
magnetNode.prototype.onExecute = function() 
{
	var system_input = this.getInputData(0);
	var properties = this.properties;

	var condition      = this.getInputData(1);
	var position_input = this.getInputData(2);
	var color_input    = this.getInputData(5);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.position = position_input == undefined ? properties.position : position_input.slice(0);
	properties.strength = this.getInputData(3) || properties.strength;
	properties.scale    = Math.max(this.getInputData(4),0) || properties.scale;
	properties.color    = color_input    == undefined ? properties.color    : color_input.slice(0);

	//It's necesary update the force scale, strength and color
	var force = this.force;
	force.color = properties.color;
	force.strength = properties.strength;
	force.scale = properties.scale;
	force.position = properties.position;

	if (system_input != undefined)
	{
		var system    = system_input.data;
		var particles = system.particles_list;
		var ids;

		//Update the force reciever
		this.force.reciever = system.id;

		if (condition != undefined)
		{
			ids = condition.condition;
			this.force.condition = condition.id;
		}
		else
			if(system_input.type == "emitter")
				ids = system.particles_ids;
			else if(system_input.type == "sub_emitter")
			{
				ids = system.sub_emittors[system_input.index].ids;
				this.force.subReciever = system_input.index;
			}

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
	else
	{
		this.force.reciever    = -1;
		this.force.subReciever = -1;
		this.force.condition   = -1;
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
magnetNode.prototype.onRemoved = function() 
{
 	searchForce(this.id, true);
}

magnetNode.title = "Magnet Point";
magnetNode.title_color = forcesNodeColor;
magnetNode.title_text_color = basicTitleColor;
magnetNode.title_selected_color = basicSelectedTitleColor;