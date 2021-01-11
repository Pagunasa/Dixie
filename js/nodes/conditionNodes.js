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
		value          : vector_3,
		condition_met  : false
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("combo", "Property", "Speed", function() {}, 
		{ values:["Speed", "Life time", "Colision number", "Size"] });
	this.addWidget("combo", "Condition", "Equals", function() {}, 
		{ values:["Equals", "Greater than", "Less than", 
		"Greater than or equals", "Less than or equals", 
		"No equals"] });
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Speed", "vec3");

	this.addOutput("Condition", "condition");
}

createConditionNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.value = this.getInputData(1) || vector_3;
	
	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, this.properties.condition_met);
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
		merge_mode   : "And",
		condition_1  : undefined,
		condition_2  : undefined,
		condition_met: false
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("combo", "Merge mode", "And", function() {}, 
		{ values:["And", "Or"] });
	
	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Condition 1", "condition");
	this.addInput("condition 2", "condition");

	this.addOutput("Condition", "condition");
}

mergeConditionsNode.prototype.onExecute = function() 
{
	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.condition_1 = this.getInputData(0);
	this.properties.condition_2 = this.getInputData(1);

	if (this.properties.condition_1 != undefined && this.properties.condition_2 != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, this.properties.condition_met);
}

mergeConditionsNode.title = "Merge Conditions";
mergeConditionsNode.title_color = conditionsNodeColor;
mergeConditionsNode.title_text_color = basicTitleColor;
mergeConditionsNode.title_selected_color = basicSelectedTitleColor;