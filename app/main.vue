
<script>
"use strict"

let SOCKET = null;

function argv() {
	let result = {};
	for (var arg of window.location.hash.substring(1).split("&")) {
		let pos = arg.indexOf("=");
		if (pos >= 0) {
			result[arg.substring(0, pos)] = decodeURIComponent(arg.substring(pos + 1));
		}
	}
	return result;
}

var MAX_CONSOLE_LINES = 10000;

const convertArrayToObject = (array, key) => {
	const initialValue = {};
	return array.reduce((obj, item) => {
		return {
			...obj,
			[item[key]]: item,
		};
	}, initialValue);
};

var AppMain = {
	name: 'app-main',
	data() {
		let self = this;
		let console = {
			lines: [],
			input: "",
			history: [],
			historyIndex: 0,
			get ready() {
				return self.conn.ready;
			},
			get paused() {
				return self.conn.paused;
			},
			set paused(value) {
				self.conn.paused = value;
			},
			submit(text) {
				self.consoleInput(text);
			},
			clear() {
				self.clear();
			},
		};
		let consoleTopic = {
			title: "Console",
			is: "panel-console",
			groupid: "Console",
			props: {
				console: console,
			},
			icon: {
				url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nO3VPQqEMBCG4fcSLnok2VsnhaBWa2Gv3mNsYiNkCncSRPPBNJPiIUN+oORt+QIbIMa1Aq0GrwnQoxYNlsQVzXth60iBbz1qB4zAJzfch970By5X4Ar4hf4MNLlgwk6nsDbwdLg6jbrOBQ+Rw+WVp9FbwF3kOmmws4AtIgW+zX/sE6JOg0uelx3XxAOblnvqngAAAABJRU5ErkJggg==",
				style: {
					filter: "invert(1.0)",
					opacity: "0.8",
				}
			}
		};
		return {
			// Connection information
			conn: {
				address: "ws://localhost:30145/",
				error: null,
				paused: false,
				ready: false,
				get connected() {
					return self.socket != null;
				},
				connect() {
					if (!self.conn.connected) {
						self.connect();
					}
				},
				disconnect() {
					if (self.conn.connected) {
						self.disconnect();
					}
				},
			},
			// WebSocket instance, null if disconnected
			socket: null,
			// Current topic being shown
			currentTopic: consoleTopic,
			// Page content
			pages: {},
			// Console
			console: console,
			consoleTopic: consoleTopic,
			// Settings UI
			settings: {
				cvars: {
					sendPropValue(cvar, value = undefined) {
						if (value === undefined) {
							value = self.settings.cvars[cvar];
						}
						else {
							self.settings.cvars[cvar] = value;
						}
						self.sendCmd("@" + cvar + " " + value);
					},
					fetchSettings() {
						self.sendCmd("@settings!");
					},
				},
				ui: {
					icons: {},
					tabs: [],
				},
			},
		};
	},
	computed: {
		sidebarTopics() {
			return [
				this.consoleTopic,

				...this.settings.ui.tabs.map(tab => ({
					title: tab.title,
					is: "panel-settings",
					groupid: "Settings",
					props: {
						cvars: this.settings.cvars,
						tab: tab,
					},
					icon: this.settings.ui.icons[tab.title],
				})),

				...Object.keys(this.pages).sort().map(page => ({
					title: page,
					is: "panel-xss",
					groupid: "Debugger",
					props: {
						page: this.pages[page],
						console: this.console,
					},
					icon: null,
				})),
			];
		}
	},
	methods: {
		connect() {
			this.conn.error = null;
			this.conn.paused = false;
			this.conn.ready = false;

			if (this.socket) {
				this.disconnect(null);
			}

			// Move the window location to reflect the connection address
			window.location.hash = "address=" + encodeURIComponent(this.conn.address);

			let sock = new WebSocket(this.conn.address);
			this.socket = window.SOCKET = sock;
			sock.onopen = e => {
				this.conn.ready = true;
				this.clear();
			};
			sock.onmessage = e => {
				try {
					if (e.data.startsWith("{")) {
						let data = JSON.parse(e.data);
						switch (data.target) {
							case 'console/log':
								this.consoleLog("" + data.message);
								break;
							case 'debug/write':
								this.writePage(data.message.scope, data.message.content);
								break;
							case 'settings/cvars':
								for (let line of data.message.split("\n")) {
									let [key, value] = line.split("=", 2);
									this.settings.cvars[key] = value;
								}
								break;
							case 'settings/ui':
								this.settings.ui = JSON.parse(data.message);
								break;
							default:
								console.log(data.target, data.message);
								break;
						}
					}
					else {
						let [line, text] = a.data.split("\n", 2);
						this.writePage(line, text);
					}
				}
				catch (ex) {
					console.error(ex);
				}
			};
			sock.onclose = e => {
				this.disconnect(null);
			}
			sock.onerror = ex => {
				this.conn.error = "Can't establish a connection to the server.";
				console.error(ex);
				this.disconnect(ex);
			};
		},
		disconnect() {
			if (this.socket) {
				this.socket.close();
				this.socket = window.SOCKET = null;
			}
			this.conn.ready = false;
			this.settings.ui.tabs = [];
		},
		writePage(scope, content) {
			if (!this.conn.paused) {
				if (!this.pages[scope]) {
					this.pages[scope] = {};
				}
				this.pages[scope].html = "" + content;
			}
		},
		// Clears the pages and console
		clear() {
			this.pages = {};
			this.console.lines = [];
		},
		changeCurrentTopic(topic) {
			this.currentTopic = topic;
		},
		consoleInput(text) {
			if (this.socket) {
				this.console.lines.push("> " + text);
				this.socket.send(text);
			}
			else {
				this.console.lines.push("Please connect to the host first.");
			}
		},
		consoleClear() {
			this.console.lines = [];
		},
		consoleLog(line) {
			this.console.lines.push(line);
			if (this.console.lines.length > (MAX_CONSOLE_LINES + 100)) {
				this.console.lines = this.console.lines.slice(this.console.lines.length - MAX_CONSOLE_LINES)
			}
		},
		sendCmd(cmd) {
			if (this.socket) {
				this.socket.send(cmd);
			}
		},
	},
	mounted() {
		let args = argv();
		if ('address' in args) {
			this.conn.address = args.address;
			this.connect();
		}
	},
	template: '#app-main',
};
</script>

