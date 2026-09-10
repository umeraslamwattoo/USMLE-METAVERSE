import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from "react-toastify";
const AccountModal = ({ user, onClose, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneno: user.phoneno,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.currentPassword && formData.newPassword) {
        await axios.post('https://usmlebackend.backendamaze.com/user/change-password', {
          userId: user.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }
  
      // Make sure we're using the correct user ID property
      const response = await axios.put(`https://usmlebackend.backendamaze.com/user/update/${user.id}`, {
        name: formData.name,
        email: formData.email,
        phoneno: formData.phoneno
      });
  
      if (response.data.success) {
        onClose();
        toast.success('Profile updated successfully', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark"
        });
        
        // Make sure to preserve the profile image when updating the user state
        const updatedUser = {
          ...response.data.user,
          profileImage: response.data.user.profileImage || user.profileImage
        };
        
        setUser(updatedUser);
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || 'Error updating profile', {
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
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50" style={{ paddingTop: '100px' }}>
      <div className="bg-white rounded-xl p-6 w-[800px] shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-3">
            <FaEdit className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Personal Information
            </h3>
            
            <div className="relative">
              <div className="flex items-center mb-1">
                <FaUser className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">Full Name</label>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="relative">
              <div className="flex items-center mb-1">
                <FaEnvelope className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">Email Address</label>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <div className="flex items-center mb-1">
                <FaPhone className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
              </div>
              <input
                type="tel"
                value={formData.phoneno}
                onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Right Column - Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaLock className="text-blue-500" />
              Change Password
            </h3>

            <div className="relative">
              <div className="flex items-center mb-1">
                <FaLock className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">Current Password</label>
              </div>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>

            <div className="relative">
              <div className="flex items-center mb-1">
                <FaLock className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">New Password</label>
              </div>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            <div className="relative">
              <div className="flex items-center mb-1">
                <FaLock className="text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              </div>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Messages and Buttons - Full Width */}
          <div className="col-span-2 space-y-4">
          
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
