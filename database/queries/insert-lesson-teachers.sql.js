'use strict';

const query = {};

function isFirstTuple(id1) {
    return (id1 === 1);
}

/**
 * Insert values into the *lesson_teachers* table.
 */
query.insertBlock = function() {
    return `
    INSERT INTO lesson_teachers(lesson_id, teacher_id) VALUES`;
};
query.valueTuple = function(id1, id2) {
    return `${ isFirstTuple(id1) ? '' : ',' }
    ($${id1}::integer, $${id2}::integer)`;
};

Object.freeze(query);

module.exports = query;
