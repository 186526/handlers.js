import { NodePlatformAdapter } from "./node";
import { SWPlatformAdapter } from "./serviceworker";
import { DenoPlatformAdapter } from "./deno";

export const platformAdapaterMapping = {
	"Node.js": NodePlatformAdapter,
	"Service Worker": SWPlatformAdapter,
	"Deno": DenoPlatformAdapter,
};

export { NodePlatformAdapter, SWPlatformAdapter, DenoPlatformAdapter };
