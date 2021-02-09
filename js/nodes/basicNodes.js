/*
* 	This node is for define a constant number.
*	@method constantNumberNode     this.widgets_up = true;
*/
function constantNumberNode() {
	this.properties = { number: 1.0 }

	this.widget = this.addWidget("number", "Number", this.properties.number, this.setValue.bind(this), {step: 0.01});

	this.addOutput("Number", "number");
}

//For recover (in a visual way) the value when a graph is loaded
constantNumberNode.prototype.onPropertyChanged = function()
{
	var number = this.properties.number;
	this.properties.number = isNaN(number) ? 1.0 : number; 
	this.widget.value = this.properties.number;
}

constantNumberNode.prototype.setValue = function(v)
{
	var number = isNaN(v) ? 1.0 : v;
	this.widget.value = number; 
	this.properties.number = number;
}

constantNumberNode.prototype.onDblClick = function()
{
	console.log(this);
}

constantNumberNode.prototype.onExecute = function() {
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
    
	this.addInput("Min value", "number");
	this.addInput("Max value", "number");

	this.addOutput("Number", "number");
}

randomNumberNode.prototype.onPropertyChanged = function()
{
	var min = this.properties.min;
	var max = this.properties.max;
	this.properties.min = isNaN(min) ? 0.0 : min; 
	this.properties.max = isNaN(max) ? 1.0 : max; 
}

randomNumberNode.prototype.onExecute = function() {
	this.properties.min = Math.min(this.getInputData(0), this.getInputData(1)) || 0.0;
	this.properties.max = Math.max(this.getInputData(0), this.getInputData(1)) || 1.0;

	var random = Math.random() * (this.properties.max - this.properties.min) + this.properties.min;
	this.setOutputData(0, random);
};

randomNumberNode.title = "Random Number";
randomNumberNode.title_color = basicNodeColor;
randomNumberNode.title_text_color = basicTitleColor;
randomNumberNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function vector2Node() {
	this.properties = { x: 0.0, y: 0.0 }

	this.data = new Float32Array(2);

	this.addInput("X", "number");
	this.addInput("Y", "number");

	this.addOutput("Vec2", "vec2");
}

vector2Node.prototype.onPropertyChanged = function()
{
	var x = this.properties.x;
	var y = this.properties.y;

	this.properties.x = isNaN(x) ? 0.0 : x; 
	this.properties.y = isNaN(y) ? 0.0 : y; 
}

vector2Node.prototype.onExecute = function() {
	this.properties.x = this.getInputData(0) || 0.0;
	this.properties.y = this.getInputData(1) || 0.0;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;

	this.setOutputData(0, this.data);
};

vector2Node.title = "Vector 2";
vector2Node.title_color = basicNodeColor;
vector2Node.title_text_color = basicTitleColor;
vector2Node.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function vector3Node() {
	this.properties = { x: 0.0, y: 0.0, z: 0.0 }

	this.data = new Float32Array(3);

	this.addInput("X", "number");
	this.addInput("Y", "number");
	this.addInput("Z", "number");

	this.addOutput("Vec3", "vec3");
}

vector3Node.prototype.onPropertyChanged = function()
{
	var x = this.properties.x;
	var y = this.properties.y;
	var z = this.properties.z;
	
	this.properties.x = isNaN(x) ? 0.0 : x; 
	this.properties.y = isNaN(y) ? 0.0 : y; 
	this.properties.z = isNaN(z) ? 0.0 : z; 
}

vector3Node.prototype.onExecute = function() {
	this.properties.x = this.getInputData(0) || 0.0;
	this.properties.y = this.getInputData(1) || 0.0;
	this.properties.z = this.getInputData(2) || 0.0;

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
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function vector4Node() {
	this.properties = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 }

	this.data = new Float32Array(4);

	this.addInput("X", "number");
	this.addInput("Y", "number");
	this.addInput("Z", "number");
	this.addInput("W", "number");

	this.addOutput("Vec4", "vec4");
}

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

vector4Node.prototype.onExecute = function() {
	this.properties.x = this.getInputData(0) || 0.0;
	this.properties.y = this.getInputData(1) || 0.0;
	this.properties.z = this.getInputData(2) || 0.0;
	this.properties.w = this.getInputData(3) || 0.0;

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
		animated: false,
		anim_loop: false,
		anim_duration: 0,
		subtextures_size: [0,0]
	}
	
	this.file = undefined;
	this.data_loaded = false;
	this.numberTextX = 0;
	this.numberTextY = 0;

	var that = this;

	this.addWidget("button", "Select texture", "", function(){
		loadTexture(that);
	});

	this.addWidget("toggle", "Sub textures", false, this.changeSubTexture.bind(this));

	this.addOutput("Texture", "texture");
};

textureLoadNode.prototype.changeAnimated = function(v, manual_prop = false){
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

textureLoadNode.prototype.changeAnimLoop = function(v, manual_prop = false){
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

textureLoadNode.prototype.addWidgets = function() {
	var properties = this.properties;

	this.subxW   = this.addWidget("number", "Sub textures size x", properties.subtextures_size[0], this.changeSubTextureSizeX.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step: 10});
	this.subyW   = this.addWidget("number", "Sub textures size y", properties.subtextures_size[1], this.changeSubTextureSizeY.bind(this), {min: 0, max: Number.MAX_SAFE_INTEGER, step: 10});

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

textureLoadNode.prototype.changeSubTexture = function(v, manual_prop = false){
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

textureLoadNode.prototype.afterLoading = function(texture, url){
	this.file = texture;
	this.computeSubTextures();
}

textureLoadNode.prototype.computeSubTextures = function(){			
	//if the data is not loaded we don't have anithing to show
	if (!this.data_loaded)
		return;
  	//if the data is undedifined is still loading (2nd check)
  	if(this.file.data == undefined)
  		return;
	
	var sizes = this.properties.subtextures_size;
	
  	this.numberTextX = sizes[0] != 0 ? Math.floor(this.file.width  / sizes[0]) : 0;
  	this.numberTextY = sizes[1] != 0 ? Math.floor(this.file.height / sizes[1]) : 0;
} 

textureLoadNode.prototype.changeAnimDuration = function(v){
	this.properties.anim_duration = Math.max(isNaN(v) ? 0 : v, 0);
}

textureLoadNode.prototype.changeSubTextureSizeX = function(v){
	this.properties.subtextures_size[0] = Math.max(isNaN(v) ? 0 : v, 0);
	this.subxW.value = this.properties.subtextures_size[0];
	this.computeSubTextures();
}

textureLoadNode.prototype.changeSubTextureSizeY = function(v){
	this.properties.subtextures_size[1] = Math.max(isNaN(v) ? 0 : v, 0);
	this.subyW.value = this.properties.subtextures_size[1];
	this.computeSubTextures();
}

//In order to show to the users the loaded texture it's mandatory to
//overload the onDrawBackground
textureLoadNode.prototype.onDrawBackground = function(ctx){
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

textureLoadNode.prototype.onPropertyChanged = function(property) {
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
				break;

			this.addWidgets();

			var subtextures_size = properties.subtextures_size;

			properties.subtextures_size[0] = Math.max(0.0, subtextures_size[0]);
			properties.subtextures_size[1] = Math.max(0.0, subtextures_size[1]);
			this.subxW.value = subtextures_size[0];
			this.subyW.value = subtextures_size[1];
			this.computeSubTextures();
		break;

		case "subtextures_size":		
			if(properties.subtextures_size.length != 2)
				properties.subtextures_size = [0,0];
			else
			{
				var subtextures_size = properties.subtextures_size;
				properties.subtextures_size[0] = Math.max(0.0, subtextures_size[0]);
				properties.subtextures_size[1] = Math.max(0.0, subtextures_size[1]);

                if(!properties.subtextures)
				    break;

				this.subxW.value = subtextures_size[0];
				this.subyW.value = subtextures_size[1];
				this.computeSubTextures();
			}
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

				if(this.data_loaded)
				    this.size[1] += 112;
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

				if(this.data_loaded)
				    this.size[1] += 112;
			}
			
			this.animdW.value = properties.anim_duration;
		break;
	}
};

textureLoadNode.prototype.onExecute = function() {
	this.setOutputData(0, {prop: this.properties, file: this.file, ntx: this.numberTextX, nty: this.numberTextY});
};

textureLoadNode.title = "Load Texture";
textureLoadNode.title_color = basicNodeColor;
textureLoadNode.title_text_color = basicTitleColor;
textureLoadNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a mesh.
*	@method textureLoadNode
*/
function meshLoadNode() {
	this.properties = { 
		position: [0,0,0],
		scale: [1,1,1],
		rotation: [0,0,0]
	}

	this.loaded = false;

	var that = this;

	this.addWidget("button", "Select mesh", "", 
		function() 
		{
			loadMesh(that);
		}
	);

	this.addInput("Position", "vec3");
	this.addInput("Scale"   , "vec3");
	this.addInput("Rotation", "vec3");
	
	this.addOutput("Mesh"  , "mesh");
	this.addOutput("Object", "object");
}

meshLoadNode.prototype.onMeshLoaded = function(loaded_mesh){
	var model;

	this.mesh = loaded_mesh;

	if(!this.loaded){
		model = mat4.create();
		objects_list.push({id: this.id, mesh: this.mesh, model: mat4.create()});
		
		this.model = searchObject(this.id).model;
		this.loaded = true;
	}
	
	this.triangle_num = this.mesh.vertexBuffers.vertices.data.length / 9; //3 coordinates by 3 points of a triangle
}

meshLoadNode.prototype.onAdded = function(){
	/*var that = this;

	this.mesh = new GL.Mesh.fromURL("default_meshes/pango.obj", function(){
		objects_list.push({id: that.id, mesh: that.mesh, model: mat4.create()});
		that.model = searchObject(that.id).model;

		that.triangle_num = that.mesh.vertexBuffers.vertices.data.length / 9; //3 coordinates by 3 points of a triangle
	});*/
}

meshLoadNode.prototype.onRemoved = function(){
	searchObject(this.id, true);
}

meshLoadNode.prototype.onPropertyChanged = function() {
	this.properties.scale[0] = Math.max(this.properties.scale[0], 0.01);
	this.properties.scale[1] = Math.max(this.properties.scale[1], 0.01);
	this.properties.scale[2] = Math.max(this.properties.scale[2], 0.01);

	this.properties.rotation[0] = Math.max(this.properties.rotation[0], 0.0);
	this.properties.rotation[1] = Math.max(this.properties.rotation[1], 0.0);
	this.properties.rotation[2] = Math.max(this.properties.rotation[2], 0.0);

	mat4.identity(this.model);
	mat4.setTranslation(this.model, this.properties.position);
	mat4.scale(this.model, this.model, this.properties.scale);
}

meshLoadNode.prototype.onExecute = function() {
	this.setOutputData(0, {
		id: this.id, 
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
* 	This node is for generate a 2D geometry.
*	@method textureLoadNode
*/
function geometry2DNode() {
	this.properties = { 
		type: "Rectangle",
		position: vector_3,
		rotation: vector_3,
		size: vector_2,
	}

	var that = this;

	this.addWidget("combo", "Geometry", "Rectangle", 
		function() {
			that.properties.type = this.value;

			//TO DO
		}, 
		{ values:["Rectangle", "Triangle", "Circle", "Plane"] });

	this.addInput("Position", "vec3");
	this.addInput("Rotation", "vec3");
	this.addInput("Size"    , "vec2");
	
	this.addOutput("Geometry", "geometry");
	this.addOutput("Object"  , "object");
}


geometry2DNode.title = "2D Geometry";
geometry2DNode.title_color = basicNodeColor;
geometry2DNode.title_text_color = basicTitleColor;
geometry2DNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function equationNode() {
	this.properties = { 
		curve_points: [[0.0, 0.0], [1.0, 1.0]]
	}

	this.coef;

	this.addOutput("Equation", "equation");
}

equationNode.prototype.onDrawBackground = function(ctx) {
	if(!this.flags.collapsed)
	  	this.curve_editor.draw(ctx, this.size, graphCanvas, true);
}

equationNode.prototype.generateFunction = function() {
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

equationNode.prototype.verifyPoints = function() {
	for(var i = 0; i < this.properties.curve_points.length; ++i) {
		for(var j = 0; j < this.properties.curve_points.length; ++j) {
			if (j!=i && this.properties.curve_points[i][0] == this.properties.curve_points[j][0]){
				this.properties.curve_points.splice(i, 1);
				break;
			}
		}
	}	
}

equationNode.prototype.onMouseMove = function(e, local_pos, graphCanvas) {
	this.curve_editor.onMouseMove(local_pos, graphCanvas);
}

equationNode.prototype.onMouseDown = function(e, local_pos, graphCanvas) {
	var editor_clicked = this.curve_editor.onMouseDown(local_pos, graphCanvas);
	if(editor_clicked){			
		this.captureInput(editor_clicked);
		this.verifyPoints();
	} 

	return editor_clicked;
}

equationNode.prototype.onMouseUp = function(e, local_pos, graphCanvas) {
	this.curve_editor.onMouseUp(local_pos, graphCanvas);
	this.verifyPoints();
	this.generateFunction();
	this.captureInput(false);
}

equationNode.prototype.onAdded = function() {
	if(this.curve_editor == undefined)
	    this.curve_editor = new LiteGraph.CurveEditor(this.properties.curve_points);

	this.verifyPoints();
	this.generateFunction();
	
	this.curve_editor.margin = 0;
	this.size = [350, 200];
	this.curve_editor.size = this.size;
}

equationNode.prototype.onPropertyChanged = function() {
	if(this.curve_editor == undefined)
	    this.curve_editor = new LiteGraph.CurveEditor(this.properties.curve_points);

	this.curve_editor.points = this.properties.curve_points;
	this.verifyPoints();
	this.generateFunction();
}

equationNode.prototype.onExecute = function() {
	this.setOutputData(0, this.coef);
}

equationNode.title = "Equation";
equationNode.title_color = basicNodeColor;
equationNode.title_text_color = basicTitleColor;
equationNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function colorPickerNode() {
	this.properties = { color : [1,1,1,1] }

	this.rw = this.addWidget("number", "Red",   1, this.setRed.bind(this), {min: 0, max: 1, step: 0.1});
	this.gw = this.addWidget("number", "Gren",  1, this.setBlue.bind(this), {min: 0, max: 1, step:  0.1});
	this.bw = this.addWidget("number", "Blue",  1, this.setGreen.bind(this), {min: 0, max: 1, step: 0.1});
	this.aw = this.addWidget("number", "Alpha", 1, this.setAlpha.bind(this), {min: 0, max: 1, step: 0.1});

	this.addOutput("Color", "color");
}

colorPickerNode.prototype.onDrawBackground = function(ctx) 
{
	//This is for make that the background color of the node
	//is the shame than the color picked by the user	
    ctx.fillStyle = "rgb(" + (this.properties.color[0] * 255) + "," +
        (this.properties.color[1] * 255) + "," +
        (this.properties.color[2] * 255) +
        ")";

    if (this.flags.collapsed) 
        this.boxcolor = ctx.fillStyle;
    else
        ctx.fillRect(0, 0, this.size[0], this.size[1]);
};

//For recover (in a visual way) the values when a graph is loaded
colorPickerNode.prototype.onPropertyChanged = function()
{
	if (this.properties.color.length != 4)
		this.properties.color = [1,1,1,1];

	this.rw.value = Math.min(Math.max(this.properties.color[0], 0.0), 1.0);
	this.gw.value = Math.min(Math.max(this.properties.color[1], 0.0), 1.0);
	this.bw.value = Math.min(Math.max(this.properties.color[2], 0.0), 1.0);
	this.aw.value = Math.min(Math.max(this.properties.color[3], 0.0), 1.0);
}

colorPickerNode.prototype.onExecute = function() {
	this.setOutputData(0, this.properties.color);
}

colorPickerNode.prototype.setRed = function(v)
{
	this.properties.color[0] = v;
}

colorPickerNode.prototype.setBlue = function(v)
{
	this.properties.color[1] = v;
}

colorPickerNode.prototype.setGreen = function(v)
{
	this.properties.color[2] = v;
}

colorPickerNode.prototype.setAlpha = function(v)
{
	this.properties.color[3] = v;
}

colorPickerNode.title = "Color Picker";
colorPickerNode.title_color = basicNodeColor;
colorPickerNode.title_text_color = basicTitleColor;
colorPickerNode.title_selected_color = basicSelectedTitleColor;