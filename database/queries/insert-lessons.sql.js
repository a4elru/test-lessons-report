'use strict';

const query = {};

function isFirstTuple(id1) {
    return (id1 === 1);
}

/**
 * Insert values into the *lessons* table.
 */
query.insertBlock = function() {
    return `
    INSERT INTO lessons(title, date, status) VALUES`;
};
query.valueTuple = function(id1, id2, id3) {
    return `${ isFirstTuple(id1) ? '' : ',' }
    ($${id1}::text, $${id2}::date, $${id3}::integer)`;
};
query.returningBlock = function() {
    return `
    RETURNING id`;
};

Object.freeze(query);

module.exports = query;
