const authService = require('../services/authService');

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            const error = new Error('Please provide username and password');
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.login(username, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user info
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                id: req.user.id,
                username: req.user.username,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    getMe,
};
