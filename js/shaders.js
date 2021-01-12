/*	Guillem Martínez Jiménez		
*   In this file you can find the main behaviour of the camera
*/

var vs_basic = '\
				precision highp float;\
				attribute vec3 a_vertex;\
				varying vec4 v_color;\
				varying vec2 v_coord;\
				uniform mat4 u_mvp;\
				\
				void main() {\
					gl_Position = u_mvp * vec4(a_vertex, 1.0);\
					gl_PointSize = 200.0 / gl_Position.z;\
				}';

var fs_flat = '\
				precision highp float;\
				uniform vec4 u_color;\
				\
				void main() {\
					gl_FragColor = u_color;\
				}';


var vs_particles = '\
					precision highp float;\
					\
					attribute vec3 a_vertex;\
					attribute vec3 a_normal;\
					attribute vec2 a_coord;\
					\
					varying vec4 v_color;\
					varying vec3 v_normal;\
					varying vec3 v_world_position;\
					varying vec3 v_pos;\
					varying vec2 v_coord;\
					\
					uniform mat4 u_model;\
					uniform mat4 u_viewprojection;\
					uniform mat4 u_mvp;\
					\
					\
					void main() {\
						v_coord = a_coord;\
						v_normal = (u_model * vec4(a_normal, 0.0)).xyz;\
						v_world_position = (u_model * vec4(a_vertex, 1.0)).xyz;\
						gl_Position = u_mvp * vec4(v_world_position, 1.0);\
					}';

var fs_texture = '\
					precision highp float;\
					uniform vec4 u_color;\
					uniform sampler2D u_texture;\
					varying vec2 v_coord;\
					\
					void main() {\
						vec4 color = u_color * texture2D(u_texture, v_coord);\
						if (color.a < 0.1)\
							discard;\
						gl_FragColor = color;\
					}';