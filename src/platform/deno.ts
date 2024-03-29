import { SWPlatformAdapter } from "./serviceworker";
import { platformAdapater } from "./index";

import { request } from "../interface/request";
import { headers } from "../interface/headers";
import { methodENUM } from "src/interface/method";


const DefaultConn: Deno.Conn = {
    localAddr: {
        transport: "tcp",
        hostname: "0.0.0.0",
        port: 80,
    },
    remoteAddr: {
        transport: "tcp",
        hostname: "0.0.0.0",
        port: 80,
    },
    rid: 0,
    closeWrite: async () => undefined,
    readable: "",
    writable: "",
    read: async (p: Uint8Array) => null,
    write: async (p: Uint8Array) => 0,
    close: () => undefined,
};

export class DenoPlatformAdapter<T = any, K = any>
    extends SWPlatformAdapter<T, K>
    implements platformAdapater<T, K>
{
    async listen(port: number): Promise<void> {
        const Server: Deno.Listener = Deno.listen({ port });

        for await (const connection of Server) {
            const httpConnection = Deno.serveHttp(connection);

            for await (const requestEvent of httpConnection) {
                requestEvent.respondWith(this.handler(requestEvent, connection));
            }
        }
    }

    async handleRequest(nativeRequest: Request, connection: Deno.Conn = DefaultConn): Promise<request<T>> {
        const requestHeaders = new headers(
            Object.fromEntries(nativeRequest.headers.entries())
        );
        const requestMessage: request<T> = new request(
            <methodENUM>nativeRequest.method,
            new URL(nativeRequest.url),
            requestHeaders,
            await nativeRequest.text(),
            {},
            `${connection.remoteAddr.hostname}:${connection.remoteAddr.port}` || ""
        );
        return requestMessage;
    }

    async handler(event: FetchEvent, connection: Deno.Conn = DefaultConn): Promise<Response> {
        return await this.handleResponse(
            await this.handleRequest(event.request, connection).then((request) =>
                this.router.respond(request)
            )
        )
    }
}
