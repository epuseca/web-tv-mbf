const imageService = require('../services/imageService');

/**
 * @desc    Get all images
 * @route   GET /api/images
 * @access  Public
 */
const getAllImages = async (req, res, next) => {
    try {
        const images = await imageService.getAllImages();
        res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single image by ID
 * @route   GET /api/images/:id
 * @access  Public
 */
const getImageById = async (req, res, next) => {
    try {
        const image = await imageService.getImageById(req.params.id);
        res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new image
 * @route   POST /api/images
 * @access  Private (Admin)
 */
const createImage = async (req, res, next) => {
    try {
        const image = await imageService.createImage(req.body);
        res.status(201).json({
            success: true,
            message: 'Image created successfully',
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update image
 * @route   PUT /api/images/:id
 * @access  Private (Admin)
 */
const updateImage = async (req, res, next) => {
    try {
        const image = await imageService.updateImage(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Image updated successfully',
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete image
 * @route   DELETE /api/images/:id
 * @access  Private (Admin)
 */
const deleteImage = async (req, res, next) => {
    try {
        await imageService.deleteImage(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllImages,
    getImageById,
    createImage,
    updateImage,
    deleteImage,
};
