import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function CreateBlogs() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [authorId, setAuthorId] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    const adminName = sessionStorage.getItem('name');
    
    if (!adminId || !adminName) {
      navigate('/admin-login');
      return;
    }
   
    setAuthorId(adminId);
    fetchCategories();
}, []);
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/category/blog');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authorId) {
      toast.error('User not logged in. Please login first', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', selectedCategory);
      formData.append('authorId', authorId);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('https://usmlebackend.backendamaze.com/posts', formData, {  // Updated endpoint
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setSelectedCategory('');
        toast.success('Post created successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error creating post. Please try again.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
};


  // ReactQuill configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'script', 'indent', 'direction', 'size',
    'color', 'background', 'font', 'align', 'link', 'image', 'video'
  ];

  // Calculate word count (optional)
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const wordCount = plainText.split(/\s+/).filter(word => word).length;

  return (
    <div className="main-Content">
      <h4 className="text-2xl font-bold text-gray-800 mb-6">Create Blogs</h4>
      <div className="create-post-container">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Featured Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      hidden
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="upload-label">
                      <div className="upload-content">
                        <svg className="upload-icon" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <span>Choose Image</span>
                      </div>
                      {imagePreview && (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" className="preview-image" />
                          <div className="overlay-text">Preview</div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.CategoryBlog}>
                        {category.CategoryBlog}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Post Content</label>
              <div className="quill-editor-container">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog post content here..."
                  className="editor-with-counter"
                />
                <div className="counter-display">
                  <span>{wordCount}</span>
                </div>
              </div>
            </div>

            <div className="author-date-grid">
              <div className="mb-3">
                <label className="form-label">Publish Date</label>
                <input type="text" className="form-control" value={date} readOnly />
              </div>
            </div>

            <button type="submit" className="submit-btn w-100">
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlogs;
