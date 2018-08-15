"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


let g_renderer = null;
let g_sprites = [];
let g_timer = null;


class BounceSprite {
	constructor(texture) {
		this.x = (texture.renderer.width() / 2) + (texture.width / 2);
		this.y = (texture.renderer.height() / 2) + (texture.height / 2);
		this.rotation = 0;
		this.speed_x = YEE.randomNumberBetween(-1, 1);
		this.speed_y = YEE.randomNumberBetween(-1, 1);
		this.texture = texture;
		this.speed = YEE.randomNumberBetween(60, 150);
	}

	logic() {
		const seconds = g_timer.deltaSeconds();
		const renderer = this.texture.renderer;
		this.rotation += g_timer.deltaSeconds();
		this.x += this.speed_x * this.speed * seconds;
		this.y += this.speed_y * this.speed * seconds;

		if (this.x < -this.texture.width) {
			this.speed_x = YEE.randomNumberBetween(0.1, 1);
			this.speed = YEE.randomNumberBetween(60, 150);
		} else if (this.x > renderer.width()) {
			this.speed_x = YEE.randomNumberBetween(-0.1, -1);
			this.speed = YEE.randomNumberBetween(60, 150);
		}

		if (this.y < -this.texture.height) {
			this.speed_y = YEE.randomNumberBetween(0.1, 1);
			this.speed = YEE.randomNumberBetween(60, 150);
		} else if (this.y > renderer.height()) {
			this.speed_y = - YEE.randomNumberBetween(0.1, 1);
			this.speed = YEE.randomNumberBetween(60, 150);
		}
	}

	render() {
		this.texture.render(this.x, this.y, this.rotation);
	}
}

function onLogic() {
	for (let sprite of g_sprites) {
		sprite.logic();
	}
}

function onRender() {
	g_renderer.resize();
	g_renderer.clear();

	// Render the sprites
	for (let sprite of g_sprites) {
		sprite.render();
	}
}

function onFrame(curr_ticks) {
	requestAnimationFrame(onFrame);

	g_timer.update(curr_ticks);

	onLogic();
	onRender();
}

function main() {
	g_timer = new YEE.Timer();
	g_renderer = new YEE.Renderer();
	g_renderer.init();

	// Reset the timer when the app wakes from sleep
	document.addEventListener('visibilitychange', () => {
		if (! document.hidden) {
			g_timer._was_asleep = true;
		}
	});

	const texture_promises = [
		YEE.Texture.load(g_renderer, 'test.png'),
		YEE.Texture.load(g_renderer, 'test2.png'),
		YEE.Texture.load(g_renderer, 'test3.png'),
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
