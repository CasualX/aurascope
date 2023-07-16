
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
	computed: {
		groupedTopics() {
			// Group this.topics by groupid
			let groups = {};
			for (let topic of this.topics) {
				if (topic.groupid in groups) {
					groups[topic.groupid].push(topic);
				}
				else {
					groups[topic.groupid] = [topic];
				}
			}
			return groups;
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
	},
	mounted() {
		this.selectTopic(this.topics.length > 0 ? this.topics[0] : null);
	},
};
</script>

<template id="app-sidebar">
	<div class="app-sidebar">
		<div class="topic-group" v-for="(topicGroup, groupName) in groupedTopics">
			<div class="topic-group-name">{{groupName}}</div>
			<div
				v-for="(topic, index) in topicGroup"
				@click="selectTopic(topic)"
				@wheel="selectTopic(topic)"
				class="topic"
				:class="{ selected: this.selectedTopic?.title == topic.title }"
			>
				<img class="topic-icon" v-if="topic.icon" :src="topic.icon.url" :style="topic.icon.style" />
				<span v-else></span>
				<span class="topic-title">{{ topic.title }}</span>
			</div>
		</div>
		<div class="sidebar-fill"></div>
	</div>
</template>

<style>
.app-sidebar {
	color: hsl(var(--bg-50));
	background-color: hsl(var(--bg-950));
	user-select: none;
	display: flex;
	flex-direction: column;
}

.app-sidebar .topic-group {
	display: flex;
	flex-direction: column;
}

.app-sidebar .topic-group:first-child .topic-group-name {
	padding-top: 8px;
}

.app-sidebar .topic-group-name {
	padding-left: 16px;
	padding-top: 16px;
	padding-bottom: 4px;
	font-size: 12px;
	letter-spacing: 1px;
	font-weight: medium;
	color: hsl(var(--bg-400));
	border-right: 1px solid hsl(var(--bg-800));
	text-transform: uppercase;
}

.app-sidebar .topic {
	display: flex;
	align-items: center;
	height: 36px;
	padding: 4px 8px 4px 16px;
	border-right: 1px solid hsl(var(--bg-800));
}

.app-sidebar .topic-title {
	color: hsl(var(--bg-300));
}

.app-sidebar .sidebar-fill {
	height: 100%;
	border-right: 1px solid hsl(var(--bg-800));
}

.app-sidebar > div.topic {
	cursor: pointer;
	transition: 0.1s;
}

.app-sidebar .topic > img,
.app-sidebar .topic > svg {
	width: 20px;
	height: 20px;
	margin-right: 6px;
}

.app-sidebar .topic.selected {
	background-color: hsl(var(--bg-900)) !important;
	border-right: 1px solid hsl(var(--bg-900)) !important;
	border-top: 1px solid hsl(var(--bg-800));
	border-bottom: 1px solid hsl(var(--bg-800));
}
.app-sidebar .topic:not(.selected) {
	cursor: pointer;
}

.app-sidebar .topic:hover {
	background-color: hsl(var(--bg-900));
	border-right: 1px solid hsl(var(--bg-900)) !important;
}
</style>
