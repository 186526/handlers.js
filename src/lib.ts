export const firstUpperCase = ([first, ...rest]: string) =>
	first?.toUpperCase() + rest.map((e) => e.toLowerCase()).join("");
export const platform = (() => {
	if (typeof process != "undefined") {
		return "Node.js";
	}
	if (typeof Deno != "undefined") {
		return "Deno";
	}
	if (typeof tjs != "undefined") {
		return "txiki.js";
	}
	if (typeof self != "undefined") {
		return "Service Worker";
	}
	return undefined;
})();
export const version = (() => {
	switch (platform) {
		case "Node.js":
			return process.version;
		case "Deno":
			return Deno.version.deno;
		case "txiki.js":
			return tjs.versions.tjs;
		case "Service Worker":
			return undefined;
		default:
			return undefined;
	}
})();
