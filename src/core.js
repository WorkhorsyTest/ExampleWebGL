"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


(function() {


const DEFAULT_QUAD = new Float32Array([
	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1,
]);

function randomNumberBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function init() {
	// Get the canvas
	const canvas = document.querySelector("#canvas");
	if (! canvas) {
		throw new Error(`Failed to find the canvas.`);
	}

	// Get the canvas WebGL context
	gl = canvas.getContext("webgl");
	if (! gl) {
		throw new Error(`Failed to get canvas WebGL context.`);
	}

	// Set black as the clear screen color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear the screen
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Create the program
	program = createProgram(gl, ["#vertex_shader", "#fragment_shader"]);

	// Get the attributes
	g_position_location = gl.getAttribLocation(program, "a_position");
	g_texcoord_location = gl.getAttribLocation(program, "a_texcoord");

	// Get the uniforms
	g_matrix_location = gl.getUniformLocation(program, "u_matrix");
	g_texture_location = gl.getUniformLocation(program, "u_texture");

	// Create a vertex buffer that contains a quad
	g_vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, g_vertex_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, DEFAULT_QUAD.slice(), gl.STATIC_DRAW);

	// Create a texture buffer that contains a quad
	g_texcoord_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, g_texcoord_buffer);
	gl.bufferData(gl.ARRAY_BUFFER, DEFAULT_QUAD.slice(), gl.STATIC_DRAW);
}

// Figure out if we are running in a Window or Web Worker
let exports = null;
if (typeof window === 'object') {
	exports = window;
} else if (typeof importScripts === 'function') {
	exports = self;
}

// Set exports
exports.DEFAULT_QUAD = DEFAULT_QUAD;
exports.randomNumberBetween = randomNumberBetween;
exports.init = init;
})();
