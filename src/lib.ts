export const firstUpperCase = ([first, ...rest]: string) =>
	first?.toUpperCase() + rest.map((e) => e.toLowerCase()).join("");
export const platform = (() => {
	if (typeof process != "undefined") {
		return "Node.js";
	}
	if (typeof self != "undefined") {
		return "Web Worker";
	}

	return "Unknown";
})();
export const version = (() => {
	switch (platform) {
		case "Node.js":
			return process.version;
		default:
			return "Unknown";
	}
})();
