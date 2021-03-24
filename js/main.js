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
var playButton, resetButton, stopButton;

var divisionButton;

var showGrid = true, showLines = false;
var c_buttonGrid, c_buttonLine;

var graphLi;
var glLi;
var root;
var widthCanvasContainer;
var navbar;

var camera;
var time_interval;

var is_graph_running;
var emergency_stop = false;
var identity = mat4.IDENTITY;

var backgroundColor = [0,0,0,0];
var gridColor       = [1,1,1,0.25];
var linesColor      = [1,1,1,0.5];
var times_clicked   = 0; //How many times the user clicks in the canvas div

/* Demos */
//Default start
var demo1 = {"last_node_id":3,"last_link_id":2,"nodes":[{"id":3,"type":"init/particle data","pos":[310,400],"size":[228.39999389648438,166],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle data","type":"p_data","links":[2]}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":2,"type":"init/init","pos":[649,237],"size":[245.1999969482422,46],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":1},{"name":"Particle data","type":"p_data","link":2}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{}},{"id":1,"type":"spawn/emitter","pos":[66,81],"size":[389,214],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[1]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}}],"links":[[1,1,0,2,0,"emitter"],[2,3,0,2,1,"p_data"]],"groups":[{"title":"In the emitter, the basic information of the system is defined","bounding":[-63,7,646,296],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-90,314,672,269],"color":"#3f789e"},{"title":"The particles are spawned and a default movement is applied","bounding":[589,153,668,146],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Conditions & properties
var demo2 = {"last_node_id":9,"last_link_id":9,"nodes":[{"id":3,"type":"init/particle data","pos":[310,400],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle data","type":"p_data","links":[2]}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":1,"type":"spawn/emitter","pos":[66,81],"size":[389,214],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[1]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":4,"type":"modify/modify property","pos":[1361,-82],"size":[262,166],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":3},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New speed","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Speed","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[0,0,0]}},{"id":6,"type":"modify/modify property","pos":[1947,174],"size":[262,166],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":7},{"name":"Condition","type":"condition_list","link":5},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":4}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[1,0,1,0]}},{"id":5,"type":"conditions/create condition","pos":[1380,289],"size":[211.60000610351562,126],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":6},{"name":"Life time","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[5]}],"properties":{"system_property":"Life time","condition":"Greater than","is_one_time":false,"value":1}},{"id":7,"type":"basic/color picker","pos":[1644,357],"size":[210,130],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Color","type":"color","links":[4]}],"properties":{"color":[1,0,1,0]}},{"id":9,"type":"modify/modify property","pos":[1733.9135430390625,568.9558062734374],"size":[262,166],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":9},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":8},{"name":"New size","type":"number","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Size","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":1}},{"id":2,"type":"init/init","pos":[649,237],"size":[245.1999969482422,46],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":1},{"name":"Particle data","type":"p_data","link":2}],"outputs":[{"name":"Particle system","type":"particle_system","links":[3,6,7,9]}],"properties":{}},{"id":8,"type":"basic/equation","pos":[1303.9135430390625,616.9558062734374],"size":[350,200],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[8]}],"properties":{"curve_points":[[0,0],[0.19156977379464218,0],[0.36128405950892817,0.9236878772686771],[0.6127126309374996,0.9346878772686773],[0.7949983452232131,0.005187877268677976],[1,0]]}}],"links":[[1,1,0,2,0,"emitter"],[2,3,0,2,1,"p_data"],[3,2,0,4,0,"particle_system"],[4,7,0,6,3,"color"],[5,5,0,6,1,"condition_list"],[6,2,0,5,0,"particle_system"],[7,2,0,6,0,"particle_system"],[8,8,0,9,2,"equation"],[9,2,0,9,0,"particle_system"]],"groups":[{"title":"In the emitter, the basic information of the system is defined","bounding":[-63,7,646,296],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-90,314,672,269],"color":"#3f789e"},{"title":"The particles are spawned and a default movement is applied","bounding":[589,153,668,146],"color":"#3f789e"},{"title":"Meet the Conditions","bounding":[1267,-230,970,1082],"color":"#a1309b"},{"title":"You can modify the properties directly","bounding":[1289,-165,414,263],"color":"#3f789e"},{"title":"You can use a condition","bounding":[1289,113,928,390],"color":"#3f789e"},{"title":"Or an equation","bounding":[1290,521,726,313],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Mergin conditions
var demo3 = {"last_node_id":11,"last_link_id":14,"nodes":[{"id":3,"type":"init/particle data","pos":[310,400],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle data","type":"p_data","links":[2]}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":4,"type":"modify/modify property","pos":[1361,-82],"size":[262,166],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":3},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New size","type":"number","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Size","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":1}},{"id":1,"type":"spawn/emitter","pos":[66,81],"size":[389,214],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[1]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":2,"type":"init/init","pos":[649,237],"size":[245.1999969482422,46],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":1},{"name":"Particle data","type":"p_data","link":2}],"outputs":[{"name":"Particle system","type":"particle_system","links":[3,6,7,10]}],"properties":{}},{"id":5,"type":"conditions/create condition","pos":[1324,310],"size":[211.60000610351562,126],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":6},{"name":"Life time","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[11]}],"properties":{"system_property":"Life time","condition":"Greater than","is_one_time":false,"value":1}},{"id":10,"type":"conditions/create condition","pos":[1325,487],"size":[211.60000610351562,126],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":10},{"name":"Size","type":"number","link":null}],"outputs":[{"name":"Condition","type":"condition_list","links":[12]}],"properties":{"system_property":"Size","condition":"Greater than","is_one_time":false,"value":0.5}},{"id":7,"type":"basic/color picker","pos":[1644,488],"size":[210,130],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Color","type":"color","links":[4]}],"properties":{"color":[1,0,1,0]}},{"id":11,"type":"conditions/merge conditions","pos":[1635,354],"size":[210,78],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Condition 1","type":"condition_list","link":11},{"name":"condition 2","type":"condition_list","link":12}],"outputs":[{"name":"Condition","type":"condition_list","links":[14]}],"properties":{"merge_mode":"And"}},{"id":6,"type":"modify/modify property","pos":[1947,252],"size":[262,166],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":7},{"name":"Condition","type":"condition_list","link":14},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":4}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[1,0,1,0]}}],"links":[[1,1,0,2,0,"emitter"],[2,3,0,2,1,"p_data"],[3,2,0,4,0,"particle_system"],[4,7,0,6,3,"color"],[6,2,0,5,0,"particle_system"],[7,2,0,6,0,"particle_system"],[10,2,0,10,0,"particle_system"],[11,5,0,11,0,"condition_list"],[12,10,0,11,1,"condition_list"],[14,11,0,6,1,"condition_list"]],"groups":[{"title":"In the emitter, the basic information of the system is defined","bounding":[-63,7,646,296],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-90,314,672,269],"color":"#3f789e"},{"title":"The particles are spawned and a default movement is applied","bounding":[589,153,668,146],"color":"#3f789e"},{"title":"Meet the Conditions","bounding":[1267,-230,983,884],"color":"#a1309b"},{"title":"You can modify the properties directly","bounding":[1289,-165,414,263],"color":"#3f789e"},{"title":"You can merge conditions","bounding":[1289,113,937,519],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//The forces
var demo4 = {"last_node_id":17,"last_link_id":18,"nodes":[{"id":3,"type":"init/particle data","pos":[310,400],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":null}],"outputs":[{"name":"Particle data","type":"p_data","links":[2]}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":1,"type":"spawn/emitter","pos":[66,81],"size":[389,214],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[1]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":2,"type":"init/init","pos":[649,237],"size":[245.1999969482422,46],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":1},{"name":"Particle data","type":"p_data","link":2}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{}},{"id":15,"type":"forces/gravity","pos":[1331,12],"size":[262,86],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Condition","type":"condition_list","link":null},{"name":"Direction","type":"vec3","link":null},{"name":"Stength","type":"number","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"direction":[0,0,0],"strength":1}},{"id":16,"type":"forces/magnet point","pos":[1331,205],"size":[262,158],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Condition","type":"condition_list","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Strength","type":"number","link":null},{"name":"Scale","type":"number","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"position":[0,0,0],"strength":10,"scale":10,"color":[1,1,1,1]}},{"id":17,"type":"forces/vortex","pos":[1326,470],"size":[262,158],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null},{"name":"Condition","type":"condition_list","link":null},{"name":"Position","type":"vec3","link":null},{"name":"Angular speed","type":"vec3","link":null},{"name":"Scale","type":"number","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"position":[0,0,0],"angular_speed":[0,0,0],"scale":10,"color":[1,1,1,1]}}],"links":[[1,1,0,2,0,"emitter"],[2,3,0,2,1,"p_data"]],"groups":[{"title":"In the emitter, the basic information of the system is defined","bounding":[-63,7,646,296],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-90,314,672,269],"color":"#3f789e"},{"title":"The particles are spawned and a default movement is applied","bounding":[589,153,668,146],"color":"#3f789e"},{"title":"Meet the Forces","bounding":[1287,-126,516,783],"color":"#a1309b"},{"title":"Gravity, a constant force","bounding":[1310,-57,314,168],"color":"#3f789e"},{"title":"Magnet point, attract or repel the particles","bounding":[1308,140,466,232],"color":"#3f789e"},{"title":"Vortex, a circular force","bounding":[1307,402,303,238],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4}
//Basic fire
var demo5 = {"last_node_id":67,"last_link_id":80,"nodes":[{"id":64,"type":"spawn/emitter","pos":[-407.87204274414086,18.31931170996092],"size":[389,214],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[75]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":59,"type":"init/init","pos":[372,83],"size":[245.1999969482422,46],"flags":{},"order":18,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":75},{"name":"Particle data","type":"p_data","link":65}],"outputs":[{"name":"Particle system","type":"particle_system","links":[66]}],"properties":{"trail_u_size":true,"trail_u_color":true,"trail_u_texture":true}},{"id":7,"type":"modify/modify property","pos":[939,244],"size":[262,166],"flags":{},"order":21,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":66},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":28},{"name":"New color","type":"color","link":24}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":8.49,"user_defined_start":0,"new_value":[1,0.449,0.007,0.5000000000000002]}},{"id":5,"type":"basic/color picker","pos":[-412,307],"size":[210,130],"flags":{},"order":6,"mode":0,"outputs":[{"name":"Color","type":"color","links":[4]}],"properties":{"color":[0.972,0.945,0.549,1]}},{"id":4,"type":"basic/load texture","pos":[-416,551],"size":[210,192],"flags":{},"order":7,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[3]}],"properties":{"default_texture":"smoke","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0,"subtextures_size":[0,0]}},{"id":3,"type":"init/particle data","pos":[-26,389],"size":[228.39999389648438,166],"flags":{},"order":15,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":4},{"name":"Texture","type":"texture","link":3}],"outputs":[{"name":"Particle data","type":"p_data","links":[65]}],"properties":{"max_speed":[0.25,1,0.25],"min_speed":[-0.25,0.5,-0.25],"max_size":4,"min_size":2,"max_life_time":7,"min_life_time":5,"color":[0.972,0.945,0.549,1]}},{"id":24,"type":"basic/equation","pos":[412,283],"size":[350,200],"flags":{},"order":8,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[28]}],"properties":{"curve_points":[[0,0],[0.10369748447963063,0],[0.2350689130510591,0.614246865653995],[0.3214974844796305,0.7170968656539947],[0.39409748447963044,0.7715468656539946],[1,1]]}},{"id":30,"type":"modify/modify property","pos":[931.692253461094,882.212353480875],"size":[262,166],"flags":{},"order":22,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":69},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New speed","type":"vec3","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"changed_property":"Speed","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":8.49,"user_defined_start":0,"new_value":[0,-1,0]}},{"id":31,"type":"modify/modify property","pos":[915.692253461094,1220.2123534808748],"size":[262,166],"flags":{},"order":23,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":70},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":null},{"name":"New color","type":"color","link":51}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":8.49,"user_defined_start":0,"new_value":[0.93,0.44900000000000007,0.007,0]}},{"id":45,"type":"basic/color picker","pos":[627.692253461094,1305.2123534808748],"size":[210,130],"flags":{},"order":10,"mode":0,"outputs":[{"name":"Color","type":"color","links":[51]}],"properties":{"color":[0.93,0.44900000000000007,0.007,0]}},{"id":28,"type":"basic/load texture","pos":[-366.30774653890614,1277.2123534808748],"size":[210,192],"flags":{},"order":11,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[52]}],"properties":{"default_texture":"light","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0,"subtextures_size":[0,0]}},{"id":26,"type":"init/particle data","pos":[242.69225346109386,1201.2123534808748],"size":[228.39999389648438,166],"flags":{},"order":16,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":32},{"name":"Texture","type":"texture","link":52}],"outputs":[{"name":"Particle data","type":"p_data","links":[68]}],"properties":{"max_speed":[0.75,1,0.75],"min_speed":[-0.75,0.5,-0.75],"max_size":0.25,"min_size":0.15,"max_life_time":13,"min_life_time":11,"color":[0.93,0.44900000000000007,0.007,1]}},{"id":61,"type":"init/init","pos":[498.6922534610936,1045.2123534808748],"size":[245.1999969482422,46],"flags":{},"order":19,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":76},{"name":"Particle data","type":"p_data","link":68}],"outputs":[{"name":"Particle system","type":"particle_system","links":[69,70]}],"properties":{"trail_u_size":true,"trail_u_color":true,"trail_u_texture":true}},{"id":53,"type":"basic/load texture","pos":[-417,2115],"size":[210,192],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[59]}],"properties":{"default_texture":"smoke","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0,"subtextures_size":[0,0]}},{"id":48,"type":"init/particle data","pos":[-34,1991],"size":[228.39999389648438,166],"flags":{},"order":14,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":55},{"name":"Texture","type":"texture","link":59}],"outputs":[{"name":"Particle data","type":"p_data","links":[72]}],"properties":{"max_speed":[0.25,2,0.25],"min_speed":[-0.25,1.5,-0.25],"max_size":4,"min_size":2,"max_life_time":15,"min_life_time":13,"color":[0.6200000000000001,0.468,0.368,0]}},{"id":66,"type":"spawn/emitter","pos":[-413,1597],"size":[389,214],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[77]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,2,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One minus source alpha","spawn_mode":"Linear"}},{"id":63,"type":"init/init","pos":[284,1602],"size":[245.1999969482422,46],"flags":{},"order":17,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":77},{"name":"Particle data","type":"p_data","link":72}],"outputs":[{"name":"Particle system","type":"particle_system","links":[74]}],"properties":{"trail_u_size":true,"trail_u_color":true,"trail_u_texture":true}},{"id":50,"type":"modify/modify property","pos":[981,1603],"size":[262,166],"flags":{},"order":20,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":74},{"name":"Condition","type":"condition_list","link":null},{"name":"Change equation","type":"equation","link":58},{"name":"New color","type":"color","link":57}],"outputs":[{"name":"Particle system","type":"particle_system","links":[]}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":8.49,"user_defined_start":0,"new_value":[0.52,0.468,0.368,0.6099999999999997]}},{"id":52,"type":"basic/equation","pos":[355,1757],"size":[350,200],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[58]}],"properties":{"curve_points":[[0,0],[0.14747195751636064,0],[0.4513680614124642,0.9784851629083812],[0.6749165039062492,0.9736712890625018],[1,0]]}},{"id":51,"type":"basic/color picker","pos":[470,2100],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[57]}],"properties":{"color":[0.52,0.468,0.368,0.6099999999999997]}},{"id":49,"type":"basic/color picker","pos":[-417,1909],"size":[210,130],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Color","type":"color","links":[55]}],"properties":{"color":[0.6200000000000001,0.468,0.368,0]}},{"id":8,"type":"basic/color picker","pos":[545,593],"size":[210,130],"flags":{},"order":9,"mode":0,"outputs":[{"name":"Color","type":"color","links":[24]}],"properties":{"color":[1,0.449,0.007,0.5000000000000002]}},{"id":29,"type":"basic/color picker","pos":[-43.30774653890626,1165.2123534808748],"size":[210,130],"flags":{},"order":13,"mode":0,"outputs":[{"name":"Color","type":"color","links":[32]}],"properties":{"color":[0.93,0.44900000000000007,0.007,1]}},{"id":65,"type":"spawn/emitter","pos":[-358.30774653890614,883.212353480875],"size":[389,234],"flags":{},"order":12,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Particles per wave","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Position","type":"vec3","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[76]}],"properties":{"max_particles":50,"spawn_rate":0.25,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Waves"}}],"links":[[3,4,0,3,7,"texture"],[4,5,0,3,6,"color"],[24,8,0,7,3,"color"],[28,24,0,7,2,"equation"],[32,29,0,26,6,"color"],[51,45,0,31,3,"color"],[52,28,0,26,7,"texture"],[55,49,0,48,6,"color"],[57,51,0,50,3,"color"],[58,52,0,50,2,"equation"],[59,53,0,48,7,"texture"],[65,3,0,59,1,"p_data"],[66,59,0,7,0,"particle_system"],[68,26,0,61,1,"p_data"],[69,61,0,30,0,"particle_system"],[70,61,0,31,0,"particle_system"],[72,48,0,63,1,"p_data"],[74,63,0,50,0,"particle_system"],[75,64,0,59,0,"emitter"],[76,65,0,61,0,"emitter"],[77,66,0,63,0,"emitter"]],"groups":[{"title":"Fire","bounding":[-464,-60,1726,844],"color":"#3f789e"},{"title":"Sparks","bounding":[-465,792,1729,687],"color":"#3f789e"},{"title":"Smoke","bounding":[-467,1487,1729,839],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[-466,-152,618,80],"color":"#b06634"}],"config":{},"extra":{},"version":0.4};
//Animated Textures, explosions!!!
var demo6 = {"last_node_id":21,"last_link_id":25,"nodes":[{"id":3,"type":"init/particle data","pos":[291.62706978295927,404.7696090371096],"size":[228.39999389648438,166],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":25}],"outputs":[{"name":"Particle data","type":"p_data","links":[2]}],"properties":{"max_speed":[0,2,0],"min_speed":[0,0.5,0],"max_size":0.5,"min_size":0.25,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":1,"type":"spawn/emitter","pos":[135.15608344726542,84.91375666210939],"size":[389,214],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null},{"name":"Spawn rate","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Mesh","type":"mesh","link":19}],"outputs":[{"name":"Emitter","type":"emitter","links":[1]}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Mesh","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":2,"type":"init/init","pos":[649,237],"size":[245.1999969482422,46],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":1},{"name":"Particle data","type":"p_data","link":2}],"outputs":[{"name":"Particle system","type":"particle_system","links":[20]}],"properties":{}},{"id":20,"type":"forces/gravity","pos":[1912.7686839437488,337.28221702246134],"size":[262,66],"flags":{},"order":9,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":24},{"name":"Direction","type":"vec3","link":null},{"name":"Stength","type":"number","link":null}],"outputs":[{"name":"Particle system","type":"particle_system","links":null}],"properties":{"direction":[0,0,0],"strength":0.6}},{"id":21,"type":"basic/load texture","pos":[-63,388],"size":[210,194],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[25]}],"properties":{"default_texture":"NONE","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0}},{"id":15,"type":"basic/load mesh","pos":[-99,136],"size":[210,160.6300048828125],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null},{"name":"Scale","type":"vec3","link":null},{"name":"Rotation","type":"vec3","link":null},{"name":"Color","type":"color","link":null}],"outputs":[{"name":"Mesh","type":"mesh","links":[19]}],"properties":{"name":"plane","position":[0,0,0],"scale":[10,10,1],"rotation":[90,0,0],"color":[1,1,1,0.25]}},{"id":17,"type":"init/init","pos":[1628.7686839437488,319.28221702246134],"size":[245.1999969482422,46],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Emitter","type":"emitter","link":21},{"name":"Particle data","type":"p_data","link":22}],"outputs":[{"name":"Particle system","type":"particle_system","links":[24]}],"properties":{}},{"id":18,"type":"init/particle data","pos":[1343.7686839437488,358.2822170224613],"size":[228.39999389648438,166],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null},{"name":"Min speed","type":"vec3","link":null},{"name":"Max life time","type":"number","link":null},{"name":"Min life time","type":"number","link":null},{"name":"Max size","type":"number","link":null},{"name":"Min size","type":"number","link":null},{"name":"Color","type":"color","link":null},{"name":"Texture","type":"texture","link":23}],"outputs":[{"name":"Particle data","type":"p_data","links":[22]}],"properties":{"max_speed":[0.15,0.15,0.15],"min_speed":[-0.15,-0.15,-0.15],"max_size":1,"min_size":0.5,"max_life_time":2,"min_life_time":1,"color":[1,1,1,1],"position":[-3.5310174375402847,15.273828218033735,-0.2220818105073663]}},{"id":16,"type":"spawn/sub emitter","pos":[1345.7686839437488,228.28221702246123],"size":[220,86],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":20},{"name":"Max particles","type":"number","link":null},{"name":"Particles per wave","type":"number","link":null},{"name":"Condition","type":"condition_list","link":null}],"outputs":[{"name":"Emitter","type":"emitter","links":[21]}],"properties":{"max_particles":10,"particles_per_wave":10}},{"id":19,"type":"basic/load texture","pos":[762,386],"size":[260,290],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[23]}],"properties":{"default_texture":"AnimatedExplosion","subtextures":true,"textures_x":6,"textures_y":1,"animated":true,"anim_loop":false,"anim_duration":0}}],"links":[[1,1,0,2,0,"emitter"],[2,3,0,2,1,"p_data"],[19,15,0,1,3,"mesh"],[20,2,0,16,0,"particle_system"],[21,16,0,17,0,"emitter"],[22,18,0,17,1,"p_data"],[23,19,0,18,7,"texture"],[24,17,0,20,0,"particle_system"],[25,21,0,3,7,"texture"]],"groups":[{"title":"In the emitter, the basic information of the system is defined","bounding":[-109,13,646,296],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-109,319,672,269],"color":"#3f789e"},{"title":"The particles are spawned and a default movement is applied","bounding":[589,153,668,146],"color":"#3f789e"},{"title":"The sub emitter spawns particles when one \"main\" particle dies","bounding":[1266,151,929,448],"color":"#3f789e"},{"title":"Oh, look! An animated texture","bounding":[722,313,339,385],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};

