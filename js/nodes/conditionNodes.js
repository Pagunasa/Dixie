/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function createConditionNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		system_property: "Speed",
		condition      : "Equals",
		value          : vector_3
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("combo", "Property", "Speed", this.changeProperty.bind(this), 
		{ values:["Speed", "Life time", "Colision number", "Size"] });
	this.addWidget("combo", "Condition", "Equals", this.changeCondition.bind(this), 
		{ values:["Equals", "Greater than", "Less than", 
		"Greater than or equals", "Less than or equals", 
		"No equals"] });
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Speed", "vec3");

	this.addOutput("Condition", "condition_list");
}

createConditionNode.prototype.changeCondition = function(v)
{
	this.properties.condition = v;

	if(v == "Greater than or equals" || v == "Less than or equals")
		this.size[0] = 270;

}

createConditionNode.prototype.changeProperty = function(v)
{
	this.properties.system_property = v;

	//The second input is deleted with his possible conection
	this.disconnectInput(1);
	this.inputs.splice(1,1);

	if(v == "Speed")
	{
		this.addInput("Speed", "vec3");
		this.properties.value = vector_3;
	}
	else if (v == "Size")
	{
		this.addInput("Size", "number");
		this.properties.value = 5;
	}
	else if (v == "Colision number")
	{
		this.addInput("Colision number", "number");
		this.properties.value = 0;
		this.size[0] = 250;
	}
	else if (v == "Life time")
	{
		this.addInput("Life time", "number");
		this.properties.value = 0;
	}

	if(this.properties.condition == "Greater than or equals" || this.properties.condition == "Less than or equals")
		this.size[0] = 270;
}

createConditionNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);
	var condition_list = [];

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.value = this.getInputData(1) || this.properties.value;
	
	if (system != undefined)
	{
		var system_info = searchSystem(system.id);
		var particles = system_info.particles_list;
		var value_to_test = this.properties.value;

		for (var i = 0; i < particles.length; i++)
		{
			var tested_value = 0;

			switch (this.properties.system_property)
			{
				case "Speed":
					tested_value = particles[i].speed;
				break;

				case "Colision number":
					tested_value = particles[i].colision_number;
				break;

				case "Size":
					tested_value = particles[i].size;
				break;
			
				case "Life time":
					tested_value = particles[i].c_lifetime;
				break;

				default:
					condition_list.push(i);
					continue;
				break;
			}

			switch (this.properties.condition)
			{
				case "Equals":
					if (tested_value == value_to_test)
						condition_list.push(i);
				break;

				case "Greater than":
					if (tested_value > value_to_test)
						condition_list.push(i);
				break;

				case "Less than":
					if (tested_value < value_to_test)
						condition_list.push(i);
				break;
			
				case "Greater than or equals":
					if (value_to_test >= tested_value)
						condition_list.push(i);
				break;

				case "Less than or equals":
					if (tested_value <= value_to_test)
						condition_list.push(i);
				break;

				case "No equals":
					if (tested_value != value_to_test)
						condition_list.push(i);
				break;
			}
		}
	}

	//The porperties of the node are the output
	this.setOutputData(0, condition_list);
}

createConditionNode.title = "Create Condition";
createConditionNode.title_color = conditionsNodeColor;
createConditionNode.title_text_color = basicTitleColor;
createConditionNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function mergeConditionsNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		merge_mode   : "And"
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.w = this.addWidget("combo", "Merge mode", "And", this.changeMergeMode.bind(this), 
		{ values:["And", "Or"] });
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Condition 1", "condition_list");
	this.addInput("condition 2", "condition_list");

	this.addOutput("Condition", "condition_list");
}

mergeConditionsNode.prototype.onPropertyChanged = function()
{
	if(this.properties.merge_mode != "And" && this.properties.merge_mode != "Or")
		this.properties.merge_mode = "And";

	this.w.value = this.properties.merge_mode;
}

mergeConditionsNode.prototype.changeMergeMode = function(v)
{
	this.properties.merge_mode = v;
}


mergeConditionsNode.prototype.onExecute = function() 
{
	var condition_1 = this.getInputData(0) || [];
	var condition_2 = this.getInputData(1) || [];

	var lenght1 = condition_1.length;
	var lenght2 = condition_2.length;

	var condition_list = [];
		
	switch (this.properties.merge_mode)
	{
		case "And":
			if (lenght1 > 0 && lenght2 > 0)
				for(var i = 0; i < lenght1; ++i){
				    for (var j = 0; j < lenght2; ++j){
				        if(condition_1[i] == condition_2[j] && !condition_list.includes(condition_1[i]))
				            condition_list.push(condition_1[i]);
				        else if (condition_2[j] > condition_1[i])
				            break;
				    }
				}
		break;

		case "Or":
			if (lenght1 > 0 && lenght2 > 0)
			{
				condition_list = condition_1;

				for (var i = 0; i < condition_2.length; ++i)
				    if(!condition_list.includes(condition_2[i]))
				        condition_list.push(condition_2[i]);
				
			}
			else if (lenght1 == 0)
				condition_list = condition_2;
			else if (lenght2 == 0)
				condition_list = condition_1;

		break;
	}

	//The porperties of the node are the output
	this.setOutputData(0, condition_list);
}

mergeConditionsNode.title = "Merge Conditions";
mergeConditionsNode.title_color = conditionsNodeColor;
mergeConditionsNode.title_text_color = basicTitleColor;
mergeConditionsNode.title_selected_color = basicSelectedTitleColor;