'use strict';

const msg = require('../resources/info-messages');

function contentType(expectedСontentType) {
    return handler.bind({ expectedСontentType });
}

function handler(request, response, next) {
    const contentType = request.get('Content-Type');
    if (
        contentType !== undefined &&
        contentType !== this.expectedСontentType
    ) {
        response.envelope(415, { 'message': msg.ERROR_UNSUPPORTED_MEDIA_TYPE });
        return;
    }
    next();
}

module.exports = {
    contentType
};
