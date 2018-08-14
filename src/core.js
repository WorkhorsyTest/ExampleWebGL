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
})();
