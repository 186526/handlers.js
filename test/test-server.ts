import * as handlersJS from '../index';

const App = new handlersJS.rootRouter();

App.binding(
    '/',
    App.create('GET', async () => '200 OK'),
);

App.binding(
    '/post',
    App.create(
        'POST',
        async (request: handlersJS.request<any>) => request.body,
    ),
);

App.binding(
    '/header',
    App.create('GET', async () => {
        const response = new handlersJS.response<any>('');
        response.status = 204;
        response.headers.set('itis', 'work');
        return response;
    }),
);

App.route('/info/(.*)')
    .binding(
        '/foo',
        App.create(
            'GET',
            (): Promise<handlersJS.response<any>> =>
                new Promise((resolve) => {
                    throw new handlersJS.response('hit');
                }),
        ),
    )
    .binding(
        '/(.*)',
        App.create(
            'GET',
            async (request: handlersJS.request<any>) =>
                request.params[0] ?? 'not found',
        ),
    );

App.useMappingAdapter();

export default App;
