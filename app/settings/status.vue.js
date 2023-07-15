export default {
	data() {
		return {};
	},
	props: ["cvars", "item"],
	computed: {
		answer() {
			return this.cvars[this.item.cvar] == "true" ? "Yes" : "No";
		},
	},
	/*html*/
	template: `
	<div class="settings-uiStatus">
		<div class="label">{{ item.label }}</div>
		<div class="value">{{ answer }}</div>
	</div>
	`,
};
