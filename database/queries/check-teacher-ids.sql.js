'use strict';

const query = {};

/**
 * Select query for assuring that all required teachers are exists.
 */
query.checkTeachersIds = function() {
    return `
    SELECT COUNT(*) FROM teachers
    WHERE ARRAY[teachers.id] <@ $1::integer[]`;
}

Object.freeze(query);

module.exports = query;
