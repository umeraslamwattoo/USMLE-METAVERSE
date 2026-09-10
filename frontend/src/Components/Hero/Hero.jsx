import { React, useEffect, useState } from 'react';
import Social from '../Social/Social';
import HeroSlider from '../Slider/HeroSlider';
import { Link as ScrollLink } from 'react-scroll';
import TextTransition, { presets } from 'react-text-transition';


 const Hero = ({ data }) => {
  const bgImg = data.bgImg;
  const bgShape = data.bgShape;
  const sliderImages = data.sliderImages;
  const title = data.title; 

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(
      () => setIndex(index => index + 1),
      3000, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  return (
    <div
      id="home"
      className="st-hero-wrap st-gray-bg st-dynamic-bg overflow-hidden st-fixed-bg"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="st-hero st-style1">
        <div className="container">
          <div className="st-hero-text">
            <div className="st-height-b20 st-height-lg-b40" />
            <h1 className="st-hero-title cd-headline slide">
            Master USMLE with<br/> Evidence-Based Strategies
              <br/>
            <span className="cd-words-wrapper">
                <TextTransition springConfig={presets.wobbly}>
                  <span className="st-transition-title">
                    {title[index % title.length]}
                  </span>
                </TextTransition>
              </span>
            </h1>
            <div className="st-hero-subtitle">
            We simplify complex concepts, ensuring clarity and guiding you toward <br/>becoming a confident, skilled physician.
            </div>
          </div>
        </div>
        <div className="st-hero-social-group">
          <div className="container">
            <Social />
          </div>
        </div>
      </div>
      <HeroSlider data={sliderImages} />
      <div className="st-hero-shape">
        <img src={bgShape} alt={bgShape} />
      </div>
    </div>
  );
};

export default Hero;
