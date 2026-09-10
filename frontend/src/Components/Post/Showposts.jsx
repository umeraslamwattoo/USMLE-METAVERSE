import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Showposts() {
    const [post, setPost] = useState(null);
    const [sameCategoryPosts, setSameCategoryPosts] = useState([]);
    const [otherCategoryPosts, setOtherCategoryPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    useEffect(() => {
        if (post) {
            fetchRelatedPosts();
        }
    }, [post]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`https://usmlebackend.backendamaze.com/posts/${id}`);
            const data = await response.json();
            setPost(data.post);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    const fetchRelatedPosts = async () => {
        try {
            const response = await fetch("https://usmlebackend.backendamaze.com/posts");
            const data = await response.json();

            // Filter out current post
            const otherPosts = data.posts.filter(p => p._id !== id);

            // Get same category posts (newest 5)
            const sameCategory = otherPosts
                .filter(p => p.category === post.category)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            // Get other category posts
            const otherCategory = otherPosts.filter(p => p.category !== post.category);

            setSameCategoryPosts(sameCategory);
            setOtherCategoryPosts(otherCategory);
        } catch (error) {
            console.error("Error fetching related posts:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (!post) return <div className="text-center my-5">Loading...</div>;

    return (
        <div className="container" style={{ marginTop: "100px" }}>
            <div className="row">
                {/* Main Post Content */}
                <div className="col-lg-8">
                    <div className="card border-0 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <p style={{ fontWeight: "bold" }} className="card-text text-muted mt-3 mb-4">
                                    Posted By- {post.authorId?.name || "Anonymous"} | {formatDate(post.createdAt)}
                                </p>
                            </div>
                            <div className="badge bg-primary mb-3">{post.category}</div>
                        </div>
                        <img
                            src={`https://usmlebackend.backendamaze.com/${post.image}`}
                            alt={post.title}
                            className="card-img-top"
                            style={{ height: "500px", borderRadius: "20px" }}
                        />
                        <div className="card-body">
                            <h2 className="card-title mb-3 mt-3 text-dark" style={{ fontWeight: "bold", fontSize: "20px" }}>{post.title}</h2>
                            <div className="card-text text-dark" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Same Category Recent Posts */}
                <div className="col-lg-4">
                    {sameCategoryPosts.length > 0 && (
                        <div className="p-3 shadow-sm bg-white rounded">
                            <h4 className="mb-4 text-dark">Latest in {post.category}</h4>
                            {sameCategoryPosts.map((p) => (
                                <Link key={p._id} to={`/post/${p._id}`} className="d-flex text-decoration-none align-items-center mb-3">
                                    <img
                                        src={`https://usmlebackend.backendamaze.com/${p.image}`}
                                        alt={p.title}
                                        style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                                        className="me-3"
                                    />
                                    <div>
                                        <h6 className="mb-0 text-dark">{p.title}</h6>
                                        <small className="text-muted">{formatDate(p.createdAt)}</small>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Other Category Posts */}
            {otherCategoryPosts.length > 0 && (
  <div className="mt-5 mb-5">
    <h1 className="mb-4 text-2xl font-bold">Other Posts</h1>
    <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
      {otherCategoryPosts.map((p) => (
        <div className="col" key={p._id}>
          <div className="card h-100 border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <Link to={`/post/${p._id}`} className="overflow-hidden block">
              <img
                src={`https://usmlebackend.backendamaze.com/${p.image}`}
                alt={p.title}
                className="card-img-top transform hover:scale-105 transition-transform duration-500"
                style={{
                  height: "250px",
                  objectFit: "cover",
                  width: "100%"
                }}
              />
            </Link>
            <div className="card-body p-4 d-flex flex-column">
              <div className="badge bg-primary mb-2 text-xs px-3 py-1 rounded-full">
                {p.category}
              </div>
              <h5 className="card-title mb-3">
                <Link
                  to={`/post/${p._id}`}
                  className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                >
                  {p.title}
                </Link>
              </h5>
              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="text-sm text-gray-700">
                  {p.authorId?.name || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(p.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


        </div>
    );
}

export default Showposts;
