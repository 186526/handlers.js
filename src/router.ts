import handler from "./handler";
import {
	path,
	method,
	response,
	request,
	ChainInterrupted,
} from "./interface/index";
import { defaultHeaders } from "./interface/response";
import route from "./route";

export class router<K = any, V = any> {
	public routes: route[];

	constructor(routes: route[] = []) {
		this.routes = routes;
	}

	add(route: route) {
		this.routes.push(route);
		return this;
	}

	binding(path: path, handler: handler<K, V>) {
		this.add(new route([path], handler));
		return this;
	}

	create(
		method: method,
		responder: (
			request: request<K>
		) =>
			| Promise<response<V>>
			| Promise<string>
			| Promise<object>
			| Promise<number>
			| Promise<void>
	) {
		return new handler<K, V>(method, [
			async (request: request<K>) => {
				const answer = await responder(request);
				if (answer instanceof response) {
					return answer;
				} else if (answer instanceof String) {
					return new response(answer);
				} else if (answer instanceof Number) {
					return new response(answer.toString());
				} else if (answer instanceof Object) {
					return new response(
						JSON.stringify(answer),
						200,
						new defaultHeaders({
							"Content-Type": "application/json; charset=utf-8",
						})
					);
				} else {
					return new response("", 204);
				}
			},
		]);
	}

	use(routers: router[], path: path): void {
		routers.forEach((router) => {
			this.binding(path, router.toHandler(path));
		});
	}

	route(path: path): router {
		const Router = new router([]);
		this.use([Router], path);
		return Router;
	}

	async respond(request: request<K>, basePath: path): Promise<response<V>> {
		request.originURL = request.url;
		request.url.pathname = request.url.pathname.replace(basePath, "");

		let responseMessage: response<V> = new response("");

		for (let route of this.routes) {
			if (
				route.handler.method != request.method ||
				route.handler.method != method.ANY
			) {
				continue;
			}

			const isMatched = await route.exec(request.url.pathname);

			if (!isMatched.matched) {
				continue;
			}

			isMatched.attributes.forEach((e) => {
				request.params[e.name] = e.value;
			});

			let thisResponse = await route.handler.respond(request, responseMessage);
			if (thisResponse instanceof response) {
				responseMessage = thisResponse;
			}
		}

		return responseMessage;
	}

	toHandler(basePath: path): handler<K, V> {
		return this.create(method.ANY, (request: request<K>) => {
			return this.respond(request, basePath);
		});
	}
}

export default router;

export class rootRouter<K = any, V = any> extends router<K, V> {
	private readonly originRespond = this.respond;
	async respond(request: request<K>, basePath: path): Promise<response<V>> {
		try {
			return this.originRespond(request, basePath);
		} catch (e) {
			if (e === ChainInterrupted) {
				return e.response;
			} else {
				throw e;
			}
		}
	}
}
