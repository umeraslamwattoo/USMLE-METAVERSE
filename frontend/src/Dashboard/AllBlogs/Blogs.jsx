import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null); // For modal view
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");


  const filteredBlogs = blogs.filter(blog => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blog.title.toLowerCase().includes(searchLower) ||
      blog.category.toLowerCase().includes(searchLower)
    );
  });
  useEffect(() => {
    // Check if admin is logged in by verifying session storage
    const adminId = sessionStorage.getItem("_id");
    const adminName = sessionStorage.getItem("name");
    if (!adminId || !adminName) {
      navigate("/admin-login");
      return;
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://usmlebackend.backendamaze.com/posts");
      if (response.data.success) {
        // Sort blogs by date, newest first
        const sortedBlogs = response.data.posts.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
      }
    } catch (error) {
      setError("Failed to fetch blogs");
      toast.error('Failed to fetch blogs', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/update-blog/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;

      const response = await axios.delete(`https://usmlebackend.backendamaze.com/posts/${id}`);
      if (response.data.success) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success('Post deleted successfully', {
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
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error('Failed to delete post', {
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

  // Open modal with full blog details
  const openModal = (blog) => {
    setSelectedBlog(blog);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBlog(null);
  };

  // Skeleton card component for loading state
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center animate-pulse">
      <div className="w-48 h-32 flex-shrink-0 bg-gray-300 rounded-lg"></div>
      <div className="flex-1 px-6">
        <div className="mb-1">
          <div className="inline-block bg-gray-300 text-gray-300 text-xs px-2 py-1 rounded-full w-20 h-4"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="p-2 bg-gray-300 rounded-full w-8 h-8"></div>
        <div className="p-2 bg-gray-300 rounded-full w-8 h-8"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="main-Content space-y-4">
        <div className="create-post-container">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="main-Content">{error}</div>;
  }

  return (
    <div className="main-Content">
     <div className="flex justify-between items-center mb-6">
  <h4 className="text-2xl font-bold text-gray-800">Manage Blogs</h4>
  
  <div className="relative">
    <input
      type="text"
      placeholder="Search blogs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
    />
  </div>
</div>
      <div className="create-post-container">
        <div className="p-6">
        <div className="grid gap-4">
        {filteredBlogs.map((blog) => {
              const plainText = blog.content.replace(/<[^>]+>/g, " ");
              const preview = plainText.split(/\s+/).slice(0, 10).join(" ") + "...";

              return (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md p-4 grid grid-cols-[minmax(100px,150px)_1fr_auto] gap-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => openModal(blog)}
                >
                  {/* Image Section */}
                  <div className="w-full h-32">
                    <img
                      src={`https://usmlebackend.backendamaze.com/${blog.image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="min-w-0">
                    <div className="mb-1">
                      <span className="inline-block badge bg-primary text-xs px-2 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                      {blog.title}
                    </h3>
                    <div className="text-gray-600 mb-2 line-clamp-2">
                      {preview}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="truncate">
                        Author: {blog.authorId?.name || "Unknown Author"}
                      </span>
                      <span>
                        Date: {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(blog._id);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 transition-colors duration-200"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(blog._id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* Bootstrap Modal for full blog view */}
      {selectedBlog && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h2
                    className="modal-title"
                    style={{ fontWeight: "bold", fontSize: "20px" }}
                  >
                    {selectedBlog.title}
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={`https://usmlebackend.backendamaze.com/${selectedBlog.image}`}
                    alt={selectedBlog.title} style={{ height: "400px", width: "100%" }}
                    className="img-fluid rounded mb-3"
                  />
                  <span className="badge bg-primary">{selectedBlog.category}</span>
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  ></div>
                </div>
                <div className="modal-footer">
                  <div className="me-auto text-muted">
                    Author: {selectedBlog.authorId?.name || "Unknown Author"} | Date:{" "}
                    {new Date(selectedBlog.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default Blogs;