<template id="app-main">
	<div class="app-main">
		<app-header :conn="conn"></app-header>
		<div class="m">
			<app-sidebar :topics="sidebarTopics" @select-topic="changeCurrentTopic"></app-sidebar>
			<keep-alive>
				<component v-if="currentTopic != null" :is="currentTopic.is" :key="currentTopic.title" v-bind="currentTopic.props"></component>
				<panel-console v-else :console="console"></panel-console>
			</keep-alive>
		</div>
	</div>
</template>

<style>
html, body, #app, .app-main, .app-main {
	font-family: 'Roboto', 'Segoe UI', 'Verdana', sans-serif;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
.app-main {
	display: grid;
	grid-template: 48px calc(100% - 48px) / auto;
}

.app-main > .h {
	color: rgb(196, 196, 196);
	background-color: rgb(60, 60, 60);

	padding: 2px 0;

	display: grid;
	grid-template: auto / 200px auto 160px;
}
.app-main > .h > .logo {
	line-height: 38px;
	user-select: none;
	text-transform: uppercase;
	font-weight: lighter;
	padding-left: 10px;
	letter-spacing: 5px;
}
.app-main > .h button {
	margin: 4px 2px;
	padding: 0 10px;
}
.app-main > .h input {
	width: 400px;
	margin: 4px 2px;
}
.app-main > .h > div {
	display: flex;
}

.app-main > .m {
	color: hsl(var(--bg-100));
	background-color: hsl(var(--bg-900));

	display: grid;
	grid-template: 100% / 200px auto;
}
</style>
