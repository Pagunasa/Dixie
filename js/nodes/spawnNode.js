function mySpawnNode() {
	this.properties = {
        max_particles: 100,
        spawn_rate: 10,
        position: new Float32Array(3),
        mode: "Point"
    };
   
    var that = this;

	this.addWidget("combo", "Mode", "Point", function(){}, { values:["Point", "Mesh", "2D Geometry"] });

	this.addInput("Max particles", "number");
	this.addInput("Spawn rate"   , "number");
	this.addInput("Position"     , "vec3");

	this.addOutput("Particle system", "particle_system");
}

mySpawnNode.title = "Spawn Particles";

mySpawnNode.prototype.onExecute = function() {

}