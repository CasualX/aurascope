export default {
	data() {
		return {
			selectedTopic: null,
		};
	},
	// [...{ title: string, is: string, props: object, groupid: string, icon: { url: string, style: object }? } ]
	props: ["topics"],
	watch: {
		topics() {
			// Make sure to select a valid topic at all times
			if (this.selectedTopic == null || !this.topics.map((topic) => topic.title).includes(this.selectedTopic.title)) {
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
				} else {
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
			this.$emit("select-topic", topic);
		},
	},
	mounted() {
		this.selectTopic(this.topics.length > 0 ? this.topics[0] : null);
	},
	/*html*/
	template: `
		<nav class="app-sidebar">
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
		</nav>
	`,
};
