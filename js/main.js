/*	Guillem Martínez Jiménez		
*   In this file you can find the:
*		--> Inicialiation of the app
*		--> The behaviour of some buttons
*	Here is where the graph is executed and the particles are rendered 
*/

/* 
*	Global variables
*/
var graph;
var graphCanvas;
var gl;

var divisionButton;
var glCanvasOptionsButton;

var graphLi;
var glLi;
var root;
var widthCanvasContainer;
var navbar;

var camera;
var time_interval;

/* Demos */
//Default start
var demo1 = {"last_node_id":11,"last_link_id":11,"nodes":[{"id":1,"type":"spawn/spawn","pos":[-112,137],"size":[245.1999969482422,142],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[1]}],"properties":{"id":1,"max_particles":100,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface","color":[1,1,1,1]}},{"id":2,"type":"init/init","pos":[606,134],"size":[262,186],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":1},{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":2},{"name":"Texture","type":"texture","link":3}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"max_speed":[2,2,2],"max_size":0.25,"max_life_time":7,"min_speed":[-2,-2,-2],"min_size":0.15,"min_life_time":5,"color":[0.7,1,0.30000000000000004,1],"texture":{"file":"","subtextures":false,"subtextures_size":[0,0]},"position":[0,0,0]}},{"id":4,"type":"basic/load texture","pos":[276,412],"size":[210,82],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[3]}],"properties":{"file":"","subtextures":false,"subtextures_size":[0,0]}},{"id":3,"type":"basic/color picker","pos":[276,238],"size":[210,130],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Color","type":"color","links":[2]}],"properties":{"color":[0.7,1,0.30000000000000004,1]}}],"links":[[1,1,0,2,0,"particle_system"],[2,3,0,2,7,"color"],[3,4,0,2,8,"texture"]],"groups":[{"title":"The most basic start","bounding":[257,-47,227,94],"color":"#3f789e"},{"title":"The particles are spawned","bounding":[-140,63,296,251],"color":"#3f789e"},{"title":"And then initialized for being rendered","bounding":[250,72,628,434],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Conditions & properties
var demo2 = {"last_node_id":11,"last_link_id":11,"nodes":[{"id":5,"type":"modify/modify property","pos":[726,100],"size":[262,166],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":4},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New speed","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Speed","application_mode":"Equalization","new_value":[0,0,0]}},{"id":6,"type":"modify/modify property","pos":[726,307],"size":[262,166],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":6},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New size","type":"number","link":11}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Size","application_mode":"Equalization","new_value":1}},{"id":11,"type":"basic/constant number","pos":[1006,376],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[11]}],"properties":{"number":1}},{"id":8,"type":"modify/modify property","pos":[975.6630653393554,649.3368659960938],"size":[262,166],"flags":{},"order":9,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":8},{"name":"Condition","type":"condition_list","link":9},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":7}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"condition":[0,2,5,6,7,8,9,11,13,14,15,19,20,22,23,24,27,29,30,31,32,34,35,36,38,42,43,44,45,51,52,53,54,55,56,57,58,59,60,61,62,67,68,70,71,73,77,80,81,82,86,87,88,89,91,93,94,96,98,99],"changed_property":"Color","application_mode":"Equalization","new_value":[0.8,0.20000000000000004,0,0]}},{"id":9,"type":"basic/color picker","pos":[684.6630653393554,748.3368659960938],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[7]}],"properties":{"color":[0.8,0.20000000000000004,0,0]}},{"id":10,"type":"conditions/create condition","pos":[680.6630653393554,608.3368659960938],"size":[211.60000610351562,102],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":10},{"name":"Life time","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[9]}],"properties":{"system_property":"Life time","condition":"Greater than","value":4.23}},{"id":2,"type":"init/init","pos":[268,237],"size":[262,186],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":1},{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":2},{"name":"Texture","type":"texture","link":3}],"outputs":[{"name":"Particle system","type":"particle_system","links":[4,6,8,10]}],"properties":{"max_speed":[2,2,2],"max_size":0.25,"max_life_time":7,"min_speed":[-2,-2,-2],"min_size":0.15,"min_life_time":5,"color":[1,0.5,0,1],"texture":{"file":"","subtextures":false,"subtextures_size":[0,0]},"position":[0,0,0]}},{"id":4,"type":"basic/load texture","pos":[-79,490],"size":[210,82],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[3]}],"properties":{"file":"","subtextures":false,"subtextures_size":[0,0]}},{"id":3,"type":"basic/color picker","pos":[-83,319],"size":[210,130],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Color","type":"color","links":[2]}],"properties":{"color":[1,0.5,0,1]}},{"id":1,"type":"spawn/spawn","pos":[-112,137],"size":[245.1999969482422,142],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[1]}],"properties":{"id":1,"max_particles":100,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface","color":[1,1,1,1]}}],"links":[[1,1,0,2,0,"particle_system"],[2,3,0,2,7,"color"],[3,4,0,2,8,"texture"],[4,2,0,5,0,"particle_system"],[6,2,0,6,0,"particle_system"],[7,9,0,8,3,"color"],[8,2,0,8,0,"particle_system"],[9,10,0,8,1,"condition_list"],[10,2,0,10,0,"particle_system"],[11,11,0,6,3,"number"]],"groups":[{"title":"The particles size and speed changes along his lifetime","bounding":[85,-105,600,80],"color":"#3f789e"},{"title":"and when they have more than 4.5 seconds of life they start disappearing","bounding":[-4,-74,794,80],"color":"#3f789e"},{"title":"You can modify directly the particle properties","bounding":[712,34,517,451],"color":"#3f789e"},{"title":"Or creating a condition ","bounding":[666,545,588,364],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Mergin conditions
var demo3 = {"last_node_id":15,"last_link_id":19,"nodes":[{"id":3,"type":"basic/color picker","pos":[-80,263],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[2]}],"properties":{"color":[1,0.5,0,1]}},{"id":1,"type":"spawn/spawn","pos":[-113,81],"size":[245.1999969482422,142],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[1]}],"properties":{"id":1,"max_particles":100,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface","color":[1,1,1,1]}},{"id":2,"type":"init/init","pos":[191,121],"size":[262,186],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":1},{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":2},{"name":"Texture","type":"texture","link":3}],"outputs":[{"name":"Particle system","type":"particle_system","links":[4,6,8,10,15]}],"properties":{"max_speed":[2,2,2],"max_size":0.25,"max_life_time":7,"min_speed":[-2,-2,-2],"min_size":0.15,"min_life_time":5,"color":[1,0.5,0,1],"texture":{"file":"","subtextures":false,"subtextures_size":[0,0]},"position":[0,0,0]}},{"id":14,"type":"conditions/merge conditions","pos":[252,567],"size":[210,78],"flags":{},"order":10,"mode":0,"inputs":[{"name":"Condition 1","type":"condition_list","link":16},{"name":"condition 2","type":"condition_list","link":17}],"outputs":[{"name":"Condition","type":"condition_list","links":[18]}],"properties":{"merge_mode":"And"}},{"id":10,"type":"conditions/create condition","pos":[-20,510],"size":[211.60000610351562,102],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":10},{"name":"Life time","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[16]}],"properties":{"system_property":"Life time","condition":"Greater than","value":4.23}},{"id":13,"type":"conditions/create condition","pos":[-25,651],"size":[219.64768981933594,102],"flags":{},"order":9,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":15},{"name":"Size","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[17]}],"properties":{"system_property":"Size","condition":"Greater than","value":0.45}},{"id":5,"type":"modify/modify property","pos":[567,124],"size":[262,166],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":4},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New speed","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Speed","application_mode":"Equalization","new_value":[0,0,0]}},{"id":6,"type":"modify/modify property","pos":[561,332],"size":[262,166],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":6},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New size","type":"number","link":19}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Size","application_mode":"Equalization","new_value":1}},{"id":8,"type":"modify/modify property","pos":[561,547],"size":[262,166],"flags":{},"order":11,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":8},{"name":"Condition","type":"condition_list","link":18},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":7}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"condition":[0,1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,24,26,28,29,31,32,33,37,41,42,43,45,48,52,53,55,57,58,59,62,63,67,68,73,79,82,84,85,86,88,89,90,91,92,93,94,95,96,98,99],"changed_property":"Color","application_mode":"Equalization","new_value":[0.8,0.20000000000000004,0,0]}},{"id":9,"type":"basic/color picker","pos":[599,766],"size":[210,130],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Color","type":"color","links":[7]}],"properties":{"color":[0.8,0.20000000000000004,0,0]}},{"id":4,"type":"basic/load texture","pos":[-385,268],"size":[210,82],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[3]}],"properties":{"file":"","subtextures":false,"subtextures_size":[0,0]}},{"id":15,"type":"basic/constant number","pos":[840,416],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[19]}],"properties":{"number":1}}],"links":[[1,1,0,2,0,"particle_system"],[2,3,0,2,7,"color"],[3,4,0,2,8,"texture"],[4,2,0,5,0,"particle_system"],[6,2,0,6,0,"particle_system"],[7,9,0,8,3,"color"],[8,2,0,8,0,"particle_system"],[10,2,0,10,0,"particle_system"],[15,2,0,13,0,"particle_system"],[16,10,0,14,0,"condition_list"],[17,13,0,14,1,"condition_list"],[18,14,0,8,1,"condition_list"],[19,15,0,6,3,"number"]],"groups":[{"title":"The particles size and speed changes along his lifetime","bounding":[-188,-137,600,80],"color":"#3f789e"},{"title":"and when they have more than 4.5 seconds of life and ","bounding":[-189,-102,602,80],"color":"#3f789e"},{"title":"his size is bigger than 0.45 they start disappearing","bounding":[-188,-56,541,80],"color":"#3f789e"},{"title":"And merge it!!!","bounding":[250,505,217,154],"color":"#3f789e"},{"title":"You can create conditions","bounding":[-63,434,287,341],"color":"#3f789e"},{"title":"Modify the properties of the particles","bounding":[490,42,568,854],"color":"#3f789e"},{"title":"Load your own textures!","bounding":[-411,193,269,289],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//The forces
var demo4 = {"last_node_id":33,"last_link_id":55,"nodes":[{"id":3,"type":"basic/color picker","pos":[-83,319],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[2]}],"properties":{"color":[1,0.5,0,1]}},{"id":1,"type":"spawn/spawn","pos":[-112,137],"size":[245.1999969482422,142],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[1]}],"properties":{"id":1,"max_particles":100,"spawn_rate":10,"position":[0,0,0],"mode":"Point","origin_mesh_mode":"Surface","color":[1,1,1,1]}},{"id":5,"type":"modify/modify property","pos":[870,-24],"size":[262,166],"flags":{},"order":21,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":4},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New speed","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Speed","application_mode":"Equalization","new_value":[0,0,0]}},{"id":6,"type":"modify/modify property","pos":[868,184],"size":[262,166],"flags":{},"order":22,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":6},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New size","type":"number","link":11}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Size","application_mode":"Equalization","new_value":1}},{"id":11,"type":"basic/constant number","pos":[627,281],"size":[210,58],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Number","type":"number","links":[11]}],"properties":{"number":1}},{"id":13,"type":"basic/vector 3","pos":[-407.54210891039145,887.834741347187],"size":[140,66],"flags":{},"order":13,"mode":0,"inputs":[{"name":"X","type":"number","link":null},{"name":"Y","type":"number","link":14},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[13]}],"properties":{"x":0,"y":1,"z":0}},{"id":14,"type":"basic/constant number","pos":[-651.5421089103921,907.8347413471872],"size":[210,58],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Number","type":"number","links":[14]}],"properties":{"number":1}},{"id":20,"type":"basic/vector 3","pos":[410,939],"size":[140,66],"flags":{},"order":14,"mode":0,"inputs":[{"name":"X","type":"number","link":19},{"name":"Y","type":"number","link":46},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[18]}],"properties":{"x":5,"y":5,"z":0}},{"id":19,"type":"basic/constant number","pos":[-650.5421089103921,1016.8347413471877],"size":[210,58],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Number","type":"number","links":[17]}],"properties":{"number":5}},{"id":23,"type":"basic/constant number","pos":[357,1146],"size":[210,58],"flags":{},"order":5,"mode":0,"outputs":[{"name":"Number","type":"number","links":[22]}],"properties":{"number":5}},{"id":21,"type":"basic/constant number","pos":[123,941],"size":[210,58],"flags":{},"order":6,"mode":0,"outputs":[{"name":"Number","type":"number","links":[19,46]}],"properties":{"number":5}},{"id":15,"type":"modify/modify property","pos":[871,392],"size":[262,166],"flags":{},"order":23,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":16},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":15}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Color","application_mode":"Equalization","new_value":[1,0.5,0,0]}},{"id":16,"type":"basic/color picker","pos":[590,452],"size":[210,130],"flags":{},"order":7,"mode":0,"outputs":[{"name":"Color","type":"color","links":[15]}],"properties":{"color":[1,0.5,0,0]}},{"id":22,"type":"basic/constant number","pos":[338,1046],"size":[210,58],"flags":{},"order":8,"mode":0,"outputs":[{"name":"Number","type":"number","links":[21]}],"properties":{"number":-8}},{"id":12,"type":"forces/gravity","pos":[-214.54210891039094,879.8347413471869],"size":[262,66],"flags":{},"order":18,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Direction","type":"vec3","link":13},{"name":"Stength","type":"number","link":17}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"direction":[0,1,0],"strength":5}},{"id":29,"type":"basic/vector 3","pos":[1200,896],"size":[140,66],"flags":{},"order":16,"mode":0,"inputs":[{"name":"X","type":"number","link":null},{"name":"Y","type":"number","link":27},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[26]}],"properties":{"x":0,"y":15,"z":0}},{"id":31,"type":"basic/vector 3","pos":[1203,1000],"size":[140,66],"flags":{},"order":15,"mode":0,"inputs":[{"name":"X","type":"number","link":null},{"name":"Y","type":"number","link":32},{"name":"Z","type":"number","link":null}],"outputs":[{"name":"Vec3","type":"vec3","links":[31]}],"properties":{"x":0,"y":5,"z":0}},{"id":32,"type":"basic/constant number","pos":[959,1021],"size":[210,58],"flags":{},"order":9,"mode":0,"outputs":[{"name":"Number","type":"number","links":[32]}],"properties":{"number":5}},{"id":27,"type":"basic/constant number","pos":[957,1137],"size":[210,58],"flags":{},"order":10,"mode":0,"outputs":[{"name":"Number","type":"number","links":[25]}],"properties":{"number":30}},{"id":30,"type":"basic/constant number","pos":[945.8399288586726,906.5278842546902],"size":[210,58],"flags":{},"order":11,"mode":0,"outputs":[{"name":"Number","type":"number","links":[27]}],"properties":{"number":15}},{"id":17,"type":"forces/magnet point","pos":[619,879],"size":[262,138],"flags":{},"order":19,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Position","type":"vec3","link":18},{"name":"Strength","type":"number","link":21},{"name":"Scale","type":"number","link":22},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"position":[5,5,0],"strength":-8,"scale":5,"color":[1,1,1,0.8]}},{"id":2,"type":"init/init","pos":[268,237],"size":[262,186],"flags":{},"order":17,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":1},{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":2},{"name":"Texture","type":"texture","link":3}],"outputs":[{"name":"Particle system","type":"particle_system","links":[4,6,16]}],"properties":{"max_speed":[2,2,2],"max_size":0.25,"max_life_time":7,"min_speed":[-2,-2,-2],"min_size":0.15,"min_life_time":5,"color":[1,0.5,0,1],"texture":{"file":"","subtextures":false,"subtextures_size":[0,0]},"position":[0,0,0]}},{"id":4,"type":"basic/load texture","pos":[-81,486],"size":[210,194],"flags":{},"order":12,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[3]}],"properties":{"file":"","subtextures":false,"subtextures_size":[0,0]}},{"id":24,"type":"forces/vortex","pos":[1434.8399288586718,886.5278842546901],"size":[262,138],"flags":{},"order":20,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Position","type":"vec3","link":31},{"name":"Angular speed","type":"vec3","link":26},{"name":"Scale","type":"number","link":25},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"position":[0,5,0],"angular_speed":[0,15,0],"scale":30,"color":[1,1,1,0.8]}}],"links":[[1,1,0,2,0,"particle_system"],[2,3,0,2,7,"color"],[3,4,0,2,8,"texture"],[4,2,0,5,0,"particle_system"],[6,2,0,6,0,"particle_system"],[11,11,0,6,3,"number"],[13,13,0,12,1,"vec3"],[14,14,0,13,1,"number"],[15,16,0,15,3,"color"],[16,2,0,15,0,"particle_system"],[17,19,0,12,2,"number"],[18,20,0,17,1,"vec3"],[19,21,0,20,0,"number"],[21,22,0,17,2,"number"],[22,23,0,17,3,"number"],[25,27,0,24,3,"number"],[26,29,0,24,2,"vec3"],[27,30,0,29,1,"number"],[31,31,0,24,1,"vec3"],[32,32,0,31,1,"number"],[46,21,0,20,1,"number"]],"groups":[{"title":"The particles size and speed changes along his lifetime","bounding":[85,-105,600,80],"color":"#3f789e"},{"title":"and when they have more than 4.5 seconds of life they start disappearing","bounding":[-4,-74,794,80],"color":"#3f789e"},{"title":"Gravity, a force that affects all particles by the same","bounding":[-673,800,743,287],"color":"#3f789e"},{"title":"Let's try something more... Magnetic!!!","bounding":[103,803,796,416],"color":"#3f789e"},{"title":"Watch out!! A tornado!!!","bounding":[935,811,780,410],"color":"#3f789e"},{"title":"Meet the forces!!","bounding":[-433,706,1574,80],"color":"#3f789e"},{"title":"If you want, you can use various forces!! Give it a try","bounding":[-585,1155,599,80],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};

/*    Default Textures    */
var spawner_text;
var vortex_text;
var magnet_text;
var particle_text;

/*
* 	Change the width of both canvases depending of the division button position.
*	@method changeCanvasWidth
*	@params {Number} the position of the division button
*/
function changeCanvasSize ( dBPosition ) 
{
	divisionButton.style.left = dBPosition + 'px';

	var canvasHeight = root.height() - navbar.offsetHeight; 
	var graphWidth = dBPosition + divisionButton.halfSize; 	//For repositionate both canvas, use the half of the size of the button
	
	graphLi.width( graphWidth );
	graphLi.height( canvasHeight );

	glLi.width( widthCanvasContainer - graphWidth );
	glLi.height( canvasHeight );
	
	gl.canvas.width  = glLi.width();
	gl.canvas.height = canvasHeight;
	
	camera.resize();
	graphCanvas.resize();
}

/*
* 	Calculus for get the correct position, using percentages, of the division button when the screen is resized.
*	@method reizeElements
*/
function resizeElements ()
{
	//save the old width of the container to know the % that the button was occupying  
	var oldWidthCanvasContainer = widthCanvasContainer;

	//Every time that the screen changes his size, get the size of the container in wich the canvas are inside
	widthCanvasContainer = root.width();
	dBLimit = widthCanvasContainer * 0.15;

	//In order to get the position, and parse to float because in the style is saved as a string
	var posDivisionButton = parseFloat(divisionButton.style.left.split('px')[0]);

	//The % that represent the actual position of the
	//divisionButton over the width of the container 
	//normaly, it will be multiplied by 100 but in the
	//next step is divided by 100 so we can delete both
	//to avoid unnecessary operations
	var percentageValue = posDivisionButton / oldWidthCanvasContainer;
	
	//The value in pixels of the % of the divisionButton in the new width of the container
	var dBPosition = percentageValue * widthCanvasContainer;
	dBPosition = Math.min(Math.max(dBPosition, dBLimit),  widthCanvasContainer - divisionButton.offsetWidth - dBLimit);

	changeCanvasSize(dBPosition);

//	glCanvasOptionsButton.style.top  = $('#menu').height() + 25 + 'px';
//	glCanvasOptionsButton.style.left = widthCanvasContainer - glCanvasOptionsButton.offsetWidth - 10 + 'px';
}

/*
* 	Initialization of the division button.
*	@method initDivisionButton
*/
function initDivisionButton () 
{
	divisionButton = document.getElementById('divisionButton');
	divisionButton.halfSize = divisionButton.offsetWidth * 0.5;
	divisionButton.style.left = (divisionButton.parentElement.offsetWidth - divisionButton.offsetWidth) * 0.5 + 'px';
	divisionButton.limit = widthCanvasContainer * 0.15; //For limit how long we can move the division button
	divisionButton.drag = false; //In order to make the button dragable a new variable is created, by default will be false
	divisionButton.onmousedown = function () { this.drag = true; } //onclick his value will change to true

	document.addEventListener('mousemove', function(e){
		if (divisionButton.drag == true){
			var dBPosition = Math.min(Math.max(e.pageX, divisionButton.limit),  widthCanvasContainer - divisionButton.offsetWidth - divisionButton.limit);
			changeCanvasSize(dBPosition);
		}
	});

	document.addEventListener('mouseup', function(e){
		if (divisionButton.drag == true)
			divisionButton.drag = false;
	});
}

/*
*	Initialization of the buttons in the menu bar
*	@method initMenuButtons
*/
function initMenuButtons ()
{
	var loadInput    = document.getElementById("graphLoader");
	var loadButton   = document.getElementById("load");
	var saveButton   = document.getElementById("save");
	var exportButton = document.getElementById("export");

	var playButton   = document.getElementById("play");
	var resetButton  = document.getElementById("reset");
	var stopButton   = document.getElementById("stop");

	var demoButton   = document.getElementById("demos");
	var helpButton   = document.getElementById("help");

	var showDemo1Button = document.getElementById("defaultDemo");
	var showDemo2Button = document.getElementById("conditonsPropertiesDemo");
	var showDemo3Button = document.getElementById("merginConditionsDemo");
	var showDemo4Button = document.getElementById("forcesDemo");

	loadInput.onmouseover = function() {
		loadButton.style.background = "#eceff1";
		loadButton.style.color      = "#455a64";
		loadInput.style.cursor      = "pointer";
	};

	loadInput.onmouseout = function() {
		loadButton.style.background = "#455a64";
		loadButton.style.color      = "#eceff1";
		loadInput.style.cursor      = "default";
	};

	loadInput.addEventListener("change", loadGraph, false);

	function loadGraph(e){
		var file = e.target.files[0];

		var filename = file.name.split(".");
		var extension = filename[filename.length - 1];

		if (!file || extension != "dx") {
			createAlert("Holy Guacamole!", "Loading error", "Please insert a valid graph file...", "danger", true, true, "pageMessages");
			return;
		}
		
		var reader = new FileReader();
		reader.onload = function(e) {
		    var contents = e.target.result;
		    graph.configure(JSON.parse(contents));
		};
		reader.readAsText(file);

	    //Permite volver a cargar el mismo documento sin reiniciar
		loadInput.value = "";
	};

	saveButton.onclick = function() {
		var jsonGraph = graph.serialize();
		jsonGraph = JSON.stringify(jsonGraph);
		jsonGraph = [jsonGraph];

		var blobl = new Blob(jsonGraph, {type: "text/plain;charset=utf-8"});
		
		var url = window.URL || window.webkitURL;
		link = url.createObjectURL(blobl);

		var savedGraph = document.createElement("a");
		savedGraph.download = "Graph.dx";
		savedGraph.href = link;

		document.body.appendChild(savedGraph);
		savedGraph.click();
		document.body.removeChild(savedGraph);
	}

	playButton.onclick = function() {
		graph.start();
	}

	stopButton.onclick = function() {
		graph.stop();
	}

	showDemo1Button.onclick =function() {
		graph.configure( demo1 ); 
		$('#demosModal').modal('hide');
	}

	showDemo2Button.onclick =function() {
		graph.configure( demo2 ); 
		$('#demosModal').modal('hide');
	}

	showDemo3Button.onclick =function() {
		graph.configure( demo3 ); 
		$('#demosModal').modal('hide');
	}

	showDemo4Button.onclick =function() {
		graph.configure( demo4 ); 
		$('#demosModal').modal('hide');
	}
}

/*
*	Addition of all the nodes created 
*	@method addNodes
*/
function addNodes () 
{
	LiteGraph.registerNodeType("basic/constant number", constantNumberNode);
	LiteGraph.registerNodeType("basic/random number"  , randomNumberNode);
	LiteGraph.registerNodeType("basic/load texture"   , textureLoadNode);
	LiteGraph.registerNodeType("basic/load mesh"      , meshLoadNode);
	LiteGraph.registerNodeType("basic/2D geometry"    , geometry2DNode);
	LiteGraph.registerNodeType("basic/equation"       , equationNode);
	LiteGraph.registerNodeType("basic/vector 2"       , vector2Node);
	LiteGraph.registerNodeType("basic/vector 3"       , vector3Node);
	LiteGraph.registerNodeType("basic/vector 4"       , vector4Node);
	LiteGraph.registerNodeType("basic/color picker"   , colorPickerNode);
	
	LiteGraph.registerNodeType("spawn/spawn"          , mySpawnNode);
	LiteGraph.registerNodeType("init/init"            , initParticlesNode);

	LiteGraph.registerNodeType("forces/gravity"       , gravityNode);
	LiteGraph.registerNodeType("forces/vortex"        , vortexNode);
	LiteGraph.registerNodeType("forces/magnet point"  , magnetNode);
	LiteGraph.registerNodeType("forces/noise"         , noiseNode);
	LiteGraph.registerNodeType("forces/path"          , pathNode);

	LiteGraph.registerNodeType("conditions/create condition", createConditionNode);
	LiteGraph.registerNodeType("conditions/merge conditions", mergeConditionsNode);

	LiteGraph.registerNodeType("modify/modify property", modifyPropertyNode);
	
	LiteGraph.registerNodeType("collisions/collisions"            , collisionsNode);
	LiteGraph.registerNodeType("collisions/collidable object list", collidableObjectsListNode);
}

/*
* 	Initialization of both canvases, menu and division buttons.
*	@method init
*/
function init () 
{
	//Inicialization of the graph canvas
	graph = new LGraph();
	graphCanvas = new LGraphCanvas( '#graphCanvas', graph );
	graph.stop(); //by default always will be stoped
	addNodes();

	//Inicialization of the litegl canvas
	gl = GL.create( {width:100, height:100} );
	particleCanvas = document.getElementById( 'particleContainer' );
	particleCanvas.appendChild( gl.canvas );
	particleCanvas.children[0].classList.add( 'gl-canvas' );

	//Canvas containers inicilization
	graphLi = $( '#graphLi' );
	glLi = $( '#particleLi' );
	root = $( '#root' );
	widthCanvasContainer = root.width();	
	navbar = document.getElementById( 'menu' );

	//buttons inicialization
	glCanvasOptionsButton = document.getElementById( 'glOptionButton' );
	initMenuButtons();
	initDivisionButton();

	camera = new Camera( gl ); /**************************************************/

	//Set the default mesh for the forces
	default_forces_mesh = new GL.Mesh({vertices: [0,0,0]});
	
	//Texture Load
	spawner_text  = GL.Texture.fromURL("default_textures/spawner.png");
	vortex_text   = GL.Texture.fromURL("default_textures/vortex.png");
	magnet_text   = GL.Texture.fromURL("default_textures/magnet_point.png");
	particle_text = GL.Texture.fromURL("default_textures/particles.png");

	//Loading of the default demos 
	demo = {};
	graph.configure( demo ); //by default charging the first demo

	resizeElements(); //First time that the application is executed we need to resize both canvases

	//Listener for the window resize, this is for make the application responsive
	window.addEventListener( 'resize', function(){resizeElements()} );

	graphCanvas.onShowNodePanel = onShowNodePanel.bind(this);
}

init();

/*************************************************/
/****************SHADER DEFINITION****************/
/*************************************************/
var flatShader     =  new GL.Shader( vs_basic, fs_flat );
var texturedShader =  new GL.Shader( vs_basic, fs_point_texture );

var particleShaderTextured =  new GL.Shader( vs_particles, fs_texture );
var particleShaderFlat     =  new GL.Shader( vs_particles, fs_flat_p  );

/*************************************************/
/********************RENDER***********************/
/*************************************************/
gl.ondraw = function() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.enable(gl.BLEND );
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.DEPTH_TEST);

	//default particles uniforms
	var particles_uniforms = { 
		u_viewprojection : camera.vp,
		u_mvp            : camera.mvp,
		u_right          : camera.getRightVector(),
		u_up             : camera.getUpVector()
	};

	//default sytem uniforms
	var system_uniforms = { 
		u_mvp: camera.mvp,
		u_texture: spawner_text,
		model: undefined
	};

	//Render the particles
	for(x in system_list){
		var mesh = searchMesh(system_list[x].mesh_id);
		
		//First all the particles of the system are rendered
		//If a texture is defined then the textured shader is used
		//but if te texture is undefined the flat will be used 
		if(system_list[x].texture == undefined)
			particleShaderFlat.uniforms( particles_uniforms ).draw( mesh );
		else
		{
			particles_uniforms.u_texture = system_list[x].texture;
			particles_uniforms.u_texture.bind(0);
			particleShaderTextured.uniforms( particles_uniforms ).draw( mesh );
		}

		//If the user wants to see the origin of the particles
		//then it will be rendered using the default texture
		if(!system_list[x].visible)
			continue;
		
		system_uniforms.u_model = system_list[x].model;
		system_uniforms.u_color = system_list[x].color;
		system_uniforms.u_texture.bind(0);
		texturedShader.uniforms( system_uniforms ).draw( default_forces_mesh, GL.POINTS );
	}

	//default forces uniforms
	var forces_uniforms = {
		u_mvp: camera.mvp,
		u_model: undefined
	}

	for (x in forces_list){
		var force = forces_list[x];

		//If the user wants to see the origin of the force
		//then it will be rendered using the default texture
		if(!force.visible)
			continue;

		forces_uniforms.u_model = force.model;
		forces_uniforms.u_color = force.color;
		
		if (force.type == "vortex")
			forces_uniforms.u_texture = vortex_text;
		else
			forces_uniforms.u_texture = magnet_text;

		forces_uniforms.u_texture.bind(0);
		texturedShader.uniforms( forces_uniforms ).draw( default_forces_mesh, GL.POINTS );
	}

	gl.disable(gl.BLEND);
}

gl.onupdate = function( dt ) {
	time_interval = dt;

	//The model of the forces and systems is updated
	for (x in forces_list)
		mat4.setTranslation(forces_list[x].model, forces_list[x].position);

	for (x in system_list)
		mat4.setTranslation(system_list[x].model, system_list[x].position);

	if(graph.status == LGraph.STATUS_RUNNING)
	graph.runStep();
}

gl.animate(); //calls the requestAnimFrame constantly, which will call ondraw