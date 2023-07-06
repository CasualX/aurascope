
<script>
"use strict"

var SettingsUiStatus = {
	name: 'settings-uiStatus',
	template: '#settings-uiStatus',
	data() {
		return {};
	},
	props: ['cvars', 'item'],
	computed: {
		answer() {
			return this.cvars[this.item.cvar] == 'true' ? 'Yes' : 'No';
		},
	},
};
</script>

<template id="settings-uiStatus">
	<div class="settings-uiStatus">
		<div class="label">{{ item.label }}</div>
		<div class="value">{{ answer }}</div>
	</div>
</template>

<style>
.settings-uiStatus {
	margin: 5px 10px;
	padding: 5px 10px;
	display: grid;
	grid-template: auto / 200px auto;
	user-select: none;
}
.settings-uiStatus > .label {
	color: #908F8F;
}
.settings-uiStatus > .value {
	justify-self: end;
}
</style>
