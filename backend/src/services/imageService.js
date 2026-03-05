const Image = require('../models/Image');

class ImageService {
    /**
     * Get all images sorted by creation date (newest first)
     */
    async getAllImages(options = {}) {
        try {
            const query = options.activeOnly ? { isActive: true } : {};
            const images = await Image.find(query).sort({ createdAt: -1 });
            return images;
        } catch (error) {
            throw new Error(`Failed to fetch images: ${error.message}`);
        }
    }

    /**
     * Get a single image by ID
     */
    async getImageById(id) {
        try {
            const image = await Image.findById(id);
            if (!image) {
                const error = new Error('Image not found');
                error.statusCode = 404;
                throw error;
            }
            return image;
        } catch (error) {
            if (error.statusCode) throw error;
            throw new Error(`Failed to fetch image: ${error.message}`);
        }
    }

    /**
     * Create a new image
     */
    async createImage(data) {
        try {
            const { title, description, imageBase64 } = data;
            const image = new Image({ title, description, imageBase64 });
            await image.save();
            return image;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const validationError = new Error(error.message);
                validationError.statusCode = 400;
                throw validationError;
            }
            throw new Error(`Failed to create image: ${error.message}`);
        }
    }

    /**
     * Update an existing image
     */
    async updateImage(id, data) {
        try {
            const { title, description, imageBase64, isActive } = data;
            const updateData = { title, description };

            if (isActive !== undefined) {
                updateData.isActive = isActive;
            }

            // Only update image if a new one is provided
            if (imageBase64) {
                updateData.imageBase64 = imageBase64;
            }

            const image = await Image.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!image) {
                const error = new Error('Image not found');
                error.statusCode = 404;
                throw error;
            }

            return image;
        } catch (error) {
            if (error.statusCode) throw error;
            if (error.name === 'ValidationError') {
                const validationError = new Error(error.message);
                validationError.statusCode = 400;
                throw validationError;
            }
            throw new Error(`Failed to update image: ${error.message}`);
        }
    }

    /**
     * Delete an image
     */
    async deleteImage(id) {
        try {
            const image = await Image.findByIdAndDelete(id);
            if (!image) {
                const error = new Error('Image not found');
                error.statusCode = 404;
                throw error;
            }
            return image;
        } catch (error) {
            if (error.statusCode) throw error;
            throw new Error(`Failed to delete image: ${error.message}`);
        }
    }

    /**
     * Get total count of images
     */
    async getImageCount() {
        try {
            return await Image.countDocuments();
        } catch (error) {
            throw new Error(`Failed to count images: ${error.message}`);
        }
    }
}

module.exports = new ImageService();
