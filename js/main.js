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
var graphHTML;
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

//FPS
var fps_display;
var fps, l_fps;
var last_t;
var curr_t;
var frames_until_display_update = 5;
var c_f = 0;

/* Demos */
//Default start
var demo1 = {"last_node_id":5,"last_link_id":3,"nodes":[{"id":5,"type":"init/particle data","pos":[90.58060990600596,519.005224511719],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":null,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[3],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":4,"type":"spawn/emitter","pos":[495,125],"size":[389,234],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":3,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}}],"links":[[3,5,0,4,3,"p_data"]],"groups":[{"title":"In the emitter, the basic information of the system is defined and a default movement is applied to the particles","bounding":[153,12,1190,397],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-59,439,672,269],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Conditions & properties
var demo2 = {"last_node_id":13,"last_link_id":14,"nodes":[{"id":6,"type":"modify/modify property","pos":[1680.5130062968742,-193.1025219136718],"size":[262,166],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":11,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Speed","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[0,0,0]}},{"id":7,"type":"modify/modify property","pos":[2286.513006296875,-171.10252191367186],"size":[262,214],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Speed","application_mode":"Equalization","modification_mode":"User defined","user_defined_seconds":5,"user_defined_start":2,"new_value":[0,0,0]}},{"id":9,"type":"modify/modify property","pos":[2202,180],"size":[262,166],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":13,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":5,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":6,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":5,"user_defined_start":2,"new_value":[0.7686274509803922,0.10588235294117647,0.5725490196078431,0]}},{"id":11,"type":"basic/equation","pos":[1493,832],"size":[350,200],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[8],"color_off":"#CC008B","color_on":"#FF99DF"}],"properties":{"curve_points":[[0,0],[0.1381622276549537,0],[0.37198629443966574,0.8875948342289461],[0.676470800493037,0.886486506726917],[0.8602050233265994,0],[1,0]]}},{"id":5,"type":"init/particle data","pos":[91,519],"size":[228.39999389648438,166],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":null,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[10],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":8,"type":"conditions/create condition","pos":[1558,455],"size":[270,126],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":12,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Condition","type":"condition_list","links":[5],"color_off":"#7700CC","color_on":"#D499FF"}],"properties":{"system_property":"Life time","condition":"Greater than or equals","is_one_time":false,"value":1}},{"id":13,"type":"spawn/emitter","pos":[503,113],"size":[389,234],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":10,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[11,12,13,14],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":12,"type":"modify/modify property","pos":[2015,851],"size":[262,166],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":14,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":8,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Size","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":1}},{"id":10,"type":"basic/color picker","pos":[1910,471],"size":[210,130],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Color","type":"color","links":[6],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.7686274509803922,0.10588235294117647,0.5725490196078431,0]}}],"links":[[5,8,0,9,1,"condition_list"],[6,10,0,9,3,"color"],[8,11,0,12,2,"equation"],[10,5,0,13,3,"p_data"],[11,13,0,6,0,"particle_system"],[12,13,0,8,0,"particle_system"],[13,13,0,9,0,"particle_system"],[14,13,0,12,0,"particle_system"]],"groups":[{"title":"In the emitter, the basic information of the system is defined and a default movement is applied to the particles","bounding":[153,12,1190,397],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-59,439,672,269],"color":"#3f789e"},{"title":"¿What options you have?","bounding":[1374,-369,1479,1449],"color":"#a1309b"},{"title":"You can modify the properties directly along the particle lifetime","bounding":[1472,-274,697,262],"color":"#8A8"},{"title":"Or you can define the time for making the modification","bounding":[2181,-274,583,330],"color":"#8A8"},{"title":"Meet the conditions!!!","bounding":[1466,118,1079,500],"color":"#b58b2a"},{"title":"Or use an equation","bounding":[1465,682,870,361],"color":"#A88"}],"config":{},"extra":{},"version":0.4};
//Mergin conditions
var demo3 = {"last_node_id":18,"last_link_id":22,"nodes":[{"id":7,"type":"modify/modify property","pos":[1493.419177726563,-258.8307152382812],"size":[262,166],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":15,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Size","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":5,"user_defined_start":2,"new_value":0}},{"id":5,"type":"init/particle data","pos":[91,519],"size":[228.39999389648438,166],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":null,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[10],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":1,"min_size":0.8,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":15,"type":"conditions/create condition","pos":[1516.419177726563,704.1692847617189],"size":[270,126],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":19,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Condition","type":"condition_list","links":[16],"color_off":"#7700CC","color_on":"#D499FF"}],"properties":{"system_property":"Life time","condition":"Greater than or equals","is_one_time":false,"value":1}},{"id":18,"type":"conditions/merge conditions","pos":[1856.419177726563,780.1692847617189],"size":[210,78],"flags":{},"order":7,"mode":0,"inputs":[{"name":"Condition 1","type":"condition_list","link":16,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"condition 2","type":"condition_list","link":17,"color_off":"#7700CC","color_on":"#D499FF"}],"outputs":[{"name":"Condition","type":"condition_list","links":[18],"color_off":"#7700CC","color_on":"#D499FF"}],"properties":{"merge_mode":"And"}},{"id":8,"type":"conditions/create condition","pos":[1530.208731046876,307.2722798369447],"size":[270,126],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":21,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Condition","type":"condition_list","links":[5],"color_off":"#7700CC","color_on":"#D499FF"}],"properties":{"system_property":"Life time","condition":"Greater than or equals","is_one_time":false,"value":1}},{"id":13,"type":"spawn/emitter","pos":[599,106],"size":[389,234],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":10,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[15,19,20,21],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":16,"type":"conditions/create condition","pos":[1522.7897974609373,882.1436078613282],"size":[270,126],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":20,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Condition","type":"condition_list","links":[17],"color_off":"#7700CC","color_on":"#D499FF"}],"properties":{"system_property":"Size","condition":"Less than or equals","is_one_time":false,"value":0.7}},{"id":14,"type":"modify/modify property","pos":[2150.4191777265632,682.1692847617189],"size":[262,166],"flags":{},"order":9,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":18,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":5,"user_defined_start":2,"new_value":[0.7176470588235294,0.7686274509803922,0,0]}},{"id":10,"type":"basic/color picker","pos":[1881,335],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[6],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.7686274509803922,0.10588235294117647,0.5725490196078431,0]}},{"id":9,"type":"modify/modify property","pos":[2152,102],"size":[262,166],"flags":{},"order":8,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":5,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":6,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":5,"user_defined_start":2,"new_value":[0.7686274509803922,0.10588235294117647,0.5725490196078431,0]}}],"links":[[5,8,0,9,1,"condition_list"],[6,10,0,9,3,"color"],[10,5,0,13,3,"p_data"],[15,13,0,7,0,"particle_system"],[16,15,0,18,0,"condition_list"],[17,16,0,18,1,"condition_list"],[18,18,0,14,1,"condition_list"],[19,13,0,15,0,"particle_system"],[20,13,0,16,0,"particle_system"],[21,13,0,8,0,"particle_system"]],"groups":[{"title":"In the emitter, the basic information of the system is defined and a default movement is applied to the particles","bounding":[153,12,1190,397],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-59,439,672,269],"color":"#3f789e"},{"title":"¿How you can use the conditions?","bounding":[1362,-392,1159,1452],"color":"#a1309b"},{"title":"Using only one","bounding":[1450,-7,1020,506],"color":"#b58b2a"},{"title":"Or merging conditions","bounding":[1471,595,991,436],"color":"#A88"}],"config":{},"extra":{},"version":0.4};
//The forces
var demo4 = {"last_node_id":8,"last_link_id":6,"nodes":[{"id":5,"type":"init/particle data","pos":[90.58060990600596,519.005224511719],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":null,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[3],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[1,1,1],"min_speed":[-1,-1,-1],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}},{"id":6,"type":"forces/gravity","pos":[1621,-244.07178867187494],"size":[262,86],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Direction","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Strength","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"direction":[0,1,0],"strength":1}},{"id":7,"type":"forces/vortex","pos":[1624,15],"size":[262,158],"flags":{},"order":2,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Angular speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Scale","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"position":[0,0,0],"angular_speed":[1,1,1],"scale":10,"color":[1,1,1,1]}},{"id":4,"type":"spawn/emitter","pos":[522,125],"size":[389,234],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":3,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":8,"type":"forces/magnet point","pos":[1632,350],"size":[262,158],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":null,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Strength","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Scale","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"position":[0,5,0],"strength":1.5,"scale":10,"color":[1,1,1,1]}}],"links":[[3,5,0,4,3,"p_data"]],"groups":[{"title":"In the emitter, the basic information of the system is defined and a default movement is applied to the particles","bounding":[153,12,1190,397],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-59,439,672,269],"color":"#3f789e"},{"title":"Meet the Forces","bounding":[1530,-384,522,934],"color":"#a1309b"},{"title":"Gravity, a constant force","bounding":[1580,-331,343,196],"color":"#b58b2a"},{"title":"Vortex, a circular force","bounding":[1579,-74,341,276],"color":"#b06634"},{"title":"Magnet point, attract or repel the particles","bounding":[1573,258,453,277],"color":"#88A"}],"config":{},"extra":{},"version":0.4};
//Basic fire
var demo5 = {"last_node_id":24,"last_link_id":20,"nodes":[{"id":8,"type":"modify/modify property","pos":[1526,343],"size":[262,166],"flags":{},"order":17,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":8,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":7,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":6,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[1,0.449,0.007,0.5]}},{"id":9,"type":"basic/color picker","pos":[1224,700],"size":[210,130],"flags":{},"order":0,"mode":0,"outputs":[{"name":"Color","type":"color","links":[6],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[1,0.449,0.007,0.5]}},{"id":10,"type":"basic/equation","pos":[1001,446],"size":[350,200],"flags":{},"order":1,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[7],"color_off":"#CC008B","color_on":"#FF99DF"}],"properties":{"curve_points":[[0,0],[0.17618525390624978,0],[0.34904239676339266,0.7159844635009762],[0.41105919987230405,0.8379188263007126],[0.500725553471058,0.8676056595867865],[1,1]]}},{"id":4,"type":"spawn/emitter","pos":[920,146],"size":[389,234],"flags":{},"order":14,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":3,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[8],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":7,"type":"basic/load texture","pos":[204,617],"size":[210,192],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[5],"color_off":"#CC7A00","color_on":"#FFC670"}],"properties":{"default_texture":"smoke","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0}},{"id":6,"type":"basic/color picker","pos":[207,429],"size":[210,130],"flags":{},"order":3,"mode":0,"outputs":[{"name":"Color","type":"color","links":[4],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.972,0.945,0.549,1]}},{"id":5,"type":"init/particle data","pos":[573,423],"size":[228.39999389648438,166],"flags":{},"order":11,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":4,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":5,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[3],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[0.25,1,0.25],"min_speed":[-0.25,0.5,-0.25],"max_size":4,"min_size":2,"max_life_time":7,"min_life_time":5,"color":[0.972,0.945,0.549,1]}},{"id":13,"type":"basic/color picker","pos":[214,1142],"size":[210,130],"flags":{},"order":4,"mode":0,"outputs":[{"name":"Color","type":"color","links":[10],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.93,0.449,0.007,1]}},{"id":12,"type":"init/particle data","pos":[495,1121],"size":[228.39999389648438,166],"flags":{},"order":12,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":10,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":11,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[9],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[0.75,1,0.75],"min_speed":[-0.75,0.5,-0.75],"max_size":0.25,"min_size":0.15,"max_life_time":13,"min_life_time":11,"color":[0.93,0.449,0.007,1]}},{"id":14,"type":"basic/load texture","pos":[214,1336],"size":[210,192],"flags":{},"order":5,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[11],"color_off":"#CC7A00","color_on":"#FFC670"}],"properties":{"default_texture":"light","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0}},{"id":15,"type":"modify/modify property","pos":[1466,989],"size":[262,166],"flags":{},"order":18,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":12,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Speed","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":8.49,"user_defined_start":0,"new_value":[0,-1,0]}},{"id":16,"type":"modify/modify property","pos":[1475,1252],"size":[262,166],"flags":{},"order":19,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":14,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":null,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":13,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[0.93,0.449,0.007,0]}},{"id":17,"type":"basic/color picker","pos":[995,1357],"size":[210,130],"flags":{},"order":6,"mode":0,"outputs":[{"name":"Color","type":"color","links":[13],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.93,0.449,0.007,0]}},{"id":11,"type":"spawn/emitter","pos":[780,984],"size":[389,254],"flags":{},"order":15,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Particles per wave","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":9,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[12,14],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":50,"spawn_rate":0.15,"particles_per_wave":10,"origin":"Point","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Waves"}},{"id":22,"type":"modify/modify property","pos":[1409,1863.5845356181248],"size":[262,166],"flags":{},"order":20,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":20,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Change equation","type":"equation","link":18,"color_off":"#CC008B","color_on":"#FF99DF"},{"name":"New color","type":"color","link":19,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"changed_property":"Color","application_mode":"Equalization","modification_mode":"Along life time","user_defined_seconds":2,"user_defined_start":0,"new_value":[0.62,0.488,0.368,0.61]}},{"id":24,"type":"basic/color picker","pos":[1109,2396.584535618125],"size":[210,130],"flags":{},"order":7,"mode":0,"outputs":[{"name":"Color","type":"color","links":[19],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.62,0.488,0.368,0.61]}},{"id":23,"type":"basic/equation","pos":[820,2103.584535618125],"size":[350,200],"flags":{},"order":8,"mode":0,"outputs":[{"name":"Equation","type":"equation","links":[18],"color_off":"#CC008B","color_on":"#FF99DF"}],"properties":{"curve_points":[[0,0],[0.18322857142857174,0],[0.4563428571428572,0.9697499999999991],[0.7347670142301974,0.971119929945678],[1,0]]}},{"id":19,"type":"init/particle data","pos":[475,1964.5845356181248],"size":[228.39999389648438,166],"flags":{},"order":13,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":16,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":17,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[15],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[0.25,2,0.25],"min_speed":[-0.25,1.5,-0.25],"max_size":4,"min_size":2,"max_life_time":15,"min_life_time":13,"color":[0.62,0.488,0.368,0]}},{"id":18,"type":"spawn/emitter","pos":[811,1739.5845356181248],"size":[389,234],"flags":{},"order":16,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":15,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[20],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":300,"spawn_rate":10,"particles_per_wave":10,"origin":"Point","position":[0,2,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One minus source alpha","spawn_mode":"Linear"}},{"id":20,"type":"basic/color picker","pos":[189,1986.5845356181248],"size":[210,130],"flags":{},"order":9,"mode":0,"outputs":[{"name":"Color","type":"color","links":[16],"color_off":"#B8A800","color_on":"#FFF585"}],"properties":{"color":[0.62,0.488,0.368,0]}},{"id":21,"type":"basic/load texture","pos":[183,2170.584535618125],"size":[210,192],"flags":{},"order":10,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[17],"color_off":"#CC7A00","color_on":"#FFC670"}],"properties":{"default_texture":"smoke","subtextures":false,"textures_x":1,"textures_y":1,"animated":false,"anim_loop":false,"anim_duration":0}}],"links":[[3,5,0,4,3,"p_data"],[4,6,0,5,6,"color"],[5,7,0,5,7,"texture"],[6,9,0,8,3,"color"],[7,10,0,8,2,"equation"],[8,4,0,8,0,"particle_system"],[9,12,0,11,3,"p_data"],[10,13,0,12,6,"color"],[11,14,0,12,7,"texture"],[12,11,0,15,0,"particle_system"],[13,17,0,16,3,"color"],[14,11,0,16,0,"particle_system"],[15,19,0,18,3,"p_data"],[16,20,0,19,6,"color"],[17,21,0,19,7,"texture"],[18,23,0,22,2,"equation"],[19,24,0,22,3,"color"],[20,18,0,22,0,"particle_system"]],"groups":[{"title":"Fire","bounding":[153,12,1681,837],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"Sparks","bounding":[151,906,1680,655],"color":"#3f789e"},{"title":"Smoke","bounding":[145,1624,1684,927],"color":"#3f789e"}],"config":{},"extra":{},"version":0.4};
//Animated Textures, explosions!!!
var demo6 = {"last_node_id":10,"last_link_id":8,"nodes":[{"id":6,"type":"basic/load mesh","pos":[196,128],"size":[210,184],"flags":{},"order":1,"mode":0,"inputs":[{"name":"Position","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Scale","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Rotation","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"}],"outputs":[{"name":"Mesh","type":"mesh","links":[4],"color_off":"#7ACC00","color_on":"#B6FF47"}],"properties":{"name":"plane","position":[0,0,0],"scale":[10,10,1],"rotation":[90,0,0],"color":[1,1,1,0.25],"visibility":true}},{"id":9,"type":"basic/load texture","pos":[1036,520],"size":[260,290],"flags":{},"order":2,"mode":0,"outputs":[{"name":"Texture","type":"texture","links":[6],"color_off":"#CC7A00","color_on":"#FFC670"}],"properties":{"default_texture":"AnimatedExplosion","subtextures":true,"textures_x":6,"textures_y":1,"animated":true,"anim_loop":false,"anim_duration":0}},{"id":7,"type":"spawn/sub emitter","pos":[1726,155],"size":[287.20001220703125,106],"flags":{},"order":5,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":7,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Particles per wave","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Particle data","type":"p_data","link":5,"color_off":"#00B806","color_on":"#5CFF61"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[8],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":10,"particles_per_wave":10}},{"id":10,"type":"forces/gravity","pos":[2057,247],"size":[262,86],"flags":{},"order":6,"mode":0,"inputs":[{"name":"Particle system","type":"particle_system","link":8,"color_off":"#CC0E00","color_on":"#FF8D85"},{"name":"Condition","type":"condition_list","link":null,"color_off":"#7700CC","color_on":"#D499FF"},{"name":"Direction","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Strength","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"}],"outputs":[{"name":"Particle system","type":"particle_system","links":null,"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"direction":[0,1,0],"strength":-1}},{"id":8,"type":"init/particle data","pos":[1425,326],"size":[228.39999389648438,166],"flags":{},"order":4,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":6,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[5],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[0.15000000596046448,0.15000000596046448,0.15000000596046448],"min_speed":[-0.15000000596046448,-0.15000000596046448,-0.15000000596046448],"max_size":1,"min_size":0.5,"max_life_time":2,"min_life_time":1,"color":[1,1,1,1]}},{"id":4,"type":"spawn/emitter","pos":[705,122],"size":[389,234],"flags":{},"order":3,"mode":0,"inputs":[{"name":"Max particles","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Spawn rate","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Emitter color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Particle data","type":"p_data","link":3,"color_off":"#00B806","color_on":"#5CFF61"},{"name":"Mesh","type":"mesh","link":4,"color_off":"#7ACC00","color_on":"#B6FF47"}],"outputs":[{"name":"Particle system","type":"particle_system","links":[7],"color_off":"#CC0E00","color_on":"#FF8D85"}],"properties":{"max_particles":100,"spawn_rate":10,"particles_per_wave":10,"origin":"Mesh","position":[0,0,0],"color":[1,1,1,1],"show_origin":true,"src_bfact":"Source alpha","dst_bfact":"One","spawn_mode":"Linear"}},{"id":5,"type":"init/particle data","pos":[-51,513],"size":[228.39999389648438,166],"flags":{},"order":0,"mode":0,"inputs":[{"name":"Max speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Min speed","type":"vec3","link":null,"color_off":"#0044CC","color_on":"#85ADFF"},{"name":"Max life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min life time","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Max size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Min size","type":"number","link":null,"color_off":"#00AEB8","color_on":"#85F9FF"},{"name":"Color","type":"color","link":null,"color_off":"#B8A800","color_on":"#FFF585"},{"name":"Texture","type":"texture","link":null,"color_off":"#CC7A00","color_on":"#FFC670"}],"outputs":[{"name":"Particle data","type":"p_data","links":[3],"color_off":"#00B806","color_on":"#5CFF61"}],"properties":{"max_speed":[0,2,0],"min_speed":[0,0.5,0],"max_size":0.25,"min_size":0.1,"max_life_time":10,"min_life_time":5,"color":[1,1,1,1]}}],"links":[[3,5,0,4,3,"p_data"],[4,6,0,4,4,"mesh"],[5,8,0,7,4,"p_data"],[6,9,0,8,7,"texture"],[7,4,0,7,0,"particle_system"],[8,7,0,10,0,"particle_system"]],"groups":[{"title":"In the emitter, the basic information of the system is defined and a default movement is applied to the particles","bounding":[153,12,1190,397],"color":"#3f789e"},{"title":"Make a double click on the node to see more information","bounding":[172,-92,612,82],"color":"#b06634"},{"title":"In particle data, the default values of every particle are defined","bounding":[-121,425,672,269],"color":"#3f789e"},{"title":"The sub emitter spawns particles when one \"main\" particle dies","bounding":[1390,14,939,503],"color":"#8A8"},{"title":"Oh, look! An animated texture","bounding":[1001,439,345,395],"color":"#b06634"}],"config":{},"extra":{},"version":0.4};

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

var loading_texture_modal;

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

		//To be sure that at least one step of the graph have been
		$.when(graph.runStep()).then(
			function()
			{
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
		);
	}

	exportButton.onclick = function(){
		export_modal.modal('hide');
		export_modal_msg.modal('show');
		//The behaviour od export is in initModals!!
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
	/********Export & loading********/
	/********************************/
	export_modal = $('#exportModal');
	export_modal_msg = $("#exportingMessage");
	export_modal_msg.on('shown.bs.modal', 
		function(e){
			exporter();
		}
	);


	loading_texture_modal = $('#loadingTexture');

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
	//LiteGraph.registerNodeType("basic/vector 2"       , vector2Node);
	LiteGraph.registerNodeType("basic/vector 3"       , vector3Node);
	//LiteGraph.registerNodeType("basic/vector 4"       , vector4Node);
	LiteGraph.registerNodeType("basic/color picker"   , colorPickerNode);
	
	LiteGraph.registerNodeType("spawn/emitter"        , mySpawnNode);
	LiteGraph.registerNodeType("spawn/sub emitter"    , subEmitterNode);
	//LiteGraph.registerNodeType("init/init"            , initParticlesNode);
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

	//Get the html of the graph canvas
	graphHTML = document.querySelector("#graphCanvas");

	//Listener for closing the node panel if is enabled and someone clicks into the graph canvas
	window.addEventListener('click', function(e){
		if(panel_focus != true)
		{
			var p = document.querySelector("#node-panel");

			if(p != null)
				if (graphHTML.contains(e.target))
				{
					if(picker)
					    picker.hide();
					p.close();	
				}
		}
	});

	//Alert in chase of window close
	window.onbeforeunload = function() {
	    return "Did you save your work?"
	}

	//Get the fps display
	fps_display = document.querySelector("#fps");
	fps = 0.0;
	last_t = 0.0;
	curr_t = 0.0;
}


init();


/*************************************************/
/****************SHADER DEFINITION****************/
/*************************************************/
var flatShader     = new GL.Shader(vs_basic_point, fs_point_flat);
var texturedShader = new GL.Shader(vs_basic_point, fs_point_texture);

var particleShaderTextured = new GL.Shader(vs_particles, fs_texture);
var particleShaderFlat     = new GL.Shader(vs_particles, fs_flat_p);

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
			particles_uniforms.u_model = identity;//system.model;
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

	curr_t = LiteGraph.getTime();
	l_fps = 1 / ((curr_t - last_t) * 0.001); //ms to seconds
	last_t = curr_t;

	if(Math.abs(l_fps - fps) > 0.5)
	{
		fps = l_fps;
		fps_display.textContent = "FPS: " + l_fps.toString().slice(0,4);
	}

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
	var distance, position;
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
		position      = system.position;

		mat4.setTranslation(system.model, position);

		//In case that the origin is a mesh then we use the translation from the model to order
		if(system.origin == "Mesh" && system.origin_mesh != undefined)
			mat4.getTranslation(position, system.origin_mesh.model);

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