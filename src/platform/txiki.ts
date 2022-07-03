import { platformAdapater } from "./index";
import { request } from "../interface/request";
import { response } from "../interface/response";
import { router } from "../router";
import serveHttp from "./txiki.js/serveHttp";

export class TxikiPlatformAdapter<T = any, K = any> implements platformAdapater {
    public router: router<T, K>;

    constructor(router: router<T, K>) {
        this.router = router;
    }

    async listen(port?: number): Promise<void> {
        const Server = await tjs.listen("tcp", "0.0.0.0", port);

        for await (const conn of Server) {
            const httpConn = serveHttp(conn);

            for await (const conn of httpConn) {
                if (typeof conn == "undefined" || typeof conn.request == "undefined") {
                    return;
                }
                conn.respondWith(await this.router.respond(conn.request));
            }
        }
    }

    async handleRequest(nativeRequest: request<any>): Promise<request<T>> {
        return nativeRequest;
    }

    async handleResponse(response: response<K>): Promise<response<K>> {
        return response;
    }
}