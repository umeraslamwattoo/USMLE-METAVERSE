import React from 'react';
import Hero from '../Components/Hero/Hero';
import About from '../Components/About/About';
import PriceSlider from '../Components/Slider/PriceSlider';
import MasonryGallery from '../Components/Gallery/Gallery';
import Post from '../Components/Post/Post';
import FreeVidio from '../Components/FreeVidio/FreeVidio';
import Rating from '../Components/Rating/Rating';

const heroData = {
  bgImg: 'images/hero-bg.jpg',
  bgShape: 'shape/hero-shape.png',
  sliderImages: [
    {
      img: 'images/hero-img.png',
    },
    {
      img: 'images/hero-img1.png',
    },
    {
      img: 'images/hero-img2.png',
    },
    {
      img: 'images/hero-img.png',
    },
    {
      img: 'images/hero-img1.png',
    },
    {
      img: 'images/hero-img2.png',
    },
  ],
  title: ['STEP 1', 'STEP 2', 'STEP 3', 'Biostatistcs'],
};

const aboutData = {
  subTitle:
    'Dr. Nasir, a medical graduate of Quaid-e-Azam Medical College, Bahawalpur, has over three years of experience teaching USMLE students from various medical schools across the USA and Canada. He specializes in high-yield, evidence-based learning strategies designed for maximum retention and success <br/> <br/> Struggling with a failed attempt in STEP 1, STEP 2, or STEP 3? Our personalized, results-driven approach can help you pass your exam within just two months.',

  avater: {
    name: 'M. Nasir, M.D',
    designation: 'Founder & Director',
  },
};

const Home = () => {
  return (
    <>
      <div id="home">
        <Hero data={heroData} />
      </div>
      <div id="about">
        <About data={aboutData} />
      </div>
      <hr />
      <div id="freevidio">
        <FreeVidio />
        </div>
      <div id="gallery">
        <MasonryGallery />
      </div>
      <div id="pricing">
        <PriceSlider/>
      </div>
      <div id="blog">
        <Post />
      </div>
      <div id="reviews">
        <Rating />
      </div>
    </>
  );
};


export default Home;
