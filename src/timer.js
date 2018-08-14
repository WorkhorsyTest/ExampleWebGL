"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


(function() {

class Timer {
	constructor() {
		this._delta_ticks = 0;
		this._ticks = 0;
		this._was_asleep = false;
	}

	update(curr_ticks) {
		// Reset the timer if it was asleep
		if (this._was_asleep) {
			this._delta_ticks = 0;
			this._ticks = curr_ticks;
			this._was_asleep = false;
		}

		this._delta_ticks = curr_ticks - this._ticks;
		this._ticks = curr_ticks;
	}

	ticks() {
		return this._ticks;
	}

	seconds() {
		return this._ticks * 0.001;
	}

	deltaTicks() {
		return this._delta_ticks;
	}

	deltaSeconds() {
		return this._delta_ticks * 0.001;
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
exports.YEE.Timer = Timer;
})();
