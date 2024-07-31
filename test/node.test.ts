import _ from './test-server';

import Axios from 'axios';

_.listen(3000);

const Instance = Axios.create({
    baseURL: 'http://localhost:3000',
});

const randomString = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

describe('Test server', () => {
    test('normal 200 response', async () => {
        expect.assertions(2);

        const { data, status } = await Instance.get('/');
        expect(status).toEqual(200);
        expect(data).toEqual('200 OK');
    });

    test('post response', async () => {
        expect.assertions(2);
        const string = randomString();

        const { data, status } = await Instance.post('/post', string);

        expect(status).toEqual(200);
        expect(data).toEqual(string);
    });

    test('change header and status code', async () => {
        expect.assertions(3);

        const { data, status, headers } = await Instance.get('/header');

        expect(status).toEqual(204);
        expect(headers['itis']).toEqual('work');
        expect(data).toEqual('');
    });

    test('get param', async () => {
        expect.assertions(2);

        const string = randomString();
        const { data, status } = await Instance.get(`/info/${string}`);

        expect(status).toEqual(200);
        expect(data).toEqual(string);
    });

    test('chain interrupted', async () => {
        expect.assertions(2);

        const { data, status } = await Instance.get(`/info/foo`);

        expect(status).toEqual(200);
        expect(data).toEqual('hit');
    });

    test('dynamic handler', async () => {
        expect.assertions(6);

        const { status: firstStatus, data: firstData } = await Instance.get(
            `/handler`,
        );

        const { data, status } = await Instance.get(`/handler/add`);

        const { status: secondStatus, data: secondData } = await Instance.get(
            `/handler`,
        );

        expect(firstStatus).toEqual(200);
        expect(firstData).toEqual('miss');
        expect(status).toEqual(200);
        expect(data).toEqual('added');
        expect(secondStatus).toEqual(200);
        expect(secondData).toEqual('hit');
    });
});
