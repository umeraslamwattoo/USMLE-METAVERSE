import React, { useState, useEffect } from 'react';
import SectionHeading from '../SectionHeading/SectionHeading';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';

function FreeVidio() {
  const [freeVideo, setFreeVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeVideo = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://usmlebackend.backendamaze.com/free-videos');
        if (response.data.success && response.data.freeVideos.length > 0) {
          setFreeVideo(response.data.freeVideos[0]);
          console.log("Video path:", response.data.freeVideos[0].Freevidiovideo);
        }
      } catch (err) {
        console.error('Error fetching free video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeVideo();
  }, []);

  // Function to get the correct video URL
  const getVideoUrl = (path) => {
    // If path already starts with http, return as is
    if (path.startsWith('http')) return path;
    
    // Remove any leading slashes from the path
    const cleanPath = path.replace(/^\/+/, '');
    
    // Construct the full URL
    return `https://usmlebackend.backendamaze.com/${cleanPath}`;
  };

  return (
    <section id='freevidio'>
      <div className="st-height-b120 st-height-lg-b50" />
      <SectionHeading
        title="Free Video"
        subTitle="Enhance your skills with our complimentary educational content"
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : freeVideo ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative aspect-video">
              <video
                className="w-full h-full"
                src={getVideoUrl(freeVideo.Freevidiovideo)}
                controls
                autoPlay={false}
                preload="auto"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-800">{freeVideo.title}</h3>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-600">No free video available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FreeVidio;
