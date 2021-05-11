/*	Guillem Martínez Jiménez		
*   In this file you can find the exporter
*/
var addTexture = function(texture)
{
	var t_prop = texture.prop;
	var id   = texture.id == undefined ? -1 : texture.id;
	var file = texture.file;

	if(file == undefined)
		return {
			id: id,
			prop: {
				subtextures   : false,
				textures_x    : 1,
				textures_y    : 1,
				animated      : false,
				anim_loop     : false,
				anim_duration : 0
			}
		}
	else
		return {
			id: id,
			prop: {
				subtextures   : t_prop.subtextures,
				textures_x    : t_prop.textures_x,
				textures_y    : t_prop.textures_y,
				animated      : t_prop.animated,
				anim_loop     : t_prop.anim_loop,
				anim_duration : t_prop.anim_duration
			}
		}
}

var addConditions = function(id)
{
	if(id == -1)
		return true;

	var condition = searchCondition(id);
	var c = {};
	c.id = id;

	if(condition.type == "c")
	{
		c.type     = "condition";
		c.one_time = condition.one_time;
		c.operator = condition.operator;
		c.property = condition.property;
		c.value    = condition.value;
	}
	else if (condition.type == "m")
	{
		c.type       = "merged conditions";
		c.mode       = condition.mode;
		c.conditions = []; 

		var id1 = condition.id_C1;
		var id2 = condition.id_C2;

		if(id1 == -1 && id2 == -1)
			return true;

		if (id1 != -1)
			c.conditions[0] = addConditions(id1);
		if (id2 != -1)
			c.conditions[1] = addConditions(id2);
	}

	return c;
}

var addToZip = function(file, filename, zip, texture = true)
{
	var blob;

	if(texture)
	{
		blob = file.toBlob(true)
		filename = "atlas/"+filename;
	}
	else
	{
		var obj  = file.encode("obj"); 
		blob     = new Blob([obj], {type: "application/plain"});
		filename = "meshes/"+filename;
	}

	zip.file(filename, blob);
}

//Variable for transfrom the values of the blending factors to a string
var blending_factors = {
	0 : "Zero",
	1 : "One",
	768 : "Source Color",
	769 : "One minus source color",
	774 : "Destination color",
	775 : "One minus destination color",
	770 : "Source alpha",
	771 : "One minus source alpha",
	772 : "Destination alpha",
	773 : "One minus destination alpha"
} 

