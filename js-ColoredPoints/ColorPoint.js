//ClickPoint.js
//Vertex Shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    '   gl_Position = a_Position;\n' + //coordinates
    '   gl_PointSize = 10.0;\n' + //sets point size
    '}\n';

//fragment shader
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' + //uniform variable
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    //retrieve canvas
    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('did not work, lacks rendering context');
        return;
    }

    //initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failes to initialize shaders')
        return;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position')
        return;
    }

    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

    //gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = []; //array for mouse press
    var g_colors = [];
    function click(ev, gl, canvas, a_Position, u_FragColor) {
        var x = ev.clientX; //x coord
        var y = ev.clientY; //y coord
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
        //store coords to gpoint array
        g_points.push([ x, y ]);

        if (x >= 0.0 && y >= 0.0) {
            g_colors.push([1.0, 0.0, 0.0, 1.0]);
        } else if (x < 0.0 && y < 0.0) {
            g_colors.push([0.0, 1.0, 0.0, 1.0]);
        } else {
            g_colors.push([1.0, 1.0, 1.0, 1.0]);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for (var i = 0; i < len; i ++) {
            var xy = g_points[i];
            var rgba = g_colors[i];

            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}