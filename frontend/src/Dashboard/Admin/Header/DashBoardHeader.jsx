import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaBars, FaUser } from 'react-icons/fa';
import LogoDoctorAdmin from '../../../Images/LogoDoctorAdmin.png'; 

function DashBoardHeader({ toggleSidebar }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = sessionStorage.getItem('name');
    setUserName(name || 'Admin');
  }, []);

  return (
    <>
      <Navbar variant="dark" expand="lg" sticky="top" className='header-container'>
        <Container fluid>
          <button
            className="navbar-toggler d-lg-none me-3 border-0 bg-transparent"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          > 
            <FaBars className="text-white fs-5" />
          </button>
          <Navbar.Brand className="d-flex align-items-center" >
           <img src={LogoDoctorAdmin} alt="Logo" style={{ width: '100%', height: '40px' }} />
          </Navbar.Brand>

          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="ms-auto">
              <div className="d-flex align-items-center gap-2 text-white">
                <div className="d-flex align-items-center">
                  <FaUser className="fs-5" />
                  <span className="ms-2 d-none d-lg-inline">
                    {userName}
                  </span>
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default DashBoardHeader;
