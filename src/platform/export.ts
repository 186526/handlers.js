import { NodePlatformAdapter } from "./node";
import { SWPlatformAdapter } from "./serviceworker";

export const platformAdapaterMapping = {
	"Node.js": NodePlatformAdapter,
	"Web Worker": SWPlatformAdapter,
};

export { NodePlatformAdapter, SWPlatformAdapter };
