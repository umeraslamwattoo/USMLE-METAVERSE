const mongoose = require('mongoose');

const categoryCourseSchema = new mongoose.Schema({
    CategoryCourse: {
        type: String,
        required: true,
        unique: true,
    },
    CategoryCoursePrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('CategoryCourse', categoryCourseSchema);
