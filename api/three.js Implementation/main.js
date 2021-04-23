import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

let camera, controls, scene, renderer;
let geometry, material, mesh;
let clock;

//Particles variables
let systems, bufferData;
let right, up;
let secToMs = 1/1000;
let blending_factors = {
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
let particle_system = {
    "num_systems": 1,
    "system_0": {
        "id": 1,
        "src_bfact": "Source alpha",
        "dst_bfact": "One",
        "origin": "Mesh",
        "position": [
            0,
            0,
            0
        ],
        "spawn_mode": "Linear",
        "max_particles": 100,
        "spawn_rate": 10,
        "particles_per_wave": 10,
        "particle_data": {
            "max_speed": [
                0,
                2,
                0
            ],
            "min_speed": [
                0,
                0.5,
                0
            ],
            "max_size": 0.5,
            "min_size": 0.25,
            "max_life_time": 10,
            "min_life_time": 5,
            "color": [
                1,
                1,
                1,
                1
            ]
        },
        "atlasName": "Atlas0.png",
        "uvs": [
            [
                0,
                0,
                0.0625,
                0.06035889070146819
            ],
            [
                0,
                0.06035889070146819,
                1,
                0.8955954323001631
            ],
            [
                0,
                0.9037520391517129,
                1,
                1.0081566068515497
            ]
        ],
        "texture": {
            "id": 1,
            "prop": {
                "subtextures": false,
                "textures_x": 1,
                "textures_y": 1,
                "animated": false,
                "anim_loop": false,
                "anim_duration": 0
            }
        },
        "origin_mesh": {
            "name": "15_plane.obj",
            "modal": [
                10,
                0,
                0,
                0,
                0,
                6.123233998228043e-16,
                10,
                0,
                0,
                -1,
                6.123234262925839e-17,
                0,
                0,
                0,
                0,
                1
            ],
            "triangle_num": 2,
            "div_value": 6
        },
        "sub_emittors": [
            {
                "id": 16,
                "origin": "Point",
                "spawn_mode": "Waves",
                "max_particles": 10,
                "particles_per_wave": 10,
                "particle_data": {
                    "max_speed": [
                        0.15,
                        0.15,
                        0.15
                    ],
                    "min_speed": [
                        -0.15,
                        -0.15,
                        -0.15
                    ],
                    "max_size": 1,
                    "min_size": 0.5,
                    "max_life_time": 2,
                    "min_life_time": 1,
                    "color": [
                        1,
                        1,
                        1,
                        1
                    ],
                    "position": [
                        -0.5599990909009867,
                        9.511611019512486,
                        -0.5274700346948391
                    ]
                },
                "texture": {
                    "id": 2,
                    "prop": {
                        "subtextures": true,
                        "textures_x": 6,
                        "textures_y": 1,
                        "animated": true,
                        "anim_loop": false,
                        "anim_duration": 0
                    }
                },
                "forces": [
                    {
                        "type": "gravity",
                        "direction": [
                            0,
                            -1,
                            0
                        ],
                        "strength": 2,
                        "condition": true
                    }
                ],
                "modifications": [],
                "condition": "On particle die"
            }
        ],
        "forces": [],
        "modifications": []
    }
};
let fire_system = {
    "num_systems": 3,
    "system_0": {
        "id": 64,
        "src_bfact": "Source alpha",
        "dst_bfact": "One",
        "origin": "Point",
        "position": [
            0,
            0,
            0
        ],
        "spawn_mode": "Linear",
        "max_particles": 100,
        "spawn_rate": 10,
        "particles_per_wave": 10,
        "particle_data": {
            "max_speed": [
                0.25,
                1,
                0.25
            ],
            "min_speed": [
                -0.25,
                0.5,
                -0.25
            ],
            "max_size": 4,
            "min_size": 2,
            "max_life_time": 7,
            "min_life_time": 5,
            "color": [
                0.972,
                0.945,
                0.549,
                1
            ]
        },
        "atlasName": "Atlas0.png",
        "uvs": [
            [
                0,
                0,
                0.0625,
                0.06739526411657559
            ],
            [
                0,
                0.06739526411657559,
                1,
                1
            ]
        ],
        "texture": {
            "id": 1,
            "prop": {
                "subtextures": false,
                "textures_x": 1,
                "textures_y": 1,
                "animated": false,
                "anim_loop": false,
                "anim_duration": 0
            }
        },
        "origin_mesh": {
            "name": "None",
            "modal": []
        },
        "sub_emittors": [],
        "forces": [],
        "modifications": [
            {
                "changed_property": "Color",
                "new_value": [
                    1,
                    0.449,
                    0.007,
                    0.5000000000000002
                ],
                "application_mode": "Equalization",
                "equation": [
                    -446.5844149551731,
                    869.8236164532682,
                    -550.7976741479964,
                    137.84847355308065,
                    -9.290000903169316,
                    0
                ],
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            }
        ]
    },
    "system_1": {
        "id": 65,
        "src_bfact": "Source alpha",
        "dst_bfact": "One",
        "origin": "Point",
        "position": [
            0,
            0,
            0
        ],
        "spawn_mode": "Waves",
        "max_particles": 50,
        "spawn_rate": 0.25,
        "particles_per_wave": 10,
        "particle_data": {
            "max_speed": [
                0.75,
                1,
                0.75
            ],
            "min_speed": [
                -0.75,
                0.5,
                -0.75
            ],
            "max_size": 0.25,
            "min_size": 0.15,
            "max_life_time": 13,
            "min_life_time": 11,
            "color": [
                0.93,
                0.44900000000000007,
                0.007,
                1
            ]
        },
        "atlasName": "Atlas1.png",
        "uvs": [
            [
                0,
                0,
                0.0625,
                0.06739526411657559
            ],
            [
                0,
                0.06739526411657559,
                1,
                1
            ]
        ],
        "texture": {
            "id": 1,
            "prop": {
                "subtextures": false,
                "textures_x": 1,
                "textures_y": 1,
                "animated": false,
                "anim_loop": false,
                "anim_duration": 0
            }
        },
        "origin_mesh": {
            "name": "None",
            "modal": []
        },
        "sub_emittors": [],
        "forces": [],
        "modifications": [
            {
                "changed_property": "Speed",
                "new_value": [
                    0,
                    -1,
                    0
                ],
                "application_mode": "Equalization",
                "equation": [],
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            },
            {
                "changed_property": "Color",
                "new_value": [
                    0.93,
                    0.44900000000000007,
                    0.007,
                    0
                ],
                "application_mode": "Equalization",
                "equation": [],
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            }
        ]
    },
    "system_2": {
        "id": 66,
        "src_bfact": "Source alpha",
        "dst_bfact": "One minus source alpha",
        "origin": "Point",
        "position": [
            0,
            2,
            0
        ],
        "spawn_mode": "Linear",
        "max_particles": 200,
        "spawn_rate": 10,
        "particles_per_wave": 10,
        "particle_data": {
            "max_speed": [
                0.25,
                2,
                0.25
            ],
            "min_speed": [
                -0.25,
                1.5,
                -0.25
            ],
            "max_size": 4,
            "min_size": 2,
            "max_life_time": 15,
            "min_life_time": 13,
            "color": [
                0.6200000000000001,
                0.468,
                0.368,
                0
            ]
        },
        "atlasName": "Atlas2.png",
        "uvs": [
            [
                0,
                0,
                0.0625,
                0.06739526411657559
            ],
            [
                0,
                0.06739526411657559,
                1,
                1
            ]
        ],
        "texture": {
            "id": 1,
            "prop": {
                "subtextures": false,
                "textures_x": 1,
                "textures_y": 1,
                "animated": false,
                "anim_loop": false,
                "anim_duration": 0
            }
        },
        "origin_mesh": {
            "name": "None",
            "modal": []
        },
        "sub_emittors": [],
        "forces": [],
        "modifications": [
            {
                "changed_property": "Color",
                "new_value": [
                    0.52,
                    0.468,
                    0.368,
                    0.6099999999999997
                ],
                "application_mode": "Equalization",
                "equation": [
                    20.525491539864817,
                    -45.819188017464846,
                    28.577419466320897,
                    -3.2837229887207418,
                    0
                ],
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            }
        ]
    }
};

//Shaders
let vertexShader, flatFragment, textFragment;

//Rotation an scale functions
let setRotation, setScale, setRotationScale;

init();

function init() {
    //Inicialize the up and right vectors
    right = new THREE.Vector3();
    up = new THREE.Vector3();

    //Inicialize and start the clock
    clock = new THREE.Clock();
    clock.start();

    //Init the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 30;

    //Create the scene
    scene = new THREE.Scene();

    //Add the cube geometry to the scene
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = 5;
    mesh.position.x = -2;
    scene.add( mesh );

    //Load the shaders
    vertexShader = document.getElementById( 'vertexShader' ).textContent;
    flatFragment = document.getElementById( 'flatFragmentShader' ).textContent;
    textFragment = document.getElementById( 'texturedFragmentShader' ).textContent;

    //Add the particle system to the scene
    systems = new Dixie();
    systems.add("Fire", fire_system, createParticleMesh, loadTexture, loadMesh, "Graph1");
    systems.add("explos", particle_system, createParticleMesh, loadTexture, loadMesh, "Graph");

    //Set the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    renderer.sortObjects = false;
    document.body.appendChild( renderer.domElement );

    //Set the camera controls
    controls = new OrbitControls( camera, renderer.domElement );

    //Set the rotacion and scale functions
    setRotation = function ( id_, modal_, rotation_ ) {
        let childrens = scene.children, children;
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

    setScale = function ( id_, modal_, scale_ ) {
        let childrens = scene.children, children;

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

    setRotationScale = function ( id_, modal_, rotation_, scale_ ) {
        let childrens = scene.children, children;

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
}

function animation( time ) {

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    let c_pos = camera.position;

    let eye = [0,0,0];
    eye[0] = c_pos.x;
    eye[1] = c_pos.y;
    eye[2] = c_pos.z;

    systems.update( clock.getDelta(), eye, getBufferData, uploadBuffers, orderSystems );

    //Get the right and up vectors of the camera
    let mv = camera.matrixWorldInverse.elements;

    right.x = mv[0];
    right.y = mv[4];
    right.z = mv[8];
    right.normalize();

    up.x = mv[1];
    up.y = mv[5];
    up.z = mv[9];
    up.normalize();


    //Update the uniforms for the particles
    let graphs = systems.graphs;
    let render_info, uniforms;
    let sy, system;


    for (let i = 0; i < graphs.length; ++i) 
    {
        sy = graphs[i].graph.systems;

        for(let j = 0; j < sy.length; ++j)
        {
            system = sy[j];
            render_info = system.renderInfo;

            //Update the uniforms
            uniforms = system.particle_mesh.material.uniforms; 
            uniforms.u_right.value = right;
            uniforms.u_up.value = up; 
        }
    }

    controls.update();
    renderer.render( scene, camera );   
}

//Function definition
function getBufferData( mesh ) {
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

function uploadBuffers( mesh, buffers ) {
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

function loadTexture( atlasURL, toSave, graph) {
    let loader = new THREE.TextureLoader();

    loader.load( atlasURL,
        function ( texture ) {
            graph[toSave] = texture;

            let material = graph.particle_mesh.material; 
            material.uniforms.u_texture = {value : texture};
            material.fragmentShader = textFragment;
            material.needsUpdate = true;
        }
    );
}

function loadMesh( meshURL, toSaveMesh, toSaveVertices, meshInGraph ) {
    let loader = new OBJLoader();

    loader.load( meshURL,
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

function createParticleMesh( buffers, src_bfact_, dst_bfact_, set_id_, t_modal_ ) {
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

        vertexShader: vertexShader,
        fragmentShader:flatFragment
    } );

    //Disable cull face
    s_material.side = THREE.DoubleSide;

    //Set the blending
    s_material.blending = THREE.CustomBlending;
    s_material.blendEquation = THREE.AddEquation;
    s_material.blendSrc = blending_factors[src_bfact_];
    s_material.blendDst = blending_factors[dst_bfact_];

    //Disable the depth test and depth mask
    s_material.depthTest  = true;
    s_material.depthWrite = false;

    //Compute the bounding box (OPTIONAL)
    geometry.computeBoundingBox();

    let m = t_modal_;

    let p_mesh = new THREE.Mesh( geometry, s_material );
    p_mesh.matrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
    p_mesh.matrixAutoUpdate = false;
    scene.add( p_mesh );

    //Add the id of the system
    set_id_(p_mesh.uuid);

    return p_mesh;
}

function orderSystems( new_order_ ) {
    //Get the emitters
    let to_order = scene.children.splice(1, 3);

    for(let i = 0; i < new_order_.length; ++i)
    {
        for(let j = 0; j < to_order.length; ++j)
        {
            if(new_order_[i].id == to_order[j].uuid)
                scene.children.push(to_order[j]);
        }
    }
}