/*    Default Textures    */
var spawner_text;
var vortex_text;
var magnet_text;
var particle_text;

/*   Default Meshes      */
var grid;


/********************************/
/*************Modals*************/
/********************************/
var texture_modal;
var def_texture_1, def_texture_2, def_texture_3;
var def_texture_4, def_texture_5, local_texture;

var mesh_modal;
var def_mesh_1, def_mesh_2, def_mesh_3, def_mesh_4, def_mesh_5;
var def_mesh_6, def_mesh_7, def_mesh_8, def_mesh_9;
var url_mesh, custom_mesh;

var export_modal;
var export_modal_msg;

var demos_modal;
/********************************/
/********************************/
/********************************/


/*
* 	Change the width of both canvases depending of the division button position
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
* 	Calculus for get the correct position, using percentages, of the division button when the screen is resized
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
}


/*
* 	Initialization of the division button
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

	playButton   = document.getElementById("play");
	resetButton  = document.getElementById("reset");
	stopButton   = document.getElementById("stop");

	var demoButton   = document.getElementById("demos");
	var helpButton   = document.getElementById("help");

	var showDemo1Button = document.getElementById("defaultDemo");
	var showDemo2Button = document.getElementById("conditonsPropertiesDemo");
	var showDemo3Button = document.getElementById("merginConditionsDemo");
	var showDemo4Button = document.getElementById("forcesDemo");
	var showDemo5Button = document.getElementById("fireDemo");
	var showDemo6Button = document.getElementById("animatedDemo");

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

		var blob = new Blob(jsonGraph, {type: "text/plain;charset=utf-8"});
		
		var url = window.URL || window.webkitURL;
		link = url.createObjectURL(blob);

		var savedGraph = document.createElement("a");
		savedGraph.download = "Graph.dx";
		savedGraph.href = link;

		document.body.appendChild(savedGraph);
		savedGraph.click();
		document.body.removeChild(savedGraph);

		export_modal.modal('hide');
	}

	exportButton.onclick = function(){
		export_modal.modal('hide');
		export_modal_msg.modal('show')
		.on('shown.bs.modal', function(e){
			exporter();
		})
	}

	playButton.onclick = function() {
		graph.start();
		is_graph_running = true;
    	emergency_stop  = false;
    	playButton.className = "button-secondary red_color";
    	stopButton.className = "button-secondary";
	}

	stopButton.onclick = function() {
		graph.stop();
		is_graph_running = false;
    	stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
    }

	resetButton.onclick = function() {
		var system, particles, ids, toReset, particle;
		var subEmittors, subEmitter;

		for (var i = 0; i < system_list.length; ++i)
			resetSystem(system_list[i]);	
	}

	showDemo1Button.onclick =function() {
		graph.configure( Object.assign({}, demo1) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}

	showDemo2Button.onclick =function() {
		graph.configure( Object.assign({}, demo2) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}

	showDemo3Button.onclick =function() {
		graph.configure( Object.assign({}, demo3) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}

	showDemo4Button.onclick =function() {
		graph.configure( Object.assign({}, demo4) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}

	showDemo5Button.onclick =function() {
		graph.configure( Object.assign({}, demo5) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}

	showDemo6Button.onclick =function() {
		graph.configure( Object.assign({}, demo6) ); 
		demos_modal.modal('hide');

		stopButton.className = "button-secondary red_color";
    	playButton.className = "button-secondary";
	}
}


/*
*	Initialization of the buttons in the gl canvas
*	@method initMenuButtons
*/
function initCanvasButtons ()
{
	//Event to remove the color pickers if the user clicks on one canvas
	document.getElementById("graphAngWebGL").onclick = function()
	{
		var color_picker = document.getElementsByClassName("jscolor-picker-wrap");

		if(color_picker.length != 0)
		{
			times_clicked++;

			//For avoid that the first time that is clicked automatically hide the color picker
			if(times_clicked%2 == 0)
				jscolor.hide();
		}
	}

	document.getElementById("backgroundColorIcon").onclick = function()
	{
		times_clicked = 0;
	}

	document.getElementById("pickerGrid").onclick = function()
	{
		times_clicked = 0;
	}

	document.getElementById("pickerLine").onclick = function()
	{
		times_clicked = 0;
	}

	c_buttonGrid = document.getElementById("gridIcon");
	c_buttonLine = document.getElementById("lineIcon");

	c_buttonGrid.onclick = function()
	{
		showGrid = !showGrid;

		if(showGrid)
			c_buttonGrid.className = "icon icon-selected";
		else
			c_buttonGrid.className = "icon";
	}

	c_buttonLine.onclick = function()
	{
		showLines = !showLines;

		if(showLines)
			c_buttonLine.className = "icon icon-selected";
		else
			c_buttonLine.className = "icon";
	}
}


