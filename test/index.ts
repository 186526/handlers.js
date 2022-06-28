import * as handlerJS from "../";

interface requestType {
	hood: boolean;
	id: number;
}

const App = new handlerJS.rootRouter<requestType, any>();

App.binding(
	"/",
	App.create(handlerJS.method["ANY"], async (request) => {
		Promise.resolve("Hello World!");
		throw handlerJS.ChainInterrupted;
	})
);

App.binding(
	"/*",
	App.create(handlerJS.method["ANY"], async (request) => "Fuck World!")
);

App.route("/v1")
	.add(
		new handlerJS.route(
			["/echo", "/echo/*"],
			new handlerJS.handler(handlerJS.method["GET"], [
				async (request, response) => {
					response = response ?? new handlerJS.response("");
					response?.headers.set("Hello", "World");
					response.body = "echo";
					return response;
				},
			])
		)
	)
	.binding(
		"/:a/echo",
		App.create(
			handlerJS.method["GET"],
			async (request) => `echo with ${request.params.a}`
		)
	);
