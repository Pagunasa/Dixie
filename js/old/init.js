/*****************************************/
/************INIT the graph***************/
/*****************************************/
var graph = new LGraph();
var graphCanvas = new LGraphCanvas( '#graphCanvas', graph );
graph.status = LGraph.STATUS_RUNNING;



/*********************************************/
/***********LOAD A DEFAULT DEMO***************/
/*********************************************/
var demo = {"last_node_id":3,"last_link_id":2,"nodes":[{"id":2,"type":"particles/Init Particles","pos":[18,256],"size":[262,106],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":1},{"name":"Min Lifetime","type":"number","link":null},{"name":"Max Lifetime","type":"number","link":null},{"name":"Min Speed","type":"vec3","link":null},{"name":"Max Speed","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[2]}],"properties":{"min_lifetime_value":0.5,"max_lifetime_value":10,"min_speed_x":0.5,"max_speed_x":0.5,"min_speed_y":0.5,"max_speed_y":0.5,"min_speed_z":0.5,"max_speed_z":0.5}},{"id":3,"type":"particles/Basic Move Particles","pos":[78,462],"size":[140,46],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle System","type":"ParticleSystem","link":2},{"name":"Vortex Noise","type":"VortexNoise","link":null}],"properties":{}},{"id":1,"type":"particles/Init System","pos":[42,120.20000076293945],"size":[210,58],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Particle System","type":"ParticleSystem","links":[1]}],"properties":{"x":0,"y":0,"z":0,"maxParticles":424,"id":1,"mesh_id":0}}],"links":[[1,1,0,2,0,"ParticleSystem"],[2,2,0,3,0,"ParticleSystem"]],"groups":[],"config":{},"version":0.4}
graph.configure(demo);



/*****************************************/
/********INIT the particle canvas*********/
/*****************************************/
var gl = GL.create({width:100, height:100});
var particleCanvas = document.getElementById('particleContainer');
particleCanvas.appendChild( gl.canvas );
particleCanvas.children[0].classList.add('gl-canvas');



/*****************************************/
/********INIT the divisionButton**********/
/*****************************************/
var dB = document.getElementById('divisionButton');
var dBHalfSize = dB.offsetWidth * 0.5;
dB.style.left = (dB.parentElement.offsetWidth - dB.offsetWidth) * 0.5 + 'px';

//In order to make the button dragable we create a new
//variable inside that control this, by default his value
//will be false but when we click on the button will change to true
dB.drag = false;
dB.onmousedown = function () { this.drag = true; }



/*****************************************/
/*************Event Listener**************/
/*****************************************/
window.addEventListener('resize', function(){resizeElements()});