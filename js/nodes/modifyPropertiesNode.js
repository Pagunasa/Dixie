/*
*	This node is for allow to modify the properties of the particles
*	@method modifyPropertyNode
*/
function modifyPropertyNode() {
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		changed_property: "Speed",
		application_mode: "Equalization",
		modification_mode: "Along life time",
		user_defined_seconds: 2,
		user_defined_start: 0,
		new_value: [0,0,0]	
	};

	this.internal = {
		last_id: -1,
		last_changed_property: "Unknow"
	}

	this.propValues = ["Speed", "Size", "Color", "Life time"];
	this.applValues = ["Equalization", "Addition", "Subtraction"];
	this.modiValues = ["Along life time", "User defined"];

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows modifying one property of the particles given a condition and\
    an equation. By default, the condition is true for all the particles, and the equation is linear.\
    It will only modify properties for sub emitter particles if the connection comes from a init node that initializes his particles.";

    this.prop_desc = {
    	changed_property:     "What property will be changed",
    	application_mode:     "What operation will be done with the new value",
    	modification_mode:    "If the property will change along the particle lifetime or depending some times defined manually",
    	user_defined_seconds: "How many seconds until achieve the new value",
		user_defined_start:   "How many seconds until start to make the changes",
		new_value:            "The new value of the property"
    }

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


/*
* 	Change if the modification is along the lifetime of the particle or if is user defined
*	@method changeModification 
*   @params {String} If is user defined or along lifetime
*/
modifyPropertyNode.prototype.changeModification = function(v)
{
	var properties = this.properties;

	properties.modification_mode = v;
	this.widgets.splice(3,2);

	if (v == "User defined")
	{
		var duration = properties.user_defined_seconds;
		var start    = properties.user_defined_start;

		this.staW = this.addWidget("number", "Starts at", start,    this.setStart.bind(this), {min: 0, max: 100000, step: 0.1});
		this.secW = this.addWidget("number", "Duration" , duration, this.setDuration.bind(this), {min: 0, max: 100000, step: 0.1});
	}
	else
		this.size[1] = 166;	

	this.modification.modification_mode = v;
}


/*
* 	Set when the modification starts
*	@method setStart 
*   @params {Number} Seconds in which the modification starts
*/
modifyPropertyNode.prototype.setStart = function(v)
{
	if(isNaN(v))
		v = 0;

	this.staW.value = v;
	this.properties.user_defined_start   = v;
}


/*
* 	Set how many time lasts the modification 
*	@method setDuration 
*   @params {Number} Modification duration in seconds
*/
modifyPropertyNode.prototype.setDuration = function(v)
{
	if(isNaN(v))
		v = 2;

	this.secW.value = v;
	this.properties.user_defined_seconds   = v;
}


/*
* 	Change the application mode of the modification
*	@method changeApplication 
*   @params {String} The name of the application (Add, equalize or substract)
*/
modifyPropertyNode.prototype.changeApplication = function(v)
{
	this.properties.application_mode = v;
	this.modification.application_mode = v;
}


/*
* 	Change the property that is modified
*	@method changeProperty 
*   @params {String} The name of the property
*/
modifyPropertyNode.prototype.changeProperty = function(v)
{
	var properties   = this.properties;
	var modification = this.modification;
	var last_prop    = this.internal.last_changed_property;

	if(v != last_prop && last_prop != "Unknow")
	{
		//The third input is deleted with his possible conection
		this.disconnectInput(3);
		this.inputs.splice(3,1);
		this.internal.last_changed_property = v;
	} 
	else if(last_prop == "Unknow")
	{
		this.internal.last_changed_property = v;
		modification.changed_property       = v;
		properties.changed_property         = v;
		return;
	}

	modification.changed_property = v;
	properties.changed_property = v;

	if(v == "Speed")
	{
		this.addInput("New speed", "vec3");
		properties.new_value = [0,0,0];
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

	modification.new_value = properties.new_value ;
}


/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*   @params {String} The name of the changed value
*/
modifyPropertyNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;
	
	if(this.modification == undefined)
	{
		this.modification = new ModifyPropertiesInfo(this.id, this.properties);
		modProp_list.push(this.modification);	
	}

	switch(property)
	{
		case "changed_property":
			var p = properties.changed_property;
			
			if(!this.propValues.includes(p))
			{
				p = "Size";
				this.propW.value = p;
				this.changeProperty(p);
			} 
			else if(this.propW.value != p)
			{
				this.propW.value = p;
				this.changeProperty(p);
			}
		break;

		case "application_mode":
			var a = properties.application_mode;

			if(!this.applValues.includes(a))
			{
				a = "Equalization";
				this.applW.value = a;
				this.changeApplication(a);
			}
			else if(this.applW.value != a)
			{
				this.applW.value = a;
				this.changeApplication(a);
			}
		break;

		case "modification_mode":
			var m = properties.modification_mode;

			if(!this.modiValues.includes(m))
			{
				m = "Along life time";	
				this.modiW.value = m;
				this.changeModification(m);		
			}
			else if(this.modiW.value != m)
			{
				this.modiW.value = m;
				this.changeModification(m);
			}
		break;

		case "user_defined_seconds":
			properties.user_defined_seconds = Math.max(properties.user_defined_seconds, 0.0);
			this.modification.user_defined_seconds = properties.user_defined_seconds;

			if(this.secW != undefined)
				this.setDuration(properties.user_defined_seconds);
		break;

		case "user_defined_start":
			properties.user_defined_start = Math.max(properties.user_defined_start, 0.0);
			this.modification.user_defined_start = properties.user_defined_start;

			if(this.staW != undefined)
				this.setStart(properties.user_defined_start);
		break;

		case "new_value":
			if(properties.changed_property == "Speed" && properties.new_value.length != 3)
				properties.new_value = [0,0,0];

			if(properties.changed_property == "Color" && properties.new_value.length != 4)
				properties.new_value = [1,1,1,1];

			if((properties.changed_property == "Size" || properties.changed_property == "Life time") 
				&& (isNaN(properties.new_value) || properties.new_value < 0))
				properties.new_value = 0;

			this.modification.new_value = properties.new_value;
		break;
	}
}


