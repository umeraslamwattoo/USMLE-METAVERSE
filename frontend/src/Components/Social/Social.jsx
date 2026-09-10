import { Icon } from '@iconify/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Social = () => {
  const phoneNumber = '15712538815'; // Remove spaces and special characters
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <ul className="st-social-btn st-style1 st-mp0">
      <li>
        <Link to='https://www.facebook.com/nasir.nasirmehmmod' target='_blank' >
          <Icon icon="fa6-brands:square-facebook" style={{height:'40px', width:'40px'}}/>
        </Link>
      </li>
      <li>
        <a href={whatsappUrl} target='_blank' rel="noopener noreferrer">
          <Icon icon="fa6-brands:whatsapp-square" style={{height:'40px', width:'40px'}} />
        </a>
      </li>
      <li>
        <Link to='' target='_blank'>
          <Icon icon="fa6-brands:twitter-square" style={{height:'40px', width:'40px'}}/>
        </Link>
      </li>
    </ul>
  )
}

export default Social;
