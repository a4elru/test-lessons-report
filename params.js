'use strict';

const params = {};

params.HTTP_PORT = process.env['HTTP_PORT'] || 3333;
params.HOSTNAME = process.env['HOSTNAME'] || 'localhost';
params.DEFAULT_PAGINATION_SIZE = process.env['PAGINATION_SIZE'] || 5;
params.PG_CONFIG = {
    host: process.env['PG_HOST'] || 'localhost',
    port: process.env['PG_PORT'] || 5432,
    database: process.env['PG_DATABASE'] || 'testlessonsreport',
    user: process.env['PG_USER'] || 'postgres',
    password: process.env['PG_PASSWORD'] || 'postgres',
    connectionString: process.env['PG_CONNECTION_STRING'] || undefined,
};

Object.freeze(params);
Object.freeze(params.PG_CONFIG);

module.exports = params;
