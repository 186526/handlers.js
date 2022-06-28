import { request, response } from "../interface";

export interface PlatformAdapater<T = any, K = any> {
	listen(port: number): void;
	handleRequest(request: any): request<T>;
	handleResponse(response: response<K>, NativeResponse?: any): any;
}
