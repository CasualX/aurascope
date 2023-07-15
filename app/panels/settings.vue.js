export default {
	data() {
		return {};
	},
	props: ["cvars", "tab"],
	mounted() {
		this.cvars.fetchSettings();
	},
	activated() {
		this.cvars.fetchSettings();
	},
	updated() {
		this.cvars.fetchSettings();
	},
	/*html*/
	template: `
	<div class="panel-container scrollbar">
		<div class="panel-settings">
			<div v-for="(group, gindex) in tab.groups" :key="gindex" class="group">
				<div class="header" v-if="group.header">{{ group.header }}</div>
				<template v-for="(item, iindex) in group.items" :key="iindex" class="item">
					<component :is="'settings-ui' + item.element" :cvars="cvars" :item="item"></component>
				</template>
			</div>
		</div>
	</div>
	`,
};
