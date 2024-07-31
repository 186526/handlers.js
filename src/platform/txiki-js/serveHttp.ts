import { request } from '../../interface/request';
import { response } from '../../interface';
import { headers } from '../../interface/headers';
import { methodENUM } from '../../interface/method';

import statusCode from './statusCode.json';

export class HttpConn {
    private closed: boolean = false;
    private conn: tjs.Connection;
    private reader: ReadableStreamDefaultReader;

    constructor(Connection: tjs.Connection) {
        this.conn = Connection;
        this.reader = this.reader ?? this.conn.readable.getReader();
    }

    private readMessage(httpMessage: string): request<any> {
        const lines = httpMessage.split('\n');
        const firstLine = lines[0];
        const dividingIndex = lines.indexOf('\r') ?? lines.indexOf('');
        const rawHeaders = lines.slice(1, dividingIndex);

        const [method, path, version] = firstLine.split(' ');

        if (!(version in ['HTTP/1.1', 'HTTP/1.0', 'HTTP/0.9'])) {
            this.conn.close();
        }

        const requestHeaders = new headers({});
        for (const header of rawHeaders) {
            const [key, value] = header.split(': ');
            requestHeaders.set(key, value);
        }

        const url = new URL(
            path,
            `http://${requestHeaders.get('Host')}/` ??
                `http://${this.conn.localAddress.ip}:${this.conn.localAddress.port}/`,
        );

        const body = lines.slice(dividingIndex + 1).join('\n');

        const requestMessage = new request<any>(
            <methodENUM>method,
            url,
            requestHeaders,
            body,
            {},
            this.conn.remoteAddress.ip,
        );
        return requestMessage;
    }

    private handleResponse(response: response<any>) {
        let responseMessage: string = '';
        responseMessage +=
            'HTTP/1.1 ' +
                response.status +
                ' ' +
                statusCode[<'100'>response.status.toString()] ?? '';

        response.headers.forEach((key, value) => {
            responseMessage += '\n' + key + ': ' + value;
        });

        responseMessage += '\n\n' + response.body;

        this.conn.write(new TextEncoder().encode(responseMessage));
        this.conn.close();
        this.closed = true;
    }

    private async read(): Promise<request<any> | undefined> {
        let message = '';
        const { done, value } = await this.reader.read();

        if (done || this.closed) {
            this.closed = true;
            return undefined;
        }

        message += String.fromCharCode(
            ...Object.values(
                <
                    {
                        [key: string]: number;
                    }
                >value,
            ),
        );

        const requestMessage = this.readMessage(message);
        return requestMessage;
    }

    [Symbol.asyncIterator]() {
        const httpConn = this;

        return {
            async next() {
                if (httpConn.closed) return { done: true, value: undefined };
                return {
                    done: false,
                    value: {
                        request: await httpConn.read(),
                        respondWith: (response: response<any>) => {
                            httpConn.handleResponse(response);
                        },
                    },
                };
            },
        };
    }
}

export default function serveHttp(Connection: tjs.Connection) {
    return new HttpConn(Connection);
}
