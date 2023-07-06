
<script>
"use strict"

var SettingsUiToggle = {
	name: 'settings-uiToggle',
	template: '#settings-uiToggle',
	data() {
		return {};
	},
	computed: {
		enabled: {
			get() {
				return this.cvars[this.item.cvar] == 'true';
			},
			set(value) {
				this.cvars.sendPropValue(this.item.cvar, value ? 'true' : 'false');
			},
		}
	},
	props: ['cvars', 'item'],
};
</script>

<template id="settings-uiToggle">
	<div class="settings-uiToggle">
		<div class="label">{{ item.label }}</div>
		<label class="value" @wheel="enabled = $event.deltaY < 0">
			<input type="checkbox" v-model="enabled">
			<span class="slider round"></span>
		</label>
	</div>
</template>

<style>
.settings-uiToggle {
	margin: 5px 10px;
	padding: 5px 10px;
	display: grid;
	grid-template: auto / 200px auto;
}
.settings-uiToggle > .label {
	color: #908F8F;
	user-select: none;
}
.settings-uiToggle > .value {
	justify-self: end;
}

.settings-uiToggle > .value {
	position: relative;
	display: inline-block;
	width: 50px;
	height: 23px;
}

.settings-uiToggle > .value > input {
	opacity: 0;
	width: 0;
	height: 0;
}

.settings-uiToggle > .value > .slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #414243;
	transition: .1s;
}

.settings-uiToggle > .value > .slider:before {
	position: absolute;
	content: "";
	height: 17px;
	width: 17px;
	left: 3px;
	bottom: 3px;
	background-color: #5F6060;
	transition: .1s;
}

.settings-uiToggle > .value > input:checked + .slider {
	background-color: #575756;
}

.settings-uiToggle > .value > input:checked + .slider:before {
	background-color: white;
}

/* .settings-uiToggle > .value > input:focus + .slider {
	box-shadow: 0 0 1px #2196F3;
} */

.settings-uiToggle > .value > input:checked + .slider:before {
	transform: translateX(26px);
}

.settings-uiToggle > .value > .slider.round {
	border-radius: 28px;
}

.settings-uiToggle > .value > .slider.round:before {
	border-radius: 50%;
}
</style>