/*
*	Initialization of the modals and his buttons
*	@method initModals
*/
function initModals ()
{
	/********************************/
	/*************Modals*************/
	/********************************/
	texture_modal = $('#texturesModal');
	def_texture_1 = document.getElementById("def_texture1");
	def_texture_2 = document.getElementById("def_texture2");
	def_texture_3 = document.getElementById("def_texture3");
	def_texture_4 = document.getElementById("def_texture4");
	def_texture_5 = document.getElementById("def_texture5");
	local_texture = document.getElementById("texture_local");


	/********************************/
	/*************Meshes*************/
	/********************************/
	mesh_modal  = $('#meshesModal');
	def_mesh_1  = document.getElementById("def_mesh1");
	def_mesh_2  = document.getElementById("def_mesh2");
	def_mesh_3  = document.getElementById("def_mesh3");
	def_mesh_4  = document.getElementById("def_mesh4");
	def_mesh_5  = document.getElementById("def_mesh5");
	def_mesh_6  = document.getElementById("def_mesh6");
	def_mesh_7  = document.getElementById("def_mesh7");
	def_mesh_8  = document.getElementById("def_mesh8");
	def_mesh_9  = document.getElementById("def_mesh9");
	url_mesh    = document.getElementById("mesh_url");
	custom_mesh = document.getElementById("mesh_custom");
    
    /********************************/
	/*************Export*************/
	/********************************/
	export_modal = $('#exportModal');
	export_modal_msg = $("#exportingMessage");

    /********************************/
	/*************Demos**************/
	/********************************/
	demos_modal = $('#demosModal');
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
	LiteGraph.registerNodeType("basic/equation"       , equationNode);
	LiteGraph.registerNodeType("basic/vector 2"       , vector2Node);
	LiteGraph.registerNodeType("basic/vector 3"       , vector3Node);
	LiteGraph.registerNodeType("basic/vector 4"       , vector4Node);
	LiteGraph.registerNodeType("basic/color picker"   , colorPickerNode);
	
	LiteGraph.registerNodeType("spawn/emitter"        , mySpawnNode);
	LiteGraph.registerNodeType("spawn/sub emitter"    , subEmitterNode);
	LiteGraph.registerNodeType("init/init"            , initParticlesNode);
	LiteGraph.registerNodeType("init/particle data"   , particleDataNode);

	LiteGraph.registerNodeType("forces/gravity"       , gravityNode);
	LiteGraph.registerNodeType("forces/vortex"        , vortexNode);
	LiteGraph.registerNodeType("forces/magnet point"  , magnetNode);

	LiteGraph.registerNodeType("conditions/create condition", createConditionNode);
	LiteGraph.registerNodeType("conditions/merge conditions", mergeConditionsNode);

	LiteGraph.registerNodeType("modify/modify property", modifyPropertyNode);
}


