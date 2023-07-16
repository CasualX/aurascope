
<style>
.widget-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	padding: 0 8px;
	height: 32px;
	cursor: pointer;
}

.widget-button:not(.primary) {
	background-color: hsl(var(--bg-900));
	border: 1px solid hsl(var(--bg-800));
	color: hsl(var(--bg-200));
}

.widget-button:not(.primary):disabled {
	background-color: hsl(var(--bg-900) / 0.5);
	border: 1px solid hsl(var(--bg-800) / 0.5);
	color: hsl(var(--bg-200) / 0.5);
}

.widget-button:not(.primary):disabled:hover {
	background-color: hsl(var(--bg-900) / 0.5);
	border: 1px solid hsl(var(--bg-800) / 0.5);
	color: hsl(var(--bg-200) / 0.5);
}

.widget-button:not(.primary):hover {
	background-color: hsl(var(--bg-800));
	border: 1px solid hsl(var(--bg-700));
	color: hsl(var(--bg-100));
}

.widget-button > .icon {
	width: 16px;
	height: 16px;
	margin-right: 6px;
	color: hsl(var(--bg-300));
}

.widget-button:not(.primary):hover > .icon {
	color: hsl(var(--bg-200));
}

.widget-button:not(.primary):active {
	background-color: hsl(var(--bg-700));
	border: 1px solid hsl(var(--bg-600));
	color: hsl(var(--bg-50));
}

.widget-button:not(.primary):active > .icon {
	color: hsl(var(--bg-100));
}

/* PRIMARY BUTTON */
.widget-button.primary {
	background-color: hsl(var(--pr-500) / 0.1);
	border: 1px solid hsl(var(--pr-500) / 0.3);
	color: hsl(var(--pr-300));
}

.widget-button.primary > .icon {
	color: hsl(var(--pr-300));
}

.widget-button.primary:hover {
	background-color: hsl(var(--pr-500) / 0.2);
	border: 1px solid hsl(var(--pr-400) / 0.6);
	color: hsl(var(--pr-200));
}

.widget-button.primary:hover > .icon {
	color: hsl(var(--pr-200));
}

.widget-button.primary:active {
	background-color: hsl(var(--pr-500) / 0.3);
	border: 1px solid hsl(var(--pr-400) / 0.8);
	color: hsl(var(--pr-100));
}

.widget-button.primary:active > .icon {
	color: hsl(var(--pr-100));
}

.widget-button.primary:disabled {
	opacity: 0.5;
}
</style>
