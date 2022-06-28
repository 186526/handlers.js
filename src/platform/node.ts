import { PlatformAdapater } from ".";
import { request, response } from "../interface";
import router from "../router";
import http from "http";

export class NodePlatformAdapter<T = any, K = any> implements PlatformAdapater {
	constructor(Router: )
	listen(port: number): void {
		const server = http.createServer();
		server.on(
			"request",
			(req: http.IncomingMessage, res: http.ServerResponse) => {
				const request = this.handleRequest(req);

			}
		);
		server.listen(port);
	}

	handleRequest(request: http.IncomingMessage): request<T> {
		throw new Error("Method not implemented.");
	}

	handleResponse(response: response<K>, NativeResponse: http.ServerResponse) {
		throw new Error("Method not implemented.");
	}
}
