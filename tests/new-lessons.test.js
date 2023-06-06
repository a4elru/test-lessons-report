'use strict';

const { HOSTNAME, HTTP_PORT } = require('../params');
const pactum = require('pactum');

const root = `http://${HOSTNAME}:${HTTP_PORT}/api/lessons`;

describe('post lessons', () => {
    test('without options', async () => {
        await pactum.spec()
            .post(root)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('just add 7 lessons by count', async () => {
        let data = {
            title: 'Blue ocean',
            days: [1],
            firstDate: '2023-01-01',
            teacherIds: [1],
            lessonsCount: 7,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result', 7);
    });
    test('just add 7 lessons by date', async () => {
        let data = {
            title: 'Blue ocean',
            days: [0, 1, 2, 3, 4, 5, 6],
            firstDate: '2023-01-01',
            teacherIds: [1],
            lastDate: '2023-01-07',
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result', 7);
    });
    test('limit 300', async () => {
        let data = {
            title: 'Blue ocean',
            days: [0, 1, 2, 3, 4, 5, 6],
            firstDate: '2020-01-01',
            teacherIds: [],
            lastDate: '2023-01-07',
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result', 300);
    });
    test('limit year', async () => {
        let data = {
            title: 'Blue ocean',
            days: [1],
            firstDate: '2020-01-01',
            teacherIds: [],
            lessonsCount: 500,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result', 52);
    });
    test('param conflict', async () => {
        let data = {
            title: 'Blue ocean',
            days: [1],
            firstDate: '2020-01-01',
            teacherIds: [],
            lessonsCount: 500,
            lastDate: '2023-01-07',
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect title: undefined', async () => {
        let data = {
            days: [1],
            firstDate: '2020-01-01',
            teacherIds: [],
            lessonsCount: 1,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect days: repeating days', async () => {
        let data = {
            title: 'Title',
            days: [1, 1],
            firstDate: '2020-01-01',
            teacherIds: [],
            lessonsCount: 1,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect first date: format', async () => {
        let data = {
            title: 'Title',
            days: [1],
            firstDate: '2020.01.01',
            teacherIds: [],
            lessonsCount: 1,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect teacherIds: teacher not exists', async () => {
        let data = {
            title: 'Title',
            days: [1],
            firstDate: '2020-01-01',
            teacherIds: [0],
            lessonsCount: 1,
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect lessonsCount: must be number', async () => {
        let data = {
            title: 'Title',
            days: [1],
            firstDate: '2020-01-01',
            teacherIds: [0],
            lessonsCount: '1',
        };
        await pactum.spec()
            .post(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
});
