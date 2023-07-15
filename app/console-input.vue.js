export default {
	data() {
		return {
			input: "",
			history: [],
			historyIndex: 0,
		};
	},
	props: ["disabled"],
	methods: {
		submit() {
			let text = this.input;
			this.$emit("submit", text);
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
				} else {
					this.input = "";
				}
				this.historyIndex = index;
			}
		},
		clear() {
			this.$emit("clear");
		},
		exit() {
			this.$emit("submit", "exit!");
		},
	},
	/*html*/
	template: `
	<div class="app-console-input">
		<span>Console:</span>
		<input type="text" class="widget-input" v-model="input" @keyup.enter="submit" @keyup.up="historyNav(-1)" @keyup.down="historyNav(1)"
			:disabled="disabled">
		<button class="widget-button-base widget-button" @click="submit" :disabled="disabled">Submit</button>
		<button class="widget-button-base widget-button" @click="exit" :disabled="disabled">Exit</button>
	</div>
	`,
};
