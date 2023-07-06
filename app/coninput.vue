
<script>
"use strict"

var AppConInput = {
	name: 'app-coninput',
	template: '#app-coninput',
	data() {
		return {
			input: "",
			history: [],
			historyIndex: 0,
		};
	},
	props: ['disabled'],
	methods: {
		submit() {
			let text = this.input;
			this.$emit('submit', text);
			this.input = "";
			this.history.push(text);
			this.historyIndex = this.history.length;
		},
		historyNav(dir) {
			let index = this.historyIndex + dir;
			index = Math.min(index, this.history.length);
			index = Math.max(index, 0);
			if (index != this.historyIndex) {
				if (index >= 0 && index < this.history.length) {
					this.input = this.history[index];
				}
				else {
					this.input = "";
				}
				this.historyIndex = index;
			}
		},
		clear() {
			this.$emit('clear');
		},
		exit() {
			this.$emit('submit', "exit!");
		},
	},
};
</script>

<template id="app-coninput">
	<div class="app-coninput">
		<span>Console:</span>
		<input
			type="text"
			v-model="input"
			@keyup.enter="submit"
			@keyup.up="historyNav(-1)"
			@keyup.down="historyNav(1)"
			:disabled="disabled">
		<button @click="submit" :disabled="disabled">Submit</button>
		<button @click="exit" :disabled="disabled">Exit</button>
	</div>
</template>

<style>
.app-coninput {
	display: grid;
	grid-template: auto / 70px 500px 80px 80px;
	user-select: none;
	padding: 6px 12px;
	gap: 4px;
	background-color: rgb(60, 60, 60);
	z-index: 1; /* good fix :) */
}
.app-coninput > span {
	line-height: 30px;
}
</style>
