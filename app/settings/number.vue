
<script>
"use strict"

var SettingsUiNumber = {
	name: 'settings-uiNumber',
	template: '#settings-uiNumber',
	data() {
		return {};
	},
	props: ['cvars', 'item'],
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
};
</script>

<template id="settings-uiNumber">
	<div class="settings-uiNumber">
		<div class="label">{{ item.label }}</div>
		<div class="value">
			<div v-if="item.unit" class="unit">{{ item.unit[0] }}</div>
			<input type="text" v-model="valueString" @change="commit" @dblclick="$event.target.select()">
		</div>
		<div class="slider"><input type="range" v-model="valueNumber" :min="item.min" :max="item.max" :step="item.step" @change="commit"></div>
	</div>
</template>

<style>
.settings-uiNumber {
	margin: 5px 10px;
	padding: 5px 10px;
	display: grid;
	grid-template: 27px 27px / auto 100px;
	align-items: center;
}

.settings-uiNumber > .label {
	color: #908F8F;
	user-select: none;
	grid-row: 1;
	grid-column: 1;
}

.settings-uiNumber > .slider {
	grid-row: 2;
	grid-column: 1 / span 2;
	padding-top: 5px;
}

.settings-uiNumber > .slider > input {
	appearance: none;
	width: 100%;
	height: 15px;
	border-radius: 5px;
	background: #2B2A28;
	outline: none;
}
.settings-uiNumber > .slider > input::-moz-range-progress {
	background-color: #41403E;
	height: 12px;
	border-radius: 5px;
}
.settings-uiNumber > .slider > input::-webkit-slider-thumb {
	appearance: none;
	width: 17px;
	height: 17px;
	border-radius: 50%;
	background: #575756;
	cursor: pointer;
}
.settings-uiNumber > .slider > input::-moz-range-thumb {
	width: 17px;
	height: 17px;
	border-radius: 50%;
	background: #575756;
	cursor: pointer;
}

.settings-uiNumber > .value {
	justify-self: end;
	position: relative;
	grid-row: 1;
	grid-column: 2;
}

.settings-uiNumber > .value > .unit {
	position: absolute;
	left: 55px;
	user-select: none;
	line-height: 27px;
	color: #908F8F;
}

.settings-uiNumber > .value > input {
	background-color: #2B2A28;
	color: #FFF;
	border: 1px solid #41403E;
	border-radius: 5px;
	height: 25px;
	width: 40px;
	text-align: right;
	padding: 0 5px;
}
.settings-uiNumber > .value > input:focus {
	outline: none;
}
</style>
