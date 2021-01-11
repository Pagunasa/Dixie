/*
*	This node is for define a constant force that is applied to all particles
*	@method mySpawnNode
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
	this.addInput("Stength"        , "vec3");

	this.addOutput("Particle system", "particle_system");
}

gravityNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.direction = this.getInputData(1) || vector_3;
	this.properties.strength  = this.getInputData(2) || 10;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

gravityNode.title = "Gravity";
gravityNode.title_color = forcesNodeColor;
gravityNode.title_text_color = basicTitleColor;
gravityNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a constant force that is applied to all particles
*	@method mySpawnNode
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
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("toggle", "Show vortex", true, function(){});

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

vortexNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.position       = this.getInputData(1) || vector_3;
	this.properties.angular_speed  = this.getInputData(2) || vector_3;
	this.properties.scale          = this.getInputData(3) || 10;
	this.properties.color          = this.getInputData(4) || vector_4;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

vortexNode.title = "Vortex";
vortexNode.title_color = forcesNodeColor;
vortexNode.title_text_color = basicTitleColor;
vortexNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a constant force that is applied to all particles
*	@method mySpawnNode
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
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("toggle", "Show magnet point", true, function(){});

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

magnetNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.position       = this.getInputData(1) || vector_3;
	this.properties.strength       = this.getInputData(2) || 10;
	this.properties.scale          = this.getInputData(3) || 10;
	this.properties.color          = this.getInputData(4) || vector_4;

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}

magnetNode.title = "Magnet Point";
magnetNode.title_color = forcesNodeColor;
magnetNode.title_text_color = basicTitleColor;
magnetNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define a constant force that is applied to all particles
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
*	This node is for define a constant force that is applied to all particles
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