/*
* 	Initialization of both canvases, menu and division buttons.
*	@method init
*/
function init () 
{
	//Inicialization of the graph canvas
	graph = new LGraph();
	graphCanvas = new LGraphCanvas('#graphCanvas', graph);
	is_graph_running = false;
	graph.stop(); //by default always will be stoped
	addNodes();

	//Inicialization of the litegl canvas (Webgl2)
	gl = GL.create({version:2, width:100, height:100});
	particleCanvas = document.getElementById('particleContainer');
	particleCanvas.appendChild(gl.canvas);
	particleCanvas.children[0].classList.add('gl-canvas');

	//Canvas containers inicilization
	graphLi = $('#graphLi');
	glLi    = $('#particleLi');
	root    = $('#root');
	widthCanvasContainer = root.width();	
	navbar = document.getElementById('menu');

	//buttons inicialization
	initMenuButtons();
	initCanvasButtons();
	initDivisionButton();

	//Modals inicialization
	initModals();

	camera = new Camera(gl, [0,0,0], [-0.36,7.36,16.74]);

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

	//Loading the grid
	grid = Mesh.grid({size: 1000, lines: 200});

	resizeElements(); //First time that the application is executed we need to resize both canvases

	//Listener for the window resize, this is for make the application responsive
	window.addEventListener('resize', function(){resizeElements()});

	graphCanvas.onShowNodePanel = onShowNodePanel.bind(this);

	//When the screen is not visible the graph execution will be paused (for eficiency)
	document.addEventListener("visibilitychange", function(){
		if (is_graph_running && graph.status == LGraph.STATUS_RUNNING)
		{
			graph.stop();
			stopButton.className = "button-secondary red_color";
    		playButton.className = "button-secondary";
		}
	});

	nodePanel = document.getElementById("nodeDisplay");
	nodePanel.addEventListener("mouseleave", function() {panel_focus = false;});
	nodePanel.addEventListener("mouseenter", function() {panel_focus = true;});

	//For detect changes in the nodeDisplay div
	//https://api.jquery.com/on/
	//https://stackoverflow.com/questions/15657686/jquery-event-detect-changes-to-the-html-text-of-a-div
	$('body').on('DOMSubtreeModified', '#nodeDisplay', function(){
		var child = nodePanel.children[0];
	  	if(child == undefined)
	  		panel_focus = false;
	  	
	});

	//Listener for close with escape the panel info
	document.addEventListener('keydown', (event) => {
	  const keyName = event.key;

	  if(event.key == "Escape")
	  {	  	
	  	var child = nodePanel.children[0];
	  	if(child != undefined)
	  	{
	  		panel_focus = false;
	  		child.remove();
	  	}
	  }
	});

	//Alert in chase of window close
	window.onbeforeunload = function() {
	    return "Did you save your work?"
	}
}


