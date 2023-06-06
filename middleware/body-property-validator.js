'use strict';

const msg = require('../resources/info-messages');
const moment = require('moment');

class BindObj {
    constructor(property, required) {
        this.property = property;
        this.required = required;
    }
    error(message) {
        return { message: this.property + ': ' + message };
    }
}

function funcReturner(property, required = true) {
    const bindObj = new BindObj(property, required);
    switch(property) {
    case 'firstDate':
    case 'lastDate':
        return singleDate.bind(bindObj);
    case 'date':
        return singleOrDoubleDate.bind(bindObj);
    case 'days':
        return daysArray.bind(bindObj);
    case 'teacherIds':
        return arrayOfIntegers.bind(bindObj);
    case 'title':
        return anyString.bind(bindObj);
    case 'status':
        return zeroOrOne.bind(bindObj);
    case 'page':
    case 'lessonsPerPage':
    case 'lessonsCount':
        return positiveInteger.bind(bindObj);
    case 'studentsCount':
        return zeroOrPositiveInteger.bind(bindObj);
    default:
        throw new Error(`ValidatorError: Unknown property "${property}".`);
    }
}
function singleDate(request, response, next) {
    // valid values:
    // - correct string like "YYYY-MM-DD"
    const date = request.body[this.property];
    // handle undefined value
    if (date === undefined) {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof date !== 'string') {
        return response.envelope(400, this.error(msg.ERROR_NOT_STRING));
    }
    // any string
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return response.envelope(400, this.error(msg.ERROR_DATE_FORMAT));
    }
    // any string like "YYYY-MM-DD"
    if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        return response.envelope(400, this.error(msg.ERROR_DATE_INVALID));
    }
    // any correct string like "YYYY-MM-DD"
    next();
}
function singleOrDoubleDate(request, response, next) {
    // valid values:
    // - correct string like "YYYY-MM-DD" or "YYYY-MM-DD,YYYY-MM-DD"
    //   where date1 <= date2
    const date = request.body[this.property];
    // handle undefined value
    if (date === undefined)  {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof date !== 'string') {
        return response.envelope(400, this.error(msg.ERROR_NOT_STRING));
    }
    // any string
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) &&
        !/^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        return response.envelope(400, this.error(msg.ERROR_DATE_FORMAT));
    }
    // any string like "YYYY-MM-DD" or "YYYY-MM-DD,YYYY-MM-DD"
    const dateArray = date.split(',');
    const date1 = dateArray[0];
    const date2 = dateArray[1] ?? date1;
    const mdate1 = moment(date1, 'YYYY-MM-DD', true);
    const mdate2 = moment(date2, 'YYYY-MM-DD', true);
    if (!mdate1.isValid() || !mdate2.isValid()) {
        return response.envelope(400, this.error(msg.ERROR_DATE_INVALID));
    }
    // any correct string like "YYYY-MM-DD" or "YYYY-MM-DD,YYYY-MM-DD"
    if (!(mdate1 <= mdate2)) {
        return response.envelope(400, this.error(msg.ERROR_DIRECTION_TO_PAST));
    }
    // any correct string like "YYYY-MM-DD" or "YYYY-MM-DD,YYYY-MM-DD"
    // where date1 <= date2
    next();
}
function anyString(request, response, next) {
    // valid values:
    // - string
    const string = request.body[this.property];
    // handle undefined value
    if (string === undefined)  {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof string !== 'string') {
        return response.envelope(400, this.error(msg.ERROR_NOT_STRING));
    }
    // any string
    next();
}
function positiveInteger(request, response, next) {
    // valid values:
    // - positive integer
    const number = request.body[this.property];
    // handle undefined value
    if (number === undefined) {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof number !== 'number') {
        return response.envelope(400, this.error(msg.ERROR_NOT_NUMBER));
    }
    // any number
    if (!Number.isInteger(number)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_INTEGER));
    }
    // any integer
    if (!(number > 0)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_POSITIVE));
    }
    // any positive integer
    next();
}
function zeroOrPositiveInteger(request, response, next) {
    // valid values:
    // - positive integer
    const number = request.body[this.property];
    // handle undefined value
    if (number === undefined) {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof number !== 'number') {
        return response.envelope(400, this.error(msg.ERROR_NOT_NUMBER));
    }
    // any number
    if (!Number.isInteger(number)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_INTEGER));
    }
    // any integer
    if (!(number >= 0)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_POSITIVE_OR_ZERO));
    }
    // any positive integer
    next();
}
function zeroOrOne(request, response, next) {
    // valid values:
    // - number 0 or 1
    const number = request.body[this.property];
    // handle undefined value
    if (number === undefined) {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (typeof number !== 'number') {
        return response.envelope(400, this.error(msg.ERROR_NOT_NUMBER));
    }
    // any number
    if (number !== 0 && number !== 1) {
        return response.envelope(400, this.error(msg.ERROR_NOT_ZERO_OR_ONE));
    }
    // number 0 or 1
    next();
}
function daysArray(request, response, next) {
    // valid values:
    // - array with integers 0-6 without repeating
    const days = request.body[this.property];
    // handle undefined value
    if (days === undefined) {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (!Array.isArray(days)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_ARRAY));
    }
    // any array
    const counts = [];
    for(let i = 0; i < days.length; i++) {
        if (
            typeof days[i] !== 'number' ||
            !Number.isInteger(days[i])
        ) {
            return response.envelope(400, this.error(msg.ERROR_ELEM_NOT_INTEGER));
        }
        if (!/[0-6]/.test(days[i])) {
            return response.envelope(400, this.error(msg.ERROR_INCORRECT_DAY));
        }
        if (counts[days[i]] === undefined) {
            counts[days[i]] = 1;
        } else {
            counts[days[i]]++;
        }
        if (counts[days[i]] > 1) {
            return response.envelope(400, this.error(msg.ERROR_REPEATING));
        }
    }
    // any array with integers 0-6 without repeating
    next();
}
function arrayOfIntegers(request, response, next) {
    // valid values:
    // - array with integers without repeating
    const array = request.body[this.property];
    // handle undefined value
    if (array === undefined)  {
        if (this.required) {
            return response.envelope(400, this.error(msg.ERROR_UNDEFINED));
        } else {
            return next();
        }
    }
    // any
    if (!Array.isArray(array)) {
        return response.envelope(400, this.error(msg.ERROR_NOT_ARRAY));
    }
    // any array
    const counts = [];
    for(let i = 0; i < array.length; i++){
        if (!Number.isInteger(array[i])) {
            return response.envelope(400, this.error(msg.ERROR_NOT_INTEGER));
        }
        if (counts[array[i]] === undefined) {
            counts[array[i]] = 1;
        } else {
            counts[array[i]]++;
        }
        if (counts[array[i]] > 1) {
            return response.envelope(400, this.error(msg.ERROR_REPEATING));
        }
    }
    // any array with integers without repeating
    next();
}

module.exports = funcReturner;
