'use strict';

function funcReturner() {
    return func;
}

function func(request, response, next) {
    if ('envelope' in response) {
        throw new Error();
    }
    response.envelope = envelope;
    next();
}

function envelope(status, okError, result) {
    this.status(status);
    const json = {};
    if (okError === true) {
        json.ok = true;
    } else {
        json.ok = false;
        json.error = okError;
    }
    if (result) {
        json.result = result;
    }
    this.json(json);
}

module.exports = funcReturner;
