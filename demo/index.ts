import * as handlerJS from "..";
import errorHandler from "./errorHandler";

interface requestType {
	hood: boolean;
	id: number;
}

const App = new handlerJS.rootRouter<requestType, any>();

App.binding(
	"/(.*)",
	new handlerJS.handler("ANY", [
		async (request, response) => {
			console.log(request);
			return undefined;
		},
	])
);

App.binding(
	"/",
	App.create(
		"ANY",
		(): Promise<string> =>
			new Promise((resolve) => {
				console.log("Hello World!");
				resolve("Hello World!");
				throw handlerJS.ChainInterrupted;
			})
	)
);

App.route("/v1/(.*)")
	.add(
		new handlerJS.route(
			["/echo", "/echo/(.*)"],
			[
				new handlerJS.handler(handlerJS.method["GET"], [
					async (request, response) => {
						response = response ?? new handlerJS.response("");
						response?.headers.set("Hello", "World");
						response.body = request.url.pathname;
						return response;
					},
				]),
				new handlerJS.handler(handlerJS.method["POST"], [
					async (request, response) => {
						response = response ?? new handlerJS.response("");
						response.body = request.body;
						return response;
					},
				]),
			]
		)
	)
	.binding(
		"/error",
		App.create(handlerJS.method["ANY"], async () => {
			throw new Error("Nothing will happen here.");
		})
	)
	.useErrorResponder(errorHandler);

App.useAdapater(handlerJS.platformAdapater.NodePlatformAdapter);
App.adapater.listen(8080);
