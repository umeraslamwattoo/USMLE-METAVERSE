const CategoryCourse = require('../Models/CategoryCourseModel');

exports.createCategoryCourse = async (req, res) => {
    try {
        const { CategoryCourse: name, CategoryCoursePrice } = req.body;
        
        const newCategory = await CategoryCourse.create({
            CategoryCourse: name,
            CategoryCoursePrice
        });

        res.status(201).json({
            success: true,
            message: 'Course category created successfully',
            category: newCategory
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCategoryCourses = async (req, res) => {
  try {
    const categories = await CategoryCourse.find();
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateCategoryCourse = async (req, res) => {
  try {
    // Rename the destructured variables to avoid shadowing the model
    const { CategoryCourse: categoryName, CategoryCoursePrice: categoryPrice } = req.body;
    
    const updatedCategory = await CategoryCourse.findByIdAndUpdate(
      req.params.id,
      { CategoryCourse: categoryName, CategoryCoursePrice: categoryPrice },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCategoryCourse = async (req, res) => {
  try {
    await CategoryCourse.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Course category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryCourse.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
