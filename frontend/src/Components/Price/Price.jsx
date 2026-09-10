import React from 'react';
import { useNavigate } from 'react-router-dom';

const Price = ({ CategoryCourse, CategoryCoursePrice, videoCount, categoryId }) => {
  const navigate = useNavigate();

  // Buy Now handler with authentication check
  const handleBuyNow = () => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
      // If not logged in, redirect to login/signup page
      navigate('/login-signup');
    } else {
      // If logged in, navigate to the Buy page with the categoryId
      navigate(`/buy-category/users/${categoryId}`);
    }
  };

  return (
    <div className="st-pricing-table st-style1">
      <div className="st-pricing-head">
        <h2 className="st-price">${CategoryCoursePrice}</h2>
        <img src="/shape/price-shape.svg" alt="shape" className="st-pricing-head-shape" />
      </div>
      <div className="st-pricing-feature">
        <h1 className="st-pricing-feature-title" style={{ fontSize: '30px', fontWeight: '500', lineHeight: '50px' }}>
          {CategoryCourse}
        </h1>
        <h1 className="st-pricing-feature-title" style={{ fontSize: '25px', fontWeight: '500', lineHeight: '50px' }}>
          Videos: {videoCount}
        </h1>
        <div className="st-pricing-btn">
          <button onClick={handleBuyNow} className="st-btn st-style2 st-color1 st-size-medium">Buy Now</button>
        </div>
        <div className="st-height-b30 st-height-lg-b30" />
      </div>
    </div>
  );
};

export default Price;
