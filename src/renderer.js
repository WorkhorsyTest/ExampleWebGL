"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


(function() {

class Renderer {
	constructor() {
		this.gl = null;
		this.program = null;

		this._position_location = null;
		this._texcoord_location = null;
		this._matrix_location = null;
		this._texture_location = null;
		this._vertex_buffer = null;
		this._texcoord_buffer = null;
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
		this.program = YEE.createProgram(gl, ["#vertex_shader", "#fragment_shader"]);

		// Get the attributes
		this._position_location = gl.getAttribLocation(this.program, "a_position");
		this._texcoord_location = gl.getAttribLocation(this.program, "a_texcoord");

		// Get the uniforms
		this._matrix_location = gl.getUniformLocation(this.program, "u_matrix");
		this._texture_location = gl.getUniformLocation(this.program, "u_texture");

		// Create a vertex buffer that contains a quad
		this._vertex_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, YEE.DEFAULT_QUAD.slice(), gl.STATIC_DRAW);

		// Create a texture buffer that contains a quad
		this._texcoord_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this._texcoord_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, YEE.DEFAULT_QUAD.slice(), gl.STATIC_DRAW);

		this.gl = gl;
	}

	resize() {
		// Resize the canvas to match the screen size
		const gl = this.gl;
		const canvas = gl.canvas;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width  = width;
			canvas.height = height;
		}
		gl.viewport(0, 0, width, height);
	}

	clear() {
		const gl = this.gl;
		// Clear the screen
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	width() {
		return this.gl.canvas.width;
	}

	height() {
		return this.gl.canvas.height;
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
if (typeof exports.YEE === "undefined") exports.YEE = {};
exports.YEE.Renderer = Renderer;
})();
