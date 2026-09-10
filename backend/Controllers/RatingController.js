const Rating = require('../Models/RatingModel');
const mongoose = require('mongoose');

// Create a new rating
exports.createRating = async (req, res) => {
    try {
        const { userId, categorycourseId, rating, comment } = req.body;

        // Validate required fields
        if (!userId || !categorycourseId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if rating is within valid range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if user has already rated this course
        const existingRating = await Rating.findOne({
            userId,
            categorycourseId
        });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.comment = comment;
            await existingRating.save();
           
            return res.status(200).json({
                success: true,
                message: 'Rating updated successfully',
                data: existingRating
            });
        }

        // Create new rating
        const newRating = new Rating({
            userId,
            categorycourseId,
            rating,
            comment
        });

        await newRating.save();

        res.status(201).json({
            success: true,
            message: 'Rating created successfully',
            data: newRating
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating rating',
            error: error.message
        });
    }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { userId } = req.body; // Assuming user ID is passed for verification

        // Validate rating ID
        if (!mongoose.Types.ObjectId.isValid(ratingId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating ID'
            });
        }

        // Find the rating
        const rating = await Rating.findById(ratingId);

        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }

        // Verify that the user owns this rating
        if (rating.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can only delete your own ratings'
            });
        }

        // Delete the rating
        await Rating.findByIdAndDelete(ratingId);

        res.status(200).json({
            success: true,
            message: 'Rating deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting rating',
            error: error.message
        });
    }
};

// Get ratings for a course
exports.getRatings = async (req, res) => {
    try {
        const { categorycourseId } = req.params;

        // Validate course ID
        if (!mongoose.Types.ObjectId.isValid(categorycourseId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid course ID'
            });
        }

        // Find all ratings for the course
        const ratings = await Rating.find({ categorycourseId })
            .populate('userId', 'name email profileImage') // Include profileImage
            .populate('categorycourseId', 'CategoryCourse')
            .sort({ createdAt: -1 });

        // Calculate average rating
        let averageRating = 0;
        if (ratings.length > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
            averageRating = sum / ratings.length;
        }

        res.status(200).json({
            success: true,
            count: ratings.length,
            averageRating,
            data: ratings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ratings',
            error: error.message
        });
    }
};
// Get ratings by user ID
exports.getRatingsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Validate user ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
  
      // Find all ratings by this user
      const ratings = await Rating.find({ userId })
        .populate('categorycourseId', 'CategoryCourse')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: ratings.length,
        data: ratings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user ratings',
        error: error.message
      });
    }
  };
  