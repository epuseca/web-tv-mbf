const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    /**
     * Authenticate user and return JWT token
     */
    async login(username, password) {
        try {
            // Find user by username
            const user = await User.findOne({ username: username.toLowerCase() });
            if (!user) {
                const error = new Error('Invalid username or password');
                error.statusCode = 401;
                throw error;
            }

            // Compare password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                const error = new Error('Invalid username or password');
                error.statusCode = 401;
                throw error;
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                },
            };
        } catch (error) {
            if (error.statusCode) throw error;
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            const err = new Error('Invalid or expired token');
            err.statusCode = 401;
            throw err;
        }
    }
}

module.exports = new AuthService();
