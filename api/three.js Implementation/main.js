import * as THREE from 'https://threejs.org/build/three.module.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

let camera, scene, renderer;
let geometry, material, mesh;
let clock;

//Particles
let systems, bufferData;
let msToSec = 1/1000;
let particle_system = {
 "num_systems": 3,
    "system_0": {
        "id": 64,
        "src_bfact": 770,
        "dst_bfact": 1,
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
                "equation" : [],
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
        "src_bfact": 770,
        "dst_bfact": 1,
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
                "equation" : [],
                "changed_property": "Speed",
                "new_value": [
                    0,
                    -1,
                    0
                ],
                "application_mode": "Equalization",
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            },
            {
                "equation" : [],
                "changed_property": "Color",
                "new_value": [
                    0.93,
                    0.44900000000000007,
                    0.007,
                    0
                ],
                "application_mode": "Equalization",
                "modification_mode": "Along life time",
                "user_defined_start": 0,
                "user_defined_seconds": 8.49,
                "condition": true
            }
        ]
    },
    "system_2": {
        "id": 66,
        "src_bfact": 770,
        "dst_bfact": 771,
        "origin": "Point",
        "position": [
            0,
            2,
            0
        ],
        "spawn_mode": "Linear",
        "max_particles": 100,
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
                "equation" : [],
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

init();

function init() {

    clock = new THREE.Clock();
    clock.start();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 30;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = 2;
    scene.add( mesh );

    //Load the shaders
    vertexShader = document.getElementById( 'vertexShader' ).textContent;
    flatFragment = document.getElementById( 'flatFragmentShader' ).textContent;
    textFragment = document.getElementById( 'texturedFragmentShader' ).textContent;

    systems = new Dixie(particle_system, createParticleMesh, loadTexture, loadMesh, "Graph");

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );
}

function animation( time ) {

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    let c_pos = camera.position;
    
    let eye = [0,0,0];
    eye[0] = c_pos.x;
    eye[1] = c_pos.y;
    eye[2] = c_pos.z;

    systems.update( clock.getDelta(), eye, getBufferData, uploadBuffers);

    //Update the uniforms for the particles
    let graphs = systems.graphs;
    let graph, render_info, uniforms;
    
    //Get the right vector of the camera
    let right = new THREE.Vector3();
    let mv = camera.modelViewMatrix.elements;
    right.x = mv[0];
    right.y = mv[4];
    right.z = mv[8];

    //Get the up vector of the camera
    let up = camera.up;

    //In a same frame this uniforms will be the same for all graphs
    right = { value : right};
    up  = { value : camera.up};

    for (let i = 0; i < graphs.length; ++i) 
    {
        graph = graphs[i];
        render_info = graph.renderInfo;

        //Update the uniforms
        uniforms = graph.particle_mesh.material.uniforms; 
        uniforms.u_right = right;
        uniforms.u_up = up; 
    }

    renderer.render( scene, camera );   
}

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
            object.modelViewMatrix.elements = meshInGraph.modal;
            //Save the mesh in the graph
            meshInGraph[toSaveMesh] = object;
            //Save the vertices
            meshInGraph[toSaveVertices] = object.children[0].geometry.attributes.position.array; 
        }
    );
}

function createParticleMesh( buffers, graph ) {
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
    s_material.blendSrc = THREE.SrcAlphaFactor;
    s_material.blendDst = THREE.OneMinusSrcAlphaFactor;

    //Disable the depth test and depth mask
    s_material.depthTest  = true;
    s_material.depthWrite = false;

    //Compute the bounding box (OPTIONAL)
    geometry.computeBoundingBox();

    let p_mesh = new THREE.Mesh( geometry, s_material );
    scene.add( p_mesh );

    return p_mesh;
}