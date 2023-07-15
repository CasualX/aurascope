export default {
	data() {
		return {};
	},
	props: ["icon", "label"],
	/*html*/
	template: `
	<button class="widget-button-base" :class="[$attrs.primary !== undefined ? 'widget-button-primary' : 'widget-button']">
		<component class="widget-button-icon" v-if="icon != null" :is="icon"></component>
		<span>{{ label }}</span>
	</button>
	`,
};
