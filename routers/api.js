'use strict';

const express = require('express');
const envelopeResponse = require('../middleware/envelope-response');
const db = require('../database/database');
const moment = require('moment');

const router0 = express.Router();

router0.use(express.json()); // request.body
router0.use(envelopeResponse()); // response.envelope

router0.get('/', async (request, response) => {
    const contentType = request.get('Content-Type');
    if (contentType && contentType != 'application/json') {
        response.envelope(415, { 'message': 'Unsupported media type.' });
        return;
    }
    const {
        page,
        lessonsPerPage,
        studentsCount,
        status,
        date,
        teacherIds,
    } = request.body;
    if (page !== undefined &&
            !(/^\d+$/.test(page) && page > 0)) {
        response.envelope(400, { 'message': 'Incorrect value of property \'page\'.' });
        return;
    }
    if (lessonsPerPage !== undefined &&
            !(/^\d+$/.test(lessonsPerPage) &&
            lessonsPerPage > 0)) {
        response.envelope(400, { 'message': 'Incorrect value of property \'lessonsPerPage\'.' });
        return;
    }
    if (studentsCount !== undefined &&
        !(/^\d+$/.test(studentsCount) &&
        studentsCount >= 0)
    ) {
        response.envelope(400, { 'message': 'Incorrect value of property \'studentsCount\'.' });
        return;
    }
    if (status !== undefined && !(/^(1|0)$/.test(status))) {
        response.envelope(400, { 'message': 'Incorrect value of property \'status\'.' });
        return;
    }
    if (date !== undefined && !(
        /^\d{4}-\d{2}-\d{2}$/.test(date) ||
        /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/.test(date))
    ) {
        response.envelope(400, { 'message': 'Incorrect value of property \'date\'.' });
        return;
    }
    let dateArray = date?.split(',');
    let date1 = dateArray?.[0];
    let date2 = dateArray?.[1];
    date2 = date2 ?? date1;
    if ((date1 !== undefined && !moment(date1, 'YYYY-MM-DD', true).isValid()) ||
        (date2 !== undefined && !moment(date2, 'YYYY-MM-DD', true).isValid())) {
        response.envelope(400, { 'message': 'Incorrect value of property \'date\'.' });
        return;
    }
    if (teacherIds !== undefined &&
        !/^\d+(,\d+)*$/.test(teacherIds)
    ) {
        response.envelope(400, { 'message': 'Incorrect value of property \'teacherIds\'.' });
        return;
    }
    const options = {
        page,
        lessonsPerPage,
        studentsCount,
        status,
        date1,
        date2,
        teacherIds,
    };
    let result;
    try {
        result = await db.getLessons(options);
    } catch(error) {
        console.error(error);
        response.envelope(500, { 'message': 'Internal server error.' });
        return;
    }
    response.envelope(200, true, result);
});

router0.use((request, response) => {
    response.envelope(404, { 'message': 'Not found.' });
});

module.exports = router0;
