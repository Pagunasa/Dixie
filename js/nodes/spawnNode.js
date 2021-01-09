/*
*	This node is for define how the particle system spawns the particles
*	@method mySpawnNode
*/
function mySpawnNode() 
{
	/**************************************/
	/***********Node properties************/
	/**************************************/
	this.properties = {
		id: 0,						   //The id of the node (is used for search the sistem and the mesh in the lists)
        max_particles: 100,            //Maximum number of particles allowed
        spawn_rate: 10,     		   //How many particles are spawned every frame
        position: new Float32Array(3), //The origin of the particles (in point mode)
        mode: "Point",      		   //The mode of spawn
        origin_mesh: undefined,        //The mesh from where the particles spawn
        origin_mesh_mode: "Surface",   //The mode of spawn in the mesh
        origin_2d_geometry: undefined  //The geometry 2D from where the particles spawn
    };
   
    this.last_status = {
    	max_particles: 100             //Which was the max_particles in the last change
    };

    var that = this;

	/**************************************/
	/***************Widgets****************/
	/**************************************/
	//This widget allows to change the mode for spawning the particles of the system 
	this.addWidget("combo", "Mode", "Point",  
		function()
		{
			that.mode = this.value;
			//The first two inputs will be always the same, so we have to disconect and delete the third
			that.disconnectInput(2);
			that.inputs.splice(2,1);

			if (that.mode == "Point")
			{
				that.addInput("Position", "vec3"); //if the mode is point the new input must be a vector 3
			}
			else if (that.mode == "Mesh")
			{
				that.addInput("Mesh", "mesh"); //if the mode is mesh the new input must be a mesh
				//This widget allow to change the spawn mode of the mesh
				that.addWidget("combo", "Mesh Spawn Mode", "Surface", function(){}, { values:["Surface", "Volume"] });
				return; //The return is for avoid ti delete the new widget
			}
			else if (that.mode == "2D Geometry")
			{
				that.addInput("Geometry", "2dGeometry"); //if the mode is 2D geometry  the new input must be that geometry
			}

			that.widgets.splice(1,1); //if a change is maked and a seconf widget exist in the node, it must be deleted
		}, 
		{ values:["Point", "Mesh", "2D Geometry"] });


	/**************************************/
	/***********Inputs & Outputs***********/
	/**************************************/
	this.addInput("Max particles", "number");
	this.addInput("Spawn rate"   , "number");
	this.addInput("Position"     , "vec3");

	this.addOutput("Particle system", "particle_system");
}

mySpawnNode.prototype.onAdded = function() 
{
	//Every time that a spawn node is created a new mesh and information about the system have to be added to the list in order to work properly
	this.properties.id = this.id; //the id of this node will be the id of the mesh and the system information 
	createMesh(this.id, this.properties.max_particles);
	system_list.push(new SystemInfo(this.id));
};

mySpawnNode.prototype.onExecute = function() 
{
	//When is executed the inputs are gotten and if they are undefined a default value is setted
	this.properties.max_particles = Math.round(this.getInputData(0)) || 100;
	this.properties.spawn_rate    = Math.round(this.getInputData(1)) || 10;
	this.properties.position      = this.getInputData(2) || new Float32Array(3);

	//Check if the maximum number of particles change, if is true then the array of the particles have to be resized
	if (this.properties.max_particles != this.last_status.max_particles)
	{
		this.last_status.max_particles == this.properties.max_particles;	
		resizeBufferArray(searchMesh(this.id), this.properties.max_particles);
	}

	//The porperties of the node are the output
	this.setOutputData(0, this.properties);
}

mySpawnNode.prototype.onRemoved = function(){
	//When the node is deleted is necesary to search in the list and delete is asigned mesh and information
	searchMesh(this.id, true);
    searchSystem(this.id, true);
}

mySpawnNode.title = "Spawn Particles";
mySpawnNode.title_color = spawnNodeColor;
mySpawnNode.title_text_color = basicTitleColor;
mySpawnNode.title_selected_color = basicSelectedTitleColor;
