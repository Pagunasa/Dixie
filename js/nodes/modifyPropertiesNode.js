/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function modifyPropertyNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		changed_property: "Speed",
		application_mode: "Equalization",
		modification_mode: "Along life time",
		user_defined_seconds: 5,
		new_value: vector_3	
	};

	this.internal = {
		last_id: -1
	}

	this.propValues = ["Speed", "Size", "Color", "Life time"];
	this.applValues = ["Equalization", "Addition", "Subtraction"];
	this.modiValues = ["Along life time", "User defined"];

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.propW = this.addWidget("combo", "Property", "Speed", this.changeProperty.bind(this), 
		{values: this.propValues});
	this.applW = this.addWidget("combo", "Application Mode", "Equalization", this.changeApplication.bind(this), 
		{values: this.applValues});
	this.modiW = this.addWidget("combo", "Modification Mode", "Along life time", this.changeModification.bind(this), 
		{values: this.modiValues});

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Condition"      , "condition_list");
	this.addInput("Change equation", "equation");
	this.addInput("New speed"      , "vec3");
	
	this.addOutput("Particle system", "particle_system");
}

modifyPropertyNode.prototype.changeModification = function(v)
{
	var properties = this.properties;

	properties.modification_mode = v;
	this.widgets.splice(3,1);

	if (v == "User defined")
	{
		var value = properties.user_defined_seconds;
		this.secW = this.addWidget("number", "Seconds", value, this.setSeconds.bind(this), {min: 0, max: 100000, step: 0.1});
	}
	else
		this.size[1] = 166;
	
}

modifyPropertyNode.prototype.setSeconds = function(v)
{
	if(isNaN(v))
		v = 5;

	this.properties.user_defined_seconds = v;
	this.secW.value = v;
}

modifyPropertyNode.prototype.changeApplication = function(v)
{
	this.properties.application_mode = v;
}

modifyPropertyNode.prototype.changeProperty = function(v)
{
	var properties = this.properties;
	
	if(properties.changed_property == v)
		return;
	
	properties.changed_property = v;

	//The third input is deleted with his possible conection
	this.disconnectInput(3);
	this.inputs.splice(3,1);

	if(v == "Speed")
	{
		this.addInput("New speed", "vec3");
		properties.new_value = vector_3;
	}
	else if (v == "Size")
	{
		this.addInput("New size", "number");
		properties.new_value = 5;
	}
	else if (v == "Color")
	{
		this.addInput("New color", "color");
		properties.new_value = [1,1,1,1];
	}
	else if (v == "Life time")
	{
		this.addInput("New life time", "number");
		properties.new_value = 0;
	}
}

//For recover (in a visual way) the values when a graph is loaded
modifyPropertyNode.prototype.onPropertyChanged = function()
{
	var properties = this.properties;

	var p = properties.changed_property;
	var a = properties.application_mode;
	var m = properties.modification_mode;

	if(!this.propValues.includes(p))
		p = "Size";

	if(this.propW.value != p)
	{
		this.propW.value = p;
		this.changeProperty(p);
	}

	if(!this.applValues.includes(a))
		a = "Equalization";
	
	if(this.applW.value != a)
	{
		this.applW.value = a;
		this.changeApplication(a);
	}

	if(!this.modiValues.includes(m))
		m = "Along life time";

	if(this.modiW.value != m)
	{
		this.modiW.value = m;
		this.changeModification(m);
	}

	properties.user_defined_seconds = Math.max(properties.user_defined_seconds, 0.0);

	if(this.secW != undefined)
		this.setSeconds(properties.user_defined_seconds);

	if(properties.changed_property == "Speed" && properties.new_value.length != 3)
		properties.new_value = [0,0,0];

	if(properties.changed_property == "Color" && properties.new_value.length != 4)
		properties.new_value = [1,1,1,1];

	if((properties.changed_property == "Size" || properties.changed_property == "Life time") 
		&& (isNaN(properties.new_value) || properties.new_value < 0))
		properties.new_value = 0;
}

