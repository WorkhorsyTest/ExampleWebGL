"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


(function() {

class Texture {
	constructor(renderer, gl_texture, x, y, width, height) {
		this.renderer = renderer;
		this.gl_texture = gl_texture;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	render(x, y, rotation) {
		const gl = this.renderer.gl;
		const gl_texture  = this.gl_texture;
		const width = this.width;
		const height = this.height;

		// Use the program on the texture
		gl.useProgram(this.renderer.program);
		gl.bindTexture(gl.TEXTURE_2D, gl_texture);

		// Set the vertex attributes
		gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer._vertex_buffer);
		gl.enableVertexAttribArray(this.renderer._position_location);
		gl.vertexAttribPointer(this.renderer._position_location, 2, gl.FLOAT, false, 0, 0);

		// Set the texture attributes
		gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer._texcoord_buffer);
		gl.enableVertexAttribArray(this.renderer._texcoord_location);
		gl.vertexAttribPointer(this.renderer._texcoord_location, 2, gl.FLOAT, false, 0, 0);

		// Use a matrix with an orthographic camera
		const buffer = new Float32Array(16);
		let matrix = mat4.ortho(buffer, 0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

		// Position, rotate, and scale the matrix
		matrix = mat4.translate(buffer, matrix, [x, y, 0]);
		const axis = [0, 0, 1];
		matrix = mat4.rotate(buffer, matrix, rotation, axis);
		matrix = mat4.scale(buffer, matrix, [width, height, 1]);

		// Set the uniforms for matrix and first texture
		gl.uniformMatrix4fv(this.renderer._matrix_location, false, matrix);
		gl.uniform1i(this.renderer._texture_location, 0);

		// Render as a quad
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	static load(renderer, url) {
		return new Promise((resolve, reject) => {
			const gl = renderer.gl;
			// Create texture
			const gl_texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, gl_texture);

			// Fill texture with a single red pixel
			const level = 0;
			const internal_format = gl.RGBA;
			const src_format = gl.RGBA;
			const width = 1;
			const height = 1;
			const border = 0;
			const src_type = gl.UNSIGNED_BYTE;
			const data = new Uint8Array([255, 0, 0, 255]);
			gl.texImage2D(gl.TEXTURE_2D, level, internal_format, width, height, border, src_format, src_type, data);

			// Set texture filtering
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

			// Set texture wrapping
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			// Load image, and copy into texture
			const image = new Image();
			image.addEventListener('load', function() {
				gl.bindTexture(gl.TEXTURE_2D, gl_texture);
				gl.texImage2D(gl.TEXTURE_2D, level, internal_format, src_format, src_type, image);

				const texture = new Texture(renderer, gl_texture, 1.0, 1.0, image.width, image.height);
				resolve(texture);
			});
			image.addEventListener('error', function() {
				reject(`Failed to load image '${url}'`);
			});
			image.src = url;
		});
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
exports.YEE.Texture = Texture;
})();
