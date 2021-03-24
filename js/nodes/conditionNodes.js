/*
*	This node is for create a condition and test if the particles meet it
*	@method createConditionNode
*/
function createConditionNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		system_property: "Speed",
		condition      : "Equals",
		is_one_time    : false,
		value          : [0,0,0]
	};

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node defines a condition and checks for every particle in the system if it's meted.\
    It will only check for a sub emitter particles if the connection comes from a init node that initializes his particles.";

    this.prop_desc = {
    	system_property: "The tested property of the particle",            
        condition:       "What kind of operator will be used for the check",
        is_one_time:     "If only can be meted one time per particle",
        value:           "The value we want to use for the check"
    }

	this.w1Values = ["Speed", "Life time", "Size"];
	this.w2Values = ["Equals", "Greater than", "Less than", "Greater than or equals", "Less than or equals", "No equals"];

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.w1 = this.addWidget("combo", "Property", "Speed", this.changeProperty.bind(this), 
		{values: this.w1Values});
	this.w2 = this.addWidget("combo", "Condition", "Equals", this.changeCondition.bind(this), 
		{values: this.w2Values});
	this.w3 = this.addWidget("toggle", "One time condition", false, this.changeConditionTime.bind(this), 
		{values: this.w2Values});

	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Particle system", "particle_system");
	this.addInput("Speed", "vec3");

	this.addOutput("Condition", "condition_list");
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*   @params {String} The name of the changed value
*/
createConditionNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;
	
	if(this.condition == undefined)
	{
		this.condition = new ConditionInfo(this.id, this.properties);
		condition_list.push(this.condition);
	}

	switch (property) {
		case "system_property":
			var sp = properties.system_property;

			if(!this.w1Values.includes(sp))
				sp = "Speed";
			
			if(this.w1.value != sp)
			{
				this.changeProperty(sp);
				this.w1.value = sp;
			}
		break;

		case "condition":
			var co = properties.condition;

			if(!this.w2Values.includes(co))
				co = "Equals";

			if(this.w2.value != co)
			{
				this.changeCondition(co);
				this.w2.value = co;
			}
		break;

		case "is_one_time":
			var one_time  = properties.is_one_time;
			this.w3.value = one_time ;
			this.condition.one_time = one_time;
		break;

		case "value":
			if(properties.system_property == "Speed" && properties.value.length != 3) 
				properties.value = [0,0,0];
			this.condition.value = properties.value;
		break; 
	}
}


/*
* 	Change if the condition can be reached several times or just one
*	@method changeConditionTime 
*   @params {Bool} If is one time or not
*/
createConditionNode.prototype.changeConditionTime = function(v)
{
	this.properties.is_one_time = v;
	this.condition.one_time   = v;
}


/*
* 	Change the kind of operator to meet the condition
*	@method changeConditionTime 
*   @params {String} The name of the operator
*/
createConditionNode.prototype.changeCondition = function(v)
{
	this.properties.condition = v;
	this.condition.operator   = v;

	if(v == "Greater than or equals" || v == "Less than or equals")
		this.size[0] = 270;
}