modifyPropertyNode.prototype.computeChangeEquation = function(lifetime)
{
	var value = 0;
	var equation = this.change_equation;
	var length = equation.length;

	for (var i = 0; i < length; ++i)
		value += equation[i]*Math.pow(lifetime, length-1-i);

	if(value >= 0.99)
		value = 1;
	
	return value;
}

modifyPropertyNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);
	var properties = this.properties;

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	var condition        = this.getInputData(1) || undefined;
	this.change_equation = this.getInputData(2) || undefined;
	var new_value        = this.getInputData(3);

	if (system != undefined)
	{
		if(new_value != undefined)
			properties.new_value = new_value;

		if(this.internal.last_id != system.id)
		{
			this.system_info = searchSystem(system.id);
			this.internal.last_id = system.id;
		}

		var system_info = this.system_info;

		var particles     = system_info.particles_list;
		var particles_ids = system_info.particles_ids;

		var particles_condition_list;
		var particle_id;
		var using_condition = false; 
		var index;

		//Look if there was an non undefined contition list
		if (condition == undefined)
			particles_condition_list = particles;
		else
		{
			using_condition = true;
			particles_condition_list = condition;
		}

		for (var i = 0; i < particles_condition_list.length; i++)
		{	
			//Depending if there was a condition, the way to get the id of the particle changes		
			if (using_condition){
				particle_id = particles_condition_list[i].id;
				index       = i;
			}
			else
			{
				index   = i;
				particle_id = particles_ids[i].id;
			}

			particle = particles[particle_id];

			//The modifier for the canges along life time is computed
			var e;
			var x = particle.c_lifetime;

			if (properties.modification_mode == "Along life time")
				e = particle.lifetime;
			else if (properties.modification_mode == "User defined")
			{
				e = properties.user_defined_seconds;
				//if(x > e) continue; //That means that the condition is already meeted
			}

			var modifier = Math.clamp(x / e, 0.0, 1.0); //The clamp is mandatory for avoid computacion errors

			if(this.change_equation)
				modifier = this.computeChangeEquation(modifier);

			var final_value = properties.new_value;

			/*
			* If the mode of application is addition the starting value is added to the final one
			* If the mode of application is substraction the starting value is substracted to the final one
			* If the mode is equalization thats all
			*/
			if(properties.changed_property == "Speed")
			{
				if(properties.application_mode == "Addition")
					for (var j = 0; j < 3; ++j)
						final_value[j] += particle.iSpeed[j];
				else if(properties.application_mode == "Subtraction")
					for (var j = 0; j < 3; ++j)
						final_value[j] -= particle.iSpeed[j];

				for (var j = 0; j < 3; ++j)
					particle.speed[j] = final_value[j] * modifier + particle.iSpeed[j] * (1.0 - modifier);
			}
			else if (properties.changed_property == "Size")
			{
				if(properties.application_mode == "Addition")
					final_value += particle.iSize;
				else if(properties.application_mode == "Subtraction")
					final_value = Math.max(particle.iSize - final_value, 0);

				particle.size = final_value * modifier + particle.iSize * (1.0 - modifier);
			}
			else if (properties.changed_property == "Color")
			{
				if(properties.application_mode == "Addition")
					for (var j = 0; j < 4; ++j)
						final_value[j] = Math.min(Math.max(particle.iColor[j] + final_value[j], 0), 1);
				else if(properties.application_mode == "Subtraction")
					for (var j = 0; j < 4; ++j)
						final_value[j] = Math.min(Math.max(particle.iColor[j] - final_value[j], 0), 1);

				for (var j = 0; j < 4; ++j)
					particle.color[j] = final_value[j] * modifier + particle.iColor[j] * (1.0 - modifier);
			}
			else if (properties.changed_property == "Life time")
			{
				//????????
			}
			
		}

	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

modifyPropertyNode.title = "Modify Property";
modifyPropertyNode.title_color = modifyPropertiesNodeColor;
modifyPropertyNode.title_text_color = basicTitleColor;
modifyPropertyNode.title_selected_color = basicSelectedTitleColor;