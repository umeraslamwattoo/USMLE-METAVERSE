import React, { useState, useEffect } from 'react';
import SectionHeading from '../SectionHeading/SectionHeading';
import { Icon } from '@iconify/react';
import Masonry from 'react-masonry-css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MasonryGallery = () => {
  const [active, setActive] = useState('all');
  const [itemShow, setItemShow] = useState(12);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    const userData = sessionStorage.getItem('userData');
    
    if (!userData) {

      navigate('/login-signup');
      toast.error('Please login to view course details', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    navigate(`/course-show-vidios/${courseId}`);
    window.scrollTo(0, 0);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://usmlebackend.backendamaze.com/category/course');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories', {
        position: "top-right",
        theme: "dark"
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('https://usmlebackend.backendamaze.com/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses', {
        position: "top-right",
        theme: "dark"
      });
    }
  };

  const breakPointColumns = {
    default: 3,
    1199: 2,
    767: 1,
  };

  return (
    <section id="gallery">
      <div className="st-height-b120 st-height-lg-b80" />
      <div className="container">
        <SectionHeading
          title="View our Courses"
          subTitle="Browse through our video courses collection"
        />
      </div>
      <div className="container">
        <div className="st-portfolio-wrapper">
          <div className="st-isotop-filter st-style1 text-center">
            <ul className="st-mp0">
              <li className={active === 'all' ? 'active' : ''}>
                <span onClick={() => setActive('all')}>All</span>
              </li>
              {categories.map((item, index) => (
                <li
                  className={active === item.CategoryCourse ? 'active' : ''}
                  key={index}
                >
                  <span onClick={() => setActive(item.CategoryCourse)}>
                    {item.CategoryCourse}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Masonry
            className="st-isotop st-style1 st-has-gutter st-lightgallery my-masonry-grid"
            breakpointCols={breakPointColumns}
          >
            {courses.slice(0, itemShow).map((course, index) => (
              <div
                key={index}
                className={`st-isotop-item ${
                  active === 'all'
                    ? ''
                    : !(active === course.category.CategoryCourse)
                    ? 'd-none'
                    : ''
                }`}
              >
                <div
                  className="st-project st-zoom st-lightbox-item st-link-hover-wrap"
                  onClick={() => handleCourseClick(course._id)}
                >
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
                      onTimeUpdate={(e) => {
                        if (e.target.currentTime >= 20) {
                          e.target.currentTime = 0;
                        }
                      }}
                    />
                  </div>
                  <span className="st-link-hover">
                    <i><Icon icon="fa-solid:play" /></i>
                  </span>
                </div>
              </div>
            ))}
          </Masonry>

          <div className="text-center">
            {courses.length > itemShow && (
              <>
                <div className="st-height-b65 st-height-lg-b40" />
                <span
                  className="st-btn st-style1 st-color1 st-size-medium st-flex-center st-gap-x-5"
                  onClick={() => setItemShow(itemShow + 4)}
                >
                  <span>Load More</span>
                  <Icon icon="bi:arrow-right" />
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  );
};

export default MasonryGallery;
