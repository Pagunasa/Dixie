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

	this.w1Values = ["Speed", "Life time", "Colision number", "Size"];
	this.w2Values = ["Equals", "Greater than", "Less than", "Greater than or equals", "Less than or equals", "No equals"];

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.w1 = this.addWidget("combo", "Property", "Speed", this.changeProperty.bind(this), 
		{values: this.w1Values});
	this.w2 = this.addWidget("combo", "Condition", "Equals", this.changeCondition.bind(this), 
		{values: this.w2Values});
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Speed", "vec3");

	this.addOutput("Condition", "condition_list");
}

createConditionNode.prototype.onPropertyChanged = function()
{
	var properties = this.properties;
	var sp = properties.system_property;
	var co = properties.condition;

	if(!this.w1Values.includes(sp))
		sp = "Speed";
	
	if(this.w1.value != sp)
	{
		this.changeProperty(sp);
		this.w1.value = sp;
	}

	if(!this.w2Values.includes(co))
		co = "Equals";

	if(this.w2.value != co)
	{
		this.changeCondition(co);
		this.w2.value = co;
	}
}

createConditionNode.prototype.changeCondition = function(v)
{
	this.properties.condition = v;

	if(v == "Greater than or equals" || v == "Less than or equals")
		this.size[0] = 270;

}

createConditionNode.prototype.changeProperty = function(v)
{
	var properties = this.properties;
	var condition  = properties.condition;

	properties.system_property = v;

	//The second input is deleted with his possible conection
	this.disconnectInput(1);
	this.inputs.splice(1,1);

	if(v == "Speed")
	{
		this.addInput("Speed", "vec3");
		properties.value = vector_3;
	}
	else if (v == "Size")
	{
		this.addInput("Size", "number");
		properties.value = 5;
	}
	else if (v == "Colision number")
	{
		this.addInput("Colision number", "number");
		properties.value = 0;
		this.size[0] = 250;
	}
	else if (v == "Life time")
	{
		this.addInput("Life time", "number");
		properties.value = 0;
	}

	if(condition == "Greater than or equals" || condition == "Less than or equals")
		this.size[0] = 270;
}

createConditionNode.prototype.onExecute = function() 
{
	var properties = this.properties;
	var system = this.getInputData(0);
	var condition_list = [];

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.value = this.getInputData(1) || properties.value;
	
	if (system != undefined)
	{
		var system_info   = searchSystem(system.id);
		var particles     = system_info.particles_list;
		var particles_ids  = system_info.particles_ids;
		var value_to_test = properties.value;
		var tested_value;
		var particle;
		var id;

		for (var i = 0; i < particles_ids.length; i++)
		{
			tested_value = 0;
			id = particles_ids[i].id;
			particle = particles[id];

			switch (properties.system_property)
			{
				case "Speed":
					//for the speed the compared value is the module of the vector
					var speed = particle.speed;
					tested_value = Math.sqrt(speed[0]*speed[0]+speed[1]*speed[1]+speed[2]*speed[2]);
					
					//We only have to do it the first time 
					if(i == 0)
						value_to_test = Math.sqrt(value_to_test[0]*value_to_test[0]+value_to_test[1]*value_to_test[1]+value_to_test[2]*value_to_test[2]);
				break;

				case "Colision number":
					tested_value = particle.colision_number;
				break;

				case "Size":
					tested_value = particle.size;
				break;
			
				case "Life time":
					tested_value = particle.c_lifetime;
				break;

				break;
			}

			//Depending on the condition, the comparison is made
			switch (this.properties.condition)
			{
				case "Equals":
					if (tested_value == value_to_test)
						condition_list.push({id : id, index: i});
				break;

				case "Greater than":
					if (tested_value > value_to_test)
						condition_list.push({id : id, index: i});
				break;

				case "Less than":
					if (tested_value < value_to_test)
						condition_list.push({id : id, index: i});
				break;
			
				case "Greater than or equals":
					if (tested_value >= value_to_test)
						condition_list.push({id : id, index: i});
				break;

				case "Less than or equals":
					if (tested_value <= value_to_test)
						condition_list.push({id : id, index: i});
				break;

				case "No equals":
					if (tested_value != value_to_test)
						condition_list.push({id : id, index: i});
				break;
			}
		}
	}

	//The ids of the particles that meet the condition are the output for this node
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

	this.vValues = ["And", "Or"];

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.w = this.addWidget("combo", "Merge mode", "And", this.changeMergeMode.bind(this), 
		{ values: this.vValues});
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Condition 1", "condition_list");
	this.addInput("condition 2", "condition_list");

	this.addOutput("Condition", "condition_list");
}

mergeConditionsNode.prototype.onPropertyChanged = function()
{
	var m = this.properties.merge_mode;

	if(!this.vValues.includes(m))
		m = "And";

	this.w.value = m;
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
		//If the merge mode is And. You have to see if the particles meet both conditions
		case "And":
			if (lenght1 > 0 && lenght2 > 0)
				for(var i = 0; i < lenght1; ++i){
				    for (var j = 0; j < lenght2; ++j){
				        if(condition_1[i] == condition_2[j] && !condition_list.includes(condition_1[i])) //The includes is for avoid duplications
				            condition_list.push(condition_1[i]);
				        else if (condition_2[j] > condition_1[i]) //We can do this because the conditions list is allways in ascendent order
				            break;
				    }
				}
		break;

		//In case of the Or is more easy, the only problem is to take care of duplications
		case "Or":
			if (lenght1 > 0 && lenght2 > 0)
			{
				condition_list = condition_1;

				for (var i = 0; i < condition_2.length; ++i)
				    if(!condition_list.includes(condition_2[i])) //For these reason is used the includes
				        condition_list.push(condition_2[i]);
				
			}
			else if (lenght1 == 0) //if we don't have particles in one, we can put the other
				condition_list = condition_2;
			else if (lenght2 == 0)
				condition_list = condition_1;

		break;
	}

	//The ids of the particles that meet the conditions are the output for this node
	this.setOutputData(0, condition_list);
}

mergeConditionsNode.title = "Merge Conditions";
mergeConditionsNode.title_color = conditionsNodeColor;
mergeConditionsNode.title_text_color = basicTitleColor;
mergeConditionsNode.title_selected_color = basicSelectedTitleColor;