
<script>
"use strict"

var PanelXss = {
	name: 'panel-xss',
	template: '#panel-xss',

	data() {
		return {}
	},
	props: ['html'],
	methods: {
		copyText() {
			window.navigator.clipboard.writeText(this.html);
		},
		copyEvent(e) {
			if (document.getSelection().toString() == "") {
				e.clipboardData.setData("text/plain", this.html);
				e.preventDefault();
			}
		},
	},
};
</script>

<template id="panel-xss">
	<div class="panel-xss" @copy="copyEvent">
		<div v-html="html" class="html"></div>
		<!-- <widget-copy :text="html"></widget-copy> -->
	</div>
</template>

<style>
.panel-xss {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	position: relative;
}
.panel-xss > div.html {
	font-family: 'Fira Code', 'Courier New', Courier, monospace;
	font-size: 14px;
	line-height: 16px;
	padding: 12px 25px;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow-y: scroll;
	cursor: text;
}
.panel-xss > div.html pre {
	margin: 0;
}
</style>
