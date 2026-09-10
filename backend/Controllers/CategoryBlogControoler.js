// Controllers/CategoryBlogController.js
const CategoryBlogModel = require('../Models/CategoryBlogModel');

// Create a new blog category (ensuring uniqueness)
exports.createCategoryBlog = async (req, res) => {
  try {
    const { CategoryBlog } = req.body;
    if (!CategoryBlog) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }
    // Check if the category already exists
    const existingCategory = await CategoryBlogModel.findOne({ CategoryBlog });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }
    // Create and save new category
    const newCategory = new CategoryBlogModel({ CategoryBlog });
    const savedCategory = await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all blog categories
exports.getCategoryBlogs = async (req, res) => {
  try {
    const categories = await CategoryBlogModel.find();
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

// Delete a blog category by ID
exports.deleteCategoryBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryBlogModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