/*
* 	If a equation is gived then this function calculates the factor of the new value using it
*	@method computeChangeEquation 
*   @params {Number} The lifetime of the particle
*/
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


/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
modifyPropertyNode.prototype.onAdded =  function()
{
	if(this.modification != undefined)
	{
		this.modification.id = this.id
		return;
	}

	this.modification = new ModifyPropertiesInfo(this.id, this.properties);
	modProp_list.push(this.modification);
}


/*
* 	What the node does every frame
*	@method onExecute 
*/
modifyPropertyNode.prototype.onExecute = function() 
{
	var system = this.getInputData(0);
	var properties = this.properties;

	//When is executed the inputs are gotten and if they are undefined a default value is setted
	var condition        = this.getInputData(1) || undefined;
	this.change_equation = this.getInputData(2) || undefined;
	var new_value        = this.getInputData(3);

	this.modification.equation  = this.change_equation;
	this.modification.condition = condition != undefined ? condition.id : -1;

	if (system != undefined)
	{
		if(new_value != undefined)
		{
			if(properties.changed_property == "Speed" || properties.changed_property == "Color")
				properties.new_value = new_value.slice(0);
			else
				properties.new_value = new_value;

			this.modification.new_value = properties.new_value; 
		}

		if(this.internal.last_id != system.id)
		{
			this.system_info      = system.data;
			this.internal.last_id = system.id;

			this.modification.reciever = this.system_info.id; 
			
			if(system.type == "sub_emitter")
				this.modification.subReciever = system.index; 
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
			particles_condition_list = system.type == "emitter" ? system_info.particles_ids : system_info.sub_emission_ids;
		else
		{
			using_condition = true;
			particles_condition_list = condition.condition;
		}

		for (var i = 0; i < particles_condition_list.length; i++)
		{	
			//Depending if there was a condition, the way to get the id of the particle changes		
			particle_id = particles_condition_list[i].id;
			index       = i;

			particle = particles[particle_id];

			//The modifier for the canges along life time is computed
			var e;
			var x = particle.c_lifetime;

			if (properties.modification_mode == "Along life time")
				e = particle.lifetime;
			else if (properties.modification_mode == "User defined")
			{
				e = properties.user_defined_seconds + properties.user_defined_start;

				//Because the time starts when the condition is meeted
				if(condition != undefined)
					e += particles_condition_list[i].meet_at;

				if(x < properties.user_defined_start) continue; //That means that the condition is already meeted
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
				var temp = [0,0,0];
				temp[0]  = final_value[0];
				temp[1]  = final_value[1];
				temp[2]  = final_value[2];
				
				if(properties.application_mode == "Addition")
					for (var j = 0; j < 3; ++j)
						temp[j] = particle.iSpeed[j] + final_value[j];
				else if(properties.application_mode == "Subtraction")
					for (var j = 0; j < 3; ++j)
						temp[j] = particle.iSpeed[j] - final_value[j];

				for (var j = 0; j < 3; ++j)
					particle.speed[j] = temp[j] * modifier + particle.iSpeed[j] * (1.0 - modifier);
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
				if(properties.application_mode == "Addition")
					final_value += particle.iLifetime;
				else if(properties.application_mode == "Subtraction")
					final_value = Math.max(particle.iLifetime - final_value, 0);

				particle.lifetime = final_value * modifier + particle.iLifetime * (1.0 - modifier);
			}
		}
	}
	else
	{
		this.modification.reciever    = -1;
		this.modification.subReciever = -1;
	}

	//The porperties of the node are the output
	this.setOutputData(0, system);
}


/*
* 	The behaviour of the node when is removed
*	@method onExecute 
*/
modifyPropertyNode.prototype.onRemoved = function() 
{
 	searchModification(this.id, true);
}


modifyPropertyNode.title = "Modify Property";
modifyPropertyNode.title_color = modifyPropertiesNodeColor;
modifyPropertyNode.title_text_color = basicTitleColor;
modifyPropertyNode.title_selected_color = basicSelectedTitleColor;