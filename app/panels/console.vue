
<script>
"use strict"

var PanelConsole = {
	name: 'panel-console',
	template: '#panel-console',

	data() {
		return {
			scrollOncePerTick: true,
		};
	},
	props: ['console'],
	computed: {
		linesCopy() {
			return this.console.lines.slice();
		},
		copyText() {
			return this.console.lines.join("\n");
		},
	},
	watch: {
		linesCopy() {
			this.scrollToEnd(false);
		},
	},
	methods: {
		scrollToEnd(force) {
			if (this.scrollOncePerTick) {
				let el = this.$refs.consoleRef;
				// From StackOverflow: Scroll to the bottom only if we're already at the bottom
				if (force || el.scrollHeight - el.scrollTop - el.clientHeight < 1) {
					this.scrollOncePerTick = false;
					Vue.nextTick(() => {
						el.scrollTop = el.scrollHeight;
						this.scrollOncePerTick = true;
					});
				}
			}
		},
		copyEvent(e) {
			if (document.getSelection().toString() == "") {
				e.clipboardData.setData("text/plain", this.copyText);
				e.preventDefault();
			}
		},
	},
	mounted() {
		this.scrollToEnd(true);
	},
};
</script>

<template id="panel-console">
	<div class="panel-console">
		<div class="content" ref="consoleRef" @copy="copyEvent">
			<pre class="lines">
				<div v-for="line in linesCopy" :key="line" class="line">{{ line }}</div>
			</pre>
		</div>
		<app-coninput :console="console"></app-coninput>
	</div>
</template>

<style>
.panel-console {
	display: grid;
	grid-template: calc(100% - 42px) 42px / auto;
}
.panel-console > .content {
	width: 100%;
	height: 100%;
	padding: 12px 25px;
	box-sizing: border-box;
	overflow-y: scroll;
}
.panel-console > .content > .lines {
	font-family: 'Fira Code', 'Courier New', Courier, monospace;
	font-size: 14px;
	line-height: 20px;
	margin: 0;
	display: flex;
	flex-direction: column;
	cursor: text;
}
</style>
