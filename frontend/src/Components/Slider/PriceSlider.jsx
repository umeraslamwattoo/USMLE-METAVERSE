import React, { useState, useEffect } from 'react';
import SectionHeading from '../SectionHeading/SectionHeading';
import Slider from 'react-slick';
import { Icon } from '@iconify/react';
import Price from '../Price/Price';

const PriceSlider = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoryResponse = await fetch('https://usmlebackend.backendamaze.com/category/course');
      const categoryData = await categoryResponse.json();
      
      // Fetch courses
      const coursesResponse = await fetch('https://usmlebackend.backendamaze.com/courses');
      const coursesData = await coursesResponse.json();
      
      if (categoryData.success && coursesData.success) {
        const categoriesWithCounts = categoryData.categories.map(category => {
          const count = coursesData.courses.filter(
            course => course.category._id === category._id
          ).length;
          
          return {
            ...category,
            videoCount: count
          };
        });
        
        setCategories(categoriesWithCounts);
        setCourses(coursesData.courses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <div 
      {...props} 
      className={'slick-arrow-left slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')}
      aria-hidden="true"
      aria-disabled={currentSlide === 0}
    >
      <Icon icon="fa-solid:angle-left" />
    </div>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <div 
      {...props} 
      className={'slick-arrow-right slick-arrow' + (currentSlide === slideCount - 1 ? ' slick-disabled' : '')}
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1}
    >
      <Icon icon="fa-solid:angle-right" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          dots: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          dots: true
        }
      }
    ]
  };

  return (
    <section id="pricing">
      <div className="st-height-b90 st-height-lg-b50"></div>
      <SectionHeading 
        title="Our Course Pricing" 
        subTitle="Choose from our available courses" 
      />
      <div className="container">
        <Slider {...settings} className='st-slider-style2 st-pricing-wrap'>
        {categories.map(category => (
  <Price 
    key={category._id}
    CategoryCourse={category.CategoryCourse} 
    CategoryCoursePrice={category.CategoryCoursePrice} 
    videoCount={category.videoCount} 
    categoryId={category._id}  // Ensure this is passed correctly
  />
))}
        </Slider>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  );
};

export default PriceSlider;
