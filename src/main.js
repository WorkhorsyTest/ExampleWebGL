"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


let gl = null;
let prev_ticks = 0;
let program = null;
let g_position_location = null;
let g_texcoord_location = null;
let g_matrix_location = null;
let g_texture_location = null;
let g_vertex_buffer = null;
let g_texcoord_buffer = null;
let g_sprites = [];



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

function onLogic(ticks) {
	for (let sprite of g_sprites) {
		sprite.logic(ticks);
	}
}

function onRender() {
	// Resize the canvas to match the screen size
	const canvas = gl.canvas;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width  = width;
		canvas.height = height;
	}
	gl.viewport(0, 0, width, height);

	// Clear the screen
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Render the sprites
	for (let sprite of g_sprites) {
		sprite.render();
	}
}

function onFrame(curr_ticks) {
	requestAnimationFrame(onFrame);

	const ticks = curr_ticks - prev_ticks;
	prev_ticks = curr_ticks;

	onLogic(ticks);
	onRender();
}

class BounceSprite {
	constructor(texture) {
		this.x = (gl.canvas.width / 2) + (texture.width / 2);
		this.y = (gl.canvas.height / 2) + (texture.height / 2);
		this.speed_x = randomNumberBetween(-1, 1);
		this.speed_y = randomNumberBetween(-1, 1);
		this.texture = texture;
		this.speed = randomNumberBetween(60, 150);
	}

	logic(ticks) {
		const seconds = ticks * 0.001;
		this.x += this.speed_x * this.speed * seconds;
		this.y += this.speed_y * this.speed * seconds;

		if (this.x < -this.texture.width) {
			this.speed_x = randomNumberBetween(0.1, 1);
			this.speed = randomNumberBetween(60, 150);
		} else if (this.x > gl.canvas.width) {
			this.speed_x = randomNumberBetween(-0.1, -1);
			this.speed = randomNumberBetween(60, 150);
		}

		if (this.y < -this.texture.height) {
			this.speed_y = randomNumberBetween(0.1, 1);
			this.speed = randomNumberBetween(60, 150);
		} else if (this.y > gl.canvas.height) {
			this.speed_y = - randomNumberBetween(0.1, 1);
			this.speed = randomNumberBetween(60, 150);
		}
	}

	render() {
		this.texture.render(this.x, this.y);
	}
}

function main() {
	init();

	const texture_promises = [
		Texture.load(gl, 'test.png'),
		Texture.load(gl, 'test2.png'),
		Texture.load(gl, 'test3.png'),
	];

	Promise.all(texture_promises).then(textures => {
		let j = 0;
		for (let i = 0; i < 6; ++i) {
			const texture = textures[j];
			if (++j > textures.length-1) j = 0;
			g_sprites.push(new BounceSprite(texture));
		}

		onFrame(0);
	}).catch(error => {
		console.error(error);
	});
}

main();
