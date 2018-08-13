"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


let g_sprites = [];

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