/*
* 	Change the propety to be tested
*	@method changeProperty 
*   @params {String} The name of the property
*/
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
		properties.value = [0,0,0];
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

		this.condition.value = properties.value;
		this.condition.property = v;	
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
createConditionNode.prototype.onAdded =  function()
{
	if(this.condition != undefined)
	{
		this.condition.id = this.id
		return;
	}
	
	this.condition = new ConditionInfo(this.id, this.properties);
	condition_list.push(this.condition);
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
createConditionNode.prototype.onExecute = function() 
{
	var properties = this.properties;
	var system_input = this.getInputData(0);
	var condition_list = [];

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	properties.value = this.getInputData(1) || properties.value;
	this.condition.value = properties.value;

	if (system_input != undefined)
	{
		var system        = system_input.data;
		var particles     = system.particles_list;
		var value_to_test = properties.value;
		var tested_value;
		var meet_time;
		var particle;
		var ids, id;

		if(system_input.type == "emitter")
			ids = system.particles_ids;
		else if(system_input.type == "sub_emitter")
			ids = system.sub_emittors[system_input.index].ids;

		for (var i = 0; i < ids.length; i++)
		{
			tested_value = 0;
			id = ids[i].id;
			particle = particles[id];
			meet_time = particle.c_lifetime;

			if(properties.is_one_time && particle.conditions_meet.includes(this.id))
				continue;

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
			}

			//Depending on the condition, the comparison is made
			switch (this.properties.condition)
			{
				case "Equals":
					if (tested_value == value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;

				case "Greater than":
					if (tested_value > value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;

				case "Less than":
					if (tested_value < value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;
			
				case "Greater than or equals":
					if (tested_value >= value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;

				case "Less than or equals":
					if (tested_value <= value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;

				case "No equals":
					if (tested_value != value_to_test)
					{
						condition_list.push({id : id, index: i, meet_at: meet_time});
						particle.conditions_meet.push(this.id);
					}
				break;
			}
		}
	}

	//The ids of the particles that meet the condition are the output for this node
	this.setOutputData(0, {id: this.id, condition: condition_list});
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
createConditionNode.prototype.onRemoved = function() 
{
 	searchCondition(this.id, true);
}


createConditionNode.title = "Create Condition";
createConditionNode.title_color = conditionsNodeColor;
createConditionNode.title_text_color = basicTitleColor;
createConditionNode.title_selected_color = basicSelectedTitleColor;


/*
*	This node is for merge two conditions
*	@method mergeConditionsNode
*/
function mergeConditionsNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		merge_mode   : "And"
	};

	this.vValues = ["And", "Or"];

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows merging two conditions and checks what particles met the new condition.";

    this.prop_desc = {
    	merge_mode: "What kind of merge will be used, with And the particle must meet both conditions and with Or just one"
    }

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


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
mergeConditionsNode.prototype.onPropertyChanged = function()
{
	var m = this.properties.merge_mode;

	if(this.condition == undefined)
	{
		this.condition = new MergedConditionInfo(this.id, -1, -1, this.properties.merge_mode);
		condition_list.push(this.condition);
	}

	if(!this.vValues.includes(m))
	{
		m = "And";
		this.properties.merge_mode = m;
	}

	this.w.value = m;

	this.condition.mode = m;
}


/*
* 	Change the kind of merge mode 
*	@method changeConditionTime 
*   @params {String} The name of the merge mode (And, OR)
*/
mergeConditionsNode.prototype.changeMergeMode = function(v)
{
	this.properties.merge_mode = v;
	this.condition.mode = v;
}


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
mergeConditionsNode.prototype.onAdded =  function()
{
	if(this.condition != undefined)
	{
		this.condition.id = this.id
		return;
	}

	this.condition = new MergedConditionInfo(this.id, -1, -1, this.properties.merge_mode);
	condition_list.push(this.condition);
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
mergeConditionsNode.prototype.onExecute = function() 
{
	var condition_1 = this.getInputData(0) || {id: -1, condition: []};
	var condition_2 = this.getInputData(1) || {id: -1, condition: []};

	var c  = this.condition;
	c.id_C1 = condition_1.id;
	c.id_C2 = condition_2.id;

	condition_1 = condition_1.condition;
	condition_2 = condition_2.condition;

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
				        if(condition_1[i].id == condition_2[j].id && !condition_list.includes(condition_1[i])) //The includes is for avoid duplications
				            condition_list.push(condition_1[i]);
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
	this.setOutputData(0, {id: this.id, condition: condition_list});
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
mergeConditionsNode.prototype.onRemoved = function() 
{
 	searchCondition(this.id, true);
}


mergeConditionsNode.title = "Merge Conditions";
mergeConditionsNode.title_color = conditionsNodeColor;
mergeConditionsNode.title_text_color = basicTitleColor;
mergeConditionsNode.title_selected_color = basicSelectedTitleColor;