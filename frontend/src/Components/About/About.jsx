import React from 'react';
import parse from 'html-react-parser';
import SectionHeading from '../SectionHeading/SectionHeading';
const About = ({ data }) => {
  const { title, subTitle, avater } = data;

  return (
    <section className="st-about-wrap" id='about'>
      <div className="st-shape-bg">
        <img src="/shape/about-bg-shape.svg" alt="/shape/about-bg-shape.svg" />
      </div>
      <div className="st-height-b120 st-height-lg-b50" />

      <SectionHeading
        title="Who We Are"
        subTitle="  "
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="st-vertical-middle">
              <div className="st-vertical-middle-in">
                <div className="st-text-block st-style1">
                  <div className="st-height-b20 st-height-lg-b20" />
                  <div className="st-text-block-text">
                    <p className='font-semibold w-[70%] mx-auto'>{parse(subTitle)}</p>
                  </div>
                  <div className="st-height-b25 st-height-lg-b25" />
                  <div className="st-text-block-avatar">
                    <div className="st-avatar-info">
                      <h4 className="st-avatar-name">{avater.name}</h4>
                      <div className="st-avatar-designation">{avater.designation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="st-height-b0 st-height-lg-b30" />
          </div>
        </div>
       
      
      </div>
    </section>
  )
}

export default About;
