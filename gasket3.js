"use strict";

var canvas;
var gl;

var points = [];
var colors = [];

var theta = 0.0;
var thetaLoc;

//var direction = true;

var NumTimesToSubdivide = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2( 0,  1),
        vec2( 1,  0),
        vec2(-1,  0 ),
        vec2( 0, -1)
    ];
    

    divideTriangle( vertices[0], vertices[1], vertices[2],vertices[3],
                    NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	
    document.getElementById("submitSubs").onclick = function(){
    	NumTimesToSubdivide = parseInt(document.getElementById("Subdivision").value);
		points = [];
	    divideTriangle( vertices[0], vertices[1], vertices[2],vertices[3]
	                    NumTimesToSubdivide);
						
					    cBuffer = gl.createBuffer();
					    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
					    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

					    vColor = gl.getAttribLocation( program, "vColor" );
					    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
					    gl.enableVertexAttribArray( vColor );

					    bufferId = gl.createBuffer();
					    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
					    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

					    // Associate out shader variables with our data buffer

					    vPosition = gl.getAttribLocation( program, "vPosition" );
					    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
					    gl.enableVertexAttribArray( vPosition );
    };
	
    document.getElementById("Direction").onclick = function () {
        theta = -theta;
    };
	
    document.getElementById("slider").onchange = function() {
        theta = (theta < 0 ? -event.srcElement.value : event.srcElement.value);
    };	
    
    render();
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function triangle( a, b, c )
{
    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0)
    ];
	
    points.push( a, b, c, d);
	var rand = getRandomInt(0, 3)
	colors.push(baseColors[rand], baseColors[rand], baseColors[rand], baseColors[rand]);
}

function divideTriangle( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c, d);
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
		divideTriangle( ab, ac, bc, count);
    }
}

function render()
{
	
    gl.clear( gl.COLOR_BUFFER_BIT );
	
    
    gl.uniform1f(thetaLoc, theta);
	
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 4 );
	
    setTimeout(
        function () {requestAnimFrame( render );},10
    );
}