init();


/*************************************************/
/****************SHADER DEFINITION****************/
/*************************************************/
var flatShader     =  new GL.Shader(vs_basic_point, fs_point_flat);
var texturedShader =  new GL.Shader(vs_basic_point, fs_point_texture);

var particleShaderTextured =  new GL.Shader(vs_particles, fs_texture);
var particleShaderFlat     =  new GL.Shader(vs_particles, fs_flat_p);

var linesShader = new GL.Shader(vs_basic_point, fs_lines_flat);
var fogShader   = new GL.Shader(vs_fog, fs_fog);

/*
*	Change the background color of the litegl canvas
*	@method updateColorBack
*	@params {jscolor} the color picker 
*/
function updateColorBack(picker)
{
	var channels = picker.channels;

    backgroundColor[0] = channels.r / 255.0;
    backgroundColor[1] = channels.g / 255.0;
    backgroundColor[2] = channels.b / 255.0;
    backgroundColor[3] = 0.0;//channels.a;
}

/*
*	Change the grid color 
*	@method updateColorGrid
*	@params {jscolor} the color picker 
*/
function updateColorGrid(picker)
{
	var channels = picker.channels;

    gridColor[0] = channels.r / 255.0;
    gridColor[1] = channels.g / 255.0;
    gridColor[2] = channels.b / 255.0;
    gridColor[3] = channels.a;
}

