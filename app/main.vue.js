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

export default {
	data() {
		let self = this;
		let console = {
			lines: [],
			get ready() {
				return self.conn.ready;
			},
			submit(text) {
				self.consoleInput(text);
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
				url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTIwIDE5VjdINHYxMmgxNm0wLTE2YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDE2bS03IDE0di0yaDV2MmgtNW0tMy40Mi00TDUuNTcgOUg4LjRsMy4zIDMuM2MuMzkuMzkuMzkgMS4wMyAwIDEuNDJMOC40MiAxN0g1LjU5bDMuOTktNFoiLz48L3N2Zz4=",
				style: {
					filter: "invert(1.0)",
					opacity: "0.7",
				},
			},
		};
		return {
			// Connection information
			conn: {
				address: "ws://localhost:30145/",
				error: null,
				paused: false,
				ready: false,
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
						} else {
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

				...this.settings.ui.tabs.map((tab) => ({
					title: tab.title,
					is: "panel-settings",
					groupid: "Settings",
					props: {
						cvars: this.settings.cvars,
						tab: tab,
					},
					icon: this.settings.ui.icons[tab.title],
				})),

				...Object.keys(this.pages)
					.sort()
					.map((page) => ({
						title: page,
						is: "panel-xss",
						groupid: "XSS",
						props: {
							page: this.pages[page],
							console: this.console,
						},
						icon: null,
					})),
			];
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

			let sock = new WebSocket("wss://ws.postman-echo.com/raw");
			this.socket = window.SOCKET = sock;
			this.conn.ready = true;
			this.clear();
			this.settings.ui = {
				icons: {
					Aimbot: {
						url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMTUgMTUiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNy41IDBhLjUuNSAwIDAgMSAuNS41djEuMzA3QTUuNjI0IDUuNjI0IDAgMCAxIDEzLjAwNyA3SDE0LjVhLjUuNSAwIDAgMSAwIDFoLTEuNTExQTUuNjI1IDUuNjI1IDAgMCAxIDggMTIuOTg5VjE0LjVhLjUuNSAwIDAgMS0xIDB2LTEuNDkzQTUuNjI0IDUuNjI0IDAgMCAxIDEuODA3IDhILjVhLjUuNSAwIDAgMSAwLTFoMS4yODlBNS42MjQgNS42MjQgMCAwIDEgNyAxLjc4OVYuNWEuNS41IDAgMCAxIC41LS41Wk04IDEyLjAzMlY5LjVhLjUuNSAwIDAgMC0xIDB2Mi41NTRBNC42NzUgNC42NzUgMCAwIDEgMi43NjMgOEg1LjVhLjUuNSAwIDAgMCAwLTFIMi43NDJBNC42NzQgNC42NzQgMCAwIDEgNyAyLjc0MlY1LjVhLjUuNSAwIDAgMCAxIDBWMi43NjNBNC42NzUgNC42NzUgMCAwIDEgMTIuMDU0IDdIOS41YS41LjUgMCAwIDAgMCAxaDIuNTMyQTQuNjc1IDQuNjc1IDAgMCAxIDggMTIuMDMyWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+",
						style: {
							filter: "invert(1.0)",
							opacity: "0.7",
						},
					},
					Visuals: {
						url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjAgMjAiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTS4yIDEwYTExIDExIDAgMCAxIDE5LjYgMEExMSAxMSAwIDAgMSAuMiAxMHptOS44IDRhNCA0IDAgMSAwIDAtOGE0IDQgMCAwIDAgMCA4em0wLTJhMiAyIDAgMSAxIDAtNGEyIDIgMCAwIDEgMCA0eiIvPjwvc3ZnPg==",
						style: {
							filter: "invert(1.0)",
							opacity: "0.7",
						},
					},
					Trainer: {
						url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEyIDIyYzMuODU5IDAgNy0zLjE0MSA3LTdzLTMuMTQxLTctNy03Yy0zLjg2IDAtNyAzLjE0MS03IDdzMy4xNCA3IDcgN3ptMC0xMmMyLjc1NyAwIDUgMi4yNDMgNSA1cy0yLjI0MyA1LTUgNXMtNS0yLjI0My01LTVzMi4yNDMtNSA1LTV6bS0xLThIN3Y1LjUxOGE4Ljk1NyA4Ljk1NyAwIDAgMSA0LTEuNDU5VjJ6bTYgMGgtNHY0LjA1OWE4Ljk1NyA4Ljk1NyAwIDAgMSA0IDEuNDU5VjJ6Ii8+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJtMTAuMDE5IDE1LjgxMWwtLjQ2OCAyLjcyNkwxMiAxNy4yNWwyLjQ0OSAxLjI4N2wtLjQ2OC0yLjcyNmwxLjk4Mi0xLjkzMmwtMi43MzgtLjM5OEwxMiAxMWwtMS4yMjUgMi40ODFsLTIuNzM4LjM5OHoiLz48L3N2Zz4=",
						style: {
							filter: "invert(1.0)",
							opacity: "0.7",
						},
					},
					Miscellaneous: {
						url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTkuOTU0IDIuMjFhOS45OSA5Ljk5IDAgMCAxIDQuMDktLjAwMkEzLjk5MyAzLjk5MyAwIDAgMCAxNiA1LjA3YTMuOTkyIDMuOTkyIDAgMCAwIDMuNDU3LjI2MUE5Ljk4OCA5Ljk4OCAwIDAgMSAyMS41IDguODc3YTMuOTkyIDMuOTkyIDAgMCAwLTEuNSAzLjEyMmMwIDEuMjY0LjU4NiAyLjM5MSAxLjUwMSAzLjEyNGExMC4wNDIgMTAuMDQyIDAgMCAxLTIuMDQ1IDMuNTQzYTMuOTkyIDMuOTkyIDAgMCAwLTMuNDU2LjI2MWEzLjk5MyAzLjk5MyAwIDAgMC0xLjk1NSAyLjg2YTkuOTkgOS45OSAwIDAgMS00LjA5LjAwNEEzLjk5MyAzLjk5MyAwIDAgMCA4IDE4LjkyN2EzLjk5MiAzLjk5MiAwIDAgMC0zLjQ1Ny0uMjZBOS45OSA5Ljk5IDAgMCAxIDIuNSAxNS4xMjFBMy45OTIgMy45OTIgMCAwIDAgNCAxMS45OTljMC0xLjI2NC0uNTg3LTIuMzktMS41MDItMy4xMjRhMTAuMDQzIDEwLjA0MyAwIDAgMSAyLjA0NS0zLjU0MkEzLjk5MyAzLjk5MyAwIDAgMCA4IDUuMDdhMy45OTMgMy45OTMgMCAwIDAgMS45NTQtMi44NlpNMTIgMTVhMyAzIDAgMSAwIDAtNmEzIDMgMCAwIDAgMCA2WiIvPjwvc3ZnPg==",
						style: {
							filter: "invert(1.0)",
							opacity: "0.7",
						},
					},
				},
				tabs: [
					{
						title: "Aimbot",
						groups: [
							{
								header: "Aimbot",
								items: [{ element: "Toggle", label: "Enable", cvar: "aim.enable" }],
							},
							{
								header: "Field of view",
								items: [
									{ element: "Number", label: "Radius", cvar: "aim.fov_radius", min: 0.0, max: 200.0, step: 0.1, unit: "u" },
									{ element: "Number", label: "Angle", cvar: "aim.fov_aim", min: 0.0, max: 180.0, step: 0.1, unit: "°" },
									{ element: "Number", label: "Minimum", cvar: "aim.fov_min", min: 0.0, max: 5.0, step: 0.1, unit: "°" },
								],
							},
							{
								header: "Target tracking",
								items: [
									{ element: "Number", label: "Ramp up time", cvar: "aim.aim_ramp", min: 0.0, max: 2.0, step: 0.01, unit: "sec" },
									{ element: "Number", label: "Idle time", cvar: "aim.aim_idletime", min: 0.0, max: 2.0, step: 0.01, unit: "sec" },
									{ element: "Number", label: "Minimum time", cvar: "aim.aim_mintime", min: 0.0, max: 2.0, step: 0.01, unit: "sec" },
									{ element: "Number", label: "Cooldown power", cvar: "aim.aim_cooldown_pow", min: 1.0, max: 10.0, step: 0.1 },
									{ element: "Number", label: "Reaction time", cvar: "aim.aim_react", min: 0.0, max: 1.0, step: 0.01, unit: "sec" },
									{ element: "Number", label: "Reaction distance", cvar: "aim.aim_react_dist", min: 0.0, max: 100.0, step: 0.1, unit: "u" },
									{ element: "Number", label: "Reaction power", cvar: "aim.aim_react_pow", min: 1.0, max: 10.0, step: 0.1 },
								],
							},
							{
								header: "Smoothing",
								items: [
									{ element: "Number", label: "Pitch strength", cvar: "aim.aim_pitch", min: 0.0, max: 1.5, step: 0.01 },
									{ element: "Number", label: "Yaw strength", cvar: "aim.aim_yaw", min: 0.0, max: 1.5, step: 0.01 },
									{ element: "Number", label: "Linear strength", cvar: "aim.pid.kp", min: 0.0, max: 5.0, step: 0.01 },
									{ element: "Number", label: "Integral strength", cvar: "aim.pid.ki", min: 0.0, max: 50.0, step: 0.1 },
									{ element: "Number", label: "Integral dampening", cvar: "aim.pid.damp", min: 0.0, max: 1.0, step: 0.01 },
								],
							},
							{
								header: "Miscellaneous",
								items: [
									{ element: "Toggle", label: "Debug", cvar: "aim.debug" },
									{ element: "Number", label: "Rate", cvar: "aim.rate", min: 30, max: 300, step: 1 },
									{ element: "Number", label: "Teleport distance", cvar: "aim.teledist", min: 0.0, max: 100.0, step: 0.1, unit: "u" },
								],
							},
						],
					},
					{
						title: "Visuals",
						groups: [
							{
								header: "Wallhack",
								items: [
									{ element: "Toggle", label: "Enable", cvar: "wh.enable" },
									{ element: "Toggle", label: "All entities", cvar: "wh.all" },
									{ element: "Toggle", label: "Players", cvar: "wh.players" },
									{ element: "Toggle", label: "Weapons", cvar: "wh.weapons" },
									{ element: "Toggle", label: "Powerups", cvar: "wh.powerups" },
								],
							},
						],
					},
					{
						title: "Trainer",
						groups: [
							{
								header: "Trainer",
								items: [
									{ element: "Status", label: "Ready", cvar: "trainer.ready" },
									{ element: "Toggle", label: "Enable", cvar: "trainer.enable" },
									{ element: "Toggle", label: "Infinite ammo", cvar: "trainer.infammo" },
									{ element: "Toggle", label: "God mode", cvar: "trainer.godmode" },
									{ element: "Toggle", label: "Give weapons", cvar: "trainer.givewp" },
									{ element: "Toggle", label: "Fast fire", cvar: "trainer.fastfire" },
								],
							},
							{
								header: "Powerups",
								items: [
									{ element: "Toggle", label: "Quad damage", cvar: "trainer.powerup.quad" },
									{ element: "Toggle", label: "Battle suit", cvar: "trainer.powerup.suit" },
									{ element: "Toggle", label: "Haste", cvar: "trainer.powerup.haste" },
									{ element: "Toggle", label: "Invisibility", cvar: "trainer.powerup.invis" },
									{ element: "Toggle", label: "Regeneration", cvar: "trainer.powerup.regen" },
									{ element: "Toggle", label: "Flight", cvar: "trainer.powerup.flight" },
								],
							},
						],
					},
					{
						title: "Miscellaneous",
						groups: [
							{
								header: "Debugger",
								items: [{ element: "Toggle", label: "Enable", cvar: "debug.enable" }],
							},
						],
					},
				],
			};
		},
		// connect() {
		// 	this.conn.error = null;
		// 	this.conn.paused = false;
		// 	this.conn.ready = false;

		// 	if (this.socket) {
		// 		this.disconnect(null);
		// 	}

		// 	// Move the window location to reflect the connection address
		// 	window.location.hash = "address=" + encodeURIComponent(this.conn.address);

		// 	let sock = new WebSocket(this.conn.address);
		// 	this.socket = window.SOCKET = sock;
		// 	sock.onopen = (e) => {
		// 		this.conn.ready = true;
		// 		this.clear();
		// 	};
		// 	sock.onmessage = (e) => {
		// 		try {
		// 			if (e.data.startsWith("{")) {
		// 				let data = JSON.parse(e.data);
		// 				switch (data.target) {
		// 					case "console/log":
		// 						this.consoleLog("" + data.message);
		// 						break;
		// 					case "debug/write":
		// 						this.writePage(data.message.scope, data.message.content);
		// 						break;
		// 					case "settings/cvars":
		// 						for (let line of data.message.split("\n")) {
		// 							let [key, value] = line.split("=", 2);
		// 							this.settings.cvars[key] = value;
		// 						}
		// 						break;
		// 					case "settings/ui":
		// 						this.settings.ui = JSON.parse(data.message);
		// 						break;
		// 					default:
		// 						console.log(data.target, data.message);
		// 						break;
		// 				}
		// 			} else {
		// 				let [line, text] = a.data.split("\n", 2);
		// 				this.writePage(line, text);
		// 			}
		// 		} catch (ex) {
		// 			console.error(ex);
		// 		}
		// 	};
		// 	sock.onclose = (e) => {
		// 		this.disconnect(null);
		// 	};
		// 	sock.onerror = (ex) => {
		// 		this.conn.error = "Can't establish a connection to the server.";
		// 		console.error(ex);
		// 		this.disconnect(ex);
		// 	};
		// },
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
			} else {
				this.console.lines.push("Please connect to the host first.");
			}
		},
		consoleClear() {
			this.console.lines = [];
		},
		consoleLog(line) {
			this.console.lines.push(line);
			if (this.console.lines.length > MAX_CONSOLE_LINES + 100) {
				this.console.lines = this.console.lines.slice(this.console.lines.length - MAX_CONSOLE_LINES);
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
		if ("address" in args) {
			this.conn.address = args.address;
			this.connect();
		}
	},
	/*html*/
	template: `
	<div class="app-main">
		<header>
			<div class="logo">Aurascope</div>
			<div class="address">
				<input type="text" class="address-input widget-input" v-model="conn.address" @keydown.enter="connect()" :readonly="socket != null" :disabled="socket != null" />
				<widget-button primary v-if="socket == null" @click="connect()" icon="icon-power" label="Connect"></widget-button>
				<widget-button v-if="socket != null" @click="disconnect()" icon="icon-power" label="Disconnect"></widget-button>
			</div>
			<div class="actions">
				<widget-button v-if="conn.paused" @click="conn.paused = false" icon="icon-play" label="Play"></widget-button>
				<widget-button v-if="!conn.paused" @click="conn.paused = true" icon="icon-pause" label="Pause"></widget-button>
				<widget-button @click="clear()" icon="icon-clear" label="Clear"></widget-button>
			</div>
		</header>
		<main>
			<app-sidebar :topics="sidebarTopics" @select-topic="changeCurrentTopic"></app-sidebar>
			<keep-alive>
				<component v-if="currentTopic != null" :is="currentTopic.is" :key="currentTopic.title" v-bind="currentTopic.props"></component>
				<panel-console v-else :console="console"></panel-console>
			</keep-alive>
		</main>
	</div>
	`,
};
