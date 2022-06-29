import { platformAdapater } from "./index";
import { request, response } from "../interface";
import { router } from "../router";
import { headers } from "../interface/headers";

import http from "http";

export class NodePlatformAdapter<T = any, K = any> implements platformAdapater {
	public router: router<T, K>;

	constructor(router: router<T, K>) {
		this.router = router;
	}

	async listen(port: number): Promise<void> {
		const server = http.createServer();
		server.on(
			"request",
			async (req: http.IncomingMessage, res: http.ServerResponse) => {
				const request = await this.handleRequest(req);
				const response = await this.router.respond(request);
				this.handleResponse(response, res);
			}
		);
		server.listen(port);
		return;
	}

	async handleRequest(
		nativeRequest: http.IncomingMessage
	): Promise<request<T>> {
		if (
			typeof nativeRequest.method != "string" ||
			typeof nativeRequest.url != "string" ||
			typeof nativeRequest.headers != "object"
		) {
			throw new Error("Invalid request");
		}

		let body: string = "";
		const ip: string = nativeRequest.socket.remoteAddress?.replace("::ffff:","") ?? "0.0.0.0";
		const requestHeaders = new headers(<any>nativeRequest.headers);

		if (!["GET", "HEAD", "DELETE", "OPTIONS"].includes(nativeRequest.method)) {
			nativeRequest.on("data", (data: string) => {
				body += data;
			});

			await new Promise((resolve) =>
				nativeRequest.on("end", () => {
					resolve(true);
				})
			);
		}

		return new request<T>(
			nativeRequest.method,
			new URL(
				nativeRequest.url,
				`http://${requestHeaders.get("host") ?? "localhost"}`
			),
			requestHeaders,
			body,
			{},
			ip
		);
	}

	handleResponse(response: response<K>, nativeResponse: http.ServerResponse) {
		nativeResponse.statusCode = response.status;
		response.headers.forEach((key, value) => {
			nativeResponse.setHeader(key, value);
		});
		nativeResponse.end(response.body);
	}
}
