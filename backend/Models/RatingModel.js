const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    categorycourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryCourse',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;