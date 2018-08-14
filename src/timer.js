"use strict";

// Copyright (c) 2018 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// Licensed under a MIT style license
// http://github.com/workhorsy/ExampleWebGL


class Timer {
	constructor() {
		this._delta_ticks = 0;
		this._ticks = 0;
	}

	update(curr_ticks) {
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
