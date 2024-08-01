import { platformAdapater } from './index';
import { request, response } from '../interface/index';
import { router } from '../router';
import { headers } from '../interface/headers';

import http from 'http';
import { methodENUM } from 'src/interface/method';

export class NodePlatformAdapter<T = any, K = any> implements platformAdapater {
    public router: router<T, K>;
    public server: http.Server;

    constructor(router: router<T, K>, server?: http.Server) {
        this.router = router;
        if (server) this.server = server;
        else this.server = http.createServer();
    }

    async listen(port: number): Promise<void> {
        this.server.on(
            'request',
            async (req: http.IncomingMessage, res: http.ServerResponse) => {
                const request = await this.handleRequest(req);
                const response = await this.router.respond(request);
                this.handleResponse(response, res);
            },
        );
        this.server.listen(port);
    }

    close() {
        this.server.close();
    }

    async handleRequest(
        nativeRequest: http.IncomingMessage,
    ): Promise<request<T>> {
        if (
            typeof nativeRequest.method != 'string' ||
            typeof nativeRequest.url != 'string' ||
            typeof nativeRequest.headers != 'object'
        ) {
            throw new Error('Invalid request');
        }

        let body: string = '';
        const ip: string =
            nativeRequest.socket.remoteAddress?.replace('::ffff:', '') ??
            '0.0.0.0';
        const requestHeaders = new headers(<any>nativeRequest.headers);

        if (
            !['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(nativeRequest.method)
        ) {
            nativeRequest.on('data', (data: string) => {
                body += data;
            });

            await new Promise((resolve) =>
                nativeRequest.on('end', () => {
                    resolve(true);
                }),
            );
        }

        return new request<T>(
            <methodENUM>nativeRequest.method,
            new URL(
                nativeRequest.url,
                `http://${requestHeaders.get('host') ?? 'localhost'}`,
            ),
            requestHeaders,
            body,
            {},
            ip,
        );
    }

    handleResponse(response: response<K>, nativeResponse: http.ServerResponse) {
        nativeResponse.statusCode = response.status;
        response.headers.forEach((key, value) => {
            nativeResponse.setHeader(key, value);
        });
        nativeResponse.end(response.body);
    }
}
