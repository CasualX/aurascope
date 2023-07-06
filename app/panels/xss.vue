
<script>
"use strict"

var PanelXss = {
	name: 'panel-xss',
	template: '#panel-xss',

	data() {
		return {}
	},
	props: ['page', 'console'],
	computed: {
		html() {
			return this.page.html;
		},
	},
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
		consoleInput(text) {
			this.console.submit(text);
		},
		consoleClear() {
			this.console.lines = [];
		},
	},
};
</script>

<template id="panel-xss">
	<div class="panel-xss" @copy="copyEvent">
		<div v-html="html" class="html"></div>
		<!-- <widget-copy :text="html"></widget-copy> -->
		<app-coninput @submit="consoleInput" @clear="consoleClear" :disabled="!console.ready"></app-coninput>
	</div>
</template>

<style>
.panel-xss {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	position: relative;
	display: grid;
	grid-template: calc(100% - 42px) 42px / auto;
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
