const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
            default: '',
        },
        imageBase64: {
            type: String,
            required: [true, 'Image is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting by creation date (display order)
imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
