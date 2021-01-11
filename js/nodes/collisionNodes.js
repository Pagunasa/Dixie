/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function collisionsNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		objects_list: [],
		condition: false,
		response: "Bouncy"
	};

	this.addWidget("combo", "Collision response", "Bouncy", function() {}, 
		{ values:["Bouncy", "Stop", "Kill"] });

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Objects list"   , "objects_list");

	this.addOutput("Particle system", "particle_system");
	this.addOutput("Condition"      , "condition");
}

collisionsNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.objects_list = this.getInputData(1) || [];

	if (system != undefined)
	{
		//TO DO
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
	this.setOutputData(1, this.properties.condition);
}

collisionsNode.title = "Collisions";
collisionsNode.title_color = collisionsNodeColor;
collisionsNode.title_text_color = basicTitleColor;
collisionsNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function collidableObjectsListNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		objects: [],
	};

	this.addWidget("button", "Add More", "", function() {});

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Object 1", "object");
	this.addInput("Object 2", "object");

	this.addOutput("Collidable objects list", "objects_list");
}

collidableObjectsListNode.prototype.onExecute = function() 
{
	//The porperties of the node are the output
	this.setOutputData(0, this.properties.objects);
}

collidableObjectsListNode.title = "Collidable Objects List";
collidableObjectsListNode.title_color = collisionsNodeColor;
collidableObjectsListNode.title_text_color = basicTitleColor;
collidableObjectsListNode.title_selected_color = basicSelectedTitleColor;