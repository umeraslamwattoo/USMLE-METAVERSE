import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import logoDoctor from '../../Images/LogoDoctor.png';
import AccountModal from './AccountModal';
import ProfileImageModal from './ProfileImageModal';

const Header = ({ data }) => {
  const { logo } = data;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const userFromStorage = sessionStorage.getItem('userData');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    }
    setMobileToggle(false);
  };

  const handleAccountClick = () => {
    setShowAccountModal(true);
    setShowProfileMenu(false);
  };

  const handleProfileImageClick = () => {
    setShowProfileImageModal(true);
    setShowProfileMenu(false);
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = document.querySelector(".st-sticky-header")?.offsetHeight + 100 || 100;
      const windowTop = window.scrollY || document.documentElement.scrollTop;
      setIsSticky(windowTop >= headerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`st-site-header st-style1 st-sticky-header ${isSticky ? "st-sticky-active" : ""}`}>
        <div className="st-main-header">
          <div className="">
            <div className="st-main-header-in mx-3 py-1">
              <div className="st-main-header-left">
                <Link to="/" className="st-site-branding">
                  <img src={logoDoctor} alt="logo" style={{ width: "100%", height: "75px" }} />
                </Link>
              </div>
              <div className="st-main-header-right">
                <div className="st-nav">
                  <ul className={`st-nav-list st-onepage-nav ${mobileToggle ? "d-block" : "none"}`}>
                    <li>
                      <ScrollLink to="home" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('home')}>
                        Home
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink to="about" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('about')}>
                        About
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink to="gallery" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('gallery')}>
                        Gallery
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink to="pricing" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('pricing')}>
                        Pricing
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink to="blog" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('blog')}>
                        Blog
                      </ScrollLink>
                    </li>
                    <li>
                      <ScrollLink to="reviews" spy={true} smooth={true} duration={500} onClick={() => handleNavClick('reviews')}>
                      Reviews
                      </ScrollLink>
                    </li>
                    <li className="relative" ref={profileMenuRef}>
                      {user ? (
                        <>
                          <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 mr-2"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                              {user.profileImage ? (
                                <img 
                                  src={`https://usmlebackend.backendamaze.com/${user.profileImage}`} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-gray-700">{user.name}</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {showProfileMenu && (
                            <div className="absolute right-2 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                              <button
                                onClick={handleAccountClick}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                My Account
                              </button>
                              <button
                                onClick={handleProfileImageClick}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Profile Image
                              </button>
                              <button
                                onClick={() => {
                                  handleLogout();
                                  setShowProfileMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                              >
                                Logout
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to="/login-signup"
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          style={{ marginRight: "60px" }}
                        >
                          Login
                        </Link>
                      )}
                    </li>
                  </ul>
                  <div
                    className={`st-munu-toggle ${mobileToggle ? "st-toggle-active" : ""}`}
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showAccountModal && user && (
        <AccountModal
          user={user}  
          onClose={() => setShowAccountModal(false)}
          setUser={setUser}
        />
      )}

      {showProfileImageModal && user && (
        <ProfileImageModal
          user={user}
          onClose={() => setShowProfileImageModal(false)}
          setUser={setUser}
        />
      )}
    </>
  );
};

export default Header;
