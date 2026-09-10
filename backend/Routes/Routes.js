const express = require('express');
const upload = require('../upload'); 
const router = express.Router();
const AdminController = require('../Controllers/AdminController');
const UserController = require('../Controllers/UserController');
const CategoryBlogControoler = require('../Controllers/CategoryBlogControoler');
const PostController = require('../Controllers/PostController');
const CategoryCourseController = require('../Controllers/CategoryCourseController');
const CourseController = require('../Controllers/CourseControoller');
const Payment = require('../Controllers/PaymentController');
const FreevidioController = require('../Controllers/FreevidioController'); 
const RatingController = require('../Controllers/RatingController');

//user routes login and register
router.post('/user/register', UserController.registerUser);
router.post('/user/login', UserController.loginUser);
//users routes CRUD operations 
router.get('/users', UserController.getUsers);
router.delete('/users/:id', UserController.deleteUser);
router.post('/user/change-password', UserController.changePassword);
router.put('/user/update/:id', UserController.updateUser);
router.get('/stripe/payments/:userId', Payment.getPaymentsByUser);
router.put('/user/toggle-access/:id', UserController.toggleAccess);
router.post('/user/profile-image/:id', upload.single('profileImage'), UserController.updateProfileImage);
router.delete('/user/profile-image/:id', UserController.removeProfileImage);
//Admin routes login and register
router.post('/admin/register', AdminController.registerAdmin);
router.post('/admin/login', AdminController.loginAdmin);
// Admin routes CRUD operations
router.get('/admin/:id', AdminController.getAdminById);
router.put('/admin/:id', AdminController.updateAdmin);

// Blog category routes CRUD operations
router.post('/category/blog', CategoryBlogControoler.createCategoryBlog);
router.get('/category/blog', CategoryBlogControoler.getCategoryBlogs);
router.delete('/category/blog/:id', CategoryBlogControoler.deleteCategoryBlog);

// Course category routes CRUD operations
router.post('/category/course', CategoryCourseController.createCategoryCourse);
router.get('/category/course', CategoryCourseController.getCategoryCourses);
router.put('/category/course/:id', CategoryCourseController.updateCategoryCourse);
router.delete('/category/course/:id', CategoryCourseController.deleteCategoryCourse);
router.get('/category/course/:id', CategoryCourseController.getCategoryById);

//post routes  CRUD operations
router.post('/posts', upload.single('image'), PostController.createPost);
router.get('/posts', PostController.getPosts);
router.get('/posts/:id', PostController.getPostById);
router.put('/posts/:id', upload.single('image'), PostController.updatePost);
router.delete('/posts/:id', PostController.deletePost);

// course routes CRUD operations
router.post('/courses', upload.single('coursevideo'), CourseController.uplodecourse);
router.get('/courses', CourseController.getallcourses);
router.delete('/courses/:id', CourseController.deleteCourse);
router.get('/courses/:id', CourseController.getCourseById);
router.put('/courses/:id', upload.single('coursevideo'), CourseController.updateCourse);

//payment routes 
router.get('/check-payment/:userId/:categoryId', Payment.checkCategoryPayment);
router.post('/stripe/create-payment-intent', Payment.createPaymentIntent);
router.post('/stripe/capture', Payment.captureStripePayment);
// PayPal endpoints
router.post('/paypal/create-order', Payment.createPaypalOrder);
router.post('/paypal/capture', Payment.capturePaypalOrder);


// Free video routes CRUD operations
router.post('/free-videos', upload.single('Freevidiovideo'), FreevidioController.createFreeVideo);
router.get('/free-videos', FreevidioController.getAllFreeVideos);
router.delete('/free-videos/:id', FreevidioController.deleteFreeVideo);


// Rating routes CRUD operations
router.post('/ratings', RatingController.createRating);
router.delete('/ratings/:ratingId', RatingController.deleteRating);
router.get('/ratings/course/:categorycourseId', RatingController.getRatings);
router.get('/user/:userId', RatingController.getRatingsByUser);


module.exports = router;
