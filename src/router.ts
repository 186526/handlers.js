import handler from "./handler";
import {
	path,
	response,
	request,
	ChainInterrupted,
	AllMismatchInterrupted,
	responder,
	method,
} from "./interface/index";
import { defaultHeaders } from "./interface/response";
import route from "./route";
import { methodENUM } from "./interface/method";
import {
	createPlatformAdapater,
	platformAdapaterConstructor,
	platformAdapater,
} from "./platform/index";
import { platformAdapaterMapping } from "./platform/export";
import { platform } from "./lib";

export class router<K = any, V = any> {
	public routes: route[];

	public errorResponder: (
		errorCode: number,
		errorMessage?: string
	) => responder<K, V>;

	constructor(routes: route[] = []) {
		this.routes = routes;
	}

	add(route: route) {
		this.routes.push(route);
		return this;
	}

	binding(path: path, handler: handler<K, V>) {
		this.add(new route([path], [handler]));
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
				} else if (typeof answer == "string") {
					return new response(answer);
				} else if (typeof answer == "number") {
					return new response(answer.toString());
				} else if (typeof answer == "object") {
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
			this.binding(path, router.toHandler());
		});
	}

	route(path: path): router {
		const Router = new router([]);
		this.use([Router], path);
		return Router;
	}

	async _respond(
		request: request<K>,
		responseMessage: response<V> = new response<V>("")
	): Promise<response<V>> {
		request.originURL = request.url;
		request.url.pathname = request.params["0"]
			? "/" + request.params["0"]
			: request.originURL.pathname;

		let mismatchCount = 0;

		for (let route of this.routes) {
			const isMatched = await route.exec(request.url.pathname);

			if (!isMatched.matched) {
				mismatchCount++;
				continue;
			}

			isMatched.attributes.forEach((e) => {
				request.params[e.name] = e.value;
			});

			try {
				let thisResponse: response<V> | void = responseMessage;
				for (let handler of route.handlers) {
					if (
						handler.method != request.method &&
						handler.method != methodENUM.ANY
					) {
						continue;
					}
					thisResponse = await handler.respond(
						request,
						thisResponse ?? responseMessage
					);
				}
				if (thisResponse instanceof response) {
					responseMessage = thisResponse;
				} else {
					// means that the handler is a middleware that doesn't change the response
					throw AllMismatchInterrupted;
				}
			} catch (e) {
				if (e === ChainInterrupted) {
					return e.response;
				}
				if (e === AllMismatchInterrupted) mismatchCount++;
				else {
					if (typeof this.errorResponder == "function") {
						responseMessage =
							(await this.errorResponder(500, e.toString() + "\n")(request)) ??
							new response(e.toString(), 500);
						console.log(e);
					} else {
						throw e;
					}
				}
			}
		}

		if (mismatchCount == this.routes.length) {
			throw AllMismatchInterrupted;
		}

		return responseMessage;
	}

	public respond = this._respond;

	toHandler(): handler<K, V> {
		return new handler(methodENUM.ANY, [
			(request: request<K>, responseMessage?: response<V>) => {
				return this.respond(request, responseMessage ?? new response(""));
			},
		]);
	}

	useErrorResponder(
		errorResponder: (
			errorCode: number,
			errorMessage?: string
		) => responder<K, V>
	): this {
		this.errorResponder = errorResponder;
		return this;
	}
}

export default router;

export class rootRouter<K = any, V = any> extends router<K, V> {
	public adapater: platformAdapater<K, V>;
	errorResponder =
		(errorCode: number, errorMessage?: string) =>
		async (_request: request<K>): Promise<response<V>> =>
			new response(errorMessage ?? "", errorCode);

	respond = async (request: request<K>): Promise<response<V>> => {
		let responseMessage: response<V> = new response("");
		try {
			responseMessage = await this._respond(request, responseMessage);
		} catch (e) {
			if (e === ChainInterrupted) {
				return responseMessage;
			} else if (e === AllMismatchInterrupted) {
				responseMessage =
					(await this.errorResponder(404, "404 Not Found\n")(request)) ??
					new response("404 Not Found\n", 404);
			} else {
				responseMessage =
					(await this.errorResponder(500, e.toString() + "\n")(request)) ??
					new response(e.toString(), 500);
				console.log(e);
			}
		}

		return responseMessage;
	};
	useAdapater(adapater: platformAdapaterConstructor): this {
		this.adapater = createPlatformAdapater(adapater, this);
		return this;
	}
	useMappingAdapter(
		mapping: { [platform: string]: platformAdapaterConstructor } = platformAdapaterMapping
	): this {
		if(mapping[platform] == undefined) throw new Error("Platform not found in mapping");
		else this.useAdapater(mapping[platform]);
		return this;
	}
	listen(port: number): void {
		if (this.adapater == null) throw new Error("No platform adapter set");
		this.adapater.listen(port);
	}
}
