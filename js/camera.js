/*	Guillem Martínez Jiménez		
*   In this file you can find the main behaviour of the camera
*/

/*
*	Global variables
*/
var DEG2RAD = Math.PI/180;

class Camera 
{
	constructor ( gl, center, eye )
	{
		this.proj   = mat4.create();
		this.view   = mat4.create();
		this.mvp    = mat4.create();
		this.vp     = mat4.create();

		this.center = center || vec3.fromValues( 0, 0, 0 );  //If no center provided the value will be vec3(0,0,0)
		this.eye    = eye    || vec3.fromValues( 0, 0, 10 ); //If no eye provided the value will be vec3(0,0,10)

		this.near   = 0.1;
		this.far    = 1000;

		this.gl     = gl;

		this.initCamera( );
	}


	/*
	*	Initialize the camera and set mouse and keys events
	*	@method initCamera
	*/
	initCamera ( )
	{	
		mat4.perspective(this.proj, 45 * DEG2RAD, this.gl.canvas.width / this.gl.canvas.height, this.near, this.far);
		this.updateViewMatrix();

		this.gl.captureMouse( true, true );

		var camera = this;

		this.gl.onmousemove = function ( e ) 
		{ 
			if( e.dragging ) {
				vec3.rotateY(camera.eye, camera.eye,  e.deltax * time_interval * DEG2RAD * 6);
				vec3.rotateX(camera.eye, camera.eye, -e.deltay * time_interval * DEG2RAD * 6);
				camera.updateViewMatrix(); //Update the viewMatrix 
			}
		}

		this.gl.onmousewheel = function ( e )
		{
			vec3.scale(camera.eye, camera.eye, 1.0 - e.delta * 0.01);
			camera.updateViewMatrix();
		}

		this.gl.captureKeys();

		this.gl.onkey = function ( e )
		{
			if( e.eventType == "keydown" )
			{
				if( e.code == "KeyW" )
					camera.moveCamera(vec3.fromValues(0.0, 0.0, 1.0));

				if( e.code == "KeyS" )
					camera.moveCamera(vec3.fromValues(0.0, 0.0, -1.0));

				if( e.code == "KeyA" ) 
					camera.moveCamera(vec3.fromValues(1.0, 0.0, 0.0));

				if( e.code == "KeyD" )
					camera.moveCamera(vec3.fromValues(-1.0, 0.0, 0.0));

				if( e.code == "KeyE" )
					camera.moveCamera(vec3.fromValues(0.0, 1.0, 0.0));

				if( e.code == "KeyQ" )
					camera.moveCamera(vec3.fromValues(0.0, -1.0, 0.0));
			}
		}
	}


	/*
	*	Set the behaviour when the screen is resized
	*	@method resize
	*/
	resize ()
	{		
		mat4.perspective( this.proj, 45 * DEG2RAD, this.gl.canvas.width / this.gl.canvas.height, 0.1, 1000 );
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
	getLocalVector ( delta )
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
	moveCamera ( delta )
	{
		var lv = this.getLocalVector(delta);

		this.eye[0] = this.eye[0] - lv[0] * time_interval * 6; //It has to be dt no 0.1
		this.eye[1] = this.eye[1] - lv[1] * time_interval * 6;
		this.eye[2] = this.eye[2] - lv[2] * time_interval * 6;

		this.center[0] = this.center[0] - lv[0] * time_interval * 6;
		this.center[1] = this.center[1] - lv[1] * time_interval * 6;
		this.center[2] = this.center[2] - lv[2] * time_interval * 6;

		this.updateViewMatrix();
	}


	/*
	*	Returns the right vector in worldspace of the camera
	*   http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
	*	@method getRightVector
	*/
	getRightVector ()
	{
		var v = this.view;
		return [v[0], v[4], v[8]];
	}


	/*
	*	Returns the up vector in worldspace of the camera
	*   http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/
	*	@method getUpVector
	*/
	getUpVector ()
	{
		var v = this.view;
		return [v[1], v[5], v[9]];
	}
}