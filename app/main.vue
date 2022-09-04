
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

var AppMain = {
	name: 'app-main',
	data() {
		return {
			// Connection information
			conn: {
				address: "ws://localhost:28912/",
				error: null,
				paused: false,
				ready: false,
			},
			// WebSocket instance, null if disconnected
			socket: null,
			// Current page being shown
			currentPage: "Console",
			// Page content
			pages: {},
			// Console
			consoleLines: [],
		};
	},
	computed: {
		pageTitles() {
			let keys = Object.keys(this.pages).sort();
			return ["Console", ...keys];
		},
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
							default:
								console.log(data.target, data.message);
								break;
						}
					}
					else {
						let [line, text] = a.data.split("\n", 2);
						if (!this.conn.paused) {
							this.pages[line] = "" + text;
						}
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
		},
		writePage(scope, content) {
			if (!this.conn.paused) {
				this.pages[scope] = "" + content;
			}
			window.PAGES = this.pages;
		},
		// Clears the pages and console
		clear() {
			this.pages = {};
			this.consoleLines = [];
		},
		changeCurrentPage(page) {
			this.currentPage = page;
		},
		consoleInput(text) {
			if (this.socket) {
				this.consoleLines.push("> " + text);
				this.socket.send(text);
			}
			else {
				this.consoleLines.push("Please connect to the host first.");
			}
		},
		consoleClear() {
			this.consoleLines = [];
		},
		consoleLog(line) {
			this.consoleLines.push(line);
			if (this.consoleLines.length > (MAX_CONSOLE_LINES + 100)) {
				this.consoleLines = this.consoleLines.slice(this.consoleLines.length - MAX_CONSOLE_LINES)
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
		}
	},
	template: '#app-main',
};
</script>

<template id="app-main">
	<div class="app-main">
		<div class="h">
			<div class="logo">Aurascope</div>
			<div>
				<input type="text" v-model="conn.address" @keydown.enter="connect()" :readonly="socket != null" :disabled="socket != null">
				<widget-button v-if="socket == null" @click="connect()" icon="icon-power" label="Connect"></widget-button>
				<widget-button v-if="socket != null" @click="disconnect()" icon="icon-power" label="Disconnect"></widget-button>
			</div>
			<div>
				<widget-button v-if="conn.paused" @click="conn.paused = false;" icon="icon-play" label="Play"></widget-button>
				<widget-button v-if="!conn.paused" @click="conn.paused = true;" icon="icon-pause" label="Pause"></widget-button>
				<widget-button @click="clear()" icon="icon-clear" label="Clear"></widget-button>
			</div>
		</div>
		<div class="m">
			<app-sidebar :topics="pageTitles" @select-topic="changeCurrentPage"></app-sidebar>
			<div class="m2">
				<panel-xss v-if="currentPage in pages" :html="pages[currentPage]"></panel-xss>
				<panel-console v-else :lines="consoleLines"></panel-console>
				<app-coninput @submit="consoleInput" @clear="consoleClear" :disabled="!conn.ready"></app-coninput>
			</div>
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
	grid-template: 42px calc(100% - 42px) / auto;
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
	color: rgb(204, 204, 204);
	background-color: rgb(30, 30, 30);

	display: grid;
	grid-template: 100% / 200px auto;
}
.app-main > .m > .m2 {
	display: grid;
	grid-template: calc(100% - 42px) 42px / auto;
}
</style>
