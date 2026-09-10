import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaCamera, FaTrash, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import { toast } from "react-toastify";

const ProfileImageModal = ({ user, onClose, setUser }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    try {
      const response = await axios.post(
        `https://usmlebackend.backendamaze.com/user/profile-image/${user.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        // Update user data in session storage
        const updatedUser = response.data.user;
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile image updated successfully', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark"
        });
        
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user.profileImage) {
      toast.error('No profile image to remove', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark"
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await axios.delete(
        `https://usmlebackend.backendamaze.com/user/profile-image/${user.id}`
      );

      if (response.data.success) {
        // Update user data in session storage
        const updatedUser = response.data.user;
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        toast.success('Profile image removed successfully', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark"
        });
        
        setPreviewUrl(null);
        setSelectedImage(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing image', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <FaCamera className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Profile Image</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-48 h-48 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
            {(previewUrl || user.profileImage) ? (
              <img 
                src={previewUrl || `https://usmlebackend.backendamaze.com/${user.profileImage}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-6xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex space-x-4 w-full">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              disabled={isUploading}
            >
              <FaCamera />
              Select Image
            </button>

            {user.profileImage && (
              <button
                onClick={handleRemoveImage}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                disabled={isUploading}
              >
                <FaTrash />
                Remove
              </button>
            )}
          </div>

          {selectedImage && (
            <button
              onClick={handleUpload}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Image
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
