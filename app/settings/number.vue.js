export default {
	data() {
		return {};
	},
	props: ["cvars", "item"],
	computed: {
		valueNumber: {
			get() {
				return parseFloat(this.valueString);
			},
			set(value) {
				let precision = -Math.round(Math.log(this.item.step) / Math.log(10));
				this.valueString = parseFloat(value).toFixed(precision);
			},
		},
		valueString: {
			get() {
				return this.cvars[this.item.cvar];
			},
			set(value) {
				// Update our local copy of the cvar value
				// Commit to sending it when done editing
				this.cvars[this.item.cvar] = "" + value;
			},
		},
	},
	methods: {
		commit() {
			this.cvars.sendPropValue(this.item.cvar);
			this.cvars.fetchSettings();
		},
	},
	/*html*/
	template: `
	<div class="settings-uiNumber">
		<div class="label">{{ item.label }}</div>
		<div class="value">
			<div v-if="item.unit" class="unit">{{ item.unit[0] }}</div>
			<input type="text" v-model="valueString" @change="commit" @dblclick="$event.target.select()" />
		</div>
		<div class="slider">
			<input type="range" v-model="valueNumber" :min="item.min" :max="item.max" :step="item.step" @change="commit" />
		</div>
	</div>
	`,
};
