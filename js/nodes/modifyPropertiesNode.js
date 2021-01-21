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
		condition: undefined,
		change_equation: undefined,
		changed_property: "Speed",
		application_mode: "Equalization",
		modification_mode: "Along lifetime",
		user_defined_seconds: 5,
		new_value: vector_3	
	};

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
	this.properties.modification_mode = v;
	this.widgets.splice(3,1);

	if (v == "User defined")
	{
		var value = this.properties.user_defined_seconds;
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
	//The third input is deleted with his possible conection
	this.disconnectInput(3);
	this.inputs.splice(3,1);

	this.properties.changed_property = v;

	if(v == "Speed")
	{
		this.addInput("New speed", "vec3");
		this.properties.new_value = vector_3;
	}
	else if (v == "Size")
	{
		this.addInput("New size", "number");
		this.properties.new_value = 5;
	}
	else if (v == "Color")
	{
		this.addInput("New color", "color");
		this.properties.new_value = [1,1,1,1];
	}
	else if (v == "Life time")
	{
		this.addInput("New life time", "number");
		this.properties.new_value = 0;
	}
}

//For recover (in a visual way) the values when a graph is loaded
modifyPropertyNode.prototype.onPropertyChanged = function()
{
	var p = this.properties.changed_property;
	var a = this.properties.application_mode;
	var m = this.properties.modification_mode;

	if(!this.propValues.includes(p))
		p = "Size";

	this.propW.value = p;
	this.changeProperty(p);

	if(!this.applValues.includes(a))
		a = "Equalization";
	
	this.applW.value = a;
	this.changeApplication(a);

	if(!this.modiValues.includes(m))
		m = "Along life time";

	this.modiW.value = m;
	this.changeModification(m);

	if(this.secW != undefined)
		this.setSeconds(this.properties.user_defined_seconds);
}

modifyPropertyNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.condition       = this.getInputData(1) || undefined;
	this.properties.change_equation = this.getInputData(2) || undefined;
	this.properties.new_value       = this.getInputData(3);

	if (system != undefined)
	{
		if(this.properties.new_value == undefined)
		{
			//Get the property to change
			switch (this.properties.changed_property)
			{
				case "Speed":
					this.properties.new_value = vector_3;
				break;
				case "Size":
					this.properties.new_value = 5;
				break;
				case "Color":
					this.properties.new_value = [1,1,1,1];
				break;
				case "Life time":
					this.properties.new_value = 0;
				break;
			}
		}

		var system_info = searchSystem(system.id);
		var particles = system_info.particles_list;
		var mesh = searchMesh(system.id);

		var particles_condition_list;
		var particle_id;
		var using_condition = false; 

		//Look if there was an non undefined contition list
		if (this.properties.condition == undefined)
			particles_condition_list = particles;
		else
		{
			using_condition = true;
			particles_condition_list = this.properties.condition;
		}

		for (var i = 0; i < particles_condition_list.length; i++)
		{	
			//Depending if there was a condition, the way to get the id of the particle changes		
			if (using_condition)
				particle_id = particles_condition_list[i];
			else
				particle_id = i;

			particle = particles[particle_id];

			//The modifier for the canges along life time is computed
			var e;
			var x = particle.c_lifetime;

			if (this.properties.modification_mode == "Along life time")
				e = particle.lifetime;
			else if (this.properties.modification_mode == "User defined")
			{
				e = this.properties.user_defined_seconds;
				if(x > e) continue; //That means that the condition is already meeted
			}

			var modifier = Math.clamp(x / e, 0.0, 1.0); //The clamp is mandatory for avoid computacion errors

			var final_value = this.properties.new_value;

			/*
			* If the mode of application is addition the starting value is added to the final one
			* If the mode of application is substraction the starting value is substracted to the final one
			* If the mode is equalization thats all
			*/
			if(this.properties.changed_property == "Speed")
			{
				if(this.properties.application_mode == "Addition")
					for (var j = 0; j < 3; ++j)
						final_value[j] += particle.iSpeed[j];
				else if(this.properties.application_mode == "Subtraction")
					for (var j = 0; j < 3; ++j)
						final_value[j] -= particle.iSpeed[j];

				for (var j = 0; j < 3; ++j)
					particle.speed[j] = final_value[j] * modifier 
								+ particle.iSpeed[j] * (1.0 - modifier);
			}
			else if (this.properties.changed_property == "Size")
			{
				if(this.properties.application_mode == "Addition")
					final_value += particle.iSize;
				else if(this.properties.application_mode == "Subtraction")
					final_value = Math.max(particle.iSize - final_value, 0);

				particle.size = final_value * modifier + particle.iSize * (1.0 - modifier);
				updateSize(mesh, particle, particle_id);
				
				mesh.upload();
			}
			else if (this.properties.changed_property == "Color")
			{
				if(this.properties.application_mode == "Addition")
					for (var j = 0; j < 4; ++j)
						final_value[j] = Math.min(Math.max(particle.iColor[j] + final_value[j], 0), 1);
				else if(this.properties.application_mode == "Subtraction")
					for (var j = 0; j < 4; ++j)
						final_value[j] = Math.min(Math.max(particle.iColor[j] - final_value[j], 0), 1);

				for (var j = 0; j < 4; ++j)
					particle.color[j] = final_value[j] * modifier 
								+ particle.iColor[j] * (1.0 - modifier);

				updateColor(mesh, particle, particle_id);
				mesh.upload();
			}
			else if (this.properties.changed_property == "Life time")
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