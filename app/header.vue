
<script>
"use strict"

var AppHeader = {
	name: 'app-header',
	template: '#app-header',
	data() {
		return {};
	},
	props: ['conn'],
};
</script>

<template id="app-header">
	<div class="app-header">
		<div class="logo">Aurascope</div>
		<div class="address">
			<input type="text" class="widget-input" v-model="conn.address" @keydown.enter="conn.connect()" :readonly="conn.connected" :disabled="conn.connected" />
			<button class="widget-button primary" v-if="!conn.connected" @click="conn.connect()"><icon-power></icon-power>&nbsp;Connect</button>
			<button class="widget-button" v-if="conn.connected" @click="conn.disconnect()"><icon-power></icon-power>&nbsp;Disconnect</button>
		</div>
	</div>
</template>

<style>
.app-header {
	color: rgb(196, 196, 196);
	background-color: hsl(var(--bg-950));
	padding: 8px 8px 8px 16px;
	display: flex;
	border-bottom: 1px solid hsl(var(--bg-900));
}

.app-header .logo {
	user-select: none;
	text-transform: uppercase;
	font-weight: 300;
	min-width: 200px;
	letter-spacing: 4px;
	display: flex;
	align-items: center;
}

@media (max-width: 950px) {
	.app-header .logo {
		display: none;
	}
}

.app-header > .address {
	display: flex;
	width: 100%;
}
.app-header > .address > * {
	margin-right: 6px;
}
.app-header > .address > input {
	width: 100%;
}
.app-header > .address > button {
	width: 120px;
}
</style>
