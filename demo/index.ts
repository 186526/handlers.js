import {
	rootRouter,
	method,
	handler,
	route,
	response,
} from "../index";
import errorHandler from "./errorHandler";

const App = new rootRouter<any, any>();

App.binding(
	"/(.*)",
	new handler("ANY", [
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
			new Promise(() => {
				console.log("Hello World!");
				throw new response("Hello World!");
			})
	)
).binding(
	"/(.*)",
	App.create(
		"ANY",
		(): Promise<string> =>
			new Promise((resolve) => {
				resolve("Hello World?")
			})
	)
);

App.route("/v1/(.*)")
	.add(
		new route(
			["/echo", "/echo/(.*)"],
			[
				new handler(method["GET"], [
					async (requestMessage, responseMessage) => {
						responseMessage = responseMessage ?? new response("");
						responseMessage?.headers.set("Hello", "World");
						responseMessage.body = requestMessage.url.pathname;
						return responseMessage;
					},
				]),
				new handler(method["POST"], [
					async (requestMessage, responseMessage) => {
						responseMessage = responseMessage ?? new response("");
						responseMessage.body = requestMessage.body;
						return responseMessage;
					},
				]),
			]
		)
	)
	.binding(
		"/error",
		App.create(method["ANY"], async () => {
			throw new Error("Nothing will happen here.");
		})
	)
	.useErrorResponder(errorHandler);

App.useMappingAdapter();
App.listen(8080);

export default App;