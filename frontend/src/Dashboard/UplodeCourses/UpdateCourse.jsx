import React, { useEffect, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function UpdateCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [existingVideo, setExistingVideo] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    if (!adminId) {
      navigate('/admin-login');
      return;
    }
    fetchCategories();
    fetchCourseData();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/category/course');
      setCategories(response.data.categories);
    } catch (error) {
      toast.error('Error fetching categories', {
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

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`https://usmlebackend.backendamaze.com/courses/${id}`);
      const course = response.data.course;
      setCourseData({
        title: course.title,
        category: course.category._id
      });
      setExistingVideo(course.coursevideo);
    } catch (error) {
      toast.error('Error fetching course data', {
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

  const handleInputChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setExistingVideo('');
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const handleRemoveExistingVideo = () => {
    setExistingVideo('');
    setVideoFile(null);
    setVideoPreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('category', courseData.category);
      if (videoFile) {
        formData.append('coursevideo', videoFile);
      }

      const response = await axios.put(
        `https://usmlebackend.backendamaze.com/courses/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      if (response.data.success) {
        toast.success('Video updated successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        navigate('/dashboard/all/courses');
      }
    } catch (error) {
      toast.error('Error updating video', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-Content">
      <h4 className="text-2xl font-bold text-gray-800 mb-6">Update Course</h4>
  
      <div className="create-post-container">
        <div className="p-6">
          <form className="course-upload-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter course title"
                    className="form-control"
                    value={courseData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.CategoryCourse} (${category.CategoryCoursePrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h5 className="section-title">Course Content</h5>
              <div className="video-upload-container">
                <div className="upload-box">
                  <FaVideo className="upload-icon" />
                  <span>Upload Course Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="form-control"
                  />
                </div>
                {videoFile && (
                  <div className="selected-file mt-4">
                    <p className="mb-2">Selected file: {videoFile.name}</p>
                    {videoPreview && (
                      <video
                        controls
                        width="100%"
                        height="auto"
                        className="mt-2 rounded-lg shadow"
                      >
                        <source src={videoPreview} type={videoFile.type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>
              {existingVideo && (
                <div className="selected-file mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="section-title">Current Course Video</h5>
                    <button
                      type="button"
                      onClick={handleRemoveExistingVideo}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Video
                    </button>
                  </div>
                  <div className="video-container">
                    <video
                      controls
                      width="100%"
                      height="auto"
                      className="mt-2 rounded-lg shadow"
                      src={`https://usmlebackend.backendamaze.com/${existingVideo}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>

            {loading && (
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{uploadProgress}% Uploaded</div>
              </div>
            )}

            <button
              type="submit"
              className="submit-btn btn btn-primary mt-4"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCourse;
