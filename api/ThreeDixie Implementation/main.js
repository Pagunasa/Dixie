import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { ThreeDixie } from "/tfg-gmj/api/ThreeDixie.js"

let camera, controls, scene, renderer;
let geometry, material, mesh;
let clock;

//Particles variables
let systems, bufferData;
let right, up;
let secToMs = 1/1000;

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

    //Add the particle system to the scene
    systems = new ThreeDixie( scene );
    //systems.load("/tfg-gmj/api/ThreeDixie%20Implementation/Graph1/Graph.json", "Graph1", "Fire");
    systems.load("/tfg-gmj/api/ThreeDixie%20Implementation/Graph/Graph.json", "Graph", "Explosions");

    //Set the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    renderer.sortObjects = false;
    document.body.appendChild( renderer.domElement );

    //Set the camera controls
    controls = new OrbitControls( camera, renderer.domElement );
}

function animation( time ) {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    systems.update( clock.getDelta(), camera );

    controls.update();
    renderer.render( scene, camera );   
}