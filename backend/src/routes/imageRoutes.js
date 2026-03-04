const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);

// Protected routes (require authentication)
router.post('/', authMiddleware, imageController.createImage);
router.put('/:id', authMiddleware, imageController.updateImage);
router.delete('/:id', authMiddleware, imageController.deleteImage);

module.exports = router;
