import React from 'react';
import Slider from 'react-slick';

const HeroSlider = ({ data }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000, 
    arrows: false
  }
  return (
    <Slider {...settings} className='st-slider-style1 st-hero-slider1'>
      {
        data.map((element, index) => (
          <div className="st-hero-img" key={index}>
            <img src={element.img} alt={element.img} />
          </div>
        ))
      }
    </Slider>
  )
}

export default HeroSlider;
