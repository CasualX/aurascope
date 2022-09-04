
<script>
"use strict"

var AppSidebar = {
	name: 'app-sidebar',
	template: '#app-sidebar',

	data() {
		return {
			selectedTopic: null,
		};
	},
	props: ['topics'],
	watch: {
		topics() {
			if (!this.topics.includes(this.selectedTopic)) {
				this.selectedTopic = null;
			}
		}
	},
	methods: {
		selectTopic(topic) {
			this.selectedTopic = topic;
			this.$emit('select-topic', topic);
		},
	},
};
</script>

<template id="app-sidebar">
	<div class="app-sidebar">
		<div v-for="topic in topics" @click="selectTopic(topic)" @wheel="selectTopic(topic)" class="clicky" :class="{ 'selected': selectedTopic == topic }">
			{{ topic }}
		</div>
	</div>
</template>

<style>
.app-sidebar {
	color: rgb(204, 204, 204);
	background-color: rgb(37, 37, 37);

	user-select: none;

	display: flex;
	flex-direction: column;
}
.app-sidebar > div {
	height: 32px;
	line-height: 32px;
	padding: 4px 10px;
}
.app-sidebar > div:nth-child(1) {
	border-bottom: 1px solid rgb(71, 71, 71);
}
.app-sidebar > div.clicky {
	cursor: pointer;
}
.app-sidebar > div.clicky.selected {
	background-color: rgb(50, 50, 50) !important;
}
.app-sidebar > div.clicky:hover {
	background-color: rgb(44, 44, 44);
}
</style>
