export default {
	data() {
		return {};
	},
	props: ["page", "console"],
	computed: {
		html() {
			return this.page.html;
		},
	},
	methods: {
		copyText() {
			window.navigator.clipboard.writeText(this.html);
		},
		copyEvent(e) {
			if (document.getSelection().toString() == "") {
				e.clipboardData.setData("text/plain", this.html);
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
	/*html*/
	template: `
	<div class="panel-xss scrollbar" @copy="copyEvent">
		<div v-html="html" class="html"></div>
		<!-- <widget-copy :text="html"></widget-copy> -->
		<app-console-input @submit="consoleInput" @clear="consoleClear" :disabled="!console.ready"></app-console-input>
	</div>
	`,
};
