/*	Guillem Martínez Jiménez		
*   In this file you can find the Api for JS
*   It's possible that you have to rewrite the shaders depending on how your framework works
*/

//The globals for the API
var DixieGlobals = {
	blending_factors : ["Zero", "One", "Source Color", "One minus source color", "Destination color", "One minus destination color", "Source alpha", "One minus source alpha", "Destination alpha", "One minus destination alpha"],
	possible_origins : ["Point", "Mesh"],
	spawn_modes      : ["Linear", "Waves"],
	
	DEG2RAD : Math.PI / 180,

	force_types : ["gravity", "vortex", "magnet"],

	cond_type : ["condition", "merged conditions"],	
	cond_oper : ["Equals", "Greater than", "Less than", "Greater than or equals", "Less than or equals", "No equals"],
	cond_prop : ["Speed", "Life time", "Size"],
	cond_mode : ["And", "Or"],

	mod_prop : ["Speed", "Size", "Color", "Life time"],
	mod_appl : ["Equalization", "Addition", "Subtraction"],
	mod_modi : ["Along life time", "User defined"],

	defaultSrcbValue : "Source alpha",
	defaultDstbValue : "One",
	defaultOrigin    : "Point",
	defaultPosition  : [0,0,0],
	defaultAtlasName : "None",
	defaultUvs       : [],

	defaultTexture   :  {
					id   : -1, 
					prop : {
						subtextures   : false,
						textures_x    : 1,
						textures_y    : 1,
						animated      : false,
						anim_loop     : false,
						anim_duration : 0
						}
				},

	defaultParticleData   : {
		max_speed: [1,1,1],
		min_speed: [-1,-1,-1],

		max_size: 0.25,
		min_size: 0.10,

		max_life_time: 10,
		min_life_time: 5,
		
		color: [1,1,1,1]
	},

	defaultMesh : {
			name  : "None",
			modal : []
	},

	identity: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],

	defaultSubEmittors : [],

	defaultForces      : [],

	defaultGravity : {
		direction: [0,-1,0],
		strength: 1
	},

	defaultVortex : {
		position: [0,0,0],
		angular_speed: [1,1,1],
		scale: 10,
		color: [1,1,1,1]
	},

	defaultMagnet : {
		position: [0,0,0],
		strength: 10,
		scale: 10,
		color: [1,1,1,1]
	},

	defaultModifications : [],

	defaultConditions : [],

	default_centers    : [-1.0,-1.0,1.0, 1.0,-1.0,1.0, 1.0,1.0,1.0, 1.0,1.0,1.0, -1.0,1.0,1.0, -1.0,-1.0,1.0],
	default_coords     : [1,1, 0,1, 1,0, 0,0, 1,0, 0,1],
	square_vertices    : [0.5,0.5, -0.5,0.5, 0.5,-0.5, -0.5,-0.5, 0.5,-0.5, -0.5,0.5],
	default_color      : [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
	default_sizes      : [0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25, 0.25,0.25],
	default_visibility : [0, 0, 0, 0, 0, 0],

	/*
	* 	Make a linear interpolation between two numbers
	*	@method lerp 
	*	@params {Number} The start of the interpolation
	*	@params {Number} The end of the interpolation
	*	@params {Number} The value to be interpolated
	*/
	lerp : 
		function(s, e, x)
		{
			return s * ( 1 - x ) + e * x;
		},

	/*
	* 	This method returns a random number
	*	@method randomNumber
	*	@params {Number} the minimum value of the random number
	*	@params {Number} the maximum value of the random number
	*/
	randomNumber:
		function(min, max)
		{
		  return Math.random() * (max - min) + min;
		},

	/*
	* 	This method returns the cross product of two vectors
	*	@method cross
	*	@params {vector3} the first vector
	*	@params {vector3} the second vector
	*/
	cross:
		function(a, b)
		{
		    var c = new Float32Array(3);
		    
		    c[0] = a[1]*b[2] - a[2]*b[1];
		    c[1] = a[2]*b[0] - a[0]*b[2];
		    c[2] = a[0]*b[1] - a[1]*b[0];

		    return c;
		},

	/*
	* 	If a equation is gived then this function calculates the factor of the new value using it
	*	@method computeChangeEquation 
	*   @params {Number} The value of the X
	*   @params {List}   The number in front of the X
	*/
	computeEquation:  
		function(equation_, factor_)
		{
			let value = 0;
			let length = equation_.length;

			for (let i = 0; i < length; ++i)
				value += equation_[i]*Math.pow(factor_, length-1-i);

			if(value >= 0.99)
				value = 1;
			
			return value;
		},

	/*
	* 	Given a matrix4x4 and a vector3 this function multiplies both
	*	@method vec3MultMatrix4 
	*   @params {List} The matrix4x4
	*   @params {List} The vector3
	*/
	vec3MultMatrix4 :
		function(m_, vector3_)
		{
			let x = vector3_[0], y = vector3_[1], z = vector3_[2];

			vector3_[0] = m_[0] * x + m_[1] * y + m_[2]  * z + m_[3];
			vector3_[1] = m_[4] * x + m_[5] * y + m_[6]  * z + m_[7];
			vector3_[2] = m_[8] * x + m_[9] * y + m_[10] * z + m_[11];
		},

	//For doing the billboard I follow the next tutorial
	//http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
	vs_particles : '\
					precision highp float;\
					\
					in vec3 vertices;\
					in vec3 a_normal;\
					in vec2 coords;\
					in vec2 icoord;\
					in vec4 colors;\
					in vec2 size;\
					in float visible;\
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
						v_visible = visible;\
						v_coord   = coords;\
						v_color   = colors;\
						v_normal  = (u_model * vec4(a_normal, 0.0)).xyz;\
						v_pos = vertices + u_right * icoord.x * size.x + u_up * icoord.y * size.y;\
						gl_Position = u_mvp * (u_model * vec4(v_pos, 1.0));\
						\
					}',

	//The fragment shader for plain particles
	fs_flat_p : '\
				precision highp float;\
				in vec4 v_color;\
				in float v_visible;\
				\
				void main() {\
					if (v_visible == 0.0) discard;\
					pc_fragColor = v_color;\
				}',

	//The fragment shader for textured particles
	fs_texture : '\
				\
				precision highp float;\
				in vec4 v_color;\
				in vec2 v_coord;\
				in float v_visible;\
				uniform sampler2D u_texture;\
				\
				void main() {\
					if (v_visible == 0.0) discard;\
					vec4 color = v_color * texture(u_texture, v_coord);\
					if (color.a < 0.1)\
						discard;\
					pc_fragColor = color;\
				}'
}

/*
* 	This class is for save information about every particle and control his properties along his lifetime
*	@class DixieParticle
*/
class DixieParticle {
	/*
	*	The constructor for the particle
	*	@method constructor
	*/
	constructor() {}

	/*
	*	The inicializer of the particle, given all the data the particle information is filled
	*	@method fill
	*	@params {Object} The data of the particle (Speed, lifetime...)
	*	@params {Object} The inforation about the texture 
	*   @params {List} The uvs of the atlas
	*	@params {String} The origin of the particle (subemitter or emitter)
	*	@params {Number} The id of the particle
	*/
	fill(data_, texture_, uvs_, origin_ = undefined, id_ = undefined) {
		//If the origin and the id are diferents to undefined then a new particle is created
		if(origin_ != undefined)
			this.origin = origin_;

		if(id_ != undefined)
			this.id = id_;
		
		//Set the position and the color
		this.position = data_.position.slice(0);

		this.iColor = data_.color.slice(0);
		this.color  = data_.color.slice(0);
	
		//Get a random size for the particle
		let s = DixieGlobals.randomNumber(data_.min_size, data_.max_size);
		this.size  = s;
		this.iSize = s;
		
		//Define a random speed for the particle
		let speed = new Float32Array(3);
		speed[0]  = DixieGlobals.randomNumber(data_.min_speed[0], data_.max_speed[0]);
		speed[1]  = DixieGlobals.randomNumber(data_.min_speed[1], data_.max_speed[1]);
		speed[2]  = DixieGlobals.randomNumber(data_.min_speed[2], data_.max_speed[2]);

		this.speed  = speed;
		this.aSpeed = [0,0,0];
		this.iSpeed = speed.slice(0);

		//Radom definition of the lifetime
		let lifetime = DixieGlobals.randomNumber(data_.min_life_time, data_.max_life_time);

		this.lifetime   = lifetime;
		this.iLifetime  = lifetime;
		this.c_lifetime = 0.0; //How many life time the particle lived
		this.visibility = 1;

		//Definition of the meeted conditions for the particle
		this.conditions_meet = [];

		//Set the texture information 
		this.texture_id  = texture_.id; 
		this.subtextures = false; //If the texture is an atlas
		this.textures_x  = 0; //Number of textures in the component X
		this.textures_y  = 0; //Number of textures in the component Y
		this.animated    = false; //If is an animated texture
		this.frameRate   = 0; //The frameRate 
		this.c_frame     = 0; //The curent frame (in ms)
		this.frameX      = 0; //In which frame is the particle 
		this.frameY      = 0;  
		
		//If there is a texture then the data will be updated
		if(texture_.id != -1) 
		{
			let t_prop = texture_.prop;

			//Get the uvs of the textured assigned to the particles (this can be not final depending if the texture is an atlas or animated)
			this.uvs = uvs_[texture_.id]; 
			this.subtextures = t_prop.subtextures; //Set if the texture is an atlas

			//If is an atlas then the number of textures in x and y will be saved
			if(t_prop.subtextures)
			{
				this.textures_x = t_prop.textures_x;
				this.textures_y = t_prop.textures_y;
			}

			//If is a animated texture then all the data that depends on the animations
			//will be inicialized
			if(t_prop.animated)
			{
				this.animated = true;

				let t = lifetime;

				//The animation can be a loop or just "one time"
				if(t_prop.anim_loop)
					t = t_prop.anim_duration;
				
				//Update the current frame in Y (The first one is on the last line)
				this.frameY = t_prop.textures_y - 1;  
				//Calculate the frame rate of the particles
				let frame_number = t_prop.textures_x * t_prop.textures_y; 
				this.frameRate = (t / frame_number);
			}
		}

		//Calculate the texture coordinates of the particle
		this.getCoords(true);
	}

	/*
	*	The lifetime, current frame and the visibility of the particles is updated
	*	@method updateLifetime
	*	@params {Number} The passed time (in ms) since the last frame
	*   @params {List} The list of particles to reset
	*/
	updateLifetime(dt_, to_reset_) {
		//Update lifetime and frame
		this.c_lifetime += dt_;
		this.c_frame += dt_;

		//If the current lifetime is bigger than the lifetime and is visible then the 
		//particle will be setted to a reset mode
		if(this.c_lifetime >= this.lifetime && this.visibility == 1)
		{
			this.visibility = 0;
			to_reset_.push(this.id);
		}
	}

