/*	Guillem Martínez Jiménez		
*   In this file you can find the main behaviour of the camera
*/

/*	Global variables*/
var DEG2RAD  = Math.PI/180;

/*
* 	This class is for define the camera
*	@class Camera
*/
class Camera 
{
	/*
	* 	The constructor of the class
	*	@method constructor
	*	@params {gl}      the litegl canvas definition
	*	@params {Vector3} the center of the camera (Where is looking)
	*	@params {Vector3} the eye of the camera (Where is the camera)
	*/
	constructor (gl, center, eye)
	{
		this.proj   = mat4.create();
		this.view   = mat4.create();
		this.mvp    = mat4.create();
		this.vp     = mat4.create();

		this.center = center || vec3.fromValues( 0, 0, 0 );  //If no center provided the value will be vec3(0,0,0)
		this.eye    = eye    || vec3.fromValues( 0, 0, 10 ); //If no eye provided the value will be vec3(0,0,10)

		this.aux_eye    = this.eye.slice(0);
		this.aux_center = this.center.slice(0);

		this.near   = 0.1;
		this.far    = 1000;
		this.yaw    = 0;
		this.pitch  = 0;
		this.fov    = 45;
		this.sensibility = 6;

		this.gl = gl;

		this.initCamera();
	}


	/*
	*	Initialize the camera and set mouse and keys events
	*	@method initCamera
	*/
	initCamera ( )
	{	
		mat4.perspective(this.proj, this.fov * DEG2RAD, this.gl.canvas.width / this.gl.canvas.height, this.near, this.far);
		this.updateViewMatrix();

		this.gl.captureMouse(true, true);
		this.gl.captureKeys(true, true);

		var camera = this;

		this.gl.onmousemove = function ( e ) 
		{ 
			if( e.dragging ) {
				var yaw   = e.deltax * time_interval * DEG2RAD * 6;
				var pitch = -e.deltay * time_interval * DEG2RAD * 6;

				camera.orbit(yaw, pitch)
			}
		}

		this.gl.onmousewheel = function ( e )
		{
			camera.zoom(e.delta);
		}
	}


	/*
	*	Set the behaviour when the screen is resized
	*	@method resize
	*/
	resize ()
	{		
		mat4.perspective( this.proj, this.fov * DEG2RAD, this.gl.canvas.width / this.gl.canvas.height, 0.1, 1000 );
		this.updateViewMatrix();
		this.gl.reset();
	}


	/*
	*	Updates the view matrix of the camera
	*	@method updateViewMatrix
	*/
	updateViewMatrix ()
	{
		mat4.lookAt(this.view, this.eye, this.center, [0,1,0]);
		mat4.multiply(this.mvp, this.proj, this.view);
		mat4.multiply(this.vp , this.view, this.proj);
	}


	/*
	*	Given a vector transform it in the local space of the camera
	*	@method getLocalVector
	*	@params {vec3}  
	*/
	getLocalVector (delta)
	{
		var iView = mat4.create();
		mat4.invert(iView, this.view);
		var lv = vec4.fromValues(delta[0], delta[1], delta[2], 0.0); 
		vec4.transformMat4(lv, lv, iView);
		return vec3.fromValues(lv[0], lv[1], lv[2]); 
	}


	/*
	*	Given a delta moves the camera
	*	@method moveCamera
	*	@params {vec3} 
	*/
	moveCamera(delta)
	{

		var eye    = this.eye;
		var center = this.center;

		var new_eye    = [0,0,0];
		var new_center = [0,0,0];

		var speed = time_interval * this.sensibility;

		vec3.scaleAndAdd(this.eye,    eye,    delta, speed);
		vec3.scaleAndAdd(this.center, center, delta, speed);

		this.updateViewMatrix();
	}


	/*
	*	Update of the camera
	*	@method update
	*   @source https://webglstudio.org/demo/
	*/
	update()
	{
		if(panel_focus)
			return;

		var delta = [0,0,0];

		if (gl.keys["W"])
			delta[2] = -1;
		else if (gl.keys["S"]) 
			delta[2] = 1;
		if (gl.keys["A"]) 
			delta[0] = -1;
		else if (gl.keys["D"]) 
			delta[0] = 1;
		if (gl.keys["Q"] )
			delta[1] = 1;
		else if (gl.keys["E"])
			delta[1] = -1;

		if(delta[0] || delta[1] || delta[2])
			camera.moveCamera(this.getLocalVector(delta));
	}


	/*
	*	Rotate the camera
	*	@method orbit
	*   @param {Vector3} The yaw of the camera   (horitzontal rotation)
	*   @param {Vector3} The pitch of the camera (vertical rotation)
	*   @source https://github.com/victorubieto/graph_system/blob/master/main.js 
	*   @source https://github.com/jagenjo/webglstudio.js/blob/518e16a330da3e83daadc966e79103584a284b7b/editor/js/tools/camera.js#L416
	*/
	orbit(yaw, pitch)
	{
		//instead of use this.getLocalVector(this.getUpVector()) I use [0,1,0] the result is the same and the performance is better
		var up    = [0,1,0], n_up = [0,0,0]; 
		var dist  = [0,0,0], front = [0,0,0], n_front = [0,0,0];
		var center = this.center, eye = this.eye;
		vec3.subtract(front, center, eye);
		vec3.subtract(dist,  eye, center);

		//The dot product is computed for know if the front ant the up are aligned avoid gimble lock
		vec3.normalize(n_front, front);
 		var problem_angle = vec3.dot(n_front, up);

 		//Apply the quaternion formula cos(-yaw) + sin(-yaw)*(UP)
		var R = quat.fromAxisAngle(up, -yaw);
		//Apply the formula R * dist * R^-1 for get how many is required to move the eye for rotate it
		vec3.transformQuat(dist, dist, R);

		if( !(problem_angle > 0.90 && pitch > 0 || problem_angle < -0.90 && pitch < 0))
		{
			var right = this.getLocalVector([1,0,0]);
			quat.setAxisAngle(R, right, pitch);
			vec3.transformQuat(dist, dist, R);
		} 
		
		//The center is added because the rotation is around the center
		vec3.add(this.eye, dist, center);

		this.updateViewMatrix();
	}


	/*
	*	Zoom in / Zoom out the camera
	*	@method zoom
	*   @param {Vector3} The zoom applied to the camera
	*/
	zoom(delta)
	{
		var eye    = this.eye;
		var center = this.center;
		var speed  = delta * time_interval * (this.sensibility*0.5);

		var dist = [0,0,0];
		vec3.subtract(dist, center, eye);
		vec3.scaleAndAdd(this.eye, eye, dist, speed);
		this.updateViewMatrix();
	}


	/*
	*	Returns the forward vector in worldspace of the camera
	*	@method getForwardVector
	*/
	getForwardVector()
	{
		var v = this.view;
		return [v[2], v[6], v[10]];
	}


	/*
	*	Returns the right vector in worldspace of the camera
	*   @source http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
	*	@method getRightVector
	*/
	getRightVector()
	{
		var v = this.view;
		return [v[0], v[4], v[8]];
	}


	/*
	*	Returns the up vector in worldspace of the camera
	*   @source http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
	*	@method getUpVector
	*/
	getUpVector()
	{
		var v = this.view;
		return [v[1], v[5], v[9]];
	}
}