/*
*	Change the lines color
*	@method updateColorLine
*	@params {jscolor} the color picker 
*/
function updateColorLine(picker)
{
	var channels = picker.channels;

    linesColor[0] = channels.r / 255.0;
    linesColor[1] = channels.g / 255.0;
    linesColor[2] = channels.b / 255.0;
    linesColor[3] = channels.a;
}

/*************************************************/
/********************RENDER***********************/
/*************************************************/
var num_frames      = 0;
var num_slow_frames = 0;
var max_slow_frames = 10;
var update_frames   = 10;
var ordeningMade    = false;
var object_uniforms, system_uniforms, particles_uniforms, forces_uniforms, grid_uniforms;

/*
*	Define the uniforms for every shader
*	@method setUniforms
*/
function setUniforms() 
{
	object_uniforms = {
		u_mvp: camera.mvp,
		u_model: mat4.IDENTITY,
		u_color: linesColor
	}

	grid_uniforms = {
		u_mvp: camera.mvp,
		u_model: mat4.IDENTITY,
		u_color: gridColor,
		u_fogColor: backgroundColor,
		u_fogFarNear: [0.1, 270.0]
	}

	//default sytem uniforms
	system_uniforms = { 
		u_mvp: camera.mvp,
		u_texture: spawner_text,
		u_model: undefined
	};

	//default particles uniforms
	particles_uniforms = { 
		u_viewprojection : camera.vp,
		u_mvp            : camera.mvp,
		u_right          : camera.getRightVector(),
		u_up             : camera.getUpVector(),
		u_model          : undefined
	};

	//default forces uniforms
	forces_uniforms = {
		u_mvp: camera.mvp,
		u_model: undefined
	}
}


