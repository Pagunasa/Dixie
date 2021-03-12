/*	Guillem Martínez Jiménez		
*   In this file you can find the main behaviour of the camera
*/
var vs_basic_point = '#version 300 es \n \
				\
				precision highp float;\
				in float a_visible;\
				in vec3 a_vertex;\
				\
				out vec3 v_world_position;\
				out vec2 v_coord;\
				out float v_visible;\
				\
				uniform mat4 u_mvp;\
				uniform mat4 u_model;\
				\
				void main() {\
					v_world_position = (u_model * vec4(a_vertex, 1.0)).xyz;\
					v_visible = a_visible;\
					gl_Position = u_mvp * vec4(v_world_position, 1.0);\
					gl_PointSize = 200.0 / gl_Position.z;\
				}';

var fs_point_flat =  '#version 300 es \n \
				precision highp float;\
				out vec4 fragColor;\
				\
				precision highp float;\
				uniform vec4 u_color;\
				\
				void main() {\
					fragColor = u_color;\
				}';

var fs_lines_flat =  '#version 300 es \n \
				precision highp float;\
				in float v_visible;\
				out vec4 fragColor;\
				\
				precision highp float;\
				uniform vec4 u_color;\
				\
				void main() {\
					if (v_visible == 0.0) discard;\
					fragColor = u_color;\
				}';

//For doing the billboard I follow the next tutorial
//http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
var vs_particles = '#version 300 es \n \
					\
					precision highp float;\
					\
					in vec3 a_vertex;\
					in vec3 a_normal;\
					in vec2 a_coord;\
					in vec2 a_icoord;\
					in vec4 a_color;\
					in vec2 a_size;\
					in float a_visible;\
					\
					out vec4 v_color;\
					out vec3 v_normal;\
					out vec3 v_pos;\
					out vec2 v_coord;\
					out float v_visible;\
					\
					uniform mat4 u_viewprojection;\
					uniform mat4 u_mvp;\
					uniform mat4 u_model;\
					uniform vec3 u_up;\
					uniform vec3 u_right;\
					\
					\
					void main() {\
						v_visible = a_visible;\
						v_coord   = a_coord;\
						v_color   = a_color;\
						v_normal  = (u_model * vec4(a_normal, 0.0)).xyz;\
						v_pos = a_vertex + u_right * a_icoord.x * a_size.x + u_up * a_icoord.y * a_size.y;\
						gl_Position = u_mvp * (u_model * vec4(v_pos, 1.0));\
					}';


var fs_flat_p ='#version 300 es \n \
				\
				precision highp float;\
				in vec4 v_color;\
				in float v_visible;\
				out vec4 fragColor;\
				\
				void main() {\
					if (v_visible == 0.0) discard;\
					fragColor = v_color;\
				}';

var fs_texture =   '#version 300 es \n \
					\
					precision highp float;\
					in vec4 v_color;\
					in vec2 v_coord;\
					in float v_visible;\
					out vec4 fragColor;\
					uniform sampler2D u_texture;\
					\
					void main() {\
						if (v_visible == 0.0) discard;\
						vec4 color = v_color * texture(u_texture, v_coord);\
						if (color.a < 0.1)\
							discard;\
						fragColor = color;\
					}';


var fs_point_texture = '#version 300 es \n \
						\
						precision highp float;\
						uniform vec4 u_color;\
						uniform sampler2D u_texture;\
						out vec4 fragColor;\
						\
						void main() {\
							vec4 color = u_color * texture(u_texture, gl_PointCoord);\
							if (color.a < 0.1)\
								discard;\
							fragColor = color;\
						}';


var vs_fog = '#version 300 es \n \
				\
				precision highp float;\
				in vec3 a_vertex;\
				\
				out vec3 v_world_position;\
				out float v_fogDepth;\
				\
				uniform mat4 u_mvp;\
				uniform mat4 u_model;\
				\
				void main() {\
					v_world_position = (u_model * vec4(a_vertex, 1.0)).xyz;\
					vec4 pos = u_mvp * vec4(v_world_position, 1.0);\
					v_fogDepth  = (pos.z);\
					gl_Position = pos;\
				}';

var fs_fog =   '#version 300 es \n \
				\
				precision highp float;\
				\
				uniform vec4 u_color;\
				uniform vec4 u_fogColor;\
				uniform vec2 u_fogFarNear;\
				\
				in float v_fogDepth;\
				\
				out vec4 fragColor;\
				\
				void main() {\
					float fogAmount = smoothstep(u_fogFarNear.x, u_fogFarNear.y, v_fogDepth);\
					fragColor = mix(u_color, u_fogColor, fogAmount);\
				}';