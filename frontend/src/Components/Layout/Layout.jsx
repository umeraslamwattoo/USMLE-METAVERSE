import React, { useEffect, useState } from 'react'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Preloader from '../../Preloader/Preloader'

const headerData = {
  "logo": "/images/logo.png"
}

const footerData = {
  "logo": "/images/footer-logo.png",
  "bgImg": "/images/footer-bg.png",
  "subTitle": " We simplify complex concepts, ensuring clarity and guiding you toward becoming a confident, skilled physician.",
}
const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);


  return (
    <>
      {
        isLoading ? <Preloader /> : (
          <>
            <Header data={headerData}/>
            <Outlet />
            <Footer data={footerData}/>
          </>
        )
      }
    </>
  )
}

export default Layout;
