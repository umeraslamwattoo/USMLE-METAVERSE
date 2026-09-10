const FreeVidioModel = require('../Models/FreeVidioModel');
const fs = require('fs');

// Create a new free video
exports.createFreeVideo = async (req, res) => {
  try {
    // Check if a free video already exists
    const existingVideos = await FreeVidioModel.countDocuments();
    
    if (existingVideos > 0) {
      return res.status(400).json({
        success: false,
        message: 'Only one free video is allowed. Please delete the existing video first.',
        hasExistingVideo: true
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const newFreeVideo = new FreeVidioModel({
      authorId: req.body.authorId,
      title: req.body.title,
      Freevidiovideo: req.file.path
    });

    const savedFreeVideo = await newFreeVideo.save();
    res.status(201).json({
      success: true,
      message: 'Free video uploaded successfully',
      freeVideo: savedFreeVideo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Get all free videos
exports.getAllFreeVideos = async (req, res) => {
  try {
    const freeVideos = await FreeVidioModel.find()
      .populate('authorId', 'name');
    
    res.status(200).json({
      success: true,
      freeVideos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Delete a free video
exports.deleteFreeVideo = async (req, res) => {
  try {
    const freeVideo = await FreeVidioModel.findById(req.params.id);
    if (!freeVideo) {
      return res.status(404).json({
        success: false,
        message: 'Free video not found'
      });
    }

    // Delete the video file from the filesystem
    if (freeVideo.Freevidiovideo && fs.existsSync(freeVideo.Freevidiovideo)) {
      await fs.promises.unlink(freeVideo.Freevidiovideo);
    }

    await FreeVidioModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Free video deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
