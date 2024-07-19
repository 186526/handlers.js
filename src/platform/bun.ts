import { SWPlatformAdapter } from './serviceworker';
import { platformAdapater } from './index';

export class BunPlatformAdapter<T = any, K = any>
    extends SWPlatformAdapter<T, K>
    implements platformAdapater<T, K>
{
    async listen(port: number): Promise<void> {
        Bun.serve({
            fetch: async (request: Request): Promise<Response> => {
                return await this.handleResponse(
                    await this.handleRequest(request).then((request) =>
                        this.router.respond(request),
                    ),
                );
            },
            port,
        });
    }
}
