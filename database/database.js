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
//    teacherIds: [1,3],
// });
async function getLessons(validOptions = {}) {
    const { date1, date2, status, studentsCount, teacherIds } = validOptions;

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
    let query = sql.s_lesson_1;
    if (date1 !== undefined  || status !== undefined ) {
        query +=
            sql.s_lesson_where +
            ( date1 !== undefined ? sql.s_lesson_where_date(nextId++, nextId++) : '' ) +
            ( status !== undefined ? sql.s_lesson_where_status(nextId++) : '' );
    }
    query += sql.s_lesson_2;
    if (teacherIds !== undefined || studentsCount !== undefined ) {
        query +=
            sql.s_lesson_having +
            ( teacherIds !== undefined ? sql.s_lesson_having_teacherIds(nextId++) : '') +
            ( studentsCount !== undefined ? sql.s_lesson_having_studentsCount(nextId++) : '');
    }
    query += sql.s_lesson_3;

    const result = await pool.query(query, params);

    return result.rows;
}

// EXAMPLE:
// createNewLessons([
//     {
//         title = 'Blue Ocean',
//         date = '2020-04-15',
//         status = 0,
//         teacherIds = [1,2,3],
//     },
//     …
// ]);
async function createNewLessons(validLessons = []) {
    // TODO: transactions
    if (validLessons.length === 0) {
        return [];
    }
    // create lessons
    let nextElemID = 0;
    let nextSqlID = 1;
    let params = [];
    let query = sql.i_lesson_1;
    for(let lesson of validLessons) {
        query += sql.i_lesson_values(nextSqlID++, nextSqlID++, nextSqlID++);
        params[nextElemID++] = lesson.title;
        params[nextElemID++] = lesson.date;
        params[nextElemID++] = lesson.status;
    }
    query += sql.i_lesson_2;

    const { rows } = await pool.query(query, params);

    // create lessons_teachers
    nextElemID = 0;
    nextSqlID = 1;
    params = [];
    query = sql.i_lesson_teachers_1;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < validLessons[i].teacherIds.length; j++) {
            query += sql.i_lesson_teachers_values(nextSqlID++, nextSqlID++);
            params[nextElemID++] = rows[i].id;
            params[nextElemID++] = validLessons[i].teacherIds[j];
        }
    }

    if (params.length > 0) {
        await pool.query(query, params);
    }

    const ids = rows.map((row) => { return row.id; });

    return ids;
}

async function allTeacherIdsExists(teacherIds) {
    if (teacherIds === []) {
        return true;
    }
    const { rows } = await pool.query(sql.check_teachers, [teacherIds]);
    const count = Number(rows[0].count);
    if (count === teacherIds.length) {
        return true;
    }
    return false;
}

module.exports = {
    getLessons,
    createNewLessons,
    allTeacherIdsExists,
};
