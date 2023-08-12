
<script>
"use strict";

var PanelSettings = {
	name: 'panel-settings',
	template: '#panel-settings',

	data() {
		return {};
	},

	props: ['cvars', 'tab'],

	methods: {
		uiElement(item) {
			switch (item.element) {
				case 'Number': return 'settings-uiNumber';
				case 'Status': return 'settings-uiStatus';
				case 'Text': return 'settings-uiText';
				case 'Toggle': return 'settings-uiToggle';
				default: return 'settings-uiText';
			}
		},
	},

	mounted() {
		this.cvars.fetchSettings();
	},
	activated() {
		this.cvars.fetchSettings();
	},
	updated() {
		this.cvars.fetchSettings();
	},
};
</script>

<template id="panel-settings">
	<div class="panel-settings">
		<div v-for="(group, gindex) in tab.groups" :key="gindex" class="group">
			<div class="header" v-if="group.header">{{ group.header }}</div>
			<template v-for="(item, iindex) in group.items" :key="iindex" class="item">
				<component :is="uiElement(item)" :cvars="cvars" :item="item"></component>
			</template>
		</div>
	</div>
</template>

<style>
.panel-settings {
	overflow-y: scroll;
}
.panel-settings > .group {
	border-radius: 8px;
	background-color: rgb(37, 37, 37);
	border: 1px solid rgb(71, 71, 71);
	padding: 10px;
	margin: 10px;
	width: 400px;
}
.panel-settings > .group > .header {
	color: rgb(95, 95, 95);
	margin-bottom: 10px;
	margin-left: 5px;
	user-select: none;
}
</style>
