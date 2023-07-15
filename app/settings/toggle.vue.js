export default {
	data() {
		return {};
	},
	computed: {
		enabled: {
			get() {
				return this.cvars[this.item.cvar] == "true";
			},
			set(value) {
				this.cvars.sendPropValue(this.item.cvar, value ? "true" : "false");
			},
		},
	},
	props: ["cvars", "item"],
	/*html*/
	template: `
	<div class="settings-uiToggle">
		<div class="label">{{ item.label }}</div>
		<label class="value" @wheel="enabled = $event.deltaY < 0">
			<input type="checkbox" v-model="enabled" />
			<span class="slider round"></span>
		</label>
	</div>
	`,
};
