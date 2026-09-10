import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RatingCarousel = ({ categoryId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch all categories first
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

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
       
        // If categoryId is provided, fetch ratings for that category only
        if (categoryId) {
          const response = await fetch(`https://usmlebackend.backendamaze.com/ratings/course/${categoryId}`);
          const data = await response.json();
          if (data.success) {
            setRatings(data.data);
            setAverageRating(data.averageRating || 0);
          }
        }
        // If no categoryId is provided, fetch ratings for all categories
        else if (categories.length > 0) {
          // Fetch ratings for all categories
          const allRatings = [];
          let totalRating = 0;
          let ratingCount = 0;
         
          // Use Promise.all to fetch ratings for all categories in parallel
          const ratingPromises = categories.map(category =>
            fetch(`https://usmlebackend.backendamaze.com/ratings/course/${category._id}`)
              .then(res => res.json())
              .then(data => {
                if (data.success && data.data.length > 0) {
                  allRatings.push(...data.data);
                  totalRating += data.averageRating * data.data.length;
                  ratingCount += data.data.length;
                }
              })
              .catch(err => console.error(`Error fetching ratings for category ${category.CategoryCourse}:`, err))
          );
         
          await Promise.all(ratingPromises);
         
          // Calculate overall average rating
          const overallAverage = ratingCount > 0 ? totalRating / ratingCount : 0;
         
          setRatings(allRatings);
          setAverageRating(overallAverage);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId || categories.length > 0) {
      fetchRatings();
    }
  }, [categoryId, categories]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          icon={i <= rating ? "mdi:star" : "mdi:star-outline"}
          className={i <= rating ? "text-warning" : "text-muted"}
          width="18"
        />
      );
    }
    return stars;
  };

  // Slider settings: show 3 at a time and loop infinitely if more than 3 ratings exist.
  const sliderSettings = {
    dots: true,
    infinite: ratings.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="rating-carousel-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="rating-carousel-empty text-center py-5">
        <Icon icon="mdi:star-off" width="48" className="mb-3 text-muted" />
        <h5>No ratings yet</h5>
        <p className="text-muted">Be the first to rate our courses!</p>
      </div>
    );
  }

  return (
    <div className="rating-carousel-container">
      <div className="average-rating-container text-center mb-4">
        <h3 className="text-xl font-bold">Overall Rating</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
          <span className="text-gray-500">({ratings.length} reviews)</span>
        </div>
      </div>

      {/* Add a custom class for the slider to help with CSS targeting */}
      <div className="equal-height-slider-container">
        <Slider {...sliderSettings} className="rating-slider">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-card-wrapper p-2">
              {/* Fixed height card container */}
              <div className="rating-card bg-white rounded-lg shadow-md p-4" style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
                <div className="rating-card-header d-flex align-items-start gap-3 mb-3">
                  {/* User avatar with profile image or first letter of name */}
                  <div
                    className="user-image-container flex-shrink-0"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#007bff',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {rating.userId?.profileImage ? (
                      <img
                        src={`https://usmlebackend.backendamaze.com/${rating.userId.profileImage}`}
                        alt={rating.userId?.name || 'User'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          // If image fails to load, show the first letter of the user's name
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = rating.userId.name.charAt(0).toUpperCase();
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {rating.userId?.name ? rating.userId.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                  </div>

                  <div className="user-info flex-grow">
                    <h5 className="user-name font-semibold text-gray-800 mb-1">
                      {rating.userId?.name || 'Anonymous User'}
                    </h5>
                    {/* Display course category name */}
                    <div className="category-name text-sm text-gray-600 mb-1">
                      {rating.categorycourseId?.CategoryCourse || 'Category Name'}
                    </div>
                    <div className="rating-stars d-flex">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                </div>
                
                {/* Comment section with overflow handling */}
                <div className="rating-card-body flex-grow-1 overflow-auto">
                  {rating.comment ? (
                    <p className="rating-comment text-gray-700">{rating.comment}</p>
                  ) : (
                    <p className="rating-no-comment text-gray-500 fst-italic">No comment provided</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Add some custom CSS for equal height cards */}
      <style jsx>{`
        .equal-height-slider-container .slick-track {
          display: flex !important;
        }
        .equal-height-slider-container .slick-slide {
          height: inherit !important;
          display: flex !important;
        }
        .equal-height-slider-container .slick-slide > div {
          display: flex;
          height: 100%;
          width: 100%;
        }
        .rating-card-wrapper {
          height: 100%;
          display: flex;
        }
        .rating-card {
          width: 100%;
        }
        .rating-card-body {
          max-height: 150px;
        }
      `}</style>
    </div>
  );
};

export default RatingCarousel;
