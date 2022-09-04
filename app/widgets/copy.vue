
<script>
"use strict"

var WidgetCopy = {
	name: 'widget-copy',
	template: '#widget-copy',
	data() {
		return {};
	},
	props: ['text'],
	methods: {
		copyText() {
			window.navigator.clipboard.writeText(this.text);
		},
	},
};
</script>

<template id="widget-copy">
	<div class="widget-copy" title="Copy to clipboard" @click="copyText"><span style="font-size: .875em; margin-right: .125em; position: relative; top: -.25em; left: -.125em">📄<span style="position: absolute; top: .25em; left: .25em">📄</span></span></div>
</template>

<style>
.widget-copy {
	position: absolute;
	right: 25px;
	bottom: 15px;
	cursor: pointer;
	user-select: none;
}
</style>
