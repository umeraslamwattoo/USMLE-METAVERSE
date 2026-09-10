import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Categorys() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [courseCategoryName, setCourseCategoryName] = useState('');
  const [courseCategoryPrice, setCourseCategoryPrice] = useState('');
  const [courseCategories, setCourseCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const adminId = sessionStorage.getItem('_id');
    const adminName = sessionStorage.getItem('name');
    if (!adminId || !adminName) {
      navigate('/admin-login');
      return;
    }
    fetchCategories();
    fetchCourseCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/category/blog');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch blog categories', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://usmlebackend.backendamaze.com/category/blog', {
        CategoryBlog: categoryName
      });
      if (response.data.success) {
        toast.success('categorie Blog created successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
        setCategoryName('');
        fetchCategories();
      } else {
       toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating category', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`https://usmlebackend.backendamaze.com/category/blog/${id}`);
      if (response.data.success) {
        fetchCategories();
        toast.success('categorie Blog deleted successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting category', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  const fetchCourseCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/category/course');
      if (response.data.success) {
        setCourseCategories(response.data.categories);
      }
    } catch (err) {
      toast.error('Failed to fetch course categories', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCourseCategory = async (e) => {
    e.preventDefault();

    if (!courseCategoryName || !courseCategoryPrice) {
      toast.error('Please fill all fields', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`https://usmlebackend.backendamaze.com/category/course/${editId}`, {
          CategoryCourse: courseCategoryName,
          CategoryCoursePrice: Number(courseCategoryPrice)
        });
      } else {
        response = await axios.post('https://usmlebackend.backendamaze.com/category/course', {
          CategoryCourse: courseCategoryName,
          CategoryCoursePrice: Number(courseCategoryPrice)
        });
      }

      if (response.data.success) {
        setCourseCategoryName('');
        setCourseCategoryPrice('');
        setIsEditing(false);
        setEditId(null);
        fetchCourseCategories();
        toast.success('course Category created successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing category', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  const handleEditClick = (category) => {
    setCourseCategoryName(category.CategoryCourse);
    setCourseCategoryPrice(category.CategoryCoursePrice);
    setIsEditing(true);
    setEditId(category._id);
  };

  const handleDeleteCourseCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await axios.delete(`https://usmlebackend.backendamaze.com/category/course/${id}`);
      if (response.data.success) {
        fetchCourseCategories();
        toast.success('course Category deleted successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting course category', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
    }
  };

  return (
    <div className="main-Content">
      <h4 className="text-2xl font-bold text-gray-800 mb-6 ml-2">Blog Category</h4>
      <div className="create-post-container">
        <div className="p-6">
          <div className="card-body">
            <Form onSubmit={handleCreateCategory}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <Button type="submit" variant="primary" className="w-100">
                      Create Category
                    </Button>
                  </Form.Group>
                </div>
              </div>
            </Form>

            <div className="mt-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <tr key={category._id}>
                          <td>{category.CategoryBlog}</td>
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No categories found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-2xl font-bold text-gray-800 mb-3 mt-3 ml-2">Course Category or Price</h4>
      <div className="create-post-container">
        <div className="p-6">
          <div className="card-body">
            <Form onSubmit={handleSubmitCourseCategory}>
              <div className="row g-3">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={courseCategoryName}
                      onChange={(e) => setCourseCategoryName(e.target.value)}
                      placeholder="Enter course category name"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type="number"
                      value={courseCategoryPrice}
                      onChange={(e) => setCourseCategoryPrice(e.target.value)}
                      placeholder="Enter price"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Button type="submit" variant="primary" >
                      {isEditing ? 'Update Category' : 'Create Category'}
                    </Button>
                  </Form.Group>
                </div>
                {isEditing && (
                  <div className="col-md-2">
                    <Form.Group>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-100"
                        onClick={() => {
                          setIsEditing(false);
                          setEditId(null);
                          setCourseCategoryName('');
                          setCourseCategoryPrice('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Form.Group>
                  </div>
                )}
              </div>
            </Form>

            <div className="mt-4">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Price ($)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseCategories.length > 0 ? (
                      courseCategories.map((category) => (
                        <tr key={category._id}>
                          <td>{category.CategoryCourse}</td>
                          <td>{category.CategoryCoursePrice}</td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditClick(category)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteCourseCategory(category._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No course categories found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categorys;
