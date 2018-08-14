"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


(function() {

class Renderer {
	constructor() {
		this.gl = null;
	}

	init() {
		// Create a canvas to use as the screen
		const canvas = document.createElement('canvas');
		// Don't blur the screen when resized
		//canvas.style.imageRendering = '-moz-crisp-edges';
		canvas.style.imageRendering = 'pixelated';
		//-ms-interpolation-mode: nearest-neighbor;
		canvas.style.width = '100vw';
		canvas.style.height = '100vh';
		canvas.style.display = 'block';
		document.body.appendChild(canvas);

		// Get the canvas WebGL context
		const gl = canvas.getContext("webgl");
		if (! gl) {
			throw new Error(`Failed to get canvas WebGL context.`);
		}

		// Set black as the clear screen color
		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		// Clear the screen
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Create the program
		g_program = createProgram(gl, ["#vertex_shader", "#fragment_shader"]);

		// Get the attributes
		g_position_location = gl.getAttribLocation(g_program, "a_position");
		g_texcoord_location = gl.getAttribLocation(g_program, "a_texcoord");

		// Get the uniforms
		g_matrix_location = gl.getUniformLocation(g_program, "u_matrix");
		g_texture_location = gl.getUniformLocation(g_program, "u_texture");

		// Create a vertex buffer that contains a quad
		g_vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, g_vertex_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, DEFAULT_QUAD.slice(), gl.STATIC_DRAW);

		// Create a texture buffer that contains a quad
		g_texcoord_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, g_texcoord_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, DEFAULT_QUAD.slice(), gl.STATIC_DRAW);

		this.gl = gl;
	}
}

// Figure out if we are running in a Window or Web Worker
let exports = null;
if (typeof window === 'object') {
	exports = window;
} else if (typeof importScripts === 'function') {
	exports = self;
}

// Set exports
exports.Renderer = Renderer;
})();