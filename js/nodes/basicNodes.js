/*
* 	This node is for define a constant number.
*	@method constantNumberNode     this.widgets_up = true;
*/
function constantNumberNode() {
	this.properties = { number: 1.0 }

	this.widget = this.addWidget("number", "Number", this.properties.number, this.setValue.bind(this));

	this.addOutput("Number", "number");
}

//For recover (in a visual way) the value when a graph is loaded
constantNumberNode.prototype.onPropertyChanged = function()
{
	this.widget.value = this.properties.number;
}

constantNumberNode.prototype.setValue = function(v)
{
	this.properties.number = v;
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
	this.properties = { min: 0.0, max: 1.0, random: 0.0 }
    
	this.addInput("Min value", "number");
	this.addInput("Max value", "number");

	this.addOutput("Number", "number");
}

randomNumberNode.prototype.onExecute = function() {
	this.properties.min = this.getInputData(0) || 0.0;
	this.properties.max = this.getInputData(1) || 1.0;

	this.properties.random = Math.random() * (this.properties.max - this.properties.min) + this.properties.min;
	this.setOutputData(0, this.properties.random);
}

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

vector2Node.prototype.onExecute = function() {
	this.properties.x = this.getInputData(0) || 0.0;
	this.properties.y = this.getInputData(1) || 0.0;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;

	this.setOutputData(0, this.data);
}

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

vector3Node.prototype.onExecute = function() {
	this.properties.x = this.getInputData(0) || 0.0;
	this.properties.y = this.getInputData(1) || 0.0;
	this.properties.z = this.getInputData(2) || 0.0;

	this.data[0] = this.properties.x;
	this.data[1] = this.properties.y;
	this.data[2] = this.properties.z;

	this.setOutputData(0, this.data);
}

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
}

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
		file: undefined,
		subtextures: false,
		subtextures_size: vector_2
	}

	var that = this;

	this.addWidget("button", "Select texture", "", 
		function()
		{
		// LOAD TEXTURE BEHAVIOUR
		}
	);

	this.addWidget("toggle", "Sub textures", false, 
		function() {
			that.subtextures = !that.subtextures;
			if (that.subtextures) {
				that.addWidget("number", "Sub textures size x", 0, function(){}, {min: 0, max: 10000000, step: 10});
				that.addWidget("number", "Sub textures size y", 0, function(){}, {min: 0, max: 10000000, step: 10});
				that.size[0] = 260;
			} else {
				that.widgets.splice(3,1);
				that.widgets.splice(2,1);
				that.size[0] = 210;
				that.size[1] = 80;
			}
		}
	);


	this.addOutput("Texture", "texture");
}

textureLoadNode.title = "Load Texture";
textureLoadNode.title_color = basicNodeColor;
textureLoadNode.title_text_color = basicTitleColor;
textureLoadNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function meshLoadNode() {
	this.properties = { 
		file: undefined,
		position: vector_3,
		scale: vector_3,
		rotation: vector_3
	}

	this.addWidget("button", "Select mesh", "", 
		function()
		{
		// LOAD TEXTURE BEHAVIOUR
		}
	);

	this.addInput("Position", "vec3");
	this.addInput("Scale"   , "vec3");
	this.addInput("Rotation", "vec3");
	
	this.addOutput("Mesh"  , "mesh");
	this.addOutput("Object", "object");
}

meshLoadNode.title = "Load Mesh";
meshLoadNode.title_color = basicNodeColor;
meshLoadNode.title_text_color = basicTitleColor;
meshLoadNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
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
		type: "Lineal"
	}

	var that = this;

	this.addWidget("combo", "Equation type", "Lineal", 
		function() {
			that.properties.type = this.value;

			//TO DO
		}, 
		{ values:["Lineal", "Exponential"] });

	this.addOutput("Equation", "equation");
}

equationNode.title = "Equation";
equationNode.title_color = basicNodeColor;
equationNode.title_text_color = basicTitleColor;
equationNode.title_selected_color = basicSelectedTitleColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/

function colorPickerMouse (event, [x,y], node){
	if (event.type === "mousemove")
        return false;
    
    setTimeout(function() { node.widgets[0].callback(); }, 20);
}

function colorPickerCallBack (){
	return true;
}

function colorPickerNode() {
	this.properties = { x: 0.0, y: 0.0, z: 0.0, w: 0.0 }

	var colorw = {
		type: "custom",
		name: "color",
		value: 0,
		mouse:    colorPickerMouse,
		callback: colorPickerCallBack,
		options: {},
	} 

	colorw.draw = function (ctx, node, widget_width, y, H) {
		
	    ctx.fillRect(15, y, widget_width - 15 * 2, H);

	}

	this.addCustomWidget(colorw);
	this.addOutput("Color", "color");
}

colorPickerNode.title = "Color Picker";
colorPickerNode.title_color = basicNodeColor;
colorPickerNode.title_text_color = basicTitleColor;
colorPickerNode.title_selected_color = basicSelectedTitleColor;