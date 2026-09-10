

const Course = require('../Models/CourseModel');
const fs = require('fs');

exports.uplodecourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const newCourse = new Course({
      authorId: req.body.authorId,
      title: req.body.title,
      category: req.body.category,
      coursevideo: req.file.path
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({
      success: true,
      message: 'Course uploaded successfully',
      course: savedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getallcourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('authorId', 'name')
      .populate('category', 'CategoryCourse CategoryCoursePrice');
    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('category', 'CategoryCourse CategoryCoursePrice')
      .populate('authorId', 'name');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updateData = {
      title: req.body.title,
      category: req.body.category,
    };

    if (req.file) {
      // Delete old video file if it exists
      if (course.coursevideo && fs.existsSync(course.coursevideo)) {
        await fs.promises.unlink(course.coursevideo);
      }
      updateData.coursevideo = req.file.path;
    }
      
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If a course video exists and the file is on disk, delete it
    if (course.coursevideo && fs.existsSync(course.coursevideo)) {
      await fs.promises.unlink(course.coursevideo);
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Course and video deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('category', 'CategoryCourse CategoryCoursePrice')
            .populate('authorId', 'name'); // Add this line to populate author name
       
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
