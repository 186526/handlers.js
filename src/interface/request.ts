import method from './method';
import headers from './headers';
export class request<RequestCustomType> {
    public readonly method: method;
    public readonly url: URL;
    public originURL?: URL;
    public readonly headers: headers;
    public readonly body: any;
    public readonly query: URLSearchParams;
    public params: { [key: string]: string | undefined };
    public custom: RequestCustomType;
    public ip: string;
    public constructor(
        method: method,
        url: URL,
        headers: headers,
        body: any,
        params: { [key: string]: string },
        ip: string = '0.0.0.0',
    ) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.body = body;
        this.query = new URLSearchParams(url.search);
        this.params = params;
        this.ip =
            headers.get('X-REAL-IP') ??
            headers.get('X-Forwarded-For')?.split(' ')[0] ??
            ip;
    }
    public extends(custom: RequestCustomType): request<RequestCustomType> {
        this.custom = custom;
        return this;
    }
}
export default request;
