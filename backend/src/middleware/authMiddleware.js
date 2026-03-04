const authService = require('../services/authService');

/**
 * JWT Authentication Middleware
 * Protects routes that require authentication
 */
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Access denied. No token provided.');
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 401;
            error.message = 'Invalid or expired token';
        }
        next(error);
    }
};

module.exports = authMiddleware;
