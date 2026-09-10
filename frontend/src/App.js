import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import './Dashboard/CSS/AdminStyle.css'
import Home from "./Pages/Home";
import Layout from "./Components/Layout/Layout";
import PageNotFound from "./Components/404/PageNotFound";
import Users from "./Dashboard/AllUsers/Users";
import Courses from "./Dashboard/AllCourses/Courses";
import UplodeCourses from "./Dashboard/UplodeCourses/UplodeCourses";
import Blogs from "./Dashboard/AllBlogs/Blogs";
import CreateBlogs from "./Dashboard/CreateBlogs/CreateBlogs";
import Layoutadmin from "./Dashboard/Layoutadmin/Layoutadmin";
import BackgroundImage from "./Dashboard/Admin/SignupSignin/BackgroundImage";
import Signin from "./Dashboard/Admin/SignupSignin/Signin";
import Signup from "./Dashboard/Admin/SignupSignin/Signup";
import Categorys from "./Dashboard/Categorys/Categorys";
import Updateblog from "./Dashboard/CreateBlogs/Updateblog";
import Showposts from "./Components/Post/Showposts";
import UpdateCourse from "./Dashboard/UplodeCourses/UpdateCourse";
import { ToastContainer } from 'react-toastify';
import MainLoginSignup from "./Components/Login/MainLoginSignup";
import CourseShow from "./Components/Gallery/CourseShow";
import { CourseProvider } from "./CourseContext";
import Buy from "./Components/BuyCategory/Buy";
import FreeVidio from "./Dashboard/UplodeCourses/FreeVidio";
import FreeVidioShow from "./Dashboard/AllCourses/FreeVidioShow";


const App = () => {
  const { pathname } = useLocation();
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/admin-login') {
      setShowSignin(true);
      setShowSignup(false);
    } else if (location.pathname === '/admin-signup') {
      setShowSignup(true);
      setShowSignin(false);
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>

      <ToastContainer />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/course-show-vidios/:id" element={<CourseShow />} />
          <Route path="/post/:id" element={<Showposts />} />
          <Route path="/buy-category/users/:categoryId" element={<Buy />} />

        </Route>
        <Route path="/login-signup" element={<MainLoginSignup />} />

        <Route path="/admin-login" element={<BackgroundImage />} />
        <Route path="/admin-signup" element={<BackgroundImage />} />

        <Route path="/dashboard" element={<Layoutadmin />}>
          <Route index element={<Blogs />} />
          <Route path="/dashboard/update-blog/:id" element={<Updateblog />} />
          <Route path="/dashboard/create/blogs" element={<CreateBlogs />} />
          <Route path="/dashboard/all/courses" element={<Courses />} />
          <Route path="/dashboard/update/course/:id" element={<UpdateCourse />} />
          <Route path="/dashboard/free-vidio" element={< FreeVidio/>} />
          <Route path="/dashboard/freevidios/show" element={< FreeVidioShow/>} />
          <Route path="/dashboard/Upload/course" element={<UplodeCourses />} />
          <Route path="/dashboard/all/users" element={<Users />} />
          <Route path="/dashboard/all/Categories" element={<Categorys />} />
        </Route>

      </Routes>
      <Signin
        show={showSignin}
        onClose={() => setShowSignin(false)}
      />
      <Signup
        show={showSignup}
        onClose={() => setShowSignup(false)}
      />

    </>
  );
};

export default App;