/*
*	The render of the application
*	@method gl.ondraw
*/
gl.ondraw = function() 
{

	num_frames++;

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clear(gl.DEPTH_BUFFER_BIT);

	gl.enable(gl.BLEND);
	gl.blendEquation(gl.FUNC_ADD);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);

	gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);

	setUniforms();

	gl.depthMask(true);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	//Render of the grid
	if(showGrid)
		fogShader.uniforms(grid_uniforms).draw(grid, GL.LINES);

	gl.depthMask(false);

	//Render the particles
	for(var i = 0; i < system_list.length; ++i){
		var system = system_list[i];

		if(system.max_particles <= 0)
			continue;

		//Draw the lines!!
		if(showLines == true)
		{
			gl.depthMask(true);
			linesShader.uniforms(object_uniforms).draw(system.line_mesh, GL.LINES);
			gl.depthMask(false);	
		}

		gl.blendFunc(system.src_bfact, system.dst_bfact);

		var mesh = system.particles_mesh;

		if(system.origin == "Point")
		{
			particles_uniforms.u_model = system.model;
			system_uniforms.u_model    = system.model;
		}
		else if(system.origin == "Mesh")
		{
			particles_uniforms.u_model = identity;
			system_uniforms.u_model    = system.external_model;		
		}

		//First all the particles of the system are rendered
		//If a atlas is defined then the textured shader is used
		//but if is undefined the flat shader will be used 
		if(system.atlas == undefined)
			particleShaderFlat.uniforms(particles_uniforms).draw(mesh);
		else
		{
			particles_uniforms.u_texture = system.atlas;
			particles_uniforms.u_texture.bind(0);
			particleShaderTextured.uniforms(particles_uniforms).draw(mesh);
			particles_uniforms.u_texture.unbind(0);
		}

		//If the user wants to see the origin of the particles
		//then it will be rendered using the default texture
		if(system.visible && system.origin == "Point")
		{
			system_uniforms.u_color = system.color;
			system_uniforms.u_model = system.model;
			system_uniforms.u_texture.bind(0);
			texturedShader.uniforms(system_uniforms).draw(default_forces_mesh, GL.POINTS);
			system_uniforms.u_texture.unbind(0);
		}
	}

	for (x in forces_list){
		var force = forces_list[x];

		//If the user wants to see the origin of the force
		//then it will be rendered using the default texture
		if(!force.visible || force.type == "gravity")
			continue;

		forces_uniforms.u_model = force.model;
		forces_uniforms.u_color = force.color;
		
		if (force.type == "vortex")
			forces_uniforms.u_texture = vortex_text;
		else
			forces_uniforms.u_texture = magnet_text;

		forces_uniforms.u_texture.bind(0);
		texturedShader.uniforms(forces_uniforms).draw(default_forces_mesh, GL.POINTS);
		forces_uniforms.u_texture.unbind(0);
	}

	gl.depthMask(true);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	for (var i = 0; i < objects_list.length; ++i) {
		var object = objects_list[i];

		if(!object.visibility || object.mesh == undefined)
			continue;

		object_uniforms.u_model = object.model;
		object_uniforms.u_color = object.color;
		flatShader.uniforms(object_uniforms).draw(object.mesh);
	}


	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.BLEND);
}

