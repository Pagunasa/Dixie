/*
*   This function merges a set of textures 
*   @method modifyPropertyNode
*   @params {List} A list that contains all the textures
*/
var TextureMerger = function(texturesObj)
{
  var max_width  = 64;
  var max_height = 64;
  var temp_s = 0;   
  var texture;
  var data_size = 0;
  var pixel_offset = 10;

  var height, width;
  var textures_l = texturesObj.length;
  var empty_text = new GL.Texture(64, 64, { minFilter: gl.NEAREST, magFilter: gl.LINEAR, format: gl.RGBA });

  //Get the maximum and minimun size of the texture
  for (var i = 0; i < textures_l; ++i) 
  {
    texture = texturesObj[i];

    height = texture.height;
    width  = texture.width;
    
    max_width  = Math.max(width, max_width);
    max_height += height;
  }

  max_height += pixel_offset;

  //Create the texture
  var atlas  = new GL.Texture( max_width, max_height, { minFilter: gl.NEAREST, magFilter: gl.LINEAR, format: gl.RGBA });
  var coords = [];

  //Create the FBO and bind the atlas
  var fbo    = new GL.FBO([atlas]);
  var offset = 0;
  var times  = 0;

  fbo.bind();

  gl.disable(gl.DEPTH_TEST);
  gl.clear( gl.COLOR_BUFFER_BIT );

  coords.push([0, 0, 64/max_width, Math.min((pixel_offset + 64)/max_height, 1.0)]);

  gl.viewport(0, offset, 64, 64);
  offset += 64 + pixel_offset;
  
  //The first texture is the "undefined one" for this reason is white with alpha 1
  empty_text.toViewport(GL.Shader.getFlatScreenShader(), {u_color: [1,1,1,1]}); 

  for (var i = 0; i < textures_l; ++i) 
  {
    texture = texturesObj[i];
    height  = texture.height;
    width   = texture.width;
    
    //Save the new coordinates of the textures
    coords.push([0, (offset)/max_height, width/max_width, (offset + height)/max_height]);

    gl.viewport(0, offset, width, height);
    offset += height + pixel_offset;

    texture.toViewport();
  }
  
  fbo.unbind();

  return [atlas, coords];
}

/*var TextureMerger = function(texturesObj)
{
  var max_width  = 64;
  var max_height = 64;
  var temp_s = 0;   
  var texture;
  var data_size = 0;
  var pixel_offset = 10;

  var height, width;
  var textures_l = texturesObj.length;
  var empty_text = new GL.Texture(64, 64, { minFilter: gl.NEAREST, magFilter: gl.LINEAR, format: gl.RGBA });

  //Get the maximum and minimun size of the texture
  for (var i = 0; i < textures_l; ++i) 
  {
    texture = texturesObj[i];

    height = texture.height;
    width  = texture.width;
    
    max_width  = Math.max(width, max_width);
    max_height += height;
  }

  max_height += pixel_offset*(textures_l-1);

  //Create the texture
  var atlas  = new GL.Texture( max_width, max_height, { minFilter: gl.NEAREST, magFilter: gl.LINEAR, format: gl.RGBA });
  var coords = [];

  //Create the FBO and bind the atlas
  var fbo    = new GL.FBO([atlas]);
  var offset = 0;
  var times  = 0;

  fbo.bind();

  gl.disable(gl.DEPTH_TEST);
  gl.clear( gl.COLOR_BUFFER_BIT );

  coords.push([0, 0, 64/max_width, Math.min((pixel_offset + 64)/max_height, 1.0)]);

  gl.viewport(0, offset, 64, 64);
  offset += 64 + pixel_offset;
  
  //The first texture is the "undefined one" for this reason is white with alpha 1
  empty_text.toViewport(GL.Shader.getFlatScreenShader(), {u_color: [1,1,1,1]}); 

  for (var i = 0; i < textures_l; ++i) 
  {
    texture = texturesObj[i];
    height  = texture.height;
    width   = texture.width;
    
    //Save the new coordinates of the textures
    coords.push([0, (offset + pixel_offset)/max_height, width/max_width, (offset + pixel_offset + height)/max_height]);

    gl.viewport(0, offset, width, height);
    offset += height + pixel_offset;

    texture.toViewport();
  }
  
  fbo.unbind();

  return [atlas, coords];
}*/