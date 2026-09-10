import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ show, onClose }) => {
  const navigate = useNavigate();
 
  const handleClose = () => {
    onClose();
    navigate('/');  // Redirect to home page when modal is closed
  };
  
  
  return (
    <div className={`modal-wrapper ${show ? 'show' : ''}`}>
      <div onClick={handleClose} />
      <div className="modal-content-sign signup-animation">
        <h4 className='text-center mb-3'>Create Account</h4>
        <form className="auth-form" >
          
          <div className="form-group slide-in">
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              required 
            />
          </div>
          <div className="form-group slide-in">
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              required 
            />
          </div>
          <div className="form-group slide-in">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required 
            />
          </div>
          <div className="form-group slide-in">
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password" 
              required 
            />
          </div>
          <div className="form-group slide-in">
            <select name="gender"  required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="submit-btn pulse">Register</button>
          
          {/* <div className="divider">
            <span>OR</span>
          </div>
          <button type="button" className="google-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Sign up with Google
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Signup;
