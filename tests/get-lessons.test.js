'use strict';

const { HOSTNAME, HTTP_PORT } = require('../params');
const pactum = require('pactum');

const root = `http://${HOSTNAME}:${HTTP_PORT}/api/`;

describe('get lessons', () => {
    test('without options', async () => {
        await pactum.spec()
            .get(root)
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });
    test('page=1', async () => {
        let data = { page: 1 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });
    test('incorrect page=0', async () => {
        let data = { page: 0 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('incorrect page={demo:1}', async () => {
        let data = { page: { demo: 1 } };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('lessonsPerPage=2', async () => {
        let data = { lessonsPerPage: 2 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result', 2);
    });
    test('lessonsPerPage=0', async () => {
        let data = { lessonsPerPage: 0 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('date=2019-01-01', async () => {
        let data = { date: '2019-01-01' };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });
    test('date=2019-01-01,2019-09-01', async () => {
        let data = { date: '2019-01-01,2019-09-01' };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });
    test('incorrect date=2019-01-01,', async () => {
        let data = { date: '2019-01-01,' };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('status=1', async () => {
        let data = { status: 1 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLike({
                'result': [ { 'status': 1 } ]
            });
    });
    test('status=0', async () => {
        let data = { status: 0 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLike({
                'result': [ { 'status': 0 } ]
            });
    });
    test('studentsCount=0', async () => {
        let data = { studentsCount: 0 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result[0].students', 0);
    });
    test('studentsCount=1', async () => {
        let data = { studentsCount: 1 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result[0].students', 1);
    });
    test('studentsCount=2', async () => {
        let data = { studentsCount: 2 };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLength('result[0].students', 2);
    });
    test('teacherIds=[2]', async () => {
        let data = { teacherIds: [2] };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLike({
                'result': [{'teachers': [{'id': 2}]}]
            });
    });
    test('teacherIds=[1,2]', async () => {
        let data = { teacherIds: [1,2] };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true)
            .expectJsonLike({
                'result': [{'teachers': [{'id': /^(1|2)$/}]}]
            });
    });
    test('teacherIds=[2,2]', async () => {
        let data = { teacherIds: [2,2] };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(400)
            .expectJsonMatch('ok', false);
    });
    test('full options', async () => {
        let data = {
            page: 1,
            lessonsPerPage: 2,
            date: '2019-01-01,2019-09-01',
            status: 1,
            teacherIds: [1],
            studentsCount: 3,
        };
        await pactum.spec()
            .get(root)
            .withJson(data)
            .expectStatus(200)
            .expectJsonMatch('ok', true);
    });
});
