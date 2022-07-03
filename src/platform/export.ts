import { NodePlatformAdapter } from "./node";
import { SWPlatformAdapter } from "./serviceworker";
import { DenoPlatformAdapter } from "./deno";
import { TxikiPlatformAdapter } from "./txiki";

export const platformAdapaterMapping = {
	"Node.js": NodePlatformAdapter,
	"Service Worker": SWPlatformAdapter,
	"Deno": DenoPlatformAdapter,
	"txiki.js": TxikiPlatformAdapter,
};

export { NodePlatformAdapter, SWPlatformAdapter, DenoPlatformAdapter, TxikiPlatformAdapter };