	/*
	*	Apply a basic movement (uniform rectilinear motion) to the particle depending on its speed
	*	@method move
	*	@params {Number} The passed time (in ms) since the last frame
	*/
	move(dt_) {

		if(this.visibility == 1)
		{
			this.aSpeed = [0,0,0];

			for(let i = 0; i < 3; ++i)
			{
				this.position[i] += this.speed[i] * dt_;
				this.aSpeed[i]   += this.speed[i];
			}
		}
	}

	/*
	*	Apply a serie of forces to the particle 
	*	@method applyForces
	*	@params {Number} The passed time (in ms) since the last frame
	*   @params {List} The list of the forces that affects to the particle
	*/
	applyForces(dt_, forces_) {
		let force, distance = [0,0,0], distance_factor;
		let v_vortex;

		for(let i = 0; i < forces_.length; ++i)
		{
			force = forces_[i];

			if(!this.testCondition(force.condition))
				continue;

			switch (force.type) {
				case "gravity":
					for(let j = 0; j < 3; ++j)
						this.position[j] += force.direction[j] * force.strength * dt_;
				break;

				case "vortex":
					//First to all the distance between the particle and the vortex is calculated
					for(let j = 0; j < 3; ++j)
						distance[j] = this.position[j] - force.position[j];

					//Then the cross product and the distance factor are computed
					v_vortex = DixieGlobals.cross(force.angular_speed, distance);
					//The distance factor uses a formula which is based on inverse square distance, avoiding singularity at the center
					distance_factor = 1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/force.scale);

					for(let j = 0; j < 3; ++j)
						this.position[j] += v_vortex[j] * distance_factor * dt_;
				break;

				case "magnet":
					//First to all the distance between the particle and the vortex is calculated
					for(let j = 0; j < 3; ++j)
						distance[j] = this.position[j] - force.position[j];

					//The distance factor uses a formula which is based on inverse square distance, avoiding singularity at the center
					distance_factor = 1/(1+(distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2])/force.scale);
					distance_factor *= force.strength;

					for(let j = 0; j < 3; ++j)
						this.position[j] += distance[j] * distance_factor * dt_;
				break; 
			}
		}
	}

	/*
	*	Given a condition test if the particle meets it
	*	@method testCondition
	*   @params {Object} The condition
	*	@params {Number} The passed time (in ms) since the last frame
	*/
	testCondition(condition_, dt_ = 0.0) {
		//If the condition is true always will be meeted (default conditon)
		if(condition_ == true)
			return true;
		else if (condition_ == "On particle die") //The condition can be when a particle dies (default for subemitters)
		{
			//Test if the particle is recently "dead"
			let diff = this.lifetime - this.c_lifetime;
			if(diff <= dt_ && this.visibility != 0)
				return true;
			else
				return false;
		}

		let meet = false;
		let c;

		//See if the condition is a merging of several conditions
		switch (condition_.type) {
			//If is a confition make the comprobation
			case "condition":
				let tested_value;
				let value_to_test = condition_.value;

				//If the condition only can be meted one time and is already 
				//meted then return false 
				if(condition_.one_time)
					for(let i = 0; i < this.conditions_meet.length; ++i)
						if(this.conditions_meet[i].id == condition_.id)
							return false;

				//See the condition to be tested
				switch (condition_.property) {
					case "Life time":
						tested_value = this.lifetime;
					break;

					case "Speed":
						tested_value = this.speed;
					break;

					case "Size":
						tested_value = this.size;
					break;
				}

				//See the operator for the condition
				switch (condition_.operator) {
					case "Equals":
						if (tested_value == value_to_test)
							meet = true;
					break;

					case "Greater than":
						if (tested_value > value_to_test)
							meet = true;
					break;

					case "Less than":
						if (tested_value < value_to_test)
							meet = true;
					break;
				
					case "Greater than or equals":
						if (tested_value >= value_to_test)
							meet = true;
					break;

					case "Less than or equals":
						if (tested_value <= value_to_test)
							meet = true;
					break;

					case "No equals":
						if (tested_value != value_to_test)
							meet = true;
					break;
				}

				if(meet)
				{
					//See if the condition is meteed
					c = this.getCondition(condition_.id)
					
					//If is not meted then push it, instead just update when is meted
					if(c == undefined)
						this.conditions_meet.push({id: condition_.id, meet_at: this.c_lifetime})
					else
						c.meet_at = this.c_lifetime;
				}
			break;

			//If is merged test both conditions
			case "merged condition":
				let conditions = condition_.conditions;
				switch (condition_.mode) {
					case "And":
						return testCondition(conditions[0]) && testCondition(conditions[1]);
					break;

					case "Or":
						return testCondition(conditions[0]) || testCondition(conditions[1]);
					break;
				}
			break;
		}

		//return if the condition is meted
		return meet;
	}

	/*
	*	See if a condition is already meted
	*	@method getCondition
	*	@params {Number} The id of the condition
	*/
	getCondition(id_) {
		let conditions = this.conditions_meet;
		let c;

		for(let i = 0; i < conditions.length; ++i)
		{
  			c = conditions[i];
  			if(c.id == id_)
  				return c;
		}

		return undefined;
	}

	/*
	*	Apply a serie of modifications to the particle 
	*	@method applyModifications
	*	@params {Number} The passed time (in ms) since the last frame
	*   @params {List} The list of the modifications that affects to the particle
	*/
	applyModifications(dt_, modifications_) {
		let modification, changed_value;
		let final_value, new_value;
		let application_mode, modification_mode, meet_at;
		let x, e, factor;

		x = this.c_lifetime;

		for(let i = 0; i < modifications_.length; ++i)
		{
			modification = modifications_[i];

			//See if the condition for the modification is meted
			if(!this.testCondition(modification.condition))
				continue;

			new_value = modification.new_value;
			application_mode = modification.application_mode;
			modification_mode = modification.modification_mode;

			if(modification_mode == "Along life time")
				e = this.lifetime;
			else if(modification_mode == "User defined")
			{
				//The conditions aren't meeted
				if(x < modification.user_defined_start)
					continue;

				e = modification.user_defined_seconds + modification.user_defined_start;

				//If is not true
				if(!modification.condition)
				{
					meet_at = this.getCondition(modification.condition.id).meet_at;
					e += meet_at;
				}
			}

			//Compute the factor
			factor = x / e;

			if(modification.equation.length > 0)
				factor = DixieGlobals.computeEquation(modification.equation, factor)

			//Modify the property
			switch (modification.changed_property) {
				case "Color":
					changed_value = this.color;

					final_value = [0,0,0,0];
					final_value[0] = new_value[0];
					final_value[1] = new_value[1];
					final_value[2] = new_value[2];
					final_value[3] = new_value[3];

					if(application_mode == "Addition")
						for(let i = 0; i < 4; ++i)
							final_value[i] = this.iColor[i] + final_value[i];
					else if(application_mode == "Subtraction")
						for(let i = 0; i < 4; ++i)
							final_value[i] = this.iColor[i] - final_value[i];

					for(let i = 0; i < 4 ; ++i)
						this.color[i] = final_value[i] * factor + this.iColor[i] * (1.0 - factor);
				break;

				case "Life time":
					changed_value = this.lifetime;
					final_value = new_value; 

					if(application_mode == "Addition")
						final_value += this.iLifetime;
					else if(application_mode == "Subtraction")
						final_value = Math.max(this.iLifetime - final_value, 0);

					this.lifetime = final_value * factor + this.iLifetime * (1.0 - factor);
				break;

				case "Speed":
					changed_value = this.speed;

					final_value = [0,0,0];
					final_value[0] = new_value[0];
					final_value[1] = new_value[1];
					final_value[2] = new_value[2];

					if(application_mode == "Addition")
						for(let i = 0; i < 3; ++i)
							final_value[i] = this.iColor[i] + final_value[i];
					else if(application_mode == "Subtraction")
						for(let i = 0; i < 3; ++i)
							final_value[i] = this.iColor[i] - final_value[i];
			
					for(let i = 0; i < 4 ; ++i)
						this.speed[i] = final_value[i] * factor + this.iSpeed[i] * (1.0 - factor);
				break;

				case "Size":
					changed_value = this.size;
					final_value = new_value; 

					if(application_mode == "Addition")
						final_value += this.iSize;
					else if(application_mode == "Subtraction")
						final_value = Math.max(this.iSize - final_value, 0);

					this.size = final_value * factor + this.iSize * (1.0 - factor);
				break;
			}
		}
	}

	/*
	*	Get the next texture frame of the particle 
	*	@method getNextFrame
	*/
	getNextFrame() {
		//If it isn't animated just return
		if(!this.animated || this.c_frame < this.frameRate)
			return;

		this.c_frame = 0;
		this.frameX++;

		if(this.frameX == this.textures_x)
		{
			this.frameY--;
			this.frameX = 0;

			if(this.frameY < 0)
				this.frameY = this.textures_y - 1;
		}

		//With the updated frame get the coordinates
		this.getCoords();
	}

	/*
	*	See if a condition is already meted
	*	@method getCondition
	*	@params {Boolean} If the particle is recently filled
	*/
	getCoords(fill = false) {
		//If is not filled and is not animated just skip this...
		if(!fill)
			if(!this.animated)
				return;

		//In case there are no texture return the default coordinates
		if(this.texture_id == -1)
		{
			this.coords = DixieGlobals.default_coords;
			return;
		}

		let minX, minY, maxX, maxY;
		let uvs = this.uvs;
		let sizeX = this.textures_x, sizeY = this.textures_y;

		if(sizeX == 0 && sizeY == 0 || !this.subtextures)
		{
			//In case there aren't subtexture of the user define both sizes as 0
			minX = uvs[0];
			minY = uvs[1];
			maxX = uvs[2];
			maxY = uvs[3];
		}
		else if(this.animated)
		{
			let iSx = 1/sizeX;
			let iSy = 1/sizeY;
			let frameX = this.frameX;
			let frameY = this.frameY;
	  
			minX = sizeX != 1 ? frameX * iSx : 0; 
			minY = sizeY != 1 ? frameY * iSy : 0; 

			maxX = sizeX != 1 ? (frameX+1) * iSx : 1; 
			maxY = sizeY != 1 ? (frameY+1) * iSy : 1; 

			//Interpolation (in order to get the correct frame)
			minX = DixieGlobals.lerp(uvs[0], uvs[2], minX);
			minY = DixieGlobals.lerp(uvs[1], uvs[3], minY);
			maxX = DixieGlobals.lerp(uvs[0], uvs[2], maxX);
			maxY = DixieGlobals.lerp(uvs[1], uvs[3], maxY);
		}
		else if(this.subtextures)
		{
			//Get the basic Uvs in the case that the texture isn't animated or have subtextures
			minX = sizeX != 1 ? Math.floor(Math.random() * sizeX)/sizeX : 0;
			minY = sizeY != 1 ? Math.floor(Math.random() * sizeY)/sizeY : 0;

			maxX = sizeX != 1 ? minX + (1/sizeX) : 1; 
			maxY = sizeY != 1 ? minY + (1/sizeY) : 1; 

			//Interpolation (in order to get the correct frame)
			minX = DixieGlobals.lerp(uvs[0], uvs[2], minX);
			minY = DixieGlobals.lerp(uvs[1], uvs[3], minY);
			maxX = DixieGlobals.lerp(uvs[0], uvs[2], maxX);
			maxY = DixieGlobals.lerp(uvs[1], uvs[3], maxY);
		}

		this.coords = [maxX,maxY, minX,maxY, maxX,minY, minX,minY, maxX,minY, minX,maxY]; 
	}

	/*
	*	The update logic of the particle
	*	@method update
	*	@params {Number} The passed time (in ms) since the last frame
	*   @params {List} The list of particles to reset
	*   @params {List} The list of forces
	*   @params {List} The list of modifications
	*/
	update(dt_, to_reset_, forces_, modifications_) {
		//First to all the lifetime and frame of the particle is updated
		this.updateLifetime(dt_, to_reset_);
		
		//If the particle is not visible not do anything
		if(this.visibility == 0)
			return;

		//Get the next frame
		this.getNextFrame();

		this.move(dt_); //Apply the movement
		this.applyForces(dt_, forces_); //Apply the forces
		this.applyModifications(dt_, modifications_); //Apply the modifications
	}
}

/*
* 	This class is for save information about the particle systems and control the emission and position of the particles
*	@class DixieParticleSystem
*/
class DixieParticleSystem {
	/*
	*	The constructor of the ParticleSystem
	*	@method constructor
	*   @params {Object} The data of the particle system
	*   @params {String} The directory where the system is saved (where are the folders atlas and meshes)
	*   @params {Function} The function for create the particle mesh
	*   @params {Function} The function to load the meshes
	*   @params {Function} The function to load the textures
	*/
	constructor(data_, directory_, create_pmesh_f_, load_mesh_f = undefined, load_texture_f = undefined) {
		Object.assign(this, data_);
		this.getTotalParticles();

		this.id;
		this.transformModal = DixieGlobals.identity.slice(0);
		this.rotation = [0, 0, 0];
		this.scale = [1, 1, 1];

		if(this.origin == "Mesh")
		{
			let m = this.origin_mesh.modal;

			this.position[0] = m[12];
			this.position[1] = m[13];
			this.position[2] = m[14];
		}

		//Original position
		this.o_position = this.position.slice(0);
		//The transformed position
		this.trans_position = this.position.slice(0);

		//Every how many frames the particles are ordered
		this.update_frame = 5;
		this.frames_until_update = 0;

		//Create the list for the particles and his ids
		this.particles          = [];
		this.particles_ids      = [];
		this.particles_to_reset = [];

		//Create an all_ids this is just for ordening the particles
		this.all_ids = [];

		//Create the sub emission info
		this.sub_emissions_ids  = [];

		for(let i = 0; i < this.sub_emittors.length; ++i)
		{
			this.sub_emittors[i].particles_ids      = [];
			this.sub_emittors[i].particles_to_reset = [];
		}

		//Time variables
		this.time_pased = 0;
		this.spawn_period = 1.0 / this.spawn_rate;

		//Shader definition
		this.vertex_shader = DixieGlobals.vs_particles;

		//The only shader that will change is the fragment
		if(this.atlasName != DixieGlobals.defaultAtlasName)
			this.fragment_shader = DixieGlobals.fs_texture;
		else
			this.fragment_shader = DixieGlobals.fs_flat_p;

		//Creation of the render info and the particle mesh
		this.createRenderInfo(directory_, load_mesh_f, load_texture_f);
		this.createParticleMesh(create_pmesh_f_);
	}

	/*
	*	Set the id for the particle system (for ordening porpuses)
	*	@method setId
	*   @params {Number} The id of the particle system
	*/
	setId(id_) {
		this.id = id_;
	}

	/*
	*	Change the update rate of the particle system
	*	@method changeUpdateRate
	*   @params {Number} The new update rate
	*/
	changeUpdateRate(new_rate_) {
		if(Dixie.validPosInteger(new_rate_))
			this.update_frame = new_rate_;
		else
			console.error("Dixie Error!! \n\n\t The new update rate must be a positive integer!! \n\n");
	}

	/*
	*	Displace all the particle system
	*	@method displace
	*   @params {List} A list of three elements, representing the displacement
	*/
	displace(pos_) {
		if(pos_ != undefined)
		{
			if(this.origin == "Mesh")
			{
				let modal = this.renderInfo.modal;

				//Apply the translation
				modal[12] += pos_[0];
				modal[13] += pos_[1];
				modal[14] += pos_[2];	
			}
			else if (this.origin == "Point")
			{
				for(let i = 0; i < 3; ++i)
					this.position[i] += pos_[i];
			}
		}
	}

	/*
	*	Change the position of the particle system
	*	@method setDisplacement
	*   @params {List} A list of three elements, representing the new position
	*/
	setDisplacement(pos_) {
		if(pos_ != undefined)
		{
			if(this.origin == "Mesh")
			{
				let modal = this.renderInfo.modal;

				//Apply the translation
				modal[12] = pos_[0];
				modal[13] = pos_[1];
				modal[14] = pos_[2];	
			}
			else if(this.origin == "Point")
			{
				for(let i = 0; i < 3; ++i)
					this.position[i] = pos_[i];
			}
		}
	}

	/*
	*	Get the id an position of the particle system
	*	@method getIdPosition
	*/
	getIdPosition() {
		return {id: this.id, position: this.trans_position};
	}

	/*
	*	Reset the position of the particle system
	*	@method resetDisplacement
	*/
	resetDisplacement() {
		if(this.origin == "Mesh")
		{
			let renderInfo = this.renderInfo;
			let modal = renderInfo.modal;
			let o_modal = renderInfo.o_modal;

			for(let i = 0; i < modal.length; ++i)
				modal[i] = o_modal[i];
		}
		else if(this.origin == "Point")
		{
			this.position = this.o_position.slice(0);
		}
	}

	/*
	*	Get the total number of the particles of the particle system
	*	@method getTotalParticles
	*/
	getTotalParticles() {
		let subParticles = 0;
		let max_particles = this.max_particles;

		for (let i = 0; i < this.sub_emittors.length; ++i)
			subParticles += this.sub_emittors[i].max_particles;

		this.total_particles = max_particles  + subParticles * max_particles;
	}

	/*
	*	Creation of the buffer for the particle mesh
	*	@method createParticleMesh
	*   @params {Function} A function that given the buffers and his information then create a mesh and fill the buffers 
	*/
	createParticleMesh(create_pmesh_f_ = undefined) {
		if(create_pmesh_f_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t No function for load the mesh provided \n\n");
			return;
		}

		let particles = this.total_particles*6;
		let size2 = particles*2;
		let size3 = particles*3;
		let size4 = particles*4;

		let vertices_data = [], coords_data = [], icoord_data = [], size_data = [], colors_data = [], visible_data = [];

		for(let i = 0; i < this.total_particles; ++i)
		{
			vertices_data = vertices_data.concat(DixieGlobals.default_centers);
			coords_data   = coords_data.concat(DixieGlobals.default_coords);
			icoord_data   = icoord_data.concat(DixieGlobals.square_vertices);
			size_data     = size_data.concat(DixieGlobals.default_sizes);
			colors_data   = colors_data.concat(DixieGlobals.default_color);
			visible_data  = visible_data.concat(DixieGlobals.default_visibility);
		}

		var buffers = [];

		//Elems is the number of elements per vertex
		//Size is the size of the buffer
		//inShader is the name in the default shader
		//elems is the number of element by vertex
		//type is the recommendable type for the buffers
		//data us the default data of the buffers
		buffers.push({name: "vertices", inShader: "a_vertex",  size: size3,     elems: 3, type: "Float32Array", data: vertices_data});
		buffers.push({name: "coords",   inShader: "a_coord",   size: size2,     elems: 2, type: "Float32Array", data: coords_data});
		buffers.push({name: "icoord",   inShader: "a_icoord",  size: size2,     elems: 2, type: "Float32Array", data: icoord_data});
		buffers.push({name: "size",     inShader: "a_size",    size: size2,     elems: 2, type: "Float32Array", data: size_data});
		buffers.push({name: "colors",   inShader: "a_color",   size: size4,     elems: 4, type: "Float32Array", data: colors_data});
		buffers.push({name: "visible",  inShader: "a_visible", size: particles, elems: 1, type: "Float32Array", data: visible_data});

		this.particle_mesh = create_pmesh_f_(buffers, this.src_bfact, this.dst_bfact, this.setId.bind(this), this.transformModal);
	}

	/*
	*	Creation of the render info
	*	@method createParticleMesh
	*   @params {String} The directory of the atlas and meshes folders 
	*   @params {Function} A function for load a mesh
	*   @params {Function} A function for load a texture
	*/
	createRenderInfo(directory_, c_mesh_loader_f_ = undefined, c_texture_loader_f_ = undefined) {
		let modal, mesh = undefined, atlas = undefined;

		if(this.origin == "Mesh")
		{
			if(c_mesh_loader_f_ == undefined)
			{
				console.error("Dixie Error!! \n\n\t No function for load the mesh provided \n\n");
				return;
			}

			modal = this.origin_mesh.modal;
			//Load the mesh
			c_mesh_loader_f_(directory_+"/meshes/"+this.origin_mesh.name, "object", "object_vertices", this.origin_mesh);
		}
		else if(this.origin == "Point")
			modal = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
		

		if(this.atlasName != DixieGlobals.defaultAtlasName)
		{
			if(c_texture_loader_f_ == undefined)
			{
				console.error("Dixie Error!! \n\n\t No function for load the mesh provided \n\n");
				return;
			}

			//Load the texture atlas
			c_texture_loader_f_(directory_+"/atlas/"+this.atlasName, "atlas", this);
		}

		this.renderInfo = {}
		this.renderInfo.o_modal = modal.slice(0);
		this.renderInfo.modal = modal;
		this.renderInfo.atlas = atlas;
		this.renderInfo.origin_mesh = mesh;
		this.renderInfo.particle_mesh = this.particle_mesh;
		this.renderInfo.src_bfact = this.src_bfact;
		this.renderInfo.dst_bfact = this.dst_bfact;
	}

	/*
	*	Set the position of the particle
	*	@method setParticlePosition
	*/
	setParticlePosition() {
		if(this.origin == "Point")
		{
			return this.position;
		}
		else if(this.origin == "Mesh")
		{
			let o_mesh = this.origin_mesh;

			if(o_mesh.object == undefined)
				return this.position;
			
			//Get random ambas
			let ambda1 = Math.random();
			let ambda2 = Math.random();
			let ambda3;

			if(ambda1 + ambda2 > 1)
			{
				ambda1 = 1 - ambda1;
				ambda2 = 1 - ambda2;
			}

			ambda3 = 1 - ambda1 - ambda2;

			let triangle_num = o_mesh.triangle_num;
			let div_value = 9;

			//Pick a random triangle
			let triangle = Math.floor(Math.random()*triangle_num) * div_value;
			let points;

			if(div_value == 9)
				points = o_mesh.object_vertices.slice(triangle, triangle + div_value);
			else
				points = o_mesh.object_vertices.slice(triangle == 0 ? 0 : 3, triangle == 0 ? 9 : 12);

			let random_point = [0,0,0];

			//Apply the barycenter coordinate formula to get the point
			for (var i = 0; i < 3; ++i)
				random_point[i] = points[i] * ambda1 + points[i+3] * ambda2 + points[i+6] * ambda3;
			
			let model = o_mesh.modal;

			//Multiply by the model the random point
			let x = random_point[0], y = random_point[1], z = random_point[2];

			random_point[0] = model[0] * x + model[4] * y + model[8]  * z + model[12];
			random_point[1] = model[1] * x + model[5] * y + model[9]  * z + model[13];
			random_point[2] = model[2] * x + model[6] * y + model[10] * z + model[14];
			
			return random_point;
		}
	}

	/*
	*	Add a new particle to the system, if there are dead particles will be reused 
	*	@method addParticle
	*   @params {String} The origin of the particle
	*   @params {Number} The maximum number of particles
	*   @params {List} The list of the particles ids
	*   @params {List} The list of particles to reset
	*   @params {Object} The properties of the particle
	*   @params {Object} The texture of the particle
	*/
	addParticle(origin_, max_particles_, ids_, to_reset_, prop_, texture_) {
		if(max_particles_ > ids_.length)
		{
			this.time_pased = 0.0;

			let particle = new DixieParticle();
			let id = this.particles.length;
			
			if(origin_ == "emitter")
				prop_.position = this.setParticlePosition();

			particle.fill(prop_, texture_, this.uvs, origin_, id);

			ids_.push({id : id, distance_to_camera : 0.0});
			this.all_ids.push({id : id, distance_to_camera : 0.0});
			this.particles.push(particle)
		}
		else if(to_reset_.length > 0)
		{
			this.time_pased = 0.0;

			let id = to_reset_[0];
			let particle = this.particles[id];

			if(origin_ == "emitter")
				prop_.position = this.setParticlePosition();

			particle.fill(prop_, texture_, this.uvs); //Reset the particle
			to_reset_.splice(0,1);
		}
	}

	/*
	*	The logic for spawn particles 
	*	@method createParticleMesh
	*   @params {Number} The passed time (in ms) since the last frame
	*/
	spawnParticles(dt_) {
		//First to all spawn the particles for the emitters
		if(this.spawn_mode == "Linear" && this.time_pased >= this.spawn_period)
			this.addParticle("emitter", this.max_particles, this.particles_ids, this.particles_to_reset, this.particle_data, this.texture);
		else if(this.spawn_mode == "Waves" && this.time_pased >= this.spawn_rate)
			for(let i = 0; i < this.particles_per_wave; ++i)
				this.addParticle("emitter", this.max_particles, this.particles_ids, this.particles_to_reset, this.particle_data, this.texture);
	
		let sub_emitter, condition, id, particle;
		let ids = this.particles_ids;
		let sub_ids, to_reset, p_data, texture, max_particles;

		//Then the subemittors
		for(let i = 0; i < this.sub_emittors.length; ++i)
		{
			sub_emitter = this.sub_emittors[i];
			condition = sub_emitter.condition;
			sub_ids = sub_emitter.particles_ids;
			to_reset = sub_emitter.particles_to_reset;
			p_data = sub_emitter.particle_data;
			texture = sub_emitter.texture;
			max_particles = sub_emitter.max_particles * this.max_particles;

			for(let j = 0; j < ids.length; ++j)
			{
				id = ids[j].id;
				particle = this.particles[id];

				if(particle.testCondition(condition, dt_))
				{
					p_data.position = particle.position;

					for(let k = 0; k < sub_emitter.particles_per_wave; ++k)
						this.addParticle("sub_emitter", max_particles, sub_ids, to_reset, p_data, texture);
				}
			}	
		}
	}

	/*
	*	Ordering of the particles of the system (the order depends on the camera_eye and the most far from it are the first ones)
	*	@method orderParticles
	*   @params {List} A list of three elements that represents the eye of the camera
	*/
	orderParticles(camera_eye_) {
		//If there isn't the frame not order anything
		if(this.frames_until_update >= this.update_frame)
		{
			this.frames_until_update = 0;

			let distance = [0,0,0], id, particle;

			for(let i = 0; i < this.all_ids.length; ++i)
			{
				id = this.all_ids[i].id;
				particle = this.particles[id];

				for(let j = 0; j < 3; ++j)
					distance[j] = particle.position[j] - camera_eye_[j];

				this.all_ids[i].distance_to_camera = Math.sqrt((distance[0]*distance[0]+distance[1]*distance[1]+distance[2]*distance[2]));
			}

			//Ordening (descendent)
			this.all_ids.sort(function(a,b){
				return b.distance_to_camera - a.distance_to_camera;
			});

			return true;
		}
		else
			this.frames_until_update++;

		return false;
	}

	/*
	*	Ordering of the buffers of the system (the order depends on the camera_eye and the most far from it are the first ones)
	*	@method orderBuffers
	*   @params {List} A list of three elements that represents the eye of the camera
	*   @params {Object} The data of the buffers 
	*   @params {Function} A function for update the buffers of the particle system
	*/
	orderBuffers(camera_eye_, buffers_data_, upload_function_) {
		if(camera_eye_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t No camera_position_ provided!! \n\n");
			return;	
		}

		if(buffers_data_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t No data provided!! \n\n");
			return;
		}

		if(typeof buffers_data_ != "object" && Array.isArray(buffers_data_))
		{
			console.error("Dixie Error!! \n\n\t buffers_data_ must be an object... \n\n");
			return;	
		}

		let vertices = buffers_data_.vertices;
		let visible  = buffers_data_.visible;
		let colors   = buffers_data_.colors;
		let coords   = buffers_data_.coords;
		let size     = buffers_data_.size;

		if(vertices == undefined)
		{
			console.error("Dixie Error!! \n\n\t Vertices buffer not provided!! \n\n");
			return;	
		}

		if(visible == undefined)
		{
			console.error("Dixie Error!! \n\n\t Visible buffer not provided!! \n\n");
			return;	
		}

		if(colors == undefined)
		{
			console.error("Dixie Error!! \n\n\t Colors buffer not provided!! \n\n");
			return;	
		}

		if(size == undefined)
		{
			console.error("Dixie Error!! \n\n\t Size buffer not provided!! \n\n");
			return;	
		}

		if(coords == undefined)
		{
			console.error("Dixie Error!! \n\n\t Coords buffer not provided!! \n\n");
			return;	
		}
		
		let particles = this.particles;
		let ids = this.all_ids, id;
		let particle;

		for(let i = 0; i < ids.length; ++i)
		{
			id = ids[i].id;
			particle = particles[id];

			for(let j = 0; j < 18; ++j)
				vertices[i*18 + j] = particle.position[j % 3];

			for(let j = 0; j < 12; ++j)
			{
				coords[i*12 + j] = particle.coords[j];
				size[i*12 +j] = particle.size;
			}

			for(let j = 0; j < 6; ++j)
				visible[i*6 + j] = particle.visibility;

			for(let j = 0; j < 24; ++j)
				colors[i*24 + j] = particle.color[j % 4];
		}

		upload_function_(this.particle_mesh, buffers_data_);
	}

	/*
	*	Rotate the system in the X axis the defined radians
	*	@method rotateX
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateX(rad_, update_cbk_) {
		this.rotation[0] += rad_;
		Dixie.rotateSystemX(this.transformModal, rad_);

		this.trans_position = this.o_position.slice(0);
		DixieGlobals.vec3MultMatrix4(this.transformModal, this.trans_position);

		if (update_cbk_ != undefined)
			update_cbk_(this.id, this.transformModal, this.rotation);
	}

	/*
	*	Rotate the system in the Y axis the defined radians
	*	@method rotateY
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateY(rad_, update_cbk_) {
		this.rotation[1] += rad_;
		Dixie.rotateSystemY(this.transformModal, rad_);

		this.trans_position = this.o_position.slice(0);
		DixieGlobals.vec3MultMatrix4(this.transformModal, this.trans_position);

		if (update_cbk_ != undefined)
			update_cbk_(this.id, this.transformModal, this.rotation);
	}

	/*
	*	Rotate the system in the Z axis the defined radians
	*	@method rotateZ
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateZ(rad_, update_cbk_) {
		this.rotation[2] += rad_;
		Dixie.rotateSystemZ(this.transformModal, rad_);

		this.trans_position = this.o_position.slice(0);
		DixieGlobals.vec3MultMatrix4(this.transformModal, this.trans_position);

		if (update_cbk_ != undefined)
			update_cbk_(this.id, this.transformModal, this.rotation);
	}

	/*
	*	Scale the system 
	*	@method scaleXYZ
	*   @params {List} A list of three elements for scale the system in XYZ 
	*   @params {Function} A function for update the scale 
	*/
	scaleXYZ(scale_, update_cbk_) {
		this.scale[0] += scale_[0];
		this.scale[1] += scale_[1];
		this.scale[2] += scale_[2];
		Dixie.scaleSystem(this.transformModal, scale_);

		this.trans_position = this.o_position.slice(0);
		DixieGlobals.vec3MultMatrix4(this.transformModal, this.trans_position);

		if (update_cbk_ != undefined)
			update_cbk_(this.id, this.transformModal, this.scale);
	}

	/*
	*	Reset all the rotations and scales applied to the system 
	*	@method resetTransforms
	*   @params {Function} A function for reset the scale and the rotation 
	*/
	resetTransforms(update_cbk_) {
		this.rotation = [0,0,0];
		this.scale = [1,1,1];
		this.transformModal = DixieGlobals.identity.slice(0);
		this.trans_position = this.o_position.slice(0);

		if (update_cbk_ != undefined)
			update_cbk_(this.id, this.transformModal, this.rotation, this.scale);
	}
} 

/*
* 	This class is for organize all the set of particle systems added
*	@class Dixie
*/
class Dixie {
	/*
	*	The constructor of Dixie
	*	@method constructor
	*/
	constructor() {
		this.version = 0.21;
		this.graphs = [];
	}

