import { request, response } from '../interface/index';
import { router } from '../router';

export interface platformAdapater<T = any, K = any> {
    router: router<T, K>;
    listen(port: number): void;
    handleRequest(nativeRequest: any): Promise<request<T>>;
    handleResponse(
        response: response<K> | Promise<response<K>>,
        nativeResponse?: any,
    ): any;
}

export interface platformAdapaterConstructor<T = any, K = any> {
    new (router: router<T, K>): platformAdapater<T, K>;
}

export function createPlatformAdapater(
    adapater: platformAdapaterConstructor,
    router: router,
): platformAdapater {
    return new adapater(router);
}
