const mongoose = require('mongoose');

const CategoryBlogSchema = new mongoose.Schema({
    CategoryBlog:{
        type:String,
        required:true,
        unique:true,
    }
});

const CategoryBlog = mongoose.model('CategoryBlog', CategoryBlogSchema);

module.exports = CategoryBlog;