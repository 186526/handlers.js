export const firstUpperCase = ([first, ...rest]: string) =>
	first?.toUpperCase() + rest.join("");
export const platform = (() => {
	if (typeof process != "undefined") {
		return "Node.js";
	}
	return "UNKNOWN";
})();
export const version = (() => {
	switch (platform) {
		case "Node.js":
			return process.version;
		default:
			return "UNKNOWN";
	}
})();
