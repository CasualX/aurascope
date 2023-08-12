
<script>
"use strict"

var SettingsUiNumber = {
	name: 'settings-uiText',
	template: '#settings-uiText',
	data() {
		return {};
	},
	props: ['cvars', 'item'],
	computed: {
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

<template id="settings-uiText">
	<div class="settings-uiText">
		<div class="label">{{ item.label }}</div>
		<div class="value">
			<div v-if="item.unit" class="unit">{{ item.unit[0] }}</div>
			<input type="text" v-model="valueString" @change="commit" @dblclick="$event.target.select()">
		</div>
	</div>
</template>

<style>
.settings-uiText {
	margin: 5px 10px;
	padding: 5px 10px;
	display: grid;
	grid-template: 27px 27px / auto 100px;
	align-items: center;
}

.settings-uiText > .label {
	color: #908F8F;
	user-select: none;
	grid-row: 1;
	grid-column: 1;
}

.settings-uiText > .value {
	justify-self: end;
	position: relative;
	grid-row: 1;
	grid-column: 2;
}

.settings-uiText > .value > .unit {
	position: absolute;
	left: 55px;
	user-select: none;
	line-height: 27px;
	color: #908F8F;
}

.settings-uiText > .value > input {
	background-color: #2B2A28;
	color: #FFF;
	border: 1px solid #41403E;
	border-radius: 5px;
	height: 25px;
	width: 40px;
	text-align: right;
	padding: 0 5px;
}
.settings-uiText > .value > input:focus {
	outline: none;
}
</style>
