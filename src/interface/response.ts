import headers from "./headers";
import packageJSON from "../../package.json";
import { platform, version } from "../lib";

export class defaultHeaders extends headers {
	constructor(headers: { [key: string]: string } = {}) {
		super(headers);
		if (!this.has("Content-Type"))
			this.set("Content-Type", "text/plain; charset=utf-8");
		this.set(
			"Server",
			`Handlers.JS/${packageJSON.version} ${platform}/${version}`
		);
	}
}
export class response<ResponseCustomType> {
	public status: number;
	public headers: headers;
	public body: any;
	public custom: ResponseCustomType;
	public constructor(
		body: any,
		status: number = 200,
		headers: headers = new defaultHeaders()
	) {
		this.status = status;
		this.headers = headers;
		this.body = body;
	}
	public extends(custom: ResponseCustomType): response<ResponseCustomType> {
		this.custom = custom;
		return this;
	}
}
export default response;
