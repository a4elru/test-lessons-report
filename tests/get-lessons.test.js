'use strict';

const { HOSTNAME, HTTP_PORT } = require('../params');
const pactum = require('pactum');

const root = `http://${HOSTNAME}:${HTTP_PORT}/api`;

describe('get lessons', () => {
    test('without options --- 200, ok=true', async () => {
        await pactum.spec()
            .get(root + '/')
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });

    test('page=1 --- 200', async () => {
        let data = { page: 1 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
    test('page=0 --- 400', async () => {
        let data = { page: 0 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(400);
    });
    test('page={demo:1} --- 400', async () => {
        let data = { page: { demo: 1 } };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(400);
    });

    test('lessonsPerPage=2 --- 200, result.length=2', async () => {
        let data = { lessonsPerPage: 2 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLength('result', 2);
    });
    test('lessonsPerPage=0 --- 400', async () => {
        let data = { lessonsPerPage: 0 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(400);
    });

    test('date=2019-01-01 --- 200', async () => {
        let data = { date: '2019-01-01' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
    test('date=2019-01-01,2019-09-01 --- 200', async () => {
        let data = { date: '2019-01-01,2019-09-01' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
    test('date=2019-01-01, --- 400', async () => {
        let data = { date: '2019-01-01,' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(400);
    });

    test('status=1 --- 200, status=1 in lessons', async () => {
        let data = { status: 1 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLike({
                'result': [ { 'status': 1 } ]
            });
    });
    test('status=0 --- 200, status=0 in lessons', async () => {
        let data = { status: 0 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLike({
                'result': [ { 'status': 0 } ]
            });
    });

    test('studentsCount=0 --- 200, result[0].students.length=0 in lessons', async () => {
        let data = { studentsCount: 0 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLength('result[0].students[*]', 0);
    });
    test('studentsCount=1 --- 200, result[0].students.length=1 in lessons', async () => {
        let data = { studentsCount: 1 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLength('result[0].students[*]', 1);
    });
    test('studentsCount=2 --- 200, result[0].students.length=2 in lessons', async () => {
        let data = { studentsCount: 2 };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200)
            .expectJsonLength('result[0].students[*]', 2);
    });

    test('teacherIds=1 --- 200', async () => {
        let data = { teacherIds: '1' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
    test('teacherIds=1,2 --- 200', async () => {
        let data = { teacherIds: '1,2' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
    test('teacherIds=1,2, --- 400', async () => {
        let data = { teacherIds: '1,2,' };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(400);
    });

    test('full options --- 200', async () => {
        let data = {
            page: 1,
            lessonsPerPage: 2,
            date: '2019-01-01,2019-09-01',
            status: 1,
            teacherIds: '1',
            studentsCount: 3,
        };
        await pactum.spec()
            .get(root + '/')
            .withJson(data)
            .expectStatus(200);
    });
});
