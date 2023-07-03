'use strict';

const { PG_CONFIG } = require('../params');

const { Pool } = require('pg');
const SelectLessonsGen = require('./queries/select-lessons.gen');
const InsertLessonsGen = require('./queries/insert-lessons.gen');
const InsertLessonTeachersGen = require('./queries/insert-lesson-teachers.gen');
const CheckTeacherIdsGen = require('./queries/check-teacher-ids.gen');

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
    const gen = new SelectLessonsGen(validOptions);

    const result = await pool.query(gen.getSQL(), gen.getParams());

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

    let gen = new InsertLessonsGen(validLessons);

    const { rows } = await pool.query(gen.getSQL(), gen.getParams());

    // create lessons_teachers

    const arrayOfTeacherIds = gen.getTeacherIds();

    gen = new InsertLessonTeachersGen(rows, arrayOfTeacherIds);

    const params = gen.getParams();

    if (params.length > 0) {
        await pool.query(gen.getSQL(), params);
    }

    const ids = rows.map((row) => { return row.id; });

    return ids;
}

async function allTeacherIdsExists(teacherIds) {
    if (teacherIds === []) {
        return true;
    }
    const gen = new CheckTeacherIdsGen(teacherIds);
    const { rows } = await pool.query(gen.getSQL(), gen.getParams());
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