	/*
	*	Add a new graph 
	*	@method add
	*   @params {String} The name of the graph
	*   @params {Object} The JSON that have all the information of the graph
	*   @params {Function} The function for create the particle mesh
	*   @params {Function} The function to load the textures
	*   @params {Function} The function to load the meshes
	*   @params {String} The directory of the meshes and atlas folders
	*/
	add(name_, graph_, create_pmesh_f_, load_texture_f_ = undefined, load_mesh_f_ = undefined, files_directory_ = "") {
		if(name_ == undefined) 
		{
			console.Warning("Dixie Warning!! \n\n\t No name provided, setting to None \n\n");
			name_ = "None";
		}

		let graph = new DixieGraph(graph_, create_pmesh_f_, load_texture_f_, load_mesh_f_, files_directory_ );
		this.graphs.push({name: name_, graph});
	}

	/*
	*	Dixie update logic
	*	@method update
	*   @params {Number} The passed time (in ms) since the last frame
	*   @params {List} A three element list that represents the eye of the camera
	*   @params {Function} The function for get the mesh buffers 
	*   @params {Function} The function for upload the buffers 
	*   @params {Function} The function for ordening the meshes of every graph inside a Dixie
	*/
	update(dt_,camera_eye_, get_buffers_f_, upload_f_, order_meshs_f_) {
		let graphs = this.graphs;

		if(get_buffers_f_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t Get buffers function no provided!! \n\n");
			return;
		}

		if(upload_f_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t Upload buffers function no provided!! \n\n");
			return;
		}

		if(order_meshs_f_ == undefined)
		{
			console.error("Dixie Error!! \n\n\t Order meshes function no provided!! \n\n");
			return;
		}

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].graph.update(dt_, camera_eye_, get_buffers_f_, upload_f_);

		order_meshs_f_(this.getOrderedGraphs(camera_eye_));
	}

	/*
	*	Get the order of the graphs
	*	@method getOrderedGraphs
	*   @params {List} A three element list that represents the eye of the camera
	*/
	getOrderedGraphs(camera_eye_) {
		let graphs = this.graphs, graph, idPos;
		let systems;
		let distance = [0, 0, 0], length;
		let ordered = [], pos;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i].graph;
			systems = graph.systems;

			for(let j = 0; j < systems.length; ++j)
			{
				idPos = systems[j].getIdPosition();
				pos = idPos.position;

				for(let k = 0; k < 3; ++k)
					distance[k] = pos[k] - camera_eye_[k];

				length = Math.sqrt(distance[0]*distance[0] + distance[1]*distance[1] + distance[2]*distance[2]);
				ordered.push({id: idPos.id, distance: length})
			}
		}

		//Ordening (descendent)
		ordered.sort(function(a,b){
			return b.distance - a.distance;
		});

		return ordered;
	}

	/*
	*	Move a graph or all of them
	*	@method move
	*   @params {List} A three element list that represents the displacement of the graph
	*   @params {String} The name of the graph that will be displaced (if empty all will be displaced)
	*/
	move(new_pos_, graph_name_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.move(new_pos_);
			else if(graph_name_ == graph.name)	
				graph.graph.move(new_pos_);
		}	
	}

	/*
	*	Reset the position a graph or all of them
	*	@method resetMove
	*   @params {String} The name of the graph that will be reseted (if empty all will be reseted)
	*/
	resetMove(graph_name_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.resetMove();
			else if(graph_name_ == graph.name)	
				graph.graph.resetMove();
		}
	}

	/*
	*	Rotate a graph, or all of them, in the X axis the defined radians
	*	@method rotateX
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {String} The name of the graph that will be rotated (if empty all will be rotated)
	*   @params {Function} A function for update the rotation 
	*/
	rotateX(rad_, graph_name_ = undefined, update_cbk_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.rotateX(rad_, update_cbk_);
			else if(graph_name_ == graph.name)	
				graph.graph.rotateX(rad_, update_cbk_);
		}
	}

	/*
	*	Rotate a graph, or all of them, in the Y axis the defined radians
	*	@method rotateY
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {String} The name of the graph that will be rotated (if empty all will be rotated)
	*   @params {Function} A function for update the rotation 
	*/
	rotateY(rad_, graph_name_ = undefined, update_cbk_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.rotateY(rad_, update_cbk_);
			else if(graph_name_ == graph.name)	
				graph.graph.rotateY(rad_, update_cbk_);
		}
	}

	/*
	*	Rotate a graph, or all of them, in the Z axis the defined radians
	*	@method rotateZ
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {String} The name of the graph that will be rotated (if empty all will be rotated)
	*   @params {Function} A function for update the rotation 
	*/
	rotateZ(rad_, graph_name_ = undefined, update_cbk_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.rotateZ(rad_, update_cbk_);
			else if(graph_name_ == graph.name)	
				graph.graph.rotateZ(rad_, update_cbk_);
		}			
	}

	/*
	*	Scale a graph, or all of them 
	*	@method scale
	*   @params {List} A list of three elements for scale the graph/s in XYZ 
	*   @params {String} The name of the graph that will be scaled (if empty all will be scaled)
	*   @params {Function} A function for update the scale 
	*/
	scale(scale_, graph_name_ = undefined, update_cbk_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.scale(scale_, update_cbk_);
			else if(graph_name_ == graph.name)	
				graph.graph.scale(scale_, update_cbk_);
		}	
	}

	/*
	*	Reset the scale and rotation of a graph, or all of them 
	*	@method resetTransforms
	*   @params {String} The name of the graph that will be reseted (if empty all will be reseted)
	*   @params {Function} A function for reset the transforms
	*/
	resetTransforms(graph_name_ = undefined, update_cbk_ = undefined) {
		let graphs = this.graphs, graph;

		for(let i = 0; i < graphs.length; ++i)
		{
			graph = graphs[i];
			
			if(graph_name_ == undefined)
				graph.graph.resetTransforms(update_cbk_);
			else if(graph_name_ == graph.name)	
				graph.graph.resetTransforms(update_cbk_);
		}	
	}

	/*
	*	Validates if the given attribute is an integer
	*	@method validInteger
	*   @params {Number} The attribute to be tested
	*/
	static validInteger(int_) {
		return (int_ != undefined && Number.isInteger(int_))
	}

	/*
	*	Validates if the given attribute is an numerical value with decimals
	*	@method validateDecimal
	*   @params {Number} The attribute to be tested
	*	@params {Boolean} If has to be positive
	*/
	static validateDecimal(double_ , pos = false) {
		if(pos)
			return (!isNaN(double_) && double_ >= 0);
		else
			return !isNaN(double_);
	}

	/*
	*	Validates if the given attribute is a positive integer
	*	@method validPosInteger
	*   @params {Number} The attribute to be tested
	*/
	static validPosInteger(int_) {
		return (int_ != undefined && int_ >= 0 && Number.isInteger(int_));
	}

	/*
	*	Validates if the given attribute is a string between the given values
	*	@method validString
	*   @params {String} The attribute to be tested
	*	@params {List} The values that can have the string
	*/
	static validString(string_, values_) {
		return (string_ != undefined && values_.includes(string_));
	}

	/*
	*	Validates if the given attribute is a array of a defined size and type
	*	@method validArray
	*   @params {List} The attribute to be tested
	*	@params {Number} The size of the array, if is -1 it dosen't make this comprobation
	*   @params {Boolean} If the array only contains numbers
	*	@params {Number} The maximun value of the array (in case to be numeric)
	*	@params {Number} The minumun value of the array (in case to be numeric)
	*/
	static validArray(array_, size_ = -1, numeric_ = false, max_ = undefined, min_ = undefined) {
		if (array_ == undefined)
			return false;

		let isValid = true;
		let value = 0, a_value = 0;

		if(size_ > 0)
			isValid = Array.isArray(array_) && array_.length == size_;
		else
			isValid = Array.isArray(array_);

		if(!isValid || !numeric_)
			return isValid;
		else
			for (let i = 0; i < array_.length; ++i)
			{
				value = array_[i];

				if(Array.isArray(value))
				{
					for(let j = 0; j < value.length; ++j)
					{
						a_value =  value[j];

						if(!Dixie.validateDecimal(a_value))
							return false;
						else if (max_ != undefined && min_ != undefined) 
						{
							if(a_value > max_ || value < min_)
								return false;
						}
					}
				}
				else
				{
					if(!Dixie.validateDecimal(value))
						return false;
					else if (max_ != undefined && min_ != undefined) 
					{
						if(value > max_ || value < min_)
							return false;
					}
				}
			}

		return isValid;
	}

	/*
	*	Validates if the given attribute is a boolean
	*	@method validBoolean
	*   @params {Number} The attribute to be tested
	*/
	static validBoolean(bool_) {
		return (typeof bool_ == "boolean" ? true : false);
	}

	/*
	*	Rotate a matrix in the X axis
	*	@method rotateSystemX
	*   @params {List} The matrix 4x4 
	*	@params {Number} The angle, in radians 
	*/
	static rotateSystemX( modal_, angle_ ) {
		let s = Math.sin( angle_ );
		let c = Math.cos( angle_ );

		let m10 = modal_[4];
		let m11 = modal_[5];
		let m12 = modal_[6];
		let m13 = modal_[7];
		let m20 = modal_[8];
		let m21 = modal_[9];
		let m22 = modal_[10];
		let m23 = modal_[11];

		modal_[4] = m10 * c + m20 * s;
		modal_[5] = m11 * c + m21 * s;
		modal_[6] = m12 * c + m22 * s;
		modal_[7] = m13 * c + m23 * s;
		modal_[8] = m20 * c - m10 * s;
		modal_[9] = m21 * c - m11 * s;
		modal_[10] = m22 * c - m12 * s;
		modal_[11] = m23 * c - m13 * s;
	}
	
	/*
	*	Rotate a matrix in the Y axis
	*	@method rotateSystemY
	*   @params {List} The matrix 4x4 
	*	@params {Number} The angle, in radians 
	*/
	static rotateSystemY( modal_, angle_ ) {
		let s = Math.sin( angle_ );
		let c = Math.cos( angle_ );

		let m00 = modal_[0];
		let m01 = modal_[1];
		let m02 = modal_[2];
		let m03 = modal_[3];
		let m20 = modal_[8];
		let m21 = modal_[9];
		let m22 = modal_[10];
		let m23 = modal_[11];

		modal_[0] = m00 * c - m20 * s;
		modal_[1] = m01 * c - m21 * s;
		modal_[2] = m02 * c - m22 * s;
		modal_[3] = m03 * c - m23 * s;
		modal_[8] = m00 * s + m20 * c;
		modal_[9] = m01 * s + m21 * c;
		modal_[10] = m02 * s + m22 * c;
		modal_[11] = m03 * s + m23 * c;
	}
	
	/*
	*	Rotate a matrix in the Z axis
	*	@method rotateSystemZ
	*   @params {List} The matrix 4x4 
	*	@params {Number} The angle, in radians 
	*/
	static rotateSystemZ( modal_, angle_ ) {
		let s = Math.sin( angle_ );
		let c = Math.cos( angle_ );

		let m00 = modal_[0];
		let m01 = modal_[1];
		let m02 = modal_[2];
		let m03 = modal_[3];
		let m10 = modal_[4];
		let m11 = modal_[5];
		let m12 = modal_[6];
		let m13 = modal_[7];

		modal_[0] = m00 * c + m10 * s;
		modal_[1] = m01 * c + m11 * s;
		modal_[2] = m02 * c + m12 * s;
		modal_[3] = m03 * c + m13 * s;
		modal_[4] = m10 * c - m00 * s;
		modal_[5] = m11 * c - m01 * s;
		modal_[6] = m12 * c - m02 * s;
		modal_[7] = m13 * c - m03 * s;
	}

	/*
	*	Scales a matrix in the XYZ axis
	*	@method scaleSystem
	*   @params {List} The matrix 4x4 
	*   @params {List} A list of three elements for make the scale 
	*/
	static scaleSystem(modal_, scale_) {
		let x = scale_[0], 
		y = scale_[1],
		z = scale_[2];

		modal_[0] *= x;
		modal_[1] *= x;
		modal_[2] *= x;
		modal_[3] *= x;
		modal_[4] *= y;
		modal_[5] *= y;
		modal_[6] *= y;
		modal_[7] *= y;
		modal_[8] *= z;
		modal_[9] *= z;
		modal_[10] *= z;
		modal_[11] *= z;
	}
}

