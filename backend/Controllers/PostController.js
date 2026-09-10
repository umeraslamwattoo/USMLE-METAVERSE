
const Post = require('../Models/PostModel');
const fs = require('fs');

exports.createPost = async (req, res) => {
  try {
    const { authorId, title, category, content } = req.body;
    let imagePath = req.body.image || '';
    if (req.file) {
      imagePath = req.file.path;
    }
    const newPost = new Post({
      authorId,
      title,
      category,
      image: imagePath,
      content
    });
    const savedPost = await newPost.save();
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: savedPost
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('authorId', 'name email');
    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate('authorId', 'name email');
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, category, content } = req.body;
    
    // First get the existing post to check if it has an image
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    let updateData = { title, category, content };

    // Update image if a new file is uploaded
    if (req.file) {
      // Delete the old image if it exists
      if (existingPost.image && fs.existsSync(existingPost.image)) {
        await fs.promises.unlink(existingPost.image);
      }
      updateData.image = req.file.path;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If an image exists and the file is present on disk, delete it
    if (post.image && fs.existsSync(post.image)) {
      await fs.promises.unlink(post.image);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};