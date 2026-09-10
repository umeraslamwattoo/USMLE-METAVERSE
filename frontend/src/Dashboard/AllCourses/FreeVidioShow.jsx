import React, { useState, useEffect } from "react";
import { FaPlay, FaTrash, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function FreeVidioShow() {
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVideo, setModalVideo] = useState(null);
 
  const filteredVideos = videos.filter(video => {
    const searchLower = searchTerm.toLowerCase();
    return video.title.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem("_id");
    if (!adminId) {
      navigate("/admin-login");
      return;
    }
    fetchVideos();
  }, [navigate]);

  // Add event listener to handle escape key for closing modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && modalVideo) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    // Prevent scrolling when modal is open
    if (modalVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [modalVideo]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get("https://usmlebackend.backendamaze.com/free-videos");
      if (response.data.success) {
        setVideos(response.data.freeVideos);
      }
    } catch (error) {
      toast.error("Error fetching free videos", {
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

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await axios.delete(`https://usmlebackend.backendamaze.com/free-videos/${videoId}`);
       
        if (response.data.success) {
          setVideos(prev => prev.filter(video => video._id !== videoId));
         
          toast.success("Video deleted successfully", {
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
      } catch (error) {
        toast.error("Error deleting video", {
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
    }
  };

  const openVideoModal = (video) => {
    setModalVideo(video);
  };

  const closeModal = () => {
    setModalVideo(null);
  };

  // Skeleton card component for Videos (using Tailwind CSS classes)
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm p-3 relative animate-pulse">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="video-container relative w-full md:w-1/4 h-[150px] bg-gray-300 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-8 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="main-Content p-4 space-y-4">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Manage Free Videos</h4>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="main-Content p-4">
      {/* Video Modal */}
      {modalVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
            <button 
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <div className="aspect-video w-full">
              <video
                className="w-full h-full"
                src={`https://usmlebackend.backendamaze.com/${modalVideo.Freevidiovideo}`}
                controls
                autoPlay
                controlsList="nodownload"
              />
            </div>
            <div className="bg-gray-900 text-white p-4">
              <h3 className="text-xl text-gray-300 font-semibold">{modalVideo.title}</h3>
              <p className="text-sm text-gray-300 mt-1 font-semibold">By: {modalVideo.authorId?.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="">
          <h4 className="text-xl font-bold text-gray-800">Manage Free Videos</h4>
          <Link to="/dashboard/all/courses" className="nav-button mt-4">
            Pay Videos
          </Link>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>
      <div className="create-post-container">
        <div className="grid gap-4">
          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <div key={video._id} className="bg-white rounded-lg shadow-sm p-3 relative">
                <div className="flex flex-col md:flex-row gap-3">
                  <div 
                    className="video-container relative w-full md:w-1/4 h-[150px] cursor-pointer"
                    onClick={() => openVideoModal(video)}
                  >
                    <video
                      className="w-full h-full rounded object-cover"
                      src={`https://usmlebackend.backendamaze.com/${video.Freevidiovideo}`}
                      muted
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40">
                      <FaPlay className="text-white text-2xl" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-600">By: {video.authorId?.name}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                      onClick={() => handleDelete(video._id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No free videos found. Add some videos to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreeVidioShow;
