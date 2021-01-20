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
		new_value: vector_3	
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.propW = this.addWidget("combo", "Property", "Speed", this.changeProperty.bind(this), 
		{ values:["Speed", "Size", "Color", "Life time"] });
	this.applW = this.addWidget("combo", "Application Mode", "Equalization", this.changeApplication.bind(this), 
		{ values:["Equalization", "Addition", "Subtraction"] });
	this.modiW = this.addWidget("combo", "Modification Mode", "Along life time", function() {}, 
		{ values:["Along life time", "User defined"] });
	//this.addWidget("combo", "Seconds", "Along life time", function() {}, 
	//	{ values:["Along life time", "User defined"] });


	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Condition"      , "condition_list");
	this.addInput("Change equation", "equation");
	this.addInput("New speed"      , "vec3");
	
	this.addOutput("Particle system", "particle_system");
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
	this.propW.value = this.properties.changed_property;
	this.applW.value = this.properties.application_mode;
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

		if (this.properties.condition == undefined)
			particles_condition_list = particles;
		else
		{
			using_condition = true;
			particles_condition_list = this.properties.condition;
		}

		for (var i = 0; i < particles_condition_list.length; i++)
		{			
			if (using_condition)
				particle_id = particles_condition_list[i];
			else
				particle_id = i;

			particle = particles[particle_id];

			var e = particle.lifetime;
			var x = particle.c_lifetime;
			var modifier = x / e;

			var final_value = this.properties.new_value;

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