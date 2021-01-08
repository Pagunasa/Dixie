function mySpawnNode() {
	this.properties = {
		x: 0.0,
		y: 0.0,
		z: 0.0,

        min_lifetime_value: 0.5,
        max_lifetime_value: 0.5,
        
        min_speed_x: 0.5,
        max_speed_x: 0.5,

        min_speed_y: 0.5,
        max_speed_y: 0.5,

        min_speed_z: 0.5,
        max_speed_z: 0.5
    };

    this.time_properties = {
    	min: 0,
        max: 10
    }

    this.speed_properties = {
    	min: -10,
    	max: 10
    }
    
    var that = this;
    this.size = [140, 40];

	this.addInput("Particle number", "number");
	
	/*************************************************/
	/*                  Position                     */
	/*************************************************/
	this.numberX = this.addWidget("number", "Origin-X",
		this.properties.x, function(v) {
			that.properties.x = v;
		});

	this.numberY = this.addWidget("number", "Origin-Y",
		this.properties.y, function(v) {
			that.properties.y = v;
		});

	this.numberZ = this.addWidget("number", "Origin-Z",
		this.properties.z, function(v) {
			that.properties.z = v;
		});

	/*************************************************/
	/*                  Lifetime                     */
	/*************************************************/
	this.sliderMinTime = this.addWidget("slider", "Minimum Lifetime",
		this.properties.min_lifetime_value,
		function(v) {
			that.properties.min_lifetime_value = v;
		}, 
		this.time_properties
	);

	this.sliderMaxTime = this.addWidget("slider", "Maximum Lifetime",
		this.properties.max_lifetime_value,
		function(v) {
			that.properties.max_lifetime_value = v;
		}, 
		this.time_properties
	);

	/*************************************************/
	/*                  SPEED-X                      */
	/*************************************************/

	this.sliderMinSX = this.addWidget("slider", "Minimum speed x",
		this.properties.min_speed_x,
		function(v) {
			that.properties.min_lifetime_value = v;
		}, 
		this.speed_properties
	);

	this.sliderMaxSX = this.addWidget("slider", "Maximum speed x",
		this.properties.max_speed_x,
		function(v) {
			that.properties.max_lifetime_value = v;
		}, 
		this.speed_properties
	);

	/*************************************************/
	/*                  SPEED-Y                      */
	/*************************************************/

	this.sliderMinSY = this.addWidget("slider", "Minimum speed y",
		this.properties.min_speed_y,
		function(v) {
			that.properties.min_lifetime_value = v;
		}, 
		this.speed_properties
	);

	this.sliderMaxSY = this.addWidget("slider", "Maximum speed y",
		this.properties.max_speed_y,
		function(v) {
			that.properties.max_lifetime_value = v;
		}, 
		this.speed_properties
	);
	
	/*************************************************/
	/*                  SPEED-Z                      */
	/*************************************************/

	this.sliderMinSZ = this.addWidget("slider", "Minimum speed z",
		this.properties.min_speed_z,
		function(v) {
			that.properties.min_lifetime_value = v;
		}, 
		this.speed_properties
	);

	this.sliderMaxSZ = this.addWidget("slider", "Maximum speed z",
		this.properties.max_speed_z,
		function(v) {
			that.properties.max_lifetime_value = v;
		}, 
		this.speed_properties
	);

	this.addOutput("Particle array", "array");
}

mySpawnNode.title = "Spawn Particles";

mySpawnNode.prototype.onExecute = function() {
	var a_vertices = [];
	
	a_vertices.push(this.properties.x);
	a_vertices.push(this.properties.y);
	a_vertices.push(this.properties.z);

	mesh = new GL.Mesh({vertices : a_vertices});

	console.log("Hola");
}