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
		condition: true,
		change_equation: undefined,
		new_value: vector_3	
	};

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("combo", "Property", "Speed", function() {}, 
		{ values:["Speed", "Size", "Color", "Life time"] });
	this.addWidget("combo", "Application Mode", "Addition", function() {}, 
		{ values:["Addition", "Subtraction", "Equalization"] });
	this.addWidget("combo", "Modification Mode", "Along life time", function() {}, 
		{ values:["Along life time", "User defined"] });
	//this.addWidget("combo", "Seconds", "Along life time", function() {}, 
	//	{ values:["Along life time", "User defined"] });


	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Condition"      , "condition");
	this.addInput("Change equation", "equation");
	this.addInput("New value"      , "vec3");
	
	this.addOutput("Particle system", "particle_system");
}

modifyPropertyNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.condition       = this.getInputData(1) || true;
	this.properties.change_equation = this.getInputData(2) || undefined;
	this.properties.new_value       = this.getInputData(2) || vector_3;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

modifyPropertyNode.title = "Modify Property";
modifyPropertyNode.title_color = spawnNodeColor;
modifyPropertyNode.title_text_color = basicTitleColor;
modifyPropertyNode.title_selected_color = basicSelectedTitleColor;