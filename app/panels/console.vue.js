import { nextTick } from "vue";

export default {
	data() {
		return {
			scrollOncePerTick: true,
		};
	},
	props: ["console"],
	computed: {
		linesCopy() {
			return this.console.lines.slice();
		},
		copyText() {
			return this.console.lines.join("\n");
		},
	},
	watch: {
		linesCopy() {
			this.scrollToEnd(false);
		},
	},
	methods: {
		scrollToEnd(force) {
			if (this.scrollOncePerTick) {
				let el = this.$refs.consoleRef;
				// From StackOverflow: Scroll to the bottom only if we're already at the bottom
				if (force || el.scrollHeight - el.scrollTop - el.clientHeight < 1) {
					this.scrollOncePerTick = false;
					nextTick(() => {
						el.scrollTop = el.scrollHeight;
						this.scrollOncePerTick = true;
					});
				}
			}
		},
		copyEvent(e) {
			if (document.getSelection().toString() == "") {
				e.clipboardData.setData("text/plain", this.copyText);
				e.preventDefault();
			}
		},
		consoleInput(text) {
			this.console.submit(text);
		},
		consoleClear() {
			this.console.lines = [];
		},
	},
	mounted() {
		this.scrollToEnd(true);
	},
	/*html*/
	template: `
	<div class="panel-console" ref="consoleRef" @copy="copyEvent">
		<div class="content scrollbar">
			<pre class="lines">
				<div v-for="line in linesCopy" :key="line" class="line">{{ line }}</div>
			</pre>
			<!-- <widget-copy :text="copyText"></widget-copy> -->
		</div>
		<app-console-input @submit="consoleInput" @clear="consoleClear" :disabled="!console.ready"></app-console-input>
	</div>
	`,
};
