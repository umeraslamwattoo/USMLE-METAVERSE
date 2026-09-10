import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { TbCategoryPlus } from "react-icons/tb";
import { BiSolidVideoPlus } from "react-icons/bi";
import { FaTimes, FaCog, FaSignOutAlt, FaHome, FaFile, FaUsers, FaFileVideo } from 'react-icons/fa';
import Setting from './Setting';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Sidebar({ isOpen, closeSidebar }) {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const logoute = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigate('/')
  };

  // Function to check if the current path matches the link path
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true;
    }
    // For other paths, check if the current path starts with the link path
    // This handles nested routes like /dashboard/create/blogs
    return path !== '/dashboard' && location.pathname.startsWith(path);
  };

  // Common style for all nav links
  const navLinkStyle = {
    paddingBottom: '20px', 
    paddingTop: '20px', 
    fontSize: '20px', 
    fontWeight: 'bold'
  };

  return (
    <div className={`header-container text-white sidebar ${isOpen ? 'open' : ''}`} >
      <div className="sidebar-header d-flex justify-content-end p-3 d-lg-none">
        <FaTimes className="text-white h4 mb-0 cursor-pointer" onClick={closeSidebar} />
      </div>

      <div className="sidebar-content">
        <Nav className="flex-column p-3">
          <Nav.Link
            as={Link}
            to="/dashboard"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}
          >
            <FaHome className="me-3" /> Dashboard
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/dashboard/create/blogs"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard/create/blogs') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}>
            <FaFile className="me-3" /> Posts
          </Nav.Link>
          
          <Nav.Link
            as={Link}
            to="/dashboard/all/courses"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard/all/courses') ? 'active bg-success' : ''}  ${isActive('/dashboard/freevidios/show') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}>
            <FaFileVideo className="me-3" /> Course
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/dashboard/Upload/course"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard/Upload/course') ? 'active bg-success' : ''} ${isActive('/dashboard/free-vidio') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}>
            <BiSolidVideoPlus className="me-3" />Upload
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/dashboard/all/users"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard/all/users') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}
          >
            <FaUsers className="me-3" /> Users
          </Nav.Link>
          
          <Nav.Link
            as={Link}
            to="/dashboard/all/Categories"
            style={navLinkStyle}
            className={`sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between ${isActive('/dashboard/all/Categories') ? 'active bg-success' : ''}`}
            onClick={closeSidebar}
          >
            <TbCategoryPlus className="me-3" />
            Categories
          </Nav.Link>
        </Nav>
      </div>

      <div className="sidebar-bottom p-3 border-top border-secondary">
        <Nav className="flex-column">
          <Nav.Link
            as="button"
            style={navLinkStyle}
            className="sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between"
            onClick={() => setShowSettings(true)}
          >
            <FaCog className="me-3" /> Settings
          </Nav.Link>
          <Nav.Link
            as="button"
            onClick={logoute}
            style={navLinkStyle}
            className="sidebar-admin text-white mb-2 rounded d-flex align-items-center justify-content-space-between"
          >
            <FaSignOutAlt className="me-3" /> Logout
          </Nav.Link>
        </Nav>
      </div>

      <Setting show={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default Sidebar;
