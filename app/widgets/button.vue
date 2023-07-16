
<script>
"use strict"

var WidgetButton = {
	name: 'widget-button',
	template: '#widget-button',
	data() {
		return {};
	},
	props: ['icon', 'label', 'primary'],
};
</script>

<template id="widget-button">
	<button class="widget-button" :class="[primary !== undefined ? 'primary' : 'widget-button']"><component v-if="icon != null" :is="icon"></component><span>&nbsp;{{ label }}</span></button>
</template>
