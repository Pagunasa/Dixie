/*	Guillem Martínez Jiménez		
*   In this file you can find the exporter
*/
var addConditions = function(list, id)
{
	if(id == -1)
		return;

	var condition = searchCondition(id);
	var c = {};

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

		if (id1 != -1)
			addConditions(c.condition, id1);
		if (id2 != -1)
			addConditions(c.condition, id2);
	}

	list.push(c)
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

var exporter = function()
{
	if(system_list.length == 0)
	{
		export_modal_msg.modal('hide');
		return;
	}

	//To be sure that at least one step of the graph have been
	graph.runStep();

	var exp_file   = [];
	var exp_system = {};
	var system, force, condition, modification;
	var aux_force, aux_cond, aux_mod;
	var aux_sEmittor, sub_emittor;
	var o_mesh, aux_mesh;
	var c_id, condition;
	var p_data;
	
	var atlas_to_download  = [];
	var meshes_to_download = [];

	for (var i = 0; i < system_list.length; ++i)
	{
		system     = system_list[i];
		exp_system = {};

		exp_system.id  = system.id;
		exp_system.uvs = system.uvs;
		
		exp_system.texture_id      = system.texture.id != undefined ? system.texture.id : -1;
		exp_system.total_particles = system.total_particles;
		exp_system.position        = system.position;
		exp_system.particle_data   = system.particle_data;

		exp_system.src_bfact = system.src_bfact;
		exp_system.dst_bfact = system.dst_bfact;

		exp_system.texture_id = system.texture.id;

		if(system.Atlas != undefined)
		{
			exp_system.atlasName = "Atlas"+i+".png";
			atlas_to_download.push({file: exp_system.atlasName, name: "Atlas"+i+".png"});
		}
		else
			exp_system.atlasName = "None";

		exp_system.origin             = system.origin;
		exp_system.spawn_rate         = system.spawn_rate;
		exp_system.spawn_mode         = system.spawn_mode;
		exp_system.particles_per_wave = system.particles_per_wave;
		exp_system.max_particles      = system.max_particles;

		o_mesh = system.origin_mesh;

		if(o_mesh == undefined)
			exp_system.origin_mesh = {};
		else
		{
			aux_mesh = searchObject(o_mesh.id);
			exp_system.origin_mesh = {name:  o_mesh.id+"_"+o_mesh.name+".obj", modal: o_mesh.model};
			meshes_to_download.push({file: aux_mesh.mesh, name: o_mesh.id+"_"+o_mesh.name+".obj"});
		}

		var sub_emittors = system.sub_emittors;
		exp_system.sub_emittors  = [];
		for (var j = 0; j < sub_emittors.length; ++j)
		{
			aux_sEmittor = sub_emittors[j];

			sub_emittor            = {};
			sub_emittor.id         = aux_sEmittor.id;
			sub_emittor.texture_id = aux_sEmittor.texture.id != undefined ? aux_sEmittor.texture.id : -1;

			sub_emittor.origin             = aux_sEmittor.origin;
			sub_emittor.spawn_mode         = aux_sEmittor.spawn_mode;

			sub_emittor.max_particles      = aux_sEmittor.max_particles;
			sub_emittor.particles_per_wave = aux_sEmittor.particles_per_wave;

			sub_emittor.texture_id = aux_sEmittor.texture.id;

			sub_emittor.forces        = [];
			sub_emittor.modifications = [];

			//Add the conditions to the sub emittor
			sub_emittor.condition = [];
			addConditions(sub_emittor.condition, aux_sEmittor.condition);

			exp_system.sub_emittors.push(sub_emittor);
		}

		exp_system.forces  = [];
		for (var j = 0; j < forces_list.length; ++j)
		{
			aux_force = forces_list[j];

			if (aux_force.reciever == exp_system.id)
			{
				force = {};
				force.type = aux_force.type;
				force.condition = [];

				//Add the conditions to the force
				addConditions(force.condition, aux_force.condition);

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

		exp_system.modifications = [];
		for (var j = 0; j < modProp_list.length; ++j)
		{
			aux_mod = modProp_list[j];

			if (aux_mod.reciever == exp_system.id)
			{
				modification = {};
				modification.application_mode     = aux_mod.application_mode;
				modification.changed_property     = aux_mod.changed_property;
				modification.equation          	  = aux_mod.equation;
				modification.modification_mode    = aux_mod.modification_mode;
				modification.new_value            = aux_mod.new_value;
				modification.user_defined_seconds = aux_mod.user_defined_seconds;
				modification.user_defined_start   = aux_mod.user_defined_start;

				modification.condition = [];

				//Add the conditions to the force
				addConditions(modification.condition, aux_mod.condition);
			
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
		exp_file.push(exp_system);
	}

	var zip = undefined;
	zip = new JSZip();

	for (var i = 0; i < atlas_to_download.length; ++i)
		addToZip(atlas_to_download[i].file, atlas_to_download[i].name, zip);

	for (var i = 0; i < meshes_to_download.length; ++i)
		addToZip(meshes_to_download[i].file, meshes_to_download[i].name, zip, false);

	exp_file = JSON.stringify(exp_file);
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


/* Link info
    this.id, --> lo puedo ignorar
    this.origin_id,
    this.origin_slot,
    this.target_id,
    this.target_slot,
    this.type --> lo puedo ignorar
*/
/*var exporter = function(graphJson)
{
	if(graphJson == undefined)
		return;
	
	var exp_file  = {};
	var exp_nodes = [];

	var links = graphJson.links;
	var nodes = graphJson.nodes;
	var node, prop, link;
	var inputs, input;
	var outputs, output;
	var aux_node;

	//Info about version app
	exp_file.version = 1.0;


	for (var i = 0; i < nodes.length; ++i)
	{
		aux_node = {}; //Reset the auxiliar node variable

		node    = nodes[i];        //Get the node
		inputs  = node.inputs;     //Get the inputs 
		outputs = node.outputs;    //Get the outputs
		prop	= node.properties; //Get the properties

		//Fill the auxiliar node
		aux_node.id         = node.id;
		aux_node.type       = node.type;
		aux_node.properties = prop;
		aux_node.inputs     = [];
		aux_node.outputs    = [];

		if(inputs != undefined)
			for (var j = 0; j < inputs.length; ++j) {
				input = inputs[j];
				aux_node.inputs.push(
					{
						name: input.name,
						type: input.type,
						slot:          j,
						sender_id:    -1,
						sender_slot:  -1
					}
				);
			}

		if(outputs != undefined)
			for (var j = 0; j < outputs.length; ++j) {
				output = outputs[j];
				aux_node.outputs.push(
					{
						name: output.name,
						type: output.type,
						slot:           j,
						reciever_id:   -1,
						reciever_slot: -1
					}
				);
			}

		exp_nodes.push(aux_node)
	}

	//Fill the inputs and outputs
	var origin_id, origin_slot, target_id, target_slot;

	for (var i = 0; i < exp_nodes.length; ++i) {
		node    = exp_nodes[i];
		outputs = node.outputs;
		inputs  = node.inputs;

		for (var j = 0; j < links.length; ++j)
		{
			link = links[j];

			origin_id   = link[1];
			origin_slot = link[2];
			target_id   = link[3];
			target_slot = link[4];

			//The node sends data
			if(origin_id == node.id)
			{
				for(var k = 0; k < outputs.length; ++k)
				{
					output = outputs[k];
					if(output.slot == origin_slot)
					{
						output.reciever_id   = target_id;
						output.reciever_slot = target_slot;
					}
				} 
			}

			//The node recieves data
			if(target_id == node.id)
			{
				for(var k = 0; k < inputs.length; ++k)
				{
					input = inputs[k];
					if(input.slot == target_slot)
					{
						input.sender_id   = origin_id;
						input.sender_slot = origin_slot;
					}
				} 
			}
		}
	}

	exp_nodes = JSON.stringify(exp_nodes);
	exp_nodes = [exp_nodes];

	var blob = new Blob(exp_nodes, {type: "application/json"});

	var url = window.URL || window.webkitURL;
	link = url.createObjectURL(blob);

	var exportedGraph = document.createElement("a");
	exportedGraph.download = "Graph.json";
	exportedGraph.href = link;

	document.body.appendChild(exportedGraph);
	exportedGraph.click();
	document.body.removeChild(exportedGraph);

	console.log(exp_nodes);
}*/
