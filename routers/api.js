'use strict';

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const bodyPropertyValidator = require('../middleware/body-property-validator');
const requestValidator = require('../middleware/request-validator');
const db = require('../database/database');
const moment = require('moment');
const msg = require('../resources/info-messages');

const router0 = express.Router();

router0.use(envelopeResponse()); // response.envelope
router0.use(requestValidator.contentType('application/json'));
router0.use(express.json()); // request.body

router0.get('/', [
    bodyPropertyValidator('page', false),
    bodyPropertyValidator('lessonsPerPage', false),
    bodyPropertyValidator('studentsCount', false),
    bodyPropertyValidator('status', false),
    bodyPropertyValidator('date', false),
    bodyPropertyValidator('teacherIds', false),
], async (request, response) => {
    const dateArray = request.body.date?.split(',');
    request.body.date1 = dateArray?.[0];
    request.body.date2 = dateArray?.[1] ?? dateArray?.[0];
    let result;
    try {
        result = await db.getLessons(request.body);
    } catch(error) {
        console.error(error);
        return response.envelope(500, { message: msg.INTERNAL_SERVER_ERROR });
    }
    return response.envelope(200, true, result);
});

router0.post('/lessons', [
    bodyPropertyValidator('title'),
    bodyPropertyValidator('teacherIds'),
    bodyPropertyValidator('firstDate'),
    bodyPropertyValidator('days'),
    bodyPropertyValidator('lessonsCount', false),
    bodyPropertyValidator('lastDate', false),
], async (request, response) => {
    if (
        request.body.lessonsCount !== undefined &&
        request.body.lastDate !== undefined
    ) {
        return response.envelope(400, { message: msg.ERROR_PARAM_CONFLICT_1 });
    }

    const { teacherIds } = request.body;
    let allTeacherIdsExists;
    try {
        allTeacherIdsExists = await db.allTeacherIdsExists(teacherIds);
    } catch(error) {
        console.error(error);
        return response.envelope(500, { message: msg.INTERNAL_SERVER_ERROR });
    }
    if (!allTeacherIdsExists) {
        return response.envelope(400, { message: msg.ERROR_UNKNOWN_TEACHER_ID });
    }

    const firstDate = moment(request.body.firstDate);

    const lessonsCountLimit = 300;
    let lessonsCount = request.body.lessonsCount ?? lessonsCountLimit;
    if (lessonsCount > lessonsCountLimit) {
        lessonsCount = lessonsCountLimit;
    }

    const lastDateLimit = moment(request.body.firstDate);
    lastDateLimit.add(1, 'year');
    lastDateLimit.subtract(1, 'day');
    let lastDate;
    if (request.body.lastDate !== undefined) {
        lastDate = moment(request.body.lastDate);
    } else {
        lastDate = lastDateLimit;
    }
    if (lastDate > lastDateLimit) {
        lastDate = lastDateLimit;
    }

    let currentDate = firstDate;
    const { title, days } = request.body;
    let lessonsCreated = 0;
    let lessons = [];
    while (lessonsCreated < lessonsCount && currentDate <= lastDate) {
        if (days.includes(currentDate.day())) {
            lessons[lessonsCreated++] = {
                title: title,
                date: moment(currentDate).format('YYYY-MM-DD'),
                status: 0,
                teacherIds: teacherIds,
            };
        }
        currentDate.add(1, 'days');
    }

    let result;
    try {
        result = await db.createNewLessons(lessons);
    } catch(error) {
        console.error(error);
        return response.envelope(500, { message: msg.INTERNAL_SERVER_ERROR });
    }
    return response.envelope(200, true, result);
});

router0.use((request, response) => {
    response.envelope(404, { 'message': msg.ERROR_NOT_FOUND });
});

module.exports = router0;
