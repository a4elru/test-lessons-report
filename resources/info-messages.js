'use strict';

const msg = {};

msg.ERROR_UNSUPPORTED_MEDIA_TYPE = 'unsupported media type';
msg.ERROR_UNDEFINED = 'value is require';
msg.ERROR_NOT_STRING = 'value must be a string';
msg.ERROR_DATE_FORMAT = 'incorrect date format';
msg.ERROR_DATE_INVALID = 'date is incorrect';
msg.ERROR_DIRECTION_TO_PAST = 'first date must be earlier than second';
msg.ERROR_NOT_NUMBER = 'value must be a number';
msg.ERROR_NOT_INTEGER = 'value must be an integer';
msg.ERROR_NOT_POSITIVE = 'value must be positive';
msg.ERROR_NOT_POSITIVE_OR_ZERO = 'value must be positive or zero';
msg.ERROR_NOT_ZERO_OR_ONE = 'value must be 0 or 1';
msg.ERROR_NOT_ARRAY = 'value must be an array';
msg.ERROR_ELEM_NOT_INTEGER = 'array\'s value must be an integer';
msg.ERROR_INCORRECT_DAY = 'array\'s value must be from interval 0-6';
msg.ERROR_REPEATING = 'invalid repeating in array';
msg.INTERNAL_SERVER_ERROR = 'internal server error';
msg.ERROR_PARAM_CONFLICT_1 = 'params "lessonsCount" and "lastDate" mustn\'t be used at the same time';
msg.ERROR_UNKNOWN_TEACHER_ID = 'one or more teachers don\'t exists';
msg.ERROR_NOT_FOUND = 'not found';

Object.freeze(msg);

module.exports = msg;
