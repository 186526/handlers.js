import * as lib from "../lib";
export class headers {
	public headers: { [key: string]: string } = {};
	constructor(headers: { [key: string]: string }) {
		this.headers = {};
		Object.keys(this.headers).forEach((key) => {
			this.headers[lib.firstUpperCase(key)] = headers[key];
		});
	}
	delete(key: string) {
		delete this.headers[lib.firstUpperCase(key)];
	}
	get(key: string): string | undefined {
		return this.headers[lib.firstUpperCase(key)];
	}
	has(key: string): boolean {
		return this.headers.hasOwnProperty(lib.firstUpperCase(key));
	}
	set(key: string, value: string) {
		this.headers[lib.firstUpperCase(key)] = value;
	}
	toObject() {
		return this.headers;
	}
}
export default headers;