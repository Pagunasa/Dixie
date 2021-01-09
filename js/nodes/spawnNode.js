function mySpawnNode() 
{
	this.properties = {
		id: 0,
        max_particles: 100,
        spawn_rate: 10,
        position: new Float32Array(3),
        mode: "Point"
    };
   
    this.last_status = {
    	max_particles: 100
    };

	this.addWidget("combo", "Mode", "Point", function(){
		console.log(this);
	}, { values:["Point", "Mesh", "2D Geometry"] });

	this.addInput("Max particles", "number");
	this.addInput("Spawn rate"   , "number");
	this.addInput("Position"     , "vec3");

	this.addOutput("Particle system", "particle_system");
}

mySpawnNode.prototype.onAdded = function() 
{
	this.properties.id = this.id;
	createMesh(this.id, this.properties.max_particles);
	system_list.push(new SystemInfo(this.id));
};

mySpawnNode.prototype.onExecute = function() 
{
	this.properties.max_particles = this.getInputData(0) || 100;
	this.properties.spawn_rate    = this.getInputData(1) || 10;
	this.properties.position      = this.getInputData(2) || new Float32Array(3);

	if (this.properties.max_particles != this.last_status.max_particles)
	{
		this.last_status.max_particles == this.properties.max_particles;	
		resizeBufferArray(this.id, searchMesh(this.id), this.properties.max_particles);
	}

	this.setOutputData(0, this.properties);
}

mySpawnNode.prototype.onRemoved = function(){
	searchMesh(this.id, true);
    searchSystem(this.id, true);
}

mySpawnNode.title = "Spawn Particles";
