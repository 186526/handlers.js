import { platformAdapater } from "./index";
import { request } from "../interface/request";
import { response } from "../interface/response";
import { router } from "../router";
import { headers } from "../interface/headers";

export class SWPlatformAdapter<T = any, K = any> implements platformAdapater {
	public router: router<T, K>;

	constructor(router: router<T, K>) {
		this.router = router;
	}

	async listen(_port?: number): Promise<void> {
		self.addEventListener("fetch", (event: FetchEvent) => {
			event.respondWith(this.handler(event));
		});
	}

	async handleRequest(nativeRequest: Request): Promise<request<T>> {
		const requestHeaders = new headers(
			Object.fromEntries(nativeRequest.headers.entries())
		);
		const requestMessage: request<T> = new request(
			nativeRequest.method,
			new URL(nativeRequest.url),
			requestHeaders,
			await nativeRequest.text(),
			{},
			requestHeaders.get("CF-Connecting-IP") || ""
		);
		return requestMessage;
	}

	async handleResponse(response: response<K>): Promise<Response> {
		const nativResponse = new Response(response.body, {
			status: response.status,
			headers: response.headers.headers,
		});
		return nativResponse;
	}

	async handler(event: FetchEvent): Promise<Response> {
		return await this.handleResponse(
			await this.handleRequest(event.request).then((request) =>
				this.router.respond(request)
			)
		)
	}
}
