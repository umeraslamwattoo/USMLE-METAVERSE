import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaInfoCircle, FaQuestionCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [userRatings, setUserRatings] = useState([]);


  useEffect(() => {
    // Check if admin is logged in by verifying session storage
    const adminId = sessionStorage.getItem("_id");
    const adminName = sessionStorage.getItem("name");
    if (!adminId || !adminName) {
      navigate("/admin-login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };


  // Toggle functions for tooltip
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  // Toggle switch function that updates the database
  const toggleSwitch = async () => {
    const newStatus = !isToggled;
    setIsToggled(newStatus);
    try {
      const response = await axios.put(
        `https://usmlebackend.backendamaze.com/user/toggle-access/${selectedUser._id}`,
        { enableaccess: newStatus }
      );
      if (response.data.success) {
        toast.success("User access updated successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        // Update the selected user with new access status
        setSelectedUser({ ...selectedUser, enableaccess: newStatus });
      } else {
        toast.error("Failed to update user access", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating user access:", error);
      toast.error("Error updating user access", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://usmlebackend.backendamaze.com/users');
      if (response.data.success) {
        // Fetch payments for each user
        const usersWithPayments = await Promise.all(
          response.data.users.map(async (user) => {
            try {
              const paymentsResponse = await axios.get(`https://usmlebackend.backendamaze.com/stripe/payments/${user._id}`);
              return { ...user, payments: paymentsResponse.data.payments || [] };
            } catch (error) {
              return { ...user, payments: [] };
            }
          })
        );
        setUsers(usersWithPayments);
      }
    } catch (error) {
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.phoneno.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://usmlebackend.backendamaze.com/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success('User deleted successfully', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteRating = async (ratingId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this rating?');
    if (!confirmDelete) return;

    try {
      // Call the API to delete the rating
      const response = await axios.delete(`https://usmlebackend.backendamaze.com/ratings/${ratingId}`, {
        data: { userId: selectedUser._id } // Pass the userId in the request body for verification
      });

      if (response.data.success) {
        // Update the userRatings state by removing the deleted rating
        setUserRatings(userRatings.filter(rating => rating._id !== ratingId));

        toast.success('Rating deleted successfully', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error('Failed to delete rating', {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error(error.response?.data?.message || 'Error deleting rating', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  // Modify your openUserModal function to use the correct API endpoint
  const openUserModal = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsToggled(user.enableaccess);

    // Fetch user ratings - Fix the API endpoint path
    try {
      const response = await axios.get(`https://usmlebackend.backendamaze.com/user/${user._id}`);
      if (response.data.success) {
        setUserRatings(response.data.data || []);
      } else {
        setUserRatings([]);
      }
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      setUserRatings([]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Skeleton row component for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-48"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-12"></div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="main-Content mt-3">
        <div className="create-post-container">
          <div className="p-6">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="main-Content">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-gray-800">Manage Users</h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>
      <div className="create-post-container">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Add profile image here */}
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          {user.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`https://usmlebackend.backendamaze.com/${user.profileImage}`}
                              alt={user.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40?text=" + user.name.charAt(0);
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.phoneno}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button onClick={() => openUserModal(user)} className="text-blue-600 hover:text-blue-900 p-2">
                        <FaInfoCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900 p-2">
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>

      {/* User Activity Modal */}
      {showModal && selectedUser && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] shadow-2xl transform transition-all flex flex-col"
          >
            {/* Modal header - keep this fixed */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-4">
                    {selectedUser.profileImage ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        src={`https://usmlebackend.backendamaze.com/${selectedUser.profileImage}`}
                        alt={selectedUser.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64?text=" + selectedUser.name.charAt(0);
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}'s Profile</h2>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Toggle Button with Tooltip */}
                  <div className="flex items-center">
                    <button onClick={toggleSwitch} className="focus:outline-none" aria-label={isToggled ? "Disable user" : "Enable user"}>
                      {isToggled ? (
                        <FaToggleOn className="text-4xl text-blue-600" />
                      ) : (
                        <FaToggleOff className="text-4xl text-gray-400" />
                      )}
                    </button>
                    <div className="relative ml-2">
                      <FaQuestionCircle
                        className="text-gray-500 hover:text-blue-600 cursor-help"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                      {showTooltip && (
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                          Enable users to access free courses.
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal body - make this scrollable */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 100px)" }}>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-lg text-gray-700 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium">{selectedUser.phoneno}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-700">Payment History</h4>
                {selectedUser.payments?.length > 0 ? (
                  <div className="grid gap-4">
                    {selectedUser.payments.map((payment, index) => (
                      <div key={index} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-medium text-gray-800">
                              {payment.categoryId?.CategoryCourse || 'Unknown Category'}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${payment.paymentStatus === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : payment.paymentStatus === 'Failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                              {payment.paymentStatus}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Category</p>
                              <p className="font-medium">{payment.categoryId?.CategoryCourse || 'Unknown Category'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Payment Method</p>
                              <p className="font-medium">{payment.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Transaction ID</p>
                              <p className="font-medium truncate">{payment.transactionId}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2 text-gray-500">No payment history found</p>
                  </div>
                )}
              </div>

              {/* Course Ratings & Reviews Section */}
              <div className="mt-8 space-y-4">
  <h4 className="font-semibold text-lg text-gray-700">Course Ratings & Reviews</h4>
  {userRatings?.length > 0 ? (
    <div className="grid gap-4">
      {userRatings.map((rating, index) => (
        <div key={index} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h5 className="font-medium text-gray-800">
                {rating.categorycourseId?.CategoryCourse || 'Unknown Course'}
              </h5>
              <div className="flex items-center mt-1">
                <div className="flex mr-2">
                  {renderStars(rating.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-2">
                {rating.rating.toFixed(1)}
              </span>
              {/* Delete button positioned in the top right corner */}
              <button
                onClick={() => handleDeleteRating(rating._id)}
                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded-full transition-colors"
                title="Delete rating"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Comment section */}
          {rating.comment ? (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700 text-sm italic">"{rating.comment}"</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No comment provided</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <p className="mt-2 text-gray-500">This user hasn't rated any courses yet</p>
    </div>
  )}
</div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Users;