/*
* 	This class contains all the graph emitters and subemitters
*	@class DixieGraph
*/
class DixieGraph {
	/*
	*	The constructor of the dixiegraph
	*	@method constructor
	*   @params {Object} The JSON that have all the information of the graph
	*   @params {Function} The function for create the particle mesh
	*   @params {Function} The function to load the textures
	*   @params {Function} The function to load the meshes
	*   @params {String} The directory of the meshes and atlas folders
	*/
	constructor(graphs_, create_pmesh_f_, load_texture_f_ = undefined, load_mesh_f_ = undefined, files_directory_ = "") {
		this.systems = [];

		if(files_directory_ == undefined)
		{
			console.Warning("Dixie Warning!! \n\n\t No directory provided, assuming it is root \n\n");
			this.directory = "";
		}
		else
			this.directory = files_directory_;
			
		if(graphs_ != undefined)
			this.loadGraph(graphs_, create_pmesh_f_, load_texture_f_, load_mesh_f_)
		else
			console.error("Dixie Error!! \n\n\t No data provided. \n\n");
	}

	/*
	*	Validates evert system inside the graph
	*	@method loadGraph
	*   @params {Object} The JSON that have all the information of the graph
	*   @params {Function} The function for create the particle mesh
	*   @params {Function} The function to load the textures
	*   @params {Function} The function to load the meshes
	*/
	loadGraph(graph_, create_pmesh_f_, load_texture_f, load_mesh_f_) {
		let num_systems = graph_.num_systems;
		let graph;

		if(num_systems == undefined)
		{
			console.error("Dixie Error!! \n\n\t Invalid graph loaded!! \n\t Cause: No num_systems found... \n\n");
			return;
		}

		if(num_systems == 0)
		{
			console.warn("Dixie Warning!! \n\n\t There aren't systems in the graph!! \n\n")
			return;
		}

		for(let i = 0; i < num_systems; ++i)
		{
			if(this.validateSystem(graph_["system_"+i], i) != -1)
			{
				graph = new DixieParticleSystem(graph_["system_"+i], this.directory, create_pmesh_f_, load_mesh_f_, load_texture_f);
				this.systems.push(graph);
			}
		}
	}

