'use strict';

const sql = require('./insert-lessons.sql');

class Generator {
    constructor(validLessons) {
        this._countOfTuples = validLessons.length;

        this._params = [];
        this._nextIDinParams = 0;

        this._teacherIdsForLessons = []; // ex: [[1,2],[3,4]]
        this._nextIDinTeacherIdsForLessons = 0;

        this._addTuples(validLessons);
    }

    getSQL() {
        let query = '';
        query += sql.insertBlock();
        for (let i = 0; i < this._countOfTuples; i++) {
            const offset = i * 3;
            const id1 = offset + 1;
            const id2 = offset + 2;
            const id3 = offset + 3;
            query += sql.valueTuple(id1, id2, id3);
        }
        query += sql.returningBlock();
        return query;
    }
    getParams() {
        return this._params;
    }
    getTeacherIds() {
        return this._teacherIdsForLessons;
    }

    _addTuples(arrayOfData) {
        for (let lesson of arrayOfData) {
            this._addTuple(lesson);
        }
    }
    _addTuple(lesson) {
        this._params[this._nextIDinParams++] = lesson.title;
        this._params[this._nextIDinParams++] = lesson.date;
        this._params[this._nextIDinParams++] = lesson.status;
        this._teacherIdsForLessons[this._nextIDinTeacherIdsForLessons++] = lesson.teacherIds;
    }
}

module.exports = Generator;
