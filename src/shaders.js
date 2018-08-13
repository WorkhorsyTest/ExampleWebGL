"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


function getShaderSource(gl, element_id) {
	// Get the script element
	const element = document.querySelector(element_id);
	if (! element) {
		throw new Error(`Failed to find element '${element_id}'`);
	}

	// Get the shader type
	let shader_type = null;
	switch (element.type) {
		case "x-shader/x-vertex":
			shader_type = gl.VERTEX_SHADER;
			break;
		case "x-shader/x-fragment":
			shader_type = gl.FRAGMENT_SHADER;
			break;
		default:
			throw new Error(`Failed to find element script type`);
	}

	// Return the type and source
	return {
		type: shader_type,
		source: element.text,
	};
}

function compileShader(gl, shader_type, shader_source) {
	// Compile the shader
	const shader = gl.createShader(shader_type);
	gl.shaderSource(shader, shader_source);
	gl.compileShader(shader);

	// Make sure it compiled successfully
	const is_success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (! is_success) {
		const log = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);
		throw new Error(`Failed to compile shader ${log}`);
	}

	return shader;
}

function createProgram(gl, element_ids) {
	// Compile the shaders
	const shaders = element_ids
		.map(id => getShaderSource(gl, id)) // Get each shader source and type
		.map(shader => compileShader(gl, shader.type, shader.source)); // Compile each shader

	// Create the program
	const program = gl.createProgram();

	// Attach the shaders to the program
	shaders.forEach(shader => gl.attachShader(program, shader));

	// Link the program
	gl.linkProgram(program);
	const is_success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (! is_success) {
		const log = gl.getProgramInfoLog(program);
		gl.deleteProgram(program);
		throw new Error(`Failed to link the program ${log}`);
	}
	return program;
}
