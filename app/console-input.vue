
<script>
"use strict"

var AppConsoleInput = {
	name: 'app-console-input',
	template: '#app-console-input',
	data() {
		let self = this;
		return {
			get disabled() {
				return self.console.ready == false;
			},
		};
	},
	props: ['console'],
	methods: {
		submit() {
			let text = this.console.input;
			this.console.submit(text);
			this.console.input = "";
			this.console.history.push(text);
			this.console.historyIndex = this.console.history.length;
		},
		historyNav(dir) {
			let index = this.console.historyIndex + dir;
			index = Math.min(index, this.console.history.length);
			index = Math.max(index, 0);
			if (index != this.console.historyIndex) {
				if (index >= 0 && index < this.console.history.length) {
					this.console.input = this.console.history[index];
				}
				else {
					this.console.input = "";
				}
				this.console.historyIndex = index;
			}
		},
		clear() {
			this.console.clear();
		},
		exit() {
			this.console.submit("exit!");
		},
	},
};
</script>

<template id="app-console-input">
	<div class="app-console-input">
		<span>Console:</span>
		<input
			class="widget-input"
			type="text"
			v-model="console.input"
			@keyup.enter="submit"
			@keyup.up="historyNav(-1)"
			@keyup.down="historyNav(1)"
			:disabled="disabled">
		<button class="widget-button primary" @click="submit" :disabled="disabled">Submit</button>
		<button class="widget-button" @click="exit" :disabled="disabled">Exit</button>
		<button class="widget-button" @click="clear()"><icon-clear></icon-clear>&nbsp;Clear</button>
		<button class="widget-button" v-if="console.paused" @click="console.paused = false;"><icon-play></icon-play>&nbsp;Play</button>
		<button class="widget-button" v-if="!console.paused" @click="console.paused = true;"><icon-pause></icon-pause>&nbsp;Pause</button>
	</div>
</template>

<style>
.app-console-input {
	display: grid;
	grid-template: auto / 70px minmax(auto, 500px) 80px 80px 80px 80px;
	user-select: none;
	padding: 6px 12px;
	align-items: center;
	gap: 4px;
	background-color: hsl(var(--bg-950));
	z-index: 1; /* good fix :) */
}
</style>