/*
* 	Ordination of the particles & saving the actual position, depending on how far from the camera they are
*	@method orderParticles
*	@params {system_info} the information of the particle system 
*	@params {list} the list of the ids of the particles
*	@params {list} the list of the ids of the subemittors
*	@params {list} the list of all the particles in the system
*	@params {camera} the camera
*	@params {mesh} the mesh of all the particles
*/
function orderParticles(system, particle_ids, subem_ids, particle_list, camera, particles_mesh)
{
	var particle, distance, all_ids;

	//only order the particles every 10 frames and when the graph is running
	if(num_frames >= update_frames && !emergency_stop)
	{	

		ordeningMade = true;

		for (var j = 0; j < particle_ids.length; ++j)
		{
			distance = [0,0,0];
			particle = particle_list[particle_ids[j].id];

			//Compute the distance from the particle position to the camera eye
			for(var k = 0; k < 3; ++k)
				distance[k] = particle.position[k] - camera.eye[k];

			//particles_ids saves the id (index in particle list) and the distance to the eye
			particle_ids[j].distance_to_camera = Math.sqrt((distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2]));
		}

		for (var j = 0; j < subem_ids.length; ++j)
		{
			distance = [0,0,0];
			particle = particle_list[subem_ids[j].id];

			//Compute the distance from the particle position to the camera eye
			for(var k = 0; k < 3; ++k)
				distance[k] = particle.position[k] - camera.eye[k];

			//particles_ids saves the id (index in particle list) and the distance to the eye
			subem_ids[j].distance_to_camera = Math.sqrt((distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2]));
		}

		//Ordening (descendent)
		particle_ids.sort(function(a,b){
			return b.distance_to_camera - a.distance_to_camera;
		});

		//Ordening (descendent)
		subem_ids.sort(function(a,b){
			return b.distance_to_camera - a.distance_to_camera;
		});

		all_ids = particle_ids.concat(subem_ids);
		all_ids.sort(function(a,b){
			return b.distance_to_camera - a.distance_to_camera;
		});
		system.all_ids = all_ids;

		system.orderBuffers(particle_list);
		return;
	}

	//If the graph is stoped don't order anything!!
    if(!emergency_stop)
    {
    	if(system.all_ids == undefined)
    	{
	    	all_ids = particle_ids.concat(subem_ids);
			all_ids.sort(function(a,b){
				return b.distance_to_camera - a.distance_to_camera;
			});	
			system.all_ids = all_ids;
    	}
		
		//function that reorder the buffers
	    system.orderBuffers(particle_list);
	    return;
	}
}

/*
*	Merge the ids of all the subemittors
*	@method mergeSubEmittorsIds
*	@params {system_info} the information of the particle system 
*	@params {list} the list of the sub_emittors 
*/
function mergeSubEmittorsIds(system, sub_emittors)
{
	system.sub_emission_ids = [];
	var ids;

	for(var i = 0; i < sub_emittors.length; ++i)
	{
		ids = sub_emittors[i].ids;
		for(var j = 0; j < ids.length; ++j)
			system.sub_emission_ids.push(ids[j]);
	}

    return system.sub_emission_ids;
}

/*************************************************/
/********************UPDATE***********************/
/*************************************************/
/*
*	The update
*	@method gl.onupdate
*/
gl.onupdate = function( dt ) {
	time_interval = dt;
	camera.update();

	//If time interval is greater than 5 seconds, then the systems goes very slow and is better to stop it
	if(time_interval >= 0.4 && !emergency_stop)
    {
    	num_slow_frames++;

    	if(num_slow_frames == max_slow_frames)
    	{
    		num_slow_frames = 0;
    		createAlert('Holy Guacamole!','Low FPS','The fps are very low, check what you do...','danger',true,false,'pageMessages')
    		graph.stop();
    		stopButton.className = "button-secondary red_color";
    		playButton.className = "button-secondary";
    		emergency_stop   = true;
			is_graph_running = false;
    	}
    }
    else
    {
    	num_slow_frames = 0;
    }

	var force, system;
	var particle_list, particle_ids, subem_ids;
	var distance;
	var textures, changes, mergerOut, sub_emittor;

	//The model of the forces and systems is updated
	for (var i = 0; i < forces_list.length; ++i)
	{
		force = forces_list[i];

		if(force.type == "gravity")
			continue;

		mat4.setTranslation(force.model, force.position);
	}

	//And the systems are ordered depending on the distance to the camera, the textures are recovered 
	for (var i = 0; i < system_list.length; ++i)
	{
		system        = system_list[i];
		particle_list = system.particles_list;
		particle_ids  = system.particles_ids;
        subem_ids     = mergeSubEmittorsIds(system, system.sub_emittors);

		mat4.setTranslation(system.model, system.position);

		distance = [0,0,0];
		for(var k = 0; k < 3; ++k)
			distance[k] = system.position[k] - camera.eye[k];

		system.distance_to_camera = Math.sqrt((distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2]));;

		//Update particles distance_to_camera
		orderParticles(system, particle_ids, subem_ids, particle_list, camera, system.particles_mesh);
		
		if(system.texture_change)
		{
			textures = [];

			if(system.texture.file != undefined)
			{
				system.texture.id = 1;
				textures.push(system.texture.file);
			}
			else
				system.texture.id = 0;

			for(var j = 0; j < system.sub_emittors.length; ++j)
			{
				sub_emittor = system.sub_emittors[j];

				if(sub_emittor.texture.file != undefined)
				{
					textures.push(sub_emittor.texture.file);
					sub_emittor.texture.id = j + 1 + system.texture.id;
				}
				else
					sub_emittor.texture.id = 0;
			}
			
			//Merge the textures (Atlas creation)
			mergerOut = TextureMerger(textures);

			system.atlas = mergerOut[0];
			system.uvs   = mergerOut[1];

			system.texture_change = false;
		}
	}

	if (ordeningMade)
	{
		num_frames = 0;
		ordeningMade = false;
	}

	system_list.sort(function(a,b){
		return b.distance_to_camera - a.distance_to_camera;
	});

	if(graph.status == LGraph.STATUS_RUNNING)
	graph.runStep();
}

gl.animate(); //calls the requestAnimFrame constantly, which will call ondraw