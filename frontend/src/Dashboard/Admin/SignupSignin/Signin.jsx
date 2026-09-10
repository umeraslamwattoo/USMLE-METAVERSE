import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Signin = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    onClose();
    navigate('/');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://usmlebackend.backendamaze.com/admin/login', formData);
        if (response.data.success) {
            sessionStorage.setItem('_id', response.data.admin.id);
            sessionStorage.setItem('name', response.data.admin.name);
            setFormData({
                email: '',
                password: ''
            });
            onClose();
            navigate('/dashboard');      
            toast.success('Login successful', {
              position: "top-right", 
              zIndex: 10000,
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark"
            });
        } else {
            toast.error(response.data.message || 'Login failed', {
              position: "top-right",
              zIndex: 10000,
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
        toast.error(error.response?.data?.message || error.message || 'Login failed', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
              zIndex: 10000,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
    }
};


  return (
    <div className={`modal-wrapper ${show ? 'show' : ''}`}>
      <div className="modal-back" onClick={handleClose} />
      <div className="modal-content-sign signin-animation">
        <h2>Welcome Back</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group slide-in">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group slide-in">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn pulse">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
