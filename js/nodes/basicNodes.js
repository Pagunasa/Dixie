/*
* 	This node is for define a constant number.
*	@method constantNumberNode 
*/
function constantNumberNode() {
	this.properties = { number: 1.0 }

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create a constant number";

    this.prop_desc = {
    	number: "The value of the number"
    }

	this.widget = this.addWidget("number", "Number", this.properties.number, this.setValue.bind(this), {step: 0.01});

	this.addOutput("Number", "number");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
constantNumberNode.prototype.onPropertyChanged = function()
{
	var number = this.properties.number;
	this.properties.number = isNaN(number) ? 1.0 : number; 
	this.widget.value = this.properties.number;
}

/*
* 	Set the value of the constant number
*	@method setValue 
*/
constantNumberNode.prototype.setValue = function(v)
{
	var number = isNaN(v) ? 1.0 : v;
	this.widget.value = number; 
	this.properties.number = number;
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
constantNumberNode.prototype.onExecute = function() 
{
	this.setOutputData(0, this.properties.number);
}

constantNumberNode.title = "Constant Number";
constantNumberNode.title_color = basicNodeColor;
constantNumberNode.title_text_color = basicTitleColor;
constantNumberNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for define a random number.
*	@method randomNumberNode
*/
function randomNumberNode() {
	this.properties = { min: 0.0, max: 1.0 }
    
    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create a random number. The random number will be changed every frame.";

    this.prop_desc = {
    	min: "The minimum value of the number",
    	max: "The maximum value of the number"
    }

	this.addInput("Min value", "number");
	this.addInput("Max value", "number");

	this.addOutput("Number", "number");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
randomNumberNode.prototype.onPropertyChanged = function()
{
	var min = this.properties.min;
	var max = this.properties.max;
	this.properties.min = isNaN(min) ? 0.0 : min; 
	this.properties.max = isNaN(max) ? 1.0 : max; 
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
randomNumberNode.prototype.onExecute = function() 
{
	this.properties.min = Math.min(this.getInputData(0), this.getInputData(1)) || this.properties.min;
	this.properties.max = Math.max(this.getInputData(0), this.getInputData(1)) || this.properties.max;

	var random = Math.random() * (this.properties.max - this.properties.min) + this.properties.min;
	this.setOutputData(0, random);
}

randomNumberNode.title = "Random Number";
randomNumberNode.title_color = basicNodeColor;
randomNumberNode.title_text_color = basicTitleColor;
randomNumberNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for create a vector of 2 components
*	@method vector2Node
*/
function vector2Node() {
	this.properties = { x: 0.0, y: 0.0 }

	this.data = new Float32Array(2);

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create a vector of two components.";

    this.prop_desc = {
    	x: "The value of the x component",
    	y: "The value of the y component"
    }

	this.addInput("X", "number");
	this.addInput("Y", "number");

	this.addOutput("Vec2", "vec2");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
vector2Node.prototype.onPropertyChanged = function()
{
	var x = this.properties.x;
	var y = this.properties.y;

	this.properties.x = isNaN(x) ? 0.0 : x; 
	this.properties.y = isNaN(y) ? 0.0 : y; 
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
vector2Node.prototype.onExecute = function() 
{
	this.properties.x = this.getInputData(0) || this.properties.x;
	this.properties.y = this.getInputData(1) || this.properties.y;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;

	this.setOutputData(0, this.data);
};

vector2Node.title = "Vector 2";
vector2Node.title_color = basicNodeColor;
vector2Node.title_text_color = basicTitleColor;
vector2Node.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for create a vector of 3 components
*	@method vector3Node
*/
function vector3Node() {
	this.properties = { x: 0.0, y: 0.0, z: 0.0 }

	this.data = new Float32Array(3);

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create a vector of three components.";

    this.prop_desc = {
    	x: "The value of the x component",
    	y: "The value of the y component",
    	z: "The value of the z component"
    }

	this.addInput("X", "number");
	this.addInput("Y", "number");
	this.addInput("Z", "number");

	this.addOutput("Vec3", "vec3");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
vector3Node.prototype.onPropertyChanged = function()
{
	var x = this.properties.x;
	var y = this.properties.y;
	var z = this.properties.z;
	
	this.properties.x = isNaN(x) ? 0.0 : x; 
	this.properties.y = isNaN(y) ? 0.0 : y; 
	this.properties.z = isNaN(z) ? 0.0 : z; 
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
vector3Node.prototype.onExecute = function() 
{
	this.properties.x = this.getInputData(0) || this.properties.x;
	this.properties.y = this.getInputData(1) || this.properties.y;
	this.properties.z = this.getInputData(2) || this.properties.z;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;
	this.data[2] = this.properties.z;

	this.setOutputData(0, this.data);
};

vector3Node.title = "Vector 3";
vector3Node.title_color = basicNodeColor;
vector3Node.title_text_color = basicTitleColor;
vector3Node.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for create a vector of 4 components
*	@method vector4Node
*/
function vector4Node() {
	this.properties = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 }

	this.data = new Float32Array(4);

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create a vector of four components.";

    this.prop_desc = {
    	x: "The value of the x component",
    	y: "The value of the y component",
    	z: "The value of the z component",
    	w: "The value of the w component"
    }

	this.addInput("X", "number");
	this.addInput("Y", "number");
	this.addInput("Z", "number");
	this.addInput("W", "number");

	this.addOutput("Vec4", "vec4");
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
vector4Node.prototype.onPropertyChanged = function()
{
	var x = this.properties.x;
	var y = this.properties.y;
	var z = this.properties.z;
	var w = this.properties.w;
	
	this.properties.x = isNaN(x) ? 0.0 : x; 
	this.properties.y = isNaN(y) ? 0.0 : y; 
	this.properties.z = isNaN(z) ? 0.0 : z; 
	this.properties.w = isNaN(w) ? 0.0 : w; 
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
vector4Node.prototype.onExecute = function() 
{
	this.properties.x = this.getInputData(0) || this.properties.x;
	this.properties.y = this.getInputData(1) || this.properties.y;
	this.properties.z = this.getInputData(2) || this.properties.z;
	this.properties.w = this.getInputData(3) || this.properties.w;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;
	this.data[2] = this.properties.z;
	this.data[3] = this.properties.w;

	this.setOutputData(0, this.data);
};

vector4Node.title = "Vector 4";
vector4Node.title_color = basicNodeColor;
vector4Node.title_text_color = basicTitleColor;
vector4Node.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function textureLoadNode() {
	this.properties = { 
		default_texture: "NONE",
		subtextures: false,
		textures_x: 1,
		textures_y: 1,
		animated: false,
		anim_loop: false,
		anim_duration: 0
	}
	
	this.file = undefined;
	this.data_loaded = false;

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to load a default texture for the particles\
    of a system or load a custom one from local in that case, you will have to save it because the next time you load\
    the graph, you will need it. Instead of loading a normal texture, atlas and animated textures are supported.";

    this.prop_desc = {
    	default_texture: "If a default texture is loaded, then his name will be saved here",
    	subtextures:     "This is to know if the loaded texture is an atlas of textures",
    	textures_x:      "The number of textures in the x coordinate of the atlas",
		textures_y:      "The number of textures in the y coordinate of the atlas",
    	animated:        "This is to know if the loaded texture is an animated texture",
    	anim_loop:       "This option enables the possibility to create a loop of the animation",
    	anim_duration:   "If the anim_loop is true, then you can say how many seconds this animation lasts"

    }

	var that = this;

	this.addWidget("button", "Select texture", "", function(){
		loadTexture(that);
	});

	this.addWidget("toggle", "Sub textures", false, this.changeSubTexture.bind(this));

	this.addOutput("Texture", "texture");
};

/*
* 	Show the widgets fot the animated textures and enable disable if a texture is animated
*	@method changeAnimated
*	@params {Bool} if the texture is animated or no
*	@params {Bool} if the value is changed manually (to avoid recalculate in chase that the user put the same value)
*/
textureLoadNode.prototype.changeAnimated = function(v, manual_prop = false)
{
	var properties = this.properties;

	if(properties.animated == v && !manual_prop)
		return;

	properties.animated = v;

	if(v){
		this.animlW = this.addWidget("toggle", "Animation loop", properties.anim_loop, this.changeAnimLoop.bind(this));
		
		if(properties.anim_loop)	
			this.animdW = this.addWidget("number", "Animation time", properties.anim_duration, this.changeAnimDuration.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step:0.01});
	} else {
		this.widgets.splice(5,2);
		this.size[1] = 154;
	}

	this.size[0] = 260;

	if(this.data_loaded)
	   	this.size[1] += 112;
}

/*
* 	Show the widgets for the loop animated textures and enable disable if a texture is animation looped
*	@method changeAnimLoop
*	@params {Bool} if the texture is looped or no
*	@params {Bool} if the value is changed manually
*/
textureLoadNode.prototype.changeAnimLoop = function(v, manual_prop = false)
{
	var properties = this.properties;

	if(properties.anim_loop == v && !manual_prop)
		return;

	properties.anim_loop = v;

	if(v){
		this.animdW  = this.addWidget("number", "Animation time", properties.anim_duration, this.changeAnimDuration.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step:0.01});
	} else {
		this.widgets.splice(6,1);
		this.size[1] = 178;
	}

	this.size[0] = 260;
	if(this.data_loaded)
	   	this.size[1] += 112;
}

/*
* 	Add all the widgets 
*	@method addWidgets
*/
textureLoadNode.prototype.addWidgets = function() 
{
	var properties = this.properties;

	this.subxW   = this.addWidget("number", "Textures in x", properties.textures_x, this.changeTexturesX.bind(this), {min: 1, max: Number.MAX_SAFE_INTEGER, step: 10});
	this.subyW   = this.addWidget("number", "Textures in y", properties.textures_y, this.changeTexturesY.bind(this), {min: 1, max: Number.MAX_SAFE_INTEGER, step: 10});

	this.animW   = this.addWidget("toggle", "Animated texture", properties.animated, this.changeAnimated.bind(this));

	if(properties.animated)
	{
		this.animlW = this.addWidget("toggle", "Animation loop", properties.anim_loop, this.changeAnimLoop.bind(this));
		
		if(properties.anim_loop)	
			this.animdW = this.addWidget("number", "Animation time", properties.anim_duration, this.changeAnimDuration.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step:0.01});
	}

	this.size[0] = 260;

	if(this.data_loaded)
	    this.size[1] += 112;
};

/*
* 	Show the widgets for the sub textures and enable disable if a texture is an atlas
*	@method changeSubTexture
*	@params {Bool} if the texture is an atlas or no
*	@params {Bool} if the value is changed manually
*/
textureLoadNode.prototype.changeSubTexture = function(v, manual_prop = false)
{
	if(this.properties.subtextures == v && !manual_prop)
		return;

	this.properties.subtextures = v;

	if (this.properties.subtextures) {
		this.addWidgets();
	} else {
		this.widgets.splice(2,7);
		this.size[0] = 210;
		this.size[1] = 80;

		if(this.data_loaded)
	    	this.size[1] += 112;
	}
}

/*
* 	The behaviour done when the texture is finally loaded
*	@method afterLoading
*	@params {Texture} The texture
*	@params {String} The url of the texture
*/
textureLoadNode.prototype.afterLoading = function(texture, url)
{
	//In chase that the texture is of an invalid size, show an alert 
	if(texture.width > gl.MAX_TEXTURE_SIZE || texture.height > gl.MAX_TEXTURE_SIZE)
	{
		createAlert('Holy Guacamole!','Loading error','The texture is too big','danger',true,true,'pageMessages')
	    return;
	}
	
	//Transform the texture to power of 2 (code by Javi Agengo http://tamats.com/apps/texturetools/)
	//Get the most closets (and bigger) power of two
	var w = Math.pow(2,Math.round(Math.log(texture.width)/Math.log(2)));
	var h = Math.pow(2,Math.round(Math.log(texture.height)/Math.log(2)));

	//If the width or the height are different then a new Texture is created
	if(w != texture.width || h != texture.height)
	{
		var new_texture = new GL.Texture(w, h, {format:gl.RGBA, magFilter: gl.NEAREST});
		texture.copyTo(new_texture);
		new_texture.data = texture.data;
		texture = new_texture;
	}

	this.file = texture;

	if(!this.data_loaded)
    	this.size[1] += 112;

	this.data_loaded = true;
}

/*
* 	Change the duration of the animtion 
*	@method changeAnimDuration
*	@params {Number} The seconds of the animation
*/
textureLoadNode.prototype.changeAnimDuration = function(v)
{
	this.properties.anim_duration = Math.max(isNaN(v) ? 1 : v, 1);
}

/*
* 	Change the numbers of textures in the component X in the atlas
*	@method changeTexturesX
*	@params {Number} The number of textures
*/
textureLoadNode.prototype.changeTexturesX = function(v)
{
	this.properties.textures_x = Math.floor(Math.max(isNaN(v) ? 1 : v, 1));
	
	if(this.subxW != undefined)
		this.subxW.value = this.properties.textures_x;
}

/*
* 	Change the numbers of textures in the component Y in the atlas
*	@method changeTexturesY
*	@params {Number} The number of textures
*/
textureLoadNode.prototype.changeTexturesY = function(v)
{
	this.properties.textures_y = Math.floor(Math.max(isNaN(v) ? 1 : v, 1));

	if(this.subyW != undefined)
		this.subyW.value = this.properties.textures_y;
}

/*
* 	In order to show to the users the loaded texture it's mandatory to overload the onDrawBackground
*	@method onDrawBackground
*	@params {Context} The context of the node
*/
textureLoadNode.prototype.onDrawBackground = function(ctx)
{
	//if the data is not loaded we don't have anithing to show
	if (!this.data_loaded)
		return;
  	//if the data is undedifined is still loading (2nd check)
  	if(this.file.data == undefined)
  		return;

  	//The title is drawed
    ctx.fillStyle = "rgb( 255 , 255 , 255)"; 
    ctx.font = "normal " + LiteGraph.NODE_SUBTEXT_SIZE + "px Arial";  
    ctx.fillText("Loaded texture", (this.size[0]-84)*0.5, this.size[1] - 100);

  	//The rectangle that encompasses the image is drawed
	ctx.strokeStyle = "rgb( 255 , 255 , 255)";    
	ctx.beginPath();
	ctx.rect((this.size[0]-80)*0.5, this.size[1] - 90, 80, 80);
	ctx.stroke();

	//The image is drawed
	ctx.drawImage(this.file.data, (this.size[0]-60)*0.5, this.size[1] - 80, 60, 60);	
};

/*
* 	For show the values when a graph is loaded, when the user change 
*	@method onPropertyChanged 
*	the properties using the window of properties and when the node is cloned
*	@params {String} The name of the changed property
*/
textureLoadNode.prototype.onPropertyChanged = function(property)
{
	var properties = this.properties;

	switch(property)
	{
		case "default_texture":
			switch (properties.default_texture)
			{
				case "smoke":
					chargeTexture(this, properties, 'default_textures/particles/smoke.png', 'smoke');
				break;
				
				case "smoke2":
					chargeTexture(this, properties, 'default_textures/particles/smoke2.png', 'smoke2');
				break;
				
				case "fire":
					chargeTexture(this, properties, 'default_textures/particles/fire.png', 'fire');
				break;
				
				case "light":
					chargeTexture(this, properties, 'default_textures/particles/light.png', 'light');
				break;

				case "AnimatedExplosion":
					chargeTexture(this, properties, 'default_textures/particles/AnimatedExplosion.png', 'AnimatedExplosion');
				break;

				default:
					createAlert('','','Please reload your texture.','warning',true,true,'pageMessages');
				break;
			}
		break;

		case "subtextures":
			this.widgets[1].value = properties.subtextures;

			this.widgets.splice(2,5);
			this.size[0] = 210;
			this.size[1] = 80;

			if(!properties.subtextures)
			{
				if(this.data_loaded)
				    this.size[1] += 112;
			
				break;
			}

			this.addWidgets();

			properties.textures_x = Math.floor(Math.max(0.0, properties.textures_x));
			properties.textures_y = Math.floor(Math.max(0.0, properties.textures_y));
			this.subxW.value = properties.textures_x;
			this.subyW.value = properties.textures_y;
			//this.computeSubTextures();
		break;

		case "textures_x":
			this.changeTexturesX(properties.textures_x);
		break;

		case "textures_y":
			this.changeTexturesY(properties.textures_y);
		break;

		case "animated":
			if(!properties.subtextures)
				break;
			
			if(!properties.animated)
			{
				this.widgets.splice(5,2);
				this.size[1] = 154;

				if(this.data_loaded)
				    this.size[1] += 112;
			}

			this.changeAnimated(properties.animated, true)
			this.animW.value = properties.animated;
		break;

		case "anim_loop":
			if(!properties.subtextures || !properties.animated)
				break;

			if(this.animlW == undefined)
			{
				this.animlW = this.addWidget("toggle", "Animation loop", properties.anim_loop, this.changeAnimLoop.bind(this));
				this.size[0] = 260;

				//if(this.data_loaded)
				//    this.size[1] += 112;
			}
			
			this.changeAnimLoop(properties.anim_loop, true);
			this.animlW.value = properties.anim_loop;
		break;


		case "anim_duration":
			if(!properties.subtextures || !properties.animated || !properties.anim_loop)
				break;

			var d = properties.anim_duration;
			properties.anim_duration =  Math.max(isNaN(d) ? 0 : d, 0);

			if(this.animdW == undefined)
			{
				this.animdW = this.addWidget("number", "Animation time", properties.anim_duration, this.changeAnimDuration.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step:0.01});
				this.size[0] = 260;

				//if(this.data_loaded)
				//    this.size[1] += 112;
			}
			
			this.animdW.value = properties.anim_duration;
		break;
	}
};

/*
* 	What the node does every frame
*	@method onExecute 
*/
textureLoadNode.prototype.onExecute = function()
{
	this.setOutputData(0, {prop: this.properties, file: this.file});
};

textureLoadNode.title = "Load Texture";
textureLoadNode.title_color = basicNodeColor;
textureLoadNode.title_text_color = basicTitleColor;
textureLoadNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a mesh.
*	@method meshLoadNode
*/
function meshLoadNode() {
	this.properties = { 
		name       : "",
		position   : [0,0,0],
		scale      : [1,1,1],
		rotation   : [0,0,0],
		color      : [1,1,1,0.25],
		visibility : true
	}

	this.last_model = {
		position: [0,0,0],
		scale   : [1,1,1],
		rotation: [0,0,0]
	}

	this.last_name = undefined;
	this.n_size    = 184;
	this.loaded    = false;
	this.meshNames = ["pango", "cylinder", "plane", "dodo", "cube", "cone", "pi", "sphere", "ico"]

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to load a default mesh or load from the internet using an URL.\
    In that case, you will have to save it because the next time you load the graph, you will need it.";

    this.prop_desc = {
    	name:       "If a default mesh is loaded, then his name will be saved here",
    	position:   "The position of the mesh",
    	scale:      "The scale in the components xyz of the mesh",
		rotation:   "The rotation, in degrees, in the components xyz of the mesh",
    	color:      "The color of the mesh",
    	visibility: "If the mesh is visible"
    }

	var that = this;

	this.addWidget("button", "Select mesh", "", 
		function() 
		{
			loadMesh(that);
		}
	);
	
	//This widget allows to enable/disable the visibility of the mesh
	this.show_widget  = this.addWidget("toggle", "Show mesh", true, this.toogleVisibility.bind(this));

	this.addInput("Position", "vec3");
	this.addInput("Scale"   , "vec3");
	this.addInput("Rotation", "vec3");
	this.addInput("Color", "color");
	
	this.addOutput("Mesh"  , "mesh");
}


/*
* 	Enable/Disable the visibility of the mesh
*	@method toogleVisibility
*	@params {Bool} If the mesh is visible
*/
meshLoadNode.prototype.toogleVisibility = function(v)
{
	this.properties.visibility = v;
	this.show_widget.value     = v;

	if(this.object != undefined)
		this.object.visibility = v;
}


/*
* 	The behaviour done when the mesh is finally loaded
*	@method onMeshLoaded
*	@params {Mesh} The loaded mesh
*	@params {Bool} If the texture is a plane
*/
meshLoadNode.prototype.onMeshLoaded = function(loaded_mesh, plane = false)
{
	if(loaded_mesh == undefined)
	{
		createAlert('Holy Guacamole!','Loading error','Mesh not found...','danger',true,true,'pageMessages')
	    return;
	}
	
    if(this.temp_name != undefined)
    {
    	this.properties.name = this.temp_name;
	    this.last_name = this.properties.name;
		this.size[1]   = this.n_size;
		this.temp_name = undefined;
    }

	if(this.object == undefined)
	{
		objects_list.push({id: this.id, mesh: this.mesh, model: mat4.create(), color: this.properties.color,
							visibility: this.properties.visibility});
		this.object = searchObject(this.id);	
	}

	this.object.mesh  = loaded_mesh;
	this.mesh         = this.object.mesh
	this.triangle_num = this.mesh.vertexBuffers.vertices.data.length / (plane ? 6 : 9); //3 coordinates by 3 points of a triangle or 2 coordinates (plane) by 3 points of a triangle 	
}

/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
meshLoadNode.prototype.onAdded = function()
{
	//Add the mesh to the object list
	if(this.object == undefined)
	{
		objects_list.push({id: this.id, mesh: this.mesh, model: mat4.create(), color: this.properties.color,
							visibility: this.properties.visibility});
		this.object = searchObject(this.id);	
	}
	
	this.model  = this.object.model;
	this.triangle_num = 0;
}

/*
* 	The behaviour done when the node is removed
*	@method onAdded
*/
meshLoadNode.prototype.onRemoved = function()
{
	searchObject(this.id, true);
}

/*
* 	Change the scale of the mesh
*	@method setScale
*	@params {Vector3} The new scale of the mesh
*/
meshLoadNode.prototype.setScale = function(scale)
{
	if(scale == undefined || scale.length != 3)
		scale = [0,0,0];

	var p_scale = this.last_model.scale;
	
	//avoid the 0 values!!!
	scale[0] = Math.max(scale[0], 0.01);
	scale[1] = Math.max(scale[1], 0.01);
	scale[2] = Math.max(scale[2], 0.01);

	if(p_scale[0] == scale[0] && p_scale[1] == scale[1] && p_scale[2] == scale[2])
		return;
	else
		this.last_model.scale = scale.slice(0); 

	this.properties.scale[0] = Math.max(scale[0], 0.01);
	this.properties.scale[1] = Math.max(scale[1], 0.01);
	this.properties.scale[2] = Math.max(scale[2], 0.01);

	mat4.identity(this.model);
	mat4.rotateX(this.model, this.model, this.properties.rotation[0]*DEG2RAD);
	mat4.rotateY(this.model, this.model, this.properties.rotation[1]*DEG2RAD);
	mat4.rotateZ(this.model, this.model, this.properties.rotation[2]*DEG2RAD);
	mat4.setTranslation(this.model, this.properties.position);
	mat4.scale(this.model, this.model, this.properties.scale);
}

/*
* 	Change the position of the mesh
*	@method setTranslation
*	@params {Vector3} The new position of the mesh
*/
meshLoadNode.prototype.setTranslation = function(position)
{
	if(position == undefined || position.length != 3)
		position = [0,0,0];

	var p_pos = this.last_model.position;
	if(p_pos[0] == position[0] && p_pos[1] == position[1] && p_pos[2] == position[2])
		return;
	else
		this.last_model.position = position.slice(0); 

	this.properties.position = position;
	mat4.setTranslation(this.model, this.properties.position);
}

/*
* 	Change the rotation of the mesh
*	@method setRotation
*	@params {Vector3} The new rotation of the mesh
*/
meshLoadNode.prototype.setRotation = function(rotation)
{
	if(rotation.length != 3)
		rotation = [0,0,0];

	var p_rot = this.last_model.rotation;
	if(p_rot[0] == rotation[0] && p_rot[1] == rotation[1] && p_rot[2] == rotation[2])
		return;
	else
		this.last_model.rotation = rotation.slice(0); 
	
	this.properties.rotation = rotation;
	mat4.identity(this.model);
	mat4.rotateX(this.model, this.model, this.properties.rotation[0]*DEG2RAD);
	mat4.rotateY(this.model, this.model, this.properties.rotation[1]*DEG2RAD);
	mat4.rotateZ(this.model, this.model, this.properties.rotation[2]*DEG2RAD);
	mat4.setTranslation(this.model, this.properties.position);
	mat4.scale(this.model, this.model, this.properties.scale);
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*	@params {String} The name of the changed property
*/
meshLoadNode.prototype.onPropertyChanged = function(property)
{

	var properties = this.properties;

	switch (property)
	{
		case "position":
			this.setTranslation(properties.position);
		break;

		case "rotation":
			this.setRotation(properties.rotation);
		break;

		case "scale":
			this.setScale(properties.scale);
		break;

		case "name":
			var in_names = this.meshNames.includes(properties.name);
			var l_name   = this.last_name;
			var v_mesh   = true; //If the mesh is valid

			if (l_name == undefined && properties.name != l_name)
			{
				if(!this.loaded)
					switch (properties.name)
					{
						case "pango":
							chargeMesh(this, 'default_meshes/pango.obj');
						break;

						case "cylinder":
							this.onMeshLoaded(GL.Mesh.cylinder({radius:0.5}));
						break;

						case "plane":
							this.onMeshLoaded(GL.Mesh.plane(), true);
						break;

						case "dodo":
							chargeMesh(this, 'default_meshes/dodo.obj');
						break;

						case "cube":
							this.onMeshLoaded(GL.Mesh.cube());
						break;

						case "cone":
							this.onMeshLoaded(GL.Mesh.cone({radius:0.5,height:1}));
						break; 

						case "pi":
							chargeMesh(this, 'default_meshes/pi.obj');
						break;

						case "sphere":
							this.onMeshLoaded(GL.Mesh.sphere());
						break;

						case "ico":
							this.onMeshLoaded(GL.Mesh.icosahedron({size:1,subdivisions:1}));
						break;

						default:
							createAlert('','','Please reload your mesh.','warning',true,true,'pageMessages');
							v_mesh   = false;
						break;
					}

				if(v_mesh)
				{
					this.last_name = properties.name;
					this.size[1]   = this.n_size;	
				}
				else
					properties.name = l_name == undefined ? "" : l_name;
			}
			else
				properties.name = l_name == undefined ? "" : l_name;
		break;

		case "color":
			if(properties.color.length != 4)
				properties.color = [1,1,1,1];

			for (var i = 0; i < 4; ++i)
				properties.color[i] = Math.min(Math.max(properties.color[i], 0.0), 1.0);
		break;

		case "visibility":
			this.toogleVisibility(properties.visibility);
		break;
	}
}

/*
* 	In order to show to the users the name of the loaded mesh it's mandatory to overload the onDrawBackground
*	@method onDrawBackground
*	@params {Context} The context of the node
*/
meshLoadNode.prototype.onDrawBackground = function(ctx)
{
	ctx.fillStyle = "rgb( 255 , 255 , 255)"; 
	ctx.font = "normal " + LiteGraph.NODE_SUBTEXT_SIZE + "px Arial";
	
	if(this.last_name != undefined)
	{
		var s = "Mesh loaded: " + this.last_name;
        var offset = 6 * s.length;
    	ctx.fillText(s, (this.size[0]-offset)*0.5, this.size[1] - 24 );
	}  
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
meshLoadNode.prototype.onExecute = function() 
{
	var position = this.properties.position;
	var scale    = this.properties.scale;
	var rotation = this.properties.rotation;

	var input_position = this.getInputData(0);
	var input_scale    = this.getInputData(1);
	var input_rotation = this.getInputData(2);
	var input_color    = this.getInputData(3);

	position = input_position == undefined ? position : input_position.slice(0);
	scale    = input_scale    == undefined ? scale    : input_scale.slice(0);
	rotation = input_rotation == undefined ? rotation : input_rotation.slice(0);
	this.properties.color = input_color == undefined ? this.properties.color : input_color.slice(0);

	this.setTranslation(position);
	this.setScale(scale);
	this.setRotation(rotation);

	this.object.color =	this.properties.color;

	this.setOutputData(0, {
		id: this.id, 
		name: this.properties.name,
		triangle_num: this.triangle_num, 
		vertices: this.mesh != undefined ? this.mesh.vertexBuffers.vertices.data : undefined, 
		model: this.model
	});
}

meshLoadNode.title = "Load Mesh";
meshLoadNode.title_color = basicNodeColor;
meshLoadNode.title_text_color = basicTitleColor;
meshLoadNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for create an equation.
*	@method equationNode
*/
function equationNode() {
	this.properties = { 
		curve_points: [[0.0, 0.0], [1.0, 1.0]]
	}

	this.coef;

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create an equation adding points when\
    you click on the black canvas and move them by dragging it. The equation can be used for the modify property node\
    instead of the linear one. A point on the top equals the value to achieve and, on the bottom, the original one.";

    this.prop_desc = {
    	curve_points:     "The points of the equation"
    }

	this.addOutput("Equation", "equation");
}

/*
* 	To show to the users the equation 
*	@method onDrawBackground
*	@params {Context} The context of the node
*/
equationNode.prototype.onDrawBackground = function(ctx) 
{
	if(!this.flags.collapsed)
	  	this.curve_editor.draw(ctx, this.size, graphCanvas, true);
}

/*
* 	Create the equation given a finite number of points
*	@method generateFunction
*/
equationNode.prototype.generateFunction = function() 
{
	var y = [];
	var x = [];
	var coef = [];
	var local_coef;
	var local_x;
	var points = this.curve_editor.points;

	for(var i = 0; i < points.length; ++i)
	{
		y.push(points[i][1]);
		local_x = [];
		for(var j = points.length-1; j >= 0 ; --j)
		{
			local_x.push(Math.pow(points[i][0], j));
		}
		x.push(local_x);
	}

	x = matrix_invert(x);

	for (var i = 0; i < y.length; ++i)
	{
		local_coef = 0;
		for (var j = 0; j < y.length; ++j)
		{
			local_coef += y[j] * x[i][j];
		}		
		coef.push(local_coef);
	}

	this.coef = coef;
}

/*
* 	Verify that all the points on the equation are valid (between 0 and 1)
*	@method verifyPoints
*/
equationNode.prototype.verifyPoints = function() 
{
	for(var i = 0; i < this.properties.curve_points.length; ++i) {
		for(var j = 0; j < this.properties.curve_points.length; ++j) {
			if (j!=i && this.properties.curve_points[i][0] == this.properties.curve_points[j][0]){
				this.properties.curve_points.splice(i, 1);
				break;
			}
		}
	}	
}

/*
* 	Control what append when the mouse moves over the node
*	@method onMouseMove
*	@params {Event} The event of the mouse
*	@params {Vector3} The local position of the mouse
*	@params {Canvas} The canvas of the equation
*/
equationNode.prototype.onMouseMove = function(e, local_pos, graphCanvas) 
{
	this.curve_editor.onMouseMove(local_pos, graphCanvas);
}

/*
* 	Control what append when the mouse is down over the node
*	@method onMouseDown
*	@params {Event} The event of the mouse
*	@params {Vector3} The local position of the mouse
*	@params {Canvas} The canvas of the equation
*/
equationNode.prototype.onMouseDown = function(e, local_pos, graphCanvas) 
{
	var editor_clicked = this.curve_editor.onMouseDown(local_pos, graphCanvas);
	if(editor_clicked){			
		this.captureInput(editor_clicked);
		this.verifyPoints();
	} 

	return editor_clicked;
}

/*
* 	Control what append when the mouse is up over the node
*	@method onMouseUp
*	@params {Event} The event of the mouse
*	@params {Vector3} The local position of the mouse
*	@params {Canvas} The canvas of the equation
*/
equationNode.prototype.onMouseUp = function(e, local_pos, graphCanvas) 
{
	this.curve_editor.onMouseUp(local_pos, graphCanvas);
	this.verifyPoints();
	this.generateFunction();
	this.captureInput(false);
}

/*
* 	The behaviour done when the node is added
*	@method onAdded
*/
equationNode.prototype.onAdded = function() 
{
	if(this.curve_editor == undefined)
	    this.curve_editor = new LiteGraph.CurveEditor(this.properties.curve_points);

	this.verifyPoints();
	this.generateFunction();
	
	this.curve_editor.margin = 0;
	this.size = [350, 200];
	this.curve_editor.size = this.size;
}

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
equationNode.prototype.onPropertyChanged = function() 
{
	if(this.curve_editor == undefined)
	    this.curve_editor = new LiteGraph.CurveEditor(this.properties.curve_points);

    if(!isArray(this.properties.curve_points[0]))
    {
    	var curve_points = this.properties.curve_points;
    	var length = curve_points.length; 

    	if(length % 2 != 0)
           this.properties.curve_points.splice(length - 1, 1);
            
		var newPoints = [];
		var point     = [];

		for(var i = 0; i < length; i = i + 2)
		{
			point.push(Math.min(Math.max(curve_points[i],0),1));
			point.push(Math.min(Math.max(curve_points[i+1],0),1));

			newPoints.push(point);
			point = [];
		}        	

		this.properties.curve_points = newPoints;
        
    }

	this.curve_editor.points = this.properties.curve_points;
	this.verifyPoints();
	this.generateFunction();
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
equationNode.prototype.onExecute = function() 
{
	this.setOutputData(0, this.coef);
}

equationNode.title = "Equation";
equationNode.title_color = basicNodeColor;
equationNode.title_text_color = basicTitleColor;
equationNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for pick a color.
*	@method colorPickerNode
*/
function colorPickerNode() 
{
	this.properties = { color : [1,1,1,1] }

    this.constructor.desc = "&nbsp;&nbsp;&nbsp;&nbsp; This node allows you to create an RGBA color.";

    this.prop_desc = {
    	color:    "The RGBA components of the color"
    }

	this.rw = this.addWidget("number", "Red",   1, this.setRed.bind(this), {min: 0, max: 1, step: 0.1});
	this.gw = this.addWidget("number", "Gren",  1, this.setBlue.bind(this), {min: 0, max: 1, step:  0.1});
	this.bw = this.addWidget("number", "Blue",  1, this.setGreen.bind(this), {min: 0, max: 1, step: 0.1});
	this.aw = this.addWidget("number", "Alpha", 1, this.setAlpha.bind(this), {min: 0, max: 1, step: 0.1});

	this.addOutput("Color", "color");
}

/*
* 	Make that the background color of the node is the shame than the color picked by the user	
*	@method onDrawBackground
*	@params {Context} The context of the node
*/
colorPickerNode.prototype.onDrawBackground = function(ctx) 
{

    ctx.fillStyle = "rgb(" + (this.properties.color[0] * 255) + "," +
        (this.properties.color[1] * 255) + "," +
        (this.properties.color[2] * 255) +
        ")";

    if (this.flags.collapsed) 
        this.boxcolor = ctx.fillStyle;
    else
        ctx.fillRect(0, 0, this.size[0], this.size[1]);
};

/*
* 	For show the values when a graph is loaded, when the user change 
*	the properties using the window of properties and when the node is cloned
*	@method onPropertyChanged 
*/
colorPickerNode.prototype.onPropertyChanged = function()
{
	if (this.properties.color.length != 4)
		this.properties.color = [1,1,1,1];

	this.properties.color[0] = Math.min(Math.max(this.properties.color[0], 0.0), 1.0);
	this.properties.color[1] = Math.min(Math.max(this.properties.color[1], 0.0), 1.0);
	this.properties.color[2] = Math.min(Math.max(this.properties.color[2], 0.0), 1.0);
	this.properties.color[3] = Math.min(Math.max(this.properties.color[3], 0.0), 1.0);

	this.rw.value = this.properties.color[0];
	this.gw.value = this.properties.color[1];
	this.bw.value = this.properties.color[2];
	this.aw.value = this.properties.color[3];
}

/*
* 	Set the red component of the color
*	@method setRed 
*	@params {Number} The value of the component
*/
colorPickerNode.prototype.setRed = function(v)
{
	this.properties.color[0] = v;
}

/*
* 	Set the blue component of the color
*	@method setBlue 
*	@params {Number} The value of the component
*/
colorPickerNode.prototype.setBlue = function(v)
{
	this.properties.color[1] = v;
}

/*
* 	Set the green component of the color
*	@method setGreen 
*	@params {Number} The value of the component
*/
colorPickerNode.prototype.setGreen = function(v)
{
	this.properties.color[2] = v;
}

/*
* 	Set the alpha component of the color
*	@method setAlpha 
*	@params {Number} The value of the component
*/
colorPickerNode.prototype.setAlpha = function(v)
{
	this.properties.color[3] = v;
}

/*
* 	What the node does every frame
*	@method onExecute 
*/
colorPickerNode.prototype.onExecute = function() 
{
	this.setOutputData(0, this.properties.color);
}

colorPickerNode.title = "Color Picker";
colorPickerNode.title_color = basicNodeColor;
colorPickerNode.title_text_color = basicTitleColor;
colorPickerNode.title_selected_color = basicSelectedTitleColor;