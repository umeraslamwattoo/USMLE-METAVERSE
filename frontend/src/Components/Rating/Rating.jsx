import React from 'react'
import RatingCarousel from './RatingCarousel'
import SectionHeading from '../SectionHeading/SectionHeading'

function Rating({ data ,categoryId }) {
  return (
    <div id='reviews'>
      <div className="row" >
      <div className="col-12">
        <SectionHeading
          title="What Our Students Say"
          subTitle="Read testimonials from our students"
        />
        <RatingCarousel categoryId={categoryId} />
      </div>
    </div>
    </div>
  )
}

export default Rating;