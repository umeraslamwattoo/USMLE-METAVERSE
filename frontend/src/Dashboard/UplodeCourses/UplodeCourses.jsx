import React, { useEffect, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function UplodeCourses() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load from localStorage
  const [courseData, setCourseData] = useState(() => {
    const savedData = localStorage.getItem("courseData");
    return savedData ? JSON.parse(savedData) : { title: "", category: "" };
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    if (!adminId) {
      navigate('/admin-login');
      return;
    }
    fetchCategories();
  }, [navigate]);

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
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error('Error fetching categories: ' + error.message , {
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
    const newData = { ...courseData, [e.target.name]: e.target.value };
    setCourseData(newData);
    localStorage.setItem("courseData", JSON.stringify(newData)); // Save in localStorage
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      toast.info(`Video selected: ${file.name}` , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    if (!courseData.title || !courseData.category || !videoFile) {
      toast.error("Fill all Inputs" , {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('category', courseData.category);
    formData.append('authorId', sessionStorage.getItem('_id'));
    formData.append('coursevideo', videoFile);

    try {
      const response = await axios.post('https://usmlebackend.backendamaze.com/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success("Video Uploaded Successfully" , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        setVideoFile(null);
        setVideoPreview(null);
        setUploadProgress(0);
        document.querySelector('input[type="file"]').value = '';

        // Preserve text inputs after upload but clear video-related data
        localStorage.setItem("courseData", JSON.stringify(courseData));
      }
    } catch (error) {
      toast.error('Error uploading course: ' + error.message , {
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
      <h4 className="text-2xl font-bold text-gray-800 mb-6">Upload Course</h4>
      <Link 
    to="/dashboard/free-vidio" 
    className="nav-button mb-4"
  >
    Free Video
  </Link>
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
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="form-control" />
                </div>
                {videoFile && (
                  <div className="selected-file mt-4">
                    <p className="mb-2">Selected file: {videoFile.name}</p>
                    {videoPreview && (
                      <video controls width="100%" height="auto" className="mt-2 rounded-lg shadow">
                        <source src={videoPreview} type={videoFile.type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="progress-text">{uploadProgress}% Uploaded</div>
              </div>
            )}

            <button type="submit" className="submit-btn btn btn-primary mt-4" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UplodeCourses;
