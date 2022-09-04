
<script>
"use strict"

var WidgetButton = {
	name: 'widget-button',
	template: '#widget-button',
	data() {
		return {};
	},
	props: ['icon', 'label'],
};
</script>

<template id="widget-button">
	<button class="widget-button"><component v-if="icon != null" :is="icon"></component><span>&nbsp;{{ label }}</span></button>
</template>

<style>
.widget-button {
	margin: 4px 2px;
	padding: 0 10px;
}
.widget-button > * {
	display: inline-block;
	vertical-align: middle;
}
.widget-button > svg {
	width: 12px;
	height: 12px;
	stroke: black;
	fill: none;
}
</style>