	/*
	*	Move all the systems of a graph
	*	@method move
	*   @params {List} A three element list that represents the displacement
	*/
	move(new_pos_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].displace(new_pos_);
	}

	/*
	*	Rotate all of the emitters of a graph in the X axis the defined radians
	*	@method rotateX
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateX(rad_, update_cbk_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].rotateX(rad_, update_cbk_);
	}
	
	/*
	*	Rotate all of the emitters of a graph in the Y axis the defined radians
	*	@method rotateY
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateY(rad_, update_cbk_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].rotateY(rad_, update_cbk_);
	}

	/*
	*	Rotate all of the emitters of a graph in the Z axis the defined radians
	*	@method rotateZ
	*   @params {Number} The radians that will be used to rotate the system 
	*   @params {Function} A function for update the rotation 
	*/
	rotateZ(rad_, update_cbk_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].rotateZ(rad_, update_cbk_);
	}

	/*
	*	Scale all of the emitters of a graph in the XYZ axis
	*	@method scale
	*   @params {List} A three element list for scale the emitters in the XYZ => [X,Y,Z]
	*   @params {Function} A function for update the scale 
	*/
	scale(scale_, update_cbk_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].scaleXYZ(scale_, update_cbk_);
	}

	/*
	*	Reset the scale and rotation of all the emitters of a graph 
	*	@method resetTransforms
	*   @params {Function} A function for reset the transforms
	*/
	resetTransforms(update_cbk_) {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].resetTransforms(update_cbk_);
	}

	/*
	*	Reset the position of all emitter of a graph
	*	@method resetMove
	*   @params {String} The name of the graph that will be reseted (if empty all will be reseted)
	*/
	resetMove() {
		let graphs = this.systems;

		for(let i = 0; i < graphs.length; ++i)
			graphs[i].resetDisplacement();	
	}

	/*
	*	DixieGraph update logic
	*	@method update
	*   @params {Number} The passed time (in ms) since the last frame
	*   @params {List} A three element list that represents the eye of the camera
	*   @params {Function} The function for get the mesh buffers 
	*   @params {Function} The function for upload the buffers 
	*/
	update(dt_,camera_eye_, get_buffers_f_, upload_f_) {
		let graph, particles, particles_ids, forces, particle;
		let sub_emittors, sub_emitter;
		let id, to_reset, modifications;

		let systems = this.systems;

		for(let i = 0; i < systems.length; ++i)
		{
			graph = systems[i];
			graph.time_pased += dt_;
			graph.spawnParticles(dt_);

			forces = graph.forces;

			particles = graph.particles;
			particles_ids = graph.particles_ids;
			to_reset = graph.particles_to_reset;
			modifications = graph.modifications;

			//Particles basic movement
			for(let j = 0; j < particles_ids.length; ++j)
			{
				id = particles_ids[j].id;
				particle = particles[id];
				particle.update(dt_, to_reset, forces, modifications);
			}

			sub_emittors = graph.sub_emittors;

			//SubEmissions basic movement
			for(let j = 0; j < sub_emittors.length; ++j)
			{
				sub_emitter = sub_emittors[j];
				particles_ids = sub_emitter.particles_ids;

				forces = sub_emitter.forces;
				to_reset = sub_emitter.particles_to_reset;
				modifications = sub_emitter.modifications;

				for(let k = 0; k < particles_ids.length; ++k)
				{
					id = particles_ids[k].id;
					particle = particles[id];

					particle.update(dt_, to_reset, forces, modifications);
				}
			}
			
			//Ordening particles and then the buffers
			graph.orderParticles(camera_eye_)

			let buffers = get_buffers_f_(graph.particle_mesh);
			graph.orderBuffers(camera_eye_, buffers, upload_f_)
		}
	}

	/*
	*	Validate the particle data
	*	@method validateParticleData
	*   @params {Object} The particle data
	*   @params {List} The list of error messages
	*   @params {List} The list of warning messages 
	*/
	validateParticleData(p_data_, error_on_, warnMsg) {
		if (p_data_ == undefined)
		{
			warnMsg.push("Particle data not defined on "+error_on_+"... Inserting a default one!!");
			p_data_ = DixieGlobals.defaultParticleData;
		}
		else
		{
			let defaultData = DixieGlobals.defaultParticleData;

			if (!Dixie.validArray(p_data_.max_speed, 3, true))
			{
				warnMsg.push("Max speed not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.max_speed + ". \
					\n \t Expected value: An array with size 3, of numbers.");
				p_data_.max_speed = defaultData.max_speed;
			}

			if (!Dixie.validArray(p_data_.min_speed, 3, true))
			{
				warnMsg.push("Min speed not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.min_speed + ". \
					\n \t Expected value: An array with size 3, of numbers.");
				p_data_.max_speed = defaultData.min_speed;
			}

			if (!Dixie.validateDecimal(p_data_.max_size, true))
			{
				warnMsg.push("Max size not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.max_size + ". \
					\n \t Expected value: A positive number.");
				p_data_.max_speed = defaultData.max_size;
			}

			if (!Dixie.validateDecimal(p_data_.min_size, true))
			{
				warnMsg.push("Min size not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.min_size + ". \
					\n \t Expected value: A positive number.");
				p_data_.max_speed = defaultData.min_size;
			}

			if (!Dixie.validateDecimal(p_data_.max_life_time, true))
			{
				warnMsg.push("Max life time not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.max_life_time + ". \
					\n \t Expected value: A positive number.");
				p_data_.max_life_time = defaultData.max_life_time;
			}

			if (!Dixie.validateDecimal(p_data_.min_life_time, true))
			{
				warnMsg.push("Min life time not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.min_life_time + ". \
					\n \t Expected value: A positive number.");
				p_data_.min_life_time = defaultData.min_life_time;
			}

			if(!Dixie.validArray(p_data_.color, 4, true, 1.0, 0.0))
			{
				warnMsg.push("Color not defined correctly for the particles in the "+ error_on_ +". Inserting a default one!!\
					\n \t Detected value: " + p_data_.color + ". \
					\n \t Expected value: An array with size 4, of numbers between 1 and 0.");
				p_data_.color = defaultData.color;
			}
		}

		return p_data_;
	}

	/*
	*	Validate the atlas
	*	@method validateTexture
	*   @params {String} The atlas name
	*   @params {Object} The texture information
	*   @params {List} The list of error messages
	*   @params {List} The list of warning messages 
	*/
	validateTexture(atlasName_, texture_, error_on_, warnMsg) {
		if (texture_ == undefined)
		{
			warnMsg.push("Texture not defined for " + error_on_ + ". Defining the default one.");
			texture_ = DixieGlobals.defaultTexture;

			if(atlasName_ != DixieGlobals.defaultAtlasName)
				texture_.id = 0;
		}
		else
		{
			if(atlasName_ != DixieGlobals.defaultAtlasName && texture_.id < 0)
			{
				warnMsg.push("Wrong texture identifier defined for " + error_on_ + ". Defining the default one.\
					\n \t Detected value: " +texture_.id+". \
					\n \t Expected value: A positive integer.");

				texture_.id = 0;
			}

			if(texture_.id > 0 && atlasName_ == DixieGlobals.defaultAtlasName)
			{
				warnMsg.push("Wrong texture identifier defined for " + error_on_ + ". Defining the default one.\
					\n \t Detected value: " +texture_.id+". \
					\n \t Expected value: A negative integer.");

				texture_.id = -1;
			}

			if(texture_.id > 0 && atlasName_ != DixieGlobals.defaultAtlasName)
			{
				let data = texture_.prop;
				let defaultData = DixieGlobals.defaultTexture.prop;

				if(!Dixie.validBoolean(data.subtextures))
				{
					warnMsg.push("Subtextures not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
						\n \t Detected value: " +data.subtextures+". \
						\n \t Expected value: A boolean.");

					data.subtextures = defaultData.subtextures;
				}

				if(!Dixie.validPosInteger(data.textures_x))
				{
					warnMsg.push("Subtextures in X are not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
						\n \t Detected value: " +data.textures_x+". \
						\n \t Expected value: A positive integer.");

					data.textures_x = defaultData.textures_x;
				}

				if(!Dixie.validPosInteger(data.textures_y))
				{
					warnMsg.push("Subtextures in Y are not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
						\n \t Detected value: " +data.textures_y+". \
						\n \t Expected value: A positive integer.");

					data.textures_y = defaultData.textures_y;
				}

				if(!Dixie.validBoolean(data.animated))
				{
					warnMsg.push("Animated not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
						\n \t Detected value: " +data.animated+". \
						\n \t Expected value: A boolean.");

					data.animated = defaultData.animated;
				}

				if(!Dixie.validBoolean(data.anim_loop))
				{
					warnMsg.push("Animation loop not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
					\n \t Detected value: " +data.anim_loop+". \
					\n \t Expected value: A boolean.");

					data.anim_loop = defaultData.anim_loop;
				}

				if(!Dixie.validateDecimal(data.anim_duration, true))
				{
					warnMsg.push("The duration of the animation is not defined correctly for the texture of " + error_on_ + ". Defining the default one.\
					\n \t Detected value: " +data.anim_duration+". \
					\n \t Expected value: A positive number.");

					data.anim_duration = defaultData.anim_duration;
				}
			}
		}

		return texture_;
	}

	/*
	*	Validate the mesh
	*	@method validateMesh
	*   @params {Object} The mesh information
	*   @params {Origin} The origin of the graph
	*   @params {List} The list of warning messages 
	*/
	validateMesh(mesh_, origin_, warnMsg) {
		if (mesh_ == undefined)
		{
			mesh_ = DixieGlobals.defaultMesh;

			if (origin_ == "Point")
				warnMsg.push("No mesh defined. Inserting the default one!!");
			else if (origin == "Mesh")
			{
				errorMsg.push("No mesh defined. Changing mode to Point!!");
				origin_ = "Point";
			}
		}
		else if (mesh_.name != "None")
		{
			if(!Dixie.validArray(mesh_.modal, 16, true))
			{
				warnMsg.push("Modal not defined correctly. Inserting the default one!!");
				mesh_.modal = DixieGlobals.identity;	
			}
			
			if(!Dixie.validPosInteger(mesh_.triangle_num))
			{
				warnMsg.push("Number of triangles not defined correctly. Changing mode to Point!!\
					\n \t Detected value: " +mesh_.triangle_num+". \
					\n \t Expected value: A positive number.");

				origin_ = "Point";
			}
			
			if(!Dixie.validPosInteger(mesh_.div_value))
			{
				warnMsg.push("Number of vertices per triangle not defined correctly. Changing mode to Point!!\
					\n \t Detected value: " +mesh_.div_value+". \
					\n \t Expected value: A positive number.");
			
				origin_ = "Point";
			}
		}

		return mesh_;
	}

	/*
	*	Validate the conditions
	*	@method validateConditions
	*   @params {Object} The condition information
	*   @params {String} The name of the system (Display warnings/errors)
	*   @params {List} The list of warning messages 
	*/
	validateConditions(condition_, systemName_, warnMsg) {
		if(condition_ == undefined)
		{
			warnMsg.push("Conditions not defined for "+ systemName_ +". Setting a default ones...");
			return DixieGlobals.defaultConditions;
		}
		else if (condition_ == true || condition_.length == 0) 
			return true;
		else if (condition_ == "On particle die")
			return "On particle die"

		let type = condition_.type;

		if(!Dixie.validPosInteger(condition_.id))
		{
			warnMsg.push("Invalid id for the condition in "+systemName_+". Deleting the condition...\
					\n \t Detected value: "+condition_.id+". \
					\n \t Expected value: A positive integer.");

			condition_ = true;
			return;
		}

		if(!Dixie.validString(type, DixieGlobals.cond_type))
		{
			warnMsg.push("Invalid condition type for "+ systemName_ +". Deleting the condition...\
					\n \t Detected value: " +type+". \
					\n \t Expected values: condition or merged conditions.");
			
			condition_ =  true;
			return;
		} 

		if(type == "condition")
		{
			if(!Dixie.validBoolean(condition_.one_time))
			{
				warnMsg.push("Invalid condition one time for the condition in "+systemName_+". Setting to false...\
					\n \t Detected value: "+condition_.one_time+". \
					\n \t Expected value: A boolean.");

				condition_.one_time = false;
			}

			if(!Dixie.validString(condition_.operator, DixieGlobals.cond_oper))
			{
				warnMsg.push("Invalid operator for the condition in "+systemName_+". Deleting the condition...\
					\n \t Detected value: "+condition_.operator+". \
					\n \t Expected value: Equals, Greater than, Less than, Greater than or equals, Less than or equals or No equals.");
				
				condition_ = true;
				return;
			}

			if(!Dixie.validString(condition_.property, DixieGlobals.cond_prop))
			{
				warnMsg.push("Invalid property for the condition in "+systemName_+". Deleting the condition...\
					\n \t Detected value: "+condition_.property+". \
					\n \t Expected value: Speed, Life time or Size.");

				condition_ = true;
				return;
			}

			let value = condition_.value;
			switch (condition_.property)
			{
				case "Speed":
					if(!Dixie.validArray(value, 3, true))
					{
						warnMsg.push("Invalid value for the condition in "+systemName_+". Deleting the condition...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: An array with size 3, of numbers.");
					
						condition_ = true;
						return;
					}
				break;

				case "Life time":
					if(!Dixie.validateDecimal(value , true))
					{
						warnMsg.push("Invalid value for the condition in "+systemName_+". Deleting the condition...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: A positive numerical value.");

						condition_ = true;
						return;
					}
				break;

				case "Size":
					if(!Dixie.validateDecimal(value , true))
					{
						warnMsg.push("Invalid value for the condition in "+systemName_+". Deleting the condition...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: A positive numerical value.");

						condition_ = true;
						return;
					}
				break;
			}
		}
		else if(type == "merged conditions")
		{
			if(!Dixie.validString(condition_.mode, DixieGlobals.cond_mode))
			{
				warnMsg.push("Invalid merge mode for the condition in "+systemName_+". Deleting the condition...\
					\n \t Detected value: "+condition_.mode+". \
					\n \t Expected value: And or Or.");

				condition_ = true;
				return;
			}

			if(!Dixie.validArray(condition_.conditions))
			{
				warnMsg.push("Merged conditions corrupted for the condition in "+systemName_+". Deleting the condition...");

				condition_ = true;
				return;
			}
			else
			{
				let m_conds = condition_.conditions;

				for (var i = 0; i < m_conds.length; ++i)
				{
					this.validateConditions(m_conds[i], "the merged condition in "+systemName_, warnMsg);
				}
			}
		}
	}

	/*
	*	Validate the modifications
	*	@method validateModifications
	*   @params {Object} The modification information
	*   @params {String} The name of the system (Display warnings/errors)
	*   @params {List} The list of warning messages 
	*/
	validateModifications(modifications_, systemName_, warnMsg) {
		if (modifications_ == undefined)
		{
			warnMsg.push("No modifications defined for " + systemName_ +". Setting a default ones...");
			modifications_ = DixieGlobals.defaultModifications;
			return;
		}

		let modification, prop, value;
		for(let i = 0; i < modifications_.length; ++i)
		{
			modification = modifications_[i];
			prop = modification.changed_property;

			if(!Dixie.validString(prop, DixieGlobals.mod_prop))
			{
				warnMsg.push("Invalid property for the modification "+i+" for "+ systemName_ +". Deleting the modification...\
					\n \t Detected value: " +prop+". \
					\n \t Expected values: Speed, Size, Color or Life time");


				modifications_.splice(i, 1);
				i--;
				continue;
			}

			value = modification.new_value;

			switch (prop)
			{
				case "Speed":
					if(!Dixie.validArray(value, 3, true))
					{
						warnMsg.push("Invalid value for the modification "+i+" in "+systemName_+". Deleting the modification...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: An array with size 3, of numbers.");

						modifications_.splice(i, 1);
						i--;
						continue;
					}
				break;

				case "Life time":
					if(!Dixie.validateDecimal(value , true))
					{
						warnMsg.push("Invalid value for the modification "+i+" in "+systemName_+". Deleting the modification...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: A positive numerical value.");

						modifications_.splice(i, 1);
						i--;
						continue;
					}
				break;

				case "Size":
					if(!Dixie.validateDecimal(value , true))
					{
						warnMsg.push("Invalid value for the modification "+i+" in "+systemName_+". Deleting the modification...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: A positive numerical value.");

						modifications_.splice(i, 1);
						i--;
						continue;
					}
				break;

				case "Color":
					if(!Dixie.validArray(value, 4, true, 1.0, 0.0))
					{
						warnMsg.push("Invalid value for the modification "+i+" in "+systemName_+". Deleting the modification...\
							\n \t Detected value: "+value+". \
							\n \t Expected value: An array with size 4, of numbers between 1.0 and 0.0.");

						modifications_.splice(i, 1);
						i--;
						continue;
					}
				break;
			}

			if(!Dixie.validString(modification.application_mode, DixieGlobals.mod_appl))
			{
				warnMsg.push("Invalid application for the modification "+i+" in "+ systemName_ +". Deleting the modification...\
					\n \t Detected value: " +modification.application_mode+". \
					\n \t Expected values: Equalization, Addition Or Subtraction.");

			   	modifications_.splice(i, 1);
				i--;
				continue;
			}

			if(!Dixie.validateDecimal(modification.user_defined_start, true))
			{
				warnMsg.push("Invalid application for the modification "+i+" in "+ systemName_ +". Deleting the modification...\
					\n \t Detected value: " +modification.user_defined_start+". \
					\n \t Expected values: A positive number.");

				modifications_.splice(i, 1);
				i--;
				continue;
			}

			if(!Dixie.validateDecimal(modification.user_defined_seconds, true))
			{
				warnMsg.push("Invalid application for the modification "+i+" in "+ systemName_ +". Deleting the modification...\
					\n \t Detected value: " +modification.user_defined_seconds+". \
					\n \t Expected values: A positive number.");

				modifications_.splice(i, 1);
				i--;
				continue;
			}

			if(!Dixie.validArray(modification.equation, -1, true))
			{
				warnMsg.push("Invalid equation for the modification "+i+" in "+ systemName_ +". Deleting the modification...\
					\n \t Detected value: " +modification.equation+". \
					\n \t Expected values: An arrayt of numbers.");

				modifications_.splice(i, 1);
				i--;
				continue;
			}

			this.validateConditions(modification.condition, "the modification "+i+" for "+ systemName_, warnMsg);
		}
	}

	/*
	*	Validate the forces
	*	@method validateModifications
	*   @params {Object} The forces information
	*   @params {String} The name of the system (Display warnings/errors)
	*   @params {List} The list of warning messages 
	*/
	validateForces(forces_, systemName_, warnMsg) {
		if(forces_ == undefined || !Dixie.validArray(forces_))
		{
			warnMsg.push("Forces not defined correctly for "+systemName_+". Inserting the default ones...");
			forces_ = DixieGlobals.defaultForces;
		}
		else
		{
			let force;
			for (let i = 0; i < forces_.length; ++i) 
			{
				force = forces_[i];

				if(!Dixie.validString(force.type, DixieGlobals.force_types)) 
				{
					warnMsg.push("Unknown forces detected in the "+systemName_+" of the force number "+i+". Sending a squad to delete the force...\
						\n \t Detected force: " + force.type+". \
						\n \t Expected values: gravity, magnet or vortex.");

					forces_.splice(i, 1);
					i--;
					continue;
				}
				else
				{
					switch (force.type)	
					{
						case "gravity":
							if(!Dixie.validArray(force.direction, 3, true))
							{
								warnMsg.push("The direction for the gravity in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.direction+". \
									\n \t Expected value: An array with size 3, of numbers.");
								force.direction = DixieGlobals.defaultGravity.direction;
							}

							if(!Dixie.validInteger(force.strength))
							{
								warnMsg.push("The value of the strength in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.strength+". \
									\n \t Expected value: A number.");
								force.strength = DixieGlobals.defaultGravity.strength;
							}
						break;

						case "vortex":
							if(!Dixie.validArray(force.position, 3, true))
							{
								warnMsg.push("The position for the vortex in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.position+". \
									\n \t Expected value: An array with size 3, of numbers.");
								force.position = DixieGlobals.defaultVortex.position;
							}

							if(!Dixie.validArray(force.angular_speed, 3, true))
							{
								warnMsg.push("The angular speed for the vortex in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.angular_speed+". \
									\n \t Expected value: An array with size 3, of numbers.");
								force.angular_speed = DixieGlobals.defaultVortex.angular_speed;
							}

							if(!Dixie.validateDecimal(force.scale, true))
							{
								warnMsg.push("The scale for the vortex in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.scale+". \
									\n \t Expected value: A positive number.");
								force.scale = DixieGlobals.defaultVortex.scale;
							}

							if(!Dixie.validArray(force.color, 4, true, 1.0, 0.0))
							{
								warnMsg.push("The color for the vortex in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.color+". \
									\n \t Expected value: An array with size 4, of numbers between 1.0 and 0.0.");
								force.color = DixieGlobals.defaultVortex.color;
							}
						break;

						case "magnet":
							if(!Dixie.validArray(force.position, 3, true))
							{
								warnMsg.push("The position for the magnet point in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.position+". \
									\n \t Expected value: An array with size 3, of numbers.");
								force.position = DixieGlobals.defaultMagnet.position;
							}

							if(!Dixie.validateDecimal(force.strength))
							{
								warnMsg.push("The strength for the magnet point in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.strength+". \
									\n \t Expected value: A number.");
								force.strength = DixieGlobals.defaultMagnet.strength;
							}

							if(!Dixie.validateDecimal(force.scale, true))
							{
								warnMsg.push("The scale for the magnet point in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.scale+". \
									\n \t Expected value: A positive number.");
								force.scale = DixieGlobals.defaultMagnet.scale;
							}

							if(!Dixie.validArray(force.color, 4, true, 1.0, 0.0))
							{
								warnMsg.push("The color for the magnet point in the "+systemName_+" of the force number "+i+" is not valid. Inserting the default one...\
									\n \t Detected force: " + force.color +". \
									\n \t Expected value: An array with size 4, of numbers between 1.0 and 0.0.");
								force.color = DixieGlobals.defaultMagnet.color;
							}
						break;

						this.validateConditions(force.condition, systemName_, warnMsg);
					}
				}
			}
		}
	}

	/*
	*	Validate the subemittors
	*	@method validateSubEmittors
	*   @params {Object} The subemittors information
	*   @params {String} The name of the atlas
	*   @params {String} The name of the system (Display warnings/errors)
	*   @params {List} The list of warning messages 
	*   @params {List} The list of error messages 
	*/
	validateSubEmittors(sub_emittors_, atlasName_, systemName_, warnMsg, errorMsg) {
		let se;

		for (let i = 0; i < sub_emittors_.length; ++i)
		{
			se = sub_emittors_[i];

			if (!Dixie.validString(se.origin, DixieGlobals.possible_origins))
			{
				errorMsg.push("No origin defined for the sub emittor "+i+" of the "+systemName_+". Deleting sub emittor...\
					\n \t Value found: " + se.origin + ". \
					\n \t Value expected: A string with value Point or Mesh.");

				sub_emittors_.splice(i, 1);
				i--;
				continue;
			}

			if (!Dixie.validPosInteger(se.max_particles))
			{
				errorMsg.push("Max particles not defined correctly for the sub emittor "+i+" of the "+systemName_+". Deleting sub emittor...\
					\n \t Value found: " + se.max_particles + ". \
					\n \t Value expected: An integer bigger than 0.");

				sub_emittors_.splice(i, 1);
				i--;
				continue;
			}

			if (!Dixie.validPosInteger(se.particles_per_wave))
			{
				errorMsg.push("Particles per wave not defined correctly for the sub emittor "+i+" of the "+systemName_+". Deleting sub emittor...\
					\n \t Value found: " + se.particles_per_wave + ". \
					\n \t Value expected: An integer bigger than 0.");

				sub_emittors_.splice(i, 1);
				i--;
				continue;
			}

			let error_on = "the sub emittor "+i+" of the "+systemName_;

			se.particle_data = this.validateParticleData(se.particle_data, error_on, warnMsg)
			se.texture = this.validateTexture(atlasName_, se.texture, error_on, warnMsg);
			this.validateForces(se.forces, error_on, warnMsg);
			this.validateConditions(se.condition, error_on, warnMsg);
			this.validateModifications(se.modifications, error_on, warnMsg);
		}
	}
	
	/*
	*	Validate the system
	*	@method validateSystem
	*   @params {Object} The system information 
	*   @params {Number} The number of the system to be validated
	*/
	validateSystem(system_, index_ = -1) {
		let s = system_;
		let errorMsg = [], warnMsg = [];
		let systemName = "principal system " + index_;
		let returnValue = 1;

		if (!Dixie.validString(s.src_bfact, DixieGlobals.blending_factors))
		{
			warnMsg.push("No src_bfact defined for "+systemName+". Inserting a default one!!\
				\n\t Value found: " + s.src_bfact +". \
				\n\t Value expected: A string with value " + DixieGlobals.blending_factors + ".");
			s.src_bfact = DixieGlobals.defaultSrcbValue;
		}

		if (!Dixie.validString(s.dst_bfact, DixieGlobals.blending_factors))
		{
			warnMsg.push("No dst_bfact defined for "+systemName+". Inserting a default one!!\
				\n\t Value found: " + s.dst_bfact +". \
				\n\t Value expected: A string with value " + DixieGlobals.blending_factors + ".");
			s.dst_bfact = DixieGlobals.defaultDstbValue;
		}

		if (!Dixie.validString(s.origin, DixieGlobals.possible_origins))
		{
			errorMsg.push("No origin defined for the "+systemName+". Stopping loading...\
				\n \t Value found: " + s.origin + ". \
				\n \t Value expected: A string with value Point or Mesh.");

			returnValue = -1;
		}

		if (!Dixie.validArray(s.position, 3, true))
		{
			warnMsg.push("Position not defined correctly for "+systemName+". Inserting a default one!!\
				\n \t Value found: " +s.position+". \
				\n \t Value expected: A array of size 3.");
			s.position = DixieGlobals.defaultPosition;

			returnValue = -1;
		}

		if (!Dixie.validString(s.spawn_mode, DixieGlobals.spawn_modes))
		{
			errorMsg.push("Spawn mode not defined correctly for the "+systemName+". Stopping loading...\
				\n \t Value found: " + s.spawn_mode + ". \
				\n \t Value expected: A string with value Linear or Waves.");

			returnValue = -1;
		}

		if (!Dixie.validPosInteger(s.max_particles))
		{
			errorMsg.push("Max particles not defined correctly for the "+systemName+". Stopping loading...\
				\n \t Value found: " + s.max_particles + ". \
				\n \t Value expected: An integer bigger than 0.");

			returnValue = -1;
		}

		if (!Dixie.validateDecimal(s.spawn_rate, true))
		{
			errorMsg.push("Spawn rate not defined correctly for the "+systemName+". Stopping loading...\
				\n \t Value found: " + s.spawn_mode + ". \
				\n \t Value expected: An integer bigger than 0.");

			returnValue = -1;
		}

		if (!Dixie.validPosInteger(s.particles_per_wave))
		{
			errorMsg.push("Particles per wave not defined correctly for the "+systemName+". Stopping loading...\
				\n \t Value found: " + s.particles_per_wave + ". \
				\n \t Value expected: An integer bigger than 0.");

			returnValue = -1;
		}
	
		//Validation of the particle data
		s.particle_data = this.validateParticleData(s.particle_data, systemName, warnMsg);

		if(s.atlasName == undefined)
		{
			warnMsg.push("No atlas provided for "+systemName+", assuming that no atlas is used.");
			s.atlasName = DixieGlobals.defaultAtlasName;
		}

		if(!Dixie.validArray(s.uvs, -1, true))
		{
			warnMsg.push("No uvs provided for "+systemName+". Inserting empty uvs...");
			s.uvs = DixieGlobals.defaultUvs;

			if (s.atlasName != DixieGlobals.defaultAtlasName)
				s.atlasName = DixieGlobals.defaultAtlasName;
		}

		s.texture     = this.validateTexture(s.atlasName, s.texture, systemName, warnMsg);
		s.origin_mesh = this.validateMesh(s.origin_mesh, s.origin, warnMsg);

		if(s.sub_emittors == undefined || !Dixie.validArray(s.sub_emittors))
		{
			warnMsg.push("Sub emittors not defined correctly for "+systemName+". Inserting the default ones...");
		}
		else
			this.validateSubEmittors(s.sub_emittors, s.atlasName, systemName, warnMsg, errorMsg);

		this.validateModifications(s.modifications, systemName, warnMsg);
		this.validateForces(s.forces, systemName, warnMsg);	

		for (let i = 0; i < errorMsg.length; ++i)
			console.error("Dixie Error!! \n\n\t" + errorMsg[i] + "\n\n");

		for (let i = 0; i < warnMsg.length; ++i)
			console.warn("Dixie Warning!! \n\n\t" + warnMsg[i] + "\n\n");

		return returnValue;
	}
}