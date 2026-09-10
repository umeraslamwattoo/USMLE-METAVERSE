import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Masonry from 'react-masonry-css';
import SectionHeading from '../SectionHeading/SectionHeading';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
const CourseShow = () => {
    const [currentCourse, setCurrentCourse] = useState(null);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [otherCourses, setOtherCourses] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState('');
    const [hasPayment, setHasPayment] = useState(false);
    const [showBuyButton, setShowBuyButton] = useState(false);
    const { id } = useParams();
    const [enableaccess, setEnableaccess] = useState(false); 
    const navigate = useNavigate();
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState('');
    const [hasRated, setHasRated] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);

    const checkUserRating = async () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (!userData || !userData.id || !currentCourse) return;
    
            const response = await fetch(`https://usmlebackend.backendamaze.com/ratings/course/${currentCourse.category._id}`);
            const data = await response.json();
            
            if (data.success) {
                // Check if user has already rated this category
                const userHasRated = data.data.some(rating => rating.userId._id === userData.id);
                setHasRated(userHasRated);
            }
        } catch (error) {
            console.error('Error checking user rating:', error);
        }
    };
    const handleVideoEnded = () => {
        setIsPlaying(false);
        setVideoCompleted(true);
        
        // If user has payment or enableaccess and hasn't rated yet, show rating modal
        if ((hasPayment || enableaccess) && !hasRated) {
            setShowRatingModal(true);
        }
    };
    const handleSubmitRating = async () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (!userData || !userData.id || !currentCourse) return;
    
            const response = await fetch('https://usmlebackend.backendamaze.com/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.id,
                    categorycourseId: currentCourse.category._id,
                    rating: userRating,
                    comment: userComment
                }),
            });
    
            const data = await response.json();
            
            if (data.success) {
                setHasRated(true);
                setShowRatingModal(false);
                // Clear inputs after successful submission
                setUserRating(0);
                setUserComment('');
                toast.success('Thank you for your rating!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark"
                });
            } else {
                toast.error('Failed to submit rating. Please try again.', {
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
            console.error('Error submitting rating:', error);
            toast.error('An error occurred. Please try again later.', {
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
    
    // Update your useEffect for video ended event
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('ended', handleVideoEnded);
            return () => video.removeEventListener('ended', handleVideoEnded);
        }
    }, [hasPayment, enableaccess, hasRated]);

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData) {
            setEnableaccess(userData.enableaccess || false);
        }
    }, []);
    // Payment check function
    const checkPaymentStatus = async () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            if (!userData || !userData.id) {
                setHasPayment(false);
                return;
            }
            if (userData.enableaccess) {
                setHasPayment(true);
                return;
            }
            const response = await fetch(
                `https://usmlebackend.backendamaze.com/check-payment/${userData.id}/${currentCourse.category._id}`
            );
            const data = await response.json();
            setHasPayment(data.hasAccess);
        } catch (error) {
            console.error('Payment check failed:', error);
            setHasPayment(false);
        }
    };
    // Updated play function: Prevent resume if preview expired
    const handlePlayPause = async () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        
        if (enableaccess) {
            // Full access users can play freely
            video.play();
            setIsPlaying(true);
            return;
        }

        if (!hasPayment && showBuyButton) return;
        
        if (hasPayment) {
            // Paid users without enableaccess
            video.play();
            setIsPlaying(true);
        } else {
            // Free preview logic
            video.currentTime = 0;
            video.play();
            setIsPlaying(true);
            setShowBuyButton(false);
        }
    };
    const handleTimeUpdate = () => {
        if (enableaccess) return; // No restrictions for enableaccess users
        
        if (!hasPayment && videoRef.current.currentTime >= 20 && !showBuyButton) {
            videoRef.current.pause();
            setIsPlaying(false);
            setShowBuyButton(true);
        }
    };


    // Buy Now handler
    const handleBuyNow = () => {
        navigate(`/buy-category/users/${currentCourse.category._id}`);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('ended', () => setIsPlaying(false));
            return () => video.removeEventListener('ended', () => setIsPlaying(false));
        }
    }, []);

    // Prevent screen recording (existing logic)
    useEffect(() => {
        const preventScreenRecording = () => {
            if (navigator.mediaDevices) {
                navigator.mediaDevices.getDisplayMedia = async () => {
                    throw new Error('Screen recording is not allowed');
                };
            }
            const preventRecording = () => {
                const video = document.querySelector('video');
                if (video) {
                    video.addEventListener('enterpictureinpicture', (e) => {
                        e.preventDefault();
                        video.exitPictureInPicture();
                    });
                    video.style.webkitPlaysinline = true;
                    video.style.playsinline = true;
                    const protectionLayer = document.createElement('div');
                    protectionLayer.style.position = 'absolute';
                    protectionLayer.style.top = '0';
                    protectionLayer.style.left = '0';
                    protectionLayer.style.width = '100%';
                    protectionLayer.style.height = '100%';
                    protectionLayer.style.pointerEvents = 'none';
                    video.parentElement.appendChild(protectionLayer);
                }
            };
            const detectRecordingTools = () => {
                const screenCaptureKeys = ['MediaRecorder', 'getDisplayMedia'];
                screenCaptureKeys.forEach(key => {
                    try {
                        if (!(key in window)) {
                            Object.defineProperty(window, key, {
                                get: () => null,
                                configurable: true
                            });
                        }
                    } catch (e) {
                        console.log(`Note: ${key} protection already active`);
                    }
                });
            };
            setInterval(() => {
                if (window.outerWidth - window.innerWidth > 160 ||
                    window.outerHeight - window.innerHeight > 160) {
                    const videos = document.getElementsByTagName('video');
                    Array.from(videos).forEach(video => {
                        video.pause();
                        video.currentTime = 0;
                        video.style.filter = 'blur(30px)';
                    });
                }
            }, 1000);
            preventRecording();
            detectRecordingTools();
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            document.addEventListener('keydown', (e) => {
                if (
                    e.keyCode === 123 ||
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                    (e.ctrlKey && e.keyCode === 85) ||
                    (e.ctrlKey && e.keyCode === 83)
                ) {
                    e.preventDefault();
                    return false;
                }
            });
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.addEventListener('dragstart', (e) => e.preventDefault());
            document.addEventListener('drop', (e) => e.preventDefault());
            document.addEventListener('copy', (e) => e.preventDefault());
            document.addEventListener('cut', (e) => e.preventDefault());
            document.addEventListener('paste', (e) => e.preventDefault());
        };
        preventScreenRecording();
        return () => {
            document.body.style.userSelect = 'auto';
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
            document.removeEventListener('keydown', (e) => e.preventDefault());
            document.removeEventListener('dragstart', (e) => e.preventDefault());
            document.removeEventListener('drop', (e) => e.preventDefault());
            document.removeEventListener('copy', (e) => e.preventDefault());
            document.removeEventListener('cut', (e) => e.preventDefault());
            document.removeEventListener('paste', (e) => e.preventDefault());
        };
    }, []);

    // Prevent non-paying users from using fullscreen mode
    useEffect(() => {
        const handleFullScreenChange = () => {
            if (!hasPayment && document.fullscreenElement) {
                document.exitFullscreen();
            }
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, [hasPayment]);

    // Interval to enforce max 20 sec playback for non-paying users
    useEffect(() => {
        if (enableaccess) return; // No interval needed for enableaccess users
        
        if (!hasPayment) {
            const intervalId = setInterval(() => {
                if (videoRef.current && videoRef.current.currentTime > 20) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 20;
                    setIsPlaying(false);
                    setShowBuyButton(true);
                }
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [hasPayment, enableaccess]);

    useEffect(() => {
        if (id) {
            fetchCourseDetails(id);
        }
        fetchCategories();
    }, [id]);

 useEffect(() => {
    if (currentCourse) {
        checkPaymentStatus();
        checkUserRating(); // Add this line
        fetchAllCourses();
        // Reset states
        setShowBuyButton(false);
        setVideoCompleted(false);
    }
}, [currentCourse]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://usmlebackend.backendamaze.com/category/course');
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await fetch(`https://usmlebackend.backendamaze.com/courses/${courseId}`);
            const data = await response.json();
            if (data.success) {
                setCurrentCourse(data.course);
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const fetchAllCourses = async () => {
        try {
            const response = await fetch('https://usmlebackend.backendamaze.com/courses');
            const data = await response.json();
            if (data.success) {
                const related = data.courses.filter(
                    course =>
                        course.category._id === currentCourse?.category._id &&
                        course._id !== currentCourse?._id
                );
                setRelatedCourses(related);

                const others = data.courses.filter(
                    course =>
                        course.category._id !== currentCourse?.category._id
                );
                setOtherCourses(others);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/course-show-vidios/${courseId}`);
        window.scrollTo(0, 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const breakPointColumns = {
        default: 3,
        1199: 2,
        767: 1,
    };

    useEffect(() => {
        const user = sessionStorage.getItem('userData');
        if (!user) {
            navigate('/login-signup');
            return;
        }
    }, [navigate]);

    if (!sessionStorage.getItem('userData')) {
        return null;
    }

    return (
        <section id="gallery">
            <div className="st-height-b120 st-height-lg-b80" />
            <div className="container">
                {currentCourse && (
                    <div className="course-details mb-5">
                        <div className="course-header bg-light p-4 rounded-4 mb-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h1 className="display-6 fw-bold mb-3">{currentCourse.title}</h1>
                                    <div className="meta-info d-flex flex-wrap gap-4">
                                        <span className="d-flex align-items-center">
                                            <Icon icon="mdi:calendar" className="me-2" width="20" />
                                            {formatDate(currentCourse.createdAt)}
                                        </span>
                                        <span className="d-flex align-items-center">
                                            <Icon icon="mdi:account" className="me-2" width="20" />
                                            {currentCourse.authorId?.name || 'Unknown Author'}
                                        </span>
                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                            {currentCourse.category.CategoryCourse}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="video-container position-relative">
                            <video
                                ref={videoRef}
                                src={`https://usmlebackend.backendamaze.com/${currentCourse.coursevideo}`}
                                className="w-100"
                                style={{ height: '70Vh' }}
                                controls={true}   // Controls always visible
                                controlsList="nodownload"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                                onTimeUpdate={() => {
                                    if (!hasPayment && videoRef.current.currentTime >= 20 && !showBuyButton) {
                                        videoRef.current.pause();
                                        setIsPlaying(false);
                                        setShowBuyButton(true);
                                    }
                                }}
                                onSeeking={() => {
                                    if (!hasPayment && videoRef.current.currentTime > 20) {
                                        videoRef.current.pause();
                                        videoRef.current.currentTime = 20;
                                        setIsPlaying(false);
                                        setShowBuyButton(true);
                                    }
                                }}
                            />

                            {/* Non-paying users: Overlay with Buy Now button */}
                            {!enableaccess && !hasPayment && showBuyButton && (
        <div className="video-overlay" style={{ pointerEvents: 'auto' }}>
            <button className="buy-button" onClick={handleBuyNow}>
                Buy Now to Watch Full Video
            </button>
        </div>
    )}


                            {/* Play button overlay (only shown when video is not playing) */}
                            {!isPlaying && (
                                <button className="play-button" onClick={handlePlayPause}>
                                    Play
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {relatedCourses.length > 0 && (
                    <div className="related-videos-section mb-5">
                        <h3 className="mb-4">Related Videos</h3>
                        <Masonry
                            className="st-isotop st-style1 st-has-gutter st-lightgallery my-masonry-grid"
                            breakpointCols={breakPointColumns}
                        >
                            {relatedCourses.map((course, index) => (
                                <div
                                    key={index}
                                    className="st-isotop-item"
                                    onClick={() => handleCourseClick(course._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="st-project st-zoom st-lightbox-item st-link-hover-wrap">
                                        <div className="st-project-img st-zoom-in">
                                            <video
                                                className="st-hover-hidden"
                                                src={`https://usmlebackend.backendamaze.com/${course.coursevideo}`}
                                                style={{ width: '100%', height: '250px' }}
                                                muted
                                                onMouseEnter={(e) => e.target.play()}
                                                onMouseLeave={(e) => {
                                                    e.target.pause();
                                                    e.target.currentTime = 0;
                                                }}
                                                controlsList="nodownload noplaybackrate"
                                                onContextMenu={(e) => e.preventDefault()}
                                                disablePictureInPicture
                                            />
                                        </div>
                                        <span className="st-link-hover">
                                            <i><Icon icon="fa-solid:play" /></i>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Masonry>
                    </div>
                )}

                {otherCourses.length > 0 && (
                    <div className="other-videos-section">
                        <div className="container">
                            <SectionHeading title="View More Course" />
                        </div>
                        <div className="section-header d-flex justify-content-center align-items-center mb-4">
                            <div className="st-isotop-filter st-style1 text-center">
                                <ul className="st-mp0">
                                    {categories
                                        .filter(cat => cat._id !== currentCourse?.category._id)
                                        .map((item, index) => (
                                            <li
                                                className={`category-filter ${active === item.CategoryCourse ? 'active' : ''}`}
                                                key={index}
                                            >
                                                <span onClick={() => setActive(item.CategoryCourse)}>
                                                    {item.CategoryCourse}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                        <Masonry
                            className="st-isotop st-style1 st-has-gutter st-lightgallery my-masonry-grid"
                            breakpointCols={breakPointColumns}
                        >
                            {otherCourses
                                .filter(course =>
                                    active ? course.category.CategoryCourse === active : true
                                )
                                .map((course, index) => (
                                    <div
                                        key={index}
                                        className="st-isotop-item"
                                        onClick={() => handleCourseClick(course._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="st-project st-zoom st-lightbox-item st-link-hover-wrap">
                                            <div className="st-project-img st-zoom-in">
                                                <video
                                                    className="st-hover-hidden"
                                                    src={`https://usmlebackend.backendamaze.com/${course.coursevideo}`}
                                                    style={{ width: '100%', height: '250px' }}
                                                    muted
                                                    onMouseEnter={(e) => e.target.play()}
                                                    onMouseLeave={(e) => {
                                                        e.target.pause();
                                                        e.target.currentTime = 0;
                                                    }}
                                                    controlsList="nodownload noplaybackrate"
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    disablePictureInPicture
                                                />
                                            </div>
                                            <span className="st-link-hover">
                                                <i><Icon icon="fa-solid:play" /></i>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </Masonry>
                    </div>
                )}
            </div>
            <div className="st-height-b120 st-height-lg-b80" />
{/* Rating Modal - Improved Styling */}
<Modal
    show={showRatingModal}
    onHide={() => setShowRatingModal(false)}
    centered
    className="rating-modal"
>
    <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold">
            <Icon icon="mdi:star-circle" className="me-2 text-warning" width="28" />
            Rate this course
        </Modal.Title>
    </Modal.Header>
    <Modal.Body className="px-4 pt-2">
        <p className="text-center mb-4">How would you rate <span className="fw-bold">"{currentCourse?.title}"</span>?</p>
        <div className="rating-stars mb-4 d-flex justify-content-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '2.5rem',
                        color: star <= userRating ? '#FFD700' : '#e0e0e0',
                        margin: '0 8px',
                        transition: 'all 0.2s ease',
                        transform: star <= userRating ? 'scale(1.2)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = star <= userRating ? 'scale(1.2)' : 'scale(1)';
                    }}
                >
                    ★
                </span>
            ))}
        </div>
        <div className="text-center mb-3">
            <small className="text-muted">
                {userRating === 0 && "Select your rating"}
                {userRating === 1 && "Poor"}
                {userRating === 2 && "Fair"}
                {userRating === 3 && "Good"}
                {userRating === 4 && "Very Good"}
                {userRating === 5 && "Excellent"}
            </small>
        </div>
        <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Your feedback (optional)</Form.Label>
            <Form.Control
                as="textarea"
                rows={4}
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                onPaste={(e) => {
                    // Get pasted content
                    const pastedText = e.clipboardData.getData('text');
                    // Update the comment with the pasted content
                    setUserComment(prev => prev + pastedText);
                    e.preventDefault(); // Prevent default paste behavior
                }}
                placeholder="Share your thoughts about this course..."
                className="border-2 shadow-sm"
            />
        </Form.Group>
    </Modal.Body>
    <Modal.Footer className="border-0 pt-0 d-flex justify-content-center gap-3">
        <Button
            variant="outline-secondary"
            onClick={() => {
                setShowRatingModal(false);
                // Clear inputs when skipping
                setUserRating(0);
                setUserComment('');
            }}
            className="px-4"
        >
            Skip
        </Button>
        <Button
            variant="primary"
            onClick={() => {
                handleSubmitRating();
                // Clear inputs after submission
                setUserRating(0);
                setUserComment('');
            }}
            disabled={userRating === 0}
            className="px-4 fw-semibold"
        >
            Submit Rating
        </Button>
    </Modal.Footer>
</Modal>



        </section>
    );
};

export default CourseShow;
