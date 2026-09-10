import React, { useEffect, useState } from 'react';
import { FaVideo } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function FreeVidio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingVideo, setExistingVideo] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Load from localStorage or initialize with empty title
  const [videoData, setVideoData] = useState(() => {
    const savedData = localStorage.getItem("freeVideoData");
    return savedData ? JSON.parse(savedData) : { title: "" };
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    if (!adminId) {
      navigate('/admin-login');
      return;
    }
    
    // Check if a free video already exists
    checkExistingVideo();
  }, [navigate]);

  const checkExistingVideo = async () => {
    if (initialCheckDone) return; // Prevent multiple checks
    
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/free-videos');
      if (response.data.success && response.data.freeVideos.length > 0) {
        setExistingVideo(true);
        
        // Show toast only once
        toast.info("Only one free video is allowed. Please delete the existing video first.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          toastId: "single-video-restriction" 
        });
        
        // Navigate to the free videos list page after a short delay
        setTimeout(() => {
          navigate('/dashboard/freevidios/show');
        }, 2000);
      }
      setInitialCheckDone(true);
    } catch (error) {
      console.error("Error checking existing videos:", error);
      setInitialCheckDone(true);
    }
  };

  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleInputChange = (e) => {
    const newData = { ...videoData, [e.target.name]: e.target.value };
    setVideoData(newData);
    localStorage.setItem("freeVideoData", JSON.stringify(newData)); // Save in localStorage
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      toast.info(`Video selected: ${file.name}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
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
    
    // If there's already a video, prevent upload and redirect
    if (existingVideo) {
      // Use toastId to prevent duplicate toasts
      toast.error("Only one free video is allowed. Please delete the existing video first.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        toastId: "single-video-restriction"
      });
      navigate('/dashboard/freevidios/show');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);

    if (!videoData.title || !videoFile) {
      toast.error("Please enter a title and select a video", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('authorId', sessionStorage.getItem('_id'));
    formData.append('Freevidiovideo', videoFile);

    try {
      const response = await axios.post('https://usmlebackend.backendamaze.com/free-videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success("Free video uploaded successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        setVideoFile(null);
        setVideoPreview(null);
        setUploadProgress(0);
        document.querySelector('input[type="file"]').value = '';

        // Preserve title after upload
        localStorage.setItem("freeVideoData", JSON.stringify(videoData));
        
        // Navigate to the free videos list page
        setTimeout(() => {
          navigate('/dashboard/freevidios/show');
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.data.hasExistingVideo) {
        // Use toastId to prevent duplicate toasts
        toast.error('Only one free video is allowed. Please delete the existing video first.', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          toastId: "single-video-restriction"
        });
        
        // Navigate to the free videos list page
        setTimeout(() => {
          navigate('/dashboard/freevidios/show');
        }, 1500);
      } else {
        toast.error('Error uploading free video: ' + (error.response?.data?.message || error.message), {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-Content">
      <h4 className="text-2xl font-bold text-gray-800 mb-6">Free Video</h4>
      <Link to="/dashboard/Upload/course" className="nav-button mb-4">
        Course Video
      </Link>
      <div className="create-post-container">
        <div className="p-6">
          {existingVideo ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p className="font-bold">Note:</p>
              <p>Only one free video is allowed. Please delete the existing video first.</p>
              <button 
                onClick={() => navigate('/dashboard/freevidios/show')}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Go to Free Videos List
              </button>
            </div>
          ) : (
            <form className="course-upload-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter video title"
                    className="form-control w-100"
                    value={videoData.title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="video-upload-container">
                  <div className="upload-box">
                    <FaVideo className="upload-icon" />
                    <span>Upload Free Video</span>
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
                {loading ? 'Uploading...' : 'Upload Free Video'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreeVidio;
