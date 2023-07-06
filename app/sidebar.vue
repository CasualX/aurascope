
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
	// [...{ title: string, is: string, props: object, groupid: string, icon: { url: string, style: object }? } ]
	props: ['topics'],
	watch: {
		topics() {
			// Make sure to select a valid topic at all times
			if (this.selectedTopic == null || !this.topics.map(topic => topic.title).includes(this.selectedTopic.title)) {
				this.selectTopic(this.topics.length > 0 ? this.topics[0] : null);
			}
		},
	},
	methods: {
		hasGroupSeparator(index) {
			if (index < 1 || index >= this.topics.length) {
				return false;
			}
			return this.topics[index].groupid !== this.topics[index - 1].groupid;
		},
		selectTopic(topic) {
			this.selectedTopic = topic;
			this.$emit('select-topic', topic);
		},
		getClickyClass(topic, index) {
			return {
				'selected': this.selectedTopic != null && this.selectedTopic.title == topic.title,
				'group-separator': this.hasGroupSeparator(index),
			};
		},
	},
	mounted() {
		this.selectTopic(this.topics.length > 0 ? this.topics[0] : null);
	},
};
</script>

<template id="app-sidebar">
	<div class="app-sidebar">
		<div v-for="(topic, index) in topics" @click="selectTopic(topic)" @wheel="selectTopic(topic)" class="clicky" :class="getClickyClass(topic, index)">
			<img v-if="topic.icon" :src="topic.icon.url" :style="topic.icon.style">
			<span v-else></span>
			<span>{{ topic.title }}</span>
		</div>
	</div>
</template>

<style>
.app-sidebar {
	color: rgb(224, 224, 224);
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
.app-sidebar > div.clicky.group-separator {
	border-top: 1px solid rgb(71, 71, 71);
}
.app-sidebar > div.clicky {
	cursor: pointer;
	display: grid;
	grid-template: auto / 25px auto;
	transition: .1s;
}
.app-sidebar > div.clicky > img {
	width: 20px;
	height: 20px;
	align-self: center;
}
.app-sidebar > div.clicky.selected {
	background-color: rgb(50, 50, 50) !important;
}
.app-sidebar > div.clicky:hover {
	background-color: rgb(44, 44, 44);
}
</style>
