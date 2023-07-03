'use strict';

const sql = require('./insert-lesson-teachers.sql');

class Generator {
    constructor(arrayOfLessons, arrayOfTeacherIds) {
        this._countOfTuples = 0;
        this._params = [];
        this._nextIDinParams = 0;

        this._addTuples(arrayOfLessons, arrayOfTeacherIds);
    }

    getSQL() {
        let query = '';
        query += sql.insertBlock();
        for (let i = 0; i < this._countOfTuples; i++) {
            const offset = i * 2;
            const id1 = offset + 1;
            const id2 = offset + 2;
            query += sql.valueTuple(id1, id2);
        }
        return query;
    }
    getParams() {
        return this._params;
    }

    _addTuples(arrayOfData, arrayOfTeacherIds) {
        for (let lesson of arrayOfData) {
            for (let teacherIds of arrayOfTeacherIds) {
                for (let teacherId of teacherIds) {
                        this._addTuple(lesson.id, teacherId);
                }
            }
        }
    }
    _addTuple(lessonId, teacherId) {
        this._params[this._nextIDinParams++] = lessonId;
        this._params[this._nextIDinParams++] = teacherId;
        this._countOfTuples++;
    }
}

module.exports = Generator;
