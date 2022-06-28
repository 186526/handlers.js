import { method, request, responder, response } from "./interface";

export class handler<RequestCustomType, ResponseCustomType> {
	public responders: responder<RequestCustomType, ResponseCustomType>[];
	public method: method;

	constructor(
		method: method,
		responders: responder<RequestCustomType, ResponseCustomType>[]
	) {
		this.responders = responders;
		this.method = method;
	}

	add(responder: responder<RequestCustomType, ResponseCustomType>) {
		this.responders.push(responder);
	}

	async respond(
		request: request<RequestCustomType>,
		responseMessage: response<ResponseCustomType> = new response<ResponseCustomType>(
			""
		)
	): Promise<response<ResponseCustomType> | void> {
		switch (this.responders.length) {
			case 0:
				Promise.reject("No responders found in this handler.");
				break;
			case 1:
				return this.responders[0](request, responseMessage);
			default:
				for (let responder of this.responders) {
					let thisResponse = await responder(request, responseMessage);
					if (thisResponse instanceof response) {
						responseMessage = thisResponse;
					}
				}
		}
	}
}

export default handler;
