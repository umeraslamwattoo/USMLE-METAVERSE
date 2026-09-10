import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Setting({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    if (adminId) {
      fetchAdminData(adminId);
    }
  }, []);

  const fetchAdminData = async (adminId) => {
    try {
      const response = await axios.get(`https://usmlebackend.backendamaze.com/admin/${adminId}`);
      setFormData(prev => ({
        ...prev,
        name: response.data.admin.name,
        email: response.data.admin.email
      }));
    } catch (error) {
      toast.error('Failed to fetch admin data', {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminId = sessionStorage.getItem('_id');
      const response = await axios.put(`https://usmlebackend.backendamaze.com/admin/${adminId}`, formData);
      
      if (response.data.success) {
        // Update session storage with new name
        sessionStorage.setItem('name', formData.name);
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
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: ''
        }));
        // Force page reload to update header
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message + 'Update failed', {
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
    <div className={`modal-wrapper ${show ? 'show' : ''}`}>
      <div className="modal-back" onClick={onClose} />
      <div className="modal-content p-4" style={{
        maxWidth: '500px',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: 'white'
      }}>
        <h2 className="text-center mb-4 text-primary">Admin Settings</h2>
        
      

        <Form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group mb-4">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                style={{ height: '45px' }}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                style={{ height: '45px' }}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                style={{ height: '45px' }}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaKey />
              </span>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password (optional)"
                style={{ height: '45px' }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <Button 
              variant="primary" 
              type="submit" 
              className="w-50"
              style={{
                height: '45px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Update Profile
            </Button>
            <Button 
              variant="secondary" 
              onClick={onClose} 
              className="w-50"
              style={{
                height: '45px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Close
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Setting;
