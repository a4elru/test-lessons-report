'use strict';

const { DEFAULT_PAGINATION_SIZE } = require('../../params.js');
const sql = require('./select-lessons.sql');

/**
 * Generates a query string and query params for use in PG pool.query function.
 * @method getSQL() - return a query string
 * @method getParams() - return query params
 */
class Generator {
    constructor(validOptions) {
        this._queryIncludeFlags = new QueryIncludeFlags();

        // for getSQL()
        this._paramIndexMapID = {};
        this._nextParamIndexMapID = 1;

        // for getParams()
        this._params = [];
        this._paramValueMapID = {};
        this._nextParamValueMapID = 0;

        this._setOptions(validOptions);
    }

    getSQL() {
        const queryIncludes = this._queryIncludeFlags;
        const indexMapID = this._paramIndexMapID;
        const sequence = queryIncludes.sequence;
        let sqlcode = '';
        for(let i = 0; i < sequence.length; i++) {
            const sqlstmt = sequence[i];
            if (queryIncludes[sqlstmt]) {
                sqlcode += sql[sqlstmt](indexMapID);
            }
        }
        return sqlcode;
    }
    getParams() {
        return this._params;
    }

    _setOptions(validOptions) {
        this.setLessonsPerPage(validOptions.lessonsPerPage);
        this.setPage(validOptions.page);
        this.setDate1(validOptions.date1);
        this.setDate2(validOptions.date2);
        this.setStatus(validOptions.status);
        this.setStudentsCount(validOptions.studentsCount);
        this.setTeacherIds(validOptions.teacherIds);
    }
    _setParam(name, value) {
        let indexID, valueID;
        if (this._paramValueMapID[name] === undefined) {
            indexID = this._nextParamIndexMapID++;
            valueID = this._nextParamValueMapID++;
            this._paramIndexMapID[name] = indexID;
            this._paramValueMapID[name] = valueID;
        } else {
            valueID = this._paramValueMapID[name];
        }
        this._params[valueID] = value;
    }

    setLessonsPerPage(lessonsPerPage = DEFAULT_PAGINATION_SIZE) {
        this._setParam('lessonsPerPage', lessonsPerPage);
    }
    setPage(page = 1) {
        this._setParam('page', page);
    }
    setDate1(date1) {
        if (date1 === undefined) {
            return;
        }
        this._queryIncludeFlags.whereBlock = true;
        this._queryIncludeFlags.whereDate1Param = true;
        this._setParam('date1', date1);
    }
    setDate2(date2) {
        if (date2 === undefined) {
            return;
        }
        this._queryIncludeFlags.whereBlock = true;
        this._queryIncludeFlags.whereDate2Param = true;
        this._setParam('date2', date2);
    }
    setStatus(status) {
        if (status === undefined) {
            return;
        }
        this._queryIncludeFlags.whereBlock = true;
        this._queryIncludeFlags.whereStatusParam = true;
        this._setParam('status', status);
    }
    setStudentsCount(studentsCount) {
        if (studentsCount === undefined) {
            return;
        }
        this._queryIncludeFlags.havingBlock = true;
        this._queryIncludeFlags.havingStudentsCountParam = true;
        this._setParam('studentsCount', studentsCount);
    }
    setTeacherIds(teacherIds) {
        if (teacherIds === undefined) {
            return;
        }
        this._queryIncludeFlags.havingBlock = true;
        this._queryIncludeFlags.havingTeacherIdsParam = true;
        this._setParam('teacherIds', teacherIds);
    }
}

/**
 * Defines which sql statements will be included in the query.
 * @prop {{flagName}} (ex: 'selectBlock') - *boolean* - defines whether included the sql statement "flagName" in query
 * @prop **sequence** - *['selectBlock', ...]* - defines sequence sql statements
 */
class QueryIncludeFlags {
    constructor() {
        this.sequence = [];
        this._nextIDinSequence = 0;
        this._initialization();
    }

    _initialization() {
        this._addFlag('selectBlock', true);

        this._addFlag('whereBlock', false);
        this._addFlag('whereDate1Param', false);
        this._addFlag('whereDate2Param', false);
        this._addFlag('whereStatusParam', false);

        this._addFlag('groupByBlock', true);

        this._addFlag('havingBlock', false);
        this._addFlag('havingStudentsCountParam', false);
        this._addFlag('havingTeacherIdsParam', false);

        this._addFlag('orderByBlock', true);
        this._addFlag('limitOffsetBlock', true);
    }
    _addFlag(flagName, isIncludedInQuery) {
        // ex: this['selectBlock'] = true;
        // ex: this['whereBlock'] = false;
        // ex: ...
        // ex: this['limitOffsetBlock'] = true;
        this[flagName] = isIncludedInQuery;
        // ex: this._sequence[0] = 'selectBlock';
        // ex: this._sequence[1] = 'whereBlock';
        // ex: ...
        // ex: this._sequence[X] = 'limitOffsetBlock';
        this.sequence[this._nextIDinSequence++] = flagName;
    }
}

module.exports = Generator;
