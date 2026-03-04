const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

const { subscribe } = require('../services/sseService');

// Public routes
router.get('/events', subscribe); // SSE endpoint — must be before /:id
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);

// Protected routes (require authentication)
router.post('/', authMiddleware, imageController.createImage);
router.put('/:id', authMiddleware, imageController.updateImage);
router.delete('/:id', authMiddleware, imageController.deleteImage);

module.exports = router;
