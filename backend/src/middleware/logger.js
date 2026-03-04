const morgan = require('morgan');

/**
 * Request Logger Middleware
 * Uses Morgan for HTTP request logging with custom format
 */
const logger = morgan((tokens, req, res) => {
    return [
        `[${new Date().toISOString()}]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});

module.exports = logger;