var exportSystems = function()
{
	var exp_file   = {};
	var exp_system = {};
	var system, force, condition, modification;
	var aux_force, aux_cond, aux_mod;
	var aux_sEmittor, sub_emittor;
	var o_mesh, aux_mesh;
	var c_id, condition;
	var p_data, texture, t_prop, taux_prop;
	
	var atlas_to_download  = [];
	var meshes_to_download = [];

	//Save the number of systems
	exp_file["num_systems"] = system_list.length;

	for (var i = 0; i < system_list.length; ++i)
	{
		//Get the system
		system     = system_list[i];
		exp_system = {};

		/********************/
		/*System information*/
		/********************/
		//The id of the system
		exp_system.id  = system.id;
		//The source blending factor for the render
		exp_system.src_bfact = blending_factors[system.src_bfact];
		//The destiny blending factor for the render
		exp_system.dst_bfact = blending_factors[system.dst_bfact];

		//The origin of the particles in the system
		exp_system.origin = system.origin;
		//The original position of the system
		exp_system.position = system.position;

		//The spawn mode of the system
		exp_system.spawn_mode = system.spawn_mode;
		//The total particles of the system considering all the subemitters
		//exp_system.total_particles = system.total_particles;
		//The maximum principal particles of the system
		exp_system.max_particles = system.max_particles;
		//The spawn rate of particles in the system
		exp_system.spawn_rate = system.spawn_rate;
		//How many particles are spawned per wave in the wave mode
		exp_system.particles_per_wave = system.particles_per_wave;


		/***************/
		/*Particle data*/
		/***************/
		//Al the initialization data for the particle in the system
		exp_system.particle_data = system.particle_data;


		/*********************/
		/*Texture information*/
		/*********************/
		//The atlas load
		if(system.atlas != undefined)
		{
			exp_system.atlasName = "Atlas"+i+".png";
			atlas_to_download.push({file: system.atlas, name: exp_system.atlasName});
		}
		else
		{
			exp_system.atlasName = "None";
		}
		//The uvs of every particle in the atlas
		exp_system.uvs = system.uvs;
		//Save the texture with his id and properties
		exp_system.texture = addTexture(system.texture);


		/******************/
		/*Mesh information*/
		/******************/
		//Load the origin mesh of the "principal" particles
		o_mesh = system.origin_mesh;
		//If is not null his name and the model are saved
		if(o_mesh == undefined)
			exp_system.origin_mesh = {name: "None", modal: []};
		else
		{
			aux_mesh = searchObject(o_mesh.id);
			exp_system.origin_mesh = {name:  o_mesh.id+"_"+o_mesh.name+".obj", 
									  modal: o_mesh.model,
									  triangle_num : o_mesh.triangle_num,
									  div_value : o_mesh.name != "plane" ? 9 : 6};
			meshes_to_download.push({file: aux_mesh.mesh, name: o_mesh.id+"_"+o_mesh.name+".obj"});
		}


		/*************/
		/*Subemitters*/
		/*************/
		var sub_emittors = system.sub_emittors;
		exp_system.sub_emittors  = [];
		for (var j = 0; j < sub_emittors.length; ++j)
		{
			aux_sEmittor = sub_emittors[j];
			sub_emittor = {};

			//The id of the sub emitter
			sub_emittor.id = aux_sEmittor.id;
			//The origin of the sub emitter (by now it's useless, only one origin)
			sub_emittor.origin = aux_sEmittor.origin;
			//The spawn mode of the sub emitter (by now it's useless, only one mode)
			sub_emittor.spawn_mode = aux_sEmittor.spawn_mode;
			//The max particles of the subemittor
			sub_emittor.max_particles = aux_sEmittor.max_particles;
			//How many particles per wave spawns the sub emittor
			sub_emittor.particles_per_wave = aux_sEmittor.particles_per_wave;

			//The init data of the particles of the sub emittor
			sub_emittor.particle_data = aux_sEmittor.particle_data;

			//The texture information of the subemittor
			sub_emittor.texture= addTexture(aux_sEmittor.texture);

			//The forces and modifications of the sub emittor
			sub_emittor.forces        = [];
			sub_emittor.modifications = [];

			//Add the conditions to the sub emittor
			sub_emittor.condition = addConditions(aux_sEmittor.condition);
			if(sub_emittor.condition == true)
				sub_emittor.condition = "On particle die"

			exp_system.sub_emittors.push(sub_emittor);
		}


		/********/
		/*Forces*/
		/********/
		exp_system.forces  = [];
		for (var j = 0; j < forces_list.length; ++j)
		{
			aux_force = forces_list[j];

			if (aux_force.reciever == exp_system.id)
			{
				force = {};

				//The type of the force
				force.type = aux_force.type;

				//Fill the force data depending on the type
				switch (force.type)
				{
					case "gravity":
						force.direction = aux_force.direction;
						force.strength  = aux_force.strength;
					break;

					case "vortex":
						force.position      = aux_force.position;
						force.angular_speed = aux_force.angular_speed;
						force.scale         = aux_force.scale;
						force.color         = aux_force.color;
					break;

					case "magnet":
						force.position      = aux_force.position;
						force.strength      = aux_force.strength;
						force.scale         = aux_force.scale;
						force.color         = aux_force.color;
					break;
				}

				//Add the conditions of the force
				force.condition = addConditions(aux_force.condition);

				//Add the force to the system or subemittor
				if (aux_force.subReciever == -1)
					exp_system.forces.push(force);
				else
					for (var k = 0; k < exp_system.sub_emittors.length; ++k)
					{
						if(k == aux_force.subReciever)
							exp_system.sub_emittors[k].forces.push(force);
					}
			}
		}


		/***************/
		/*Modifications*/
		/***************/
		exp_system.modifications = [];
		for (var j = 0; j < modProp_list.length; ++j)
		{
			aux_mod = modProp_list[j];

			if (aux_mod.reciever == exp_system.id)
			{
				modification = {};

				//The changed property
				modification.changed_property = aux_mod.changed_property;
				//The new value of the propety
				modification.new_value = aux_mod.new_value;

				//What operation do with the new value
				modification.application_mode = aux_mod.application_mode;
				//The equation to follow, by default is lineal
				modification.equation = aux_mod.equation || [];

				//If the modification is along the lifetime or defined by the user
				modification.modification_mode = aux_mod.modification_mode;
				//When the changes starts
				modification.user_defined_start = aux_mod.user_defined_start;
				//How long until achieve the final value
				modification.user_defined_seconds = aux_mod.user_defined_seconds;

				//Add the conditions of the modification
				modification.condition = addConditions(aux_mod.condition);
			
				//Add the force to the system or subemittor
				if (aux_mod.subReciever == -1)
					exp_system.modifications.push(modification);
				else
					for (var k = 0; k < exp_system.sub_emittors.length; ++k)
					{
						if(k == aux_mod.subReciever)
							exp_system.sub_emittors[k].modifications.push(modification);
					}
			}
		}

		//Add the system to the file
		exp_file["system_"+i] = exp_system;
	}

	var zip = undefined;
	zip = new JSZip();

	for (var i = 0; i < atlas_to_download.length; ++i)
		addToZip(atlas_to_download[i].file, atlas_to_download[i].name, zip);

	for (var i = 0; i < meshes_to_download.length; ++i)
		addToZip(meshes_to_download[i].file, meshes_to_download[i].name, zip, false);

	exp_file = JSON.stringify(exp_file, null, '\t');
	exp_file = [exp_file];

	var blob = new Blob(exp_file, {type: "application/json"});
	zip.file("Graph.json", blob);

	var jsonGraph = graph.serialize();
	jsonGraph = JSON.stringify(jsonGraph);
	jsonGraph = [jsonGraph];

	blob = new Blob(jsonGraph, {type: "text/plain;charset=utf-8"});
	zip.file("Graph.dx", blob);

	zip.generateAsync({type : "blob"}).then(function(blob)
		{
			var url = window.URL || window.webkitURL;
			link = url.createObjectURL(blob);

			var exportedGraph = document.createElement("a");
			exportedGraph.download = "Graph.zip";
			exportedGraph.href = link;

			document.body.appendChild(exportedGraph);
			exportedGraph.click();
			document.body.removeChild(exportedGraph);

			export_modal_msg.modal('hide');
		});
}

var exporter = function()
{
	if(system_list.length == 0)
	{
		export_modal_msg.modal('hide');
		return;
	}

	//To be sure that at least one step of the graph have been
	$.when(graph.runStep()).then(function(){
		try 
		{
			exportSystems()
		}
		catch (error)
		{
			export_modal_msg.modal('hide');
	    	createAlert('Holy Guacamole!','Error exporting!!','Something goes wrong... Please save the file as DX and contact us via Github.','danger',true,false,'pageMessages')
		}
	});	
}