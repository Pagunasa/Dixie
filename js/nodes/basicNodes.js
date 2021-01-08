/*
* 	This node is for define a constant number.
*	@method constantNumberNode
*/
function constantNumberNode() {
	this.properties = { number: 0.0 }
    
    var that = this;

	this.value = this.addWidget("number", "Number",
		this.properties.number, 
		function(v) {
			that.properties.number = v;
		}
	);

	this.addOutput("Number", "number");
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

vector2Node.prototype.onExecute = function() {
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
}

textureLoadNode.title = "Load Texture";
textureLoadNode.title_color = basicNodeColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function meshLoadNode() {
}

meshLoadNode.title = "Load Mesh";
meshLoadNode.title_color = basicNodeColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function geometry2DNode() {
}

geometry2DNode.title = "2D Geometry";
geometry2DNode.title_color = basicNodeColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function equationNode() {
}

equationNode.title = "Equation";
equationNode.title_color = basicNodeColor;


/*
* 	This node is for load a texture.
*	@method textureLoadNode
*/
function colorPickerNode() {
}

colorPickerNode.title = "Color Picker";
colorPickerNode.title_color = basicNodeColor;