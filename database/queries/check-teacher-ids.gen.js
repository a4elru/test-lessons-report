'use strict';

const sql = require('./check-teacher-ids.sql');

class Generator {
	constructor(teacherIds) {
		this._params = [teacherIds];
		this._sql = sql.checkTeachersIds();
	}

	getSQL() {
		return this._sql;
	}
	getParams() {
		return this._params;
	}
}

module.exports = Generator;
