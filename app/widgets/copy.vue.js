export default {
	data() {
		return {};
	},
	props: ["text"],
	methods: {
		copyText() {
			window.navigator.clipboard.writeText(this.text);
		},
	},
	/*html*/
	template: `
	<div class="widget-copy" title="Copy to clipboard" @click="copyText">
		<span style="font-size: 0.875em; margin-right: 0.125em; position: relative; top: -0.25em; left: -0.125em"></span>
			📄
			<span style="position: absolute; top: 0.25em; left: 0.25em">📄</span>
		</span>
	</div>
	`,
};
