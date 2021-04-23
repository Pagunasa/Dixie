//OBJLoader is required to work
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

//Dixie oficial support for Threejs
class ThreeDixie {

	#json_loader, #obj_loader, #text_loader;
	#systems, #scene;
	#vertexShader, #flatFragment, #textFragment;
	#blending_factors;

	constructor ( scene_ ) {
		if(scene_ == undefined)
		{
			console.error("Dixie error!! \n\n\t Scene not provided \n\n");
			return;
		}

 		this.#json_loader = new THREE.ObjectLoader()
 		this.#obj_loader = new OBJLoader();
 		this.#text_loader = new THREE.TextureLoader();
		this.#systems = new Dixie();
		this.#scene = scene_;

		this.#vertexShader = 
			'attribute vec3 vertices;\
			attribute vec2 coords;\
			attribute vec2 icoord;\
			attribute vec4 colors;\
			attribute vec2 size;\
			attribute float visible;\
			\
			varying vec4 v_color;\
			varying vec3 v_pos;\
			varying vec2 v_coord;\
			varying float v_visible;\
			varying vec4 v_center;\
			\
			uniform vec3 u_up;\
			uniform vec3 u_right;\
			\
			void main() {\
				v_visible = visible;\
				v_coord = coords;\
				v_color = colors;\
				v_center = (modelMatrix * vec4( vertices, 1.0));\
				v_pos = v_center.xyz + u_right * icoord.x * size.x + u_up * icoord.y * size.y;\
				gl_Position = projectionMatrix * viewMatrix * vec4( v_pos, v_center.w );\
			}';

		this.#flatFragment = 
			'varying vec4 v_color;\
			varying float v_visible;\
			\
			void main() {\
				if (v_visible == 0.0) discard;\
				pc_fragColor = v_color;\
			}';

		this.#textFragment =
			'uniform sampler2D u_texture;\
			\
			varying vec4 v_color;\
			varying vec2 v_coord;\
			varying float v_visible;\
			\
			void main() {\
				if (v_visible == 0.0) discard;\
				vec4 color = v_color * texture(u_texture, v_coord);\
				if(color.a < 0.1) discard;\
				pc_fragColor = color;\
			}';

		this.#blending_factors = {
		    "Zero" : THREE.ZeroFactor,
		    "One"  : THREE.OneFactor,
		    "Source Color" : THREE.SrcColorFactor,
		    "One minus source color" : THREE.OneMinusSrcColorFactor,
		    "Destination color" : THREE.DstColorFactor,
		    "One minus destination color" : THREE.OneMinusDstColorFactor,
		    "Source alpha" : THREE.SrcAlphaFactor,
		    "One minus source alpha" : THREE.OneMinusSrcAlphaFactor,
		    "Destination alpha" : THREE.DstAlphaFactor,
		    "One minus destination alpha" : THREE.OneMinusDstAlphaFactor
		}
	}

	load ( url_, file_directory_, name_ = "None" ) {
		if(url_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No url provided \n\n");
			return;
		}

		if(file_directory_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No file directory provided \n\n");
			return;	
		}

		this.#json_loader.load( url_, 
			function ( system ) {
				this.#systems.add( name_, system, this.#createParticleMesh, this.#loadTexture, this.#loadMesh, file_directory_ );
			}
		);
	}

	update ( dt_, eye_ ) {
		this.#systems.update( dt_, eye_, this.#getBufferData, this.#uploadBuffers, this.#orderSystems );
	}

	addToScene () {
		let childrens = this.#scene.children, children;
		let systems = this.#systems;
		let emitters, id;
		let inScene = false;

		for(let i = 0; i < systems.length; ++i)
        {
        	emitters = systems[i].graph.systems;

        	for(let j = 0; j < emitters.length; ++j)
        	{
        		id = emitters[j].id;

        		for(let k = 0; k < childrens.length; ++k)
        		{
        			children = childrens[k];

        			if(children.uuid == id)
        			{
        				inScene = true;
        				break;
        			}
        		}

        		if(!inScene)
        			this.#scene.add(emitters.particle_mesh)
        	}
        }
	}
	
	rotateX ( rad_, name_ = undefined ) {
		if(rad_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No radians provided \n\n");
			return;
		}

		this.#systems.rotateX(rad_, name_, this.#updateRotation);
	}

	rotateY ( rad_, name_ = undefined ) {
		if(rad_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No radians provided \n\n");
			return;
		}

		this.#systems.rotateY(rad_, name_, this.#updateRotation);
	}

	rotateZ ( rad_, name_ = undefined ) {
		if(rad_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No radians provided \n\n");
			return;
		}

		this.#systems.rotateZ(rad_, name_, this.#updateRotation);
	}

	scaleXYZ ( scale_, name_ = undefined ) {
		if(scale_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No scale provided \n\n");
			return;
		}

		if(scale_.length != 3)
		{
			console.error("Dixie error!! \n\n\t Wrong scale, expected an array of length 3 \n\n");
			return;
		}

		this.#systems.scale(scale_, name_, this.#updateScale);
	}

	resetTransforms ( name_ = undefined ) {
		this.#systems.resetTransforms(name_, this.#updateRotationScale);
	}

	resetMove ( name_ ) {
		this.#systems.resetMove(name_);
	}

	move ( pos_, name_ = undefined ) {
		if(pos_ == undefined)
		{
			console.error("Dixie error!! \n\n\t No position provided \n\n");
			return;
		}

		if(pos_.length != 3)
		{
			console.error("Dixie error!! \n\n\t Wrong position, expected an array of length 3 \n\n");
			return;
		}

		this.#systems.move(pos_, name_);
	}

	#getBufferData ( mesh ) {
	    let attributes = mesh.geometry.attributes;

	    let buffers = {};
	    let keys = Object.keys(attributes), key;

	    for (let i = 0; i < keys.length; ++i)
	    {
	        key = keys[i];
	        
	        if(key == "icoord") continue;

	        buffers[key] = attributes[key].array;
	    }

	    return buffers;
	}

	#uploadBuffers ( mesh, buffers ) {
	    let attributes = mesh.geometry.attributes;
	    let keys = Object.keys(attributes), key;

	    for (let i = 0; i < keys.length; ++i)
	    {
	        key = keys[i];

	        if(key == "icoord") continue;

	        attributes[key].array = buffers[key];
	        attributes[key].needsUpdate = true;
	    }
	}

	#orderSystems ( new_order_ ) {
	    let childrens = this.#scene.children, children;
	    let to_order = [];

	    for(let i = 0; i < childrens.length; ++i)
	    {
	    	children = childrens[i];

	    	if(new_order_.some(el => el.id === children.uuid))
	    	{
	    		to_order.push(children);
	    		scene.remove(children);
	    		i--;
	    	}
	    }

	    for(let i = 0; i < new_order_.length; ++i)
	    {
	        for(let j = 0; j < to_order.length; ++j)
	        {
	            if(new_order_[i].id == to_order[j].uuid)
	                this.#scene.add(to_order[j]);
	        }
	    }
	}

    #updateRotation ( id_, modal_, rotation_ ) {
        let childrens = this.#scene.children, children;
        let m = modal_;

        for(let i = 0; i < childrens.length; ++i)
        {
            children = childrens[i];

            if(children.uuid == id_)
            {
                children.matrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
                children.matrixWorldNeedsUpdate = true;
            }
        }
    }

    #updateScale ( id_, modal_, scale_ ) {
        let childrens = this.#scene.children, children;

        for(let i = 0; i < childrens.length; ++i)
        {
            children = childrens[i];

            if(children.uuid == id_)
            {
                children.scale.x = scale_[0];
                children.scale.y = scale_[1]; 
                children.scale.z = scale_[2];  
            }
        }
    }

    #updateRotationScale ( id_, modal_, rotation_, scale_ ) {
        let childrens = this.#scene.children, children;

        for(let i = 0; i < childrens.length; ++i)
        {
            children = childrens[i];

            if(children.uuid == id_)
            {
                children.matrix.elements = modal_;
                children.matrixWorldNeedsUpdate = true;

                children.scale.x = scale_[0];
                children.scale.y = scale_[1]; 
                children.scale.z = scale_[2];  
            }
        }
    }

	#loadMesh ( meshURL, toSaveMesh, toSaveVertices, meshInGraph ) {
	    this.#obj_loader.load( meshURL,
	        function ( object ) {
	            //Update the modal
	            object.matrix.elements = meshInGraph.modal;
	            //Save the mesh in the graph
	            meshInGraph[toSaveMesh] = object;
	            //Save the vertices
	            meshInGraph[toSaveVertices] = object.children[0].geometry.attributes.position.array; 
	        }
	    );
	}

	#loadTexture ( atlasURL, toSave, graph) {
	    this.#text_loader.load( atlasURL,
	        function ( texture ) {
	            graph[toSave] = texture;

	            let material = graph.particle_mesh.material; 
	            material.uniforms.u_texture = {value : texture};
	            material.fragmentShader = this.#textFragment;
	            material.needsUpdate = true;
	        }
	    );
	}

	#createParticleMesh ( buffers, src_bfact_, dst_bfact_, set_id_, t_modal_ ) {
	    //Geometry creation
	    let geometry = new THREE.BufferGeometry();

	    //Attributes of the geometry
	    let data, buffer;

	    for(let i = 0; i < buffers.length; ++i)
	    {
	        buffer = buffers[i];
	        data   = Float32Array.from(buffer.data);
	        geometry.setAttribute( buffer.name, new THREE.BufferAttribute( data, buffer.elems ));
	        
	        if(buffer.name == "vertices")
	            geometry.setAttribute( 'position', new THREE.BufferAttribute( data, buffer.elems ) );
	    }

	    //Shader material
	    let s_material = new THREE.ShaderMaterial( {

	        uniforms: {
	            u_right : { value : camera.up},
	            u_up : { value : camera.up}
	        },

	        vertexShader: this.#vertexShader,
	        fragmentShader: this.#flatFragment
	    } );

	    //Disable cull face
	    s_material.side = THREE.DoubleSide;

	    //Set the blending
	    s_material.blending = THREE.CustomBlending;
	    s_material.blendEquation = THREE.AddEquation;
	    s_material.blendSrc = this.#blending_factors[src_bfact_];
	    s_material.blendDst = this.#blending_factors[dst_bfact_];

	    //Disable the depth test and depth mask
	    s_material.depthTest  = true;
	    s_material.depthWrite = false;

	    //Compute the bounding box (OPTIONAL)
	    geometry.computeBoundingBox();

	    let m = t_modal_;

	    let p_mesh = new THREE.Mesh( geometry, s_material );
	    p_mesh.matrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
	    p_mesh.matrixAutoUpdate = false;

	    //Add the id of the system
	    set_id_(p_mesh.uuid);

	    return p_mesh;
	}
}