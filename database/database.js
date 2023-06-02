'use strict';

const { PG_CONFIG, DEFAULT_PAGINATION_SIZE } = require('../params');

const { Pool } = require('pg');
const sql = require('./sql-queries');

const pool = new Pool(PG_CONFIG);

// EXAMPLE:
// getLessons({
//    page: 1,
//    lessonsPerPage: 2,
//    studentsCount: 2,
//    status: 1,
//    date1: '2019-05-10',
//    date2: '2019-06-17',
//    teacherIds: '1,3',
// });
async function getLessons(validOptions = {}) {
    const { date1, date2, status, studentsCount } = validOptions;

    const teacherIds = validOptions.teacherIds?.split(',');
    const page = validOptions.page || 1;
    const lessonsPerPage = validOptions.lessonsPerPage || DEFAULT_PAGINATION_SIZE;

    let params = [
        page,
        lessonsPerPage,
    ];
    let nextId = 2;
    if (date1 !== undefined) {
        params[nextId++] = date1;
        params[nextId++] = date2;
    }
    if (status !== undefined) {
        params[nextId++] = status;
    }
    if (teacherIds !== undefined) {
        params[nextId++] = teacherIds;
    }
    if (studentsCount !== undefined) {
        params[nextId++] = studentsCount;
    }

    nextId = 3;
    let query = sql.lesson_1;
    if (date1 !== undefined  || status !== undefined ) {
        query +=
            sql.lesson_where +
            ( date1 !== undefined ? sql.lesson_where_date(nextId++, nextId++) : '' ) +
            ( status !== undefined ? sql.lesson_where_status(nextId++) : '' );
    }
    query += sql.lesson_2;
    if (teacherIds !== undefined || studentsCount !== undefined ) {
        query +=
            sql.lesson_having +
            ( teacherIds !== undefined ? sql.lesson_having_teacherIds(nextId++) : '') +
            ( studentsCount !== undefined ? sql.lesson_having_studentsCount(nextId++) : '');
    }
    query += sql.lesson_3;

    const result = await pool.query(query, params);

    return result.rows;
}

module.exports = {
    getLessons,
};
