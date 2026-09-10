import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../SectionHeading/SectionHeading';

const Post = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://usmlebackend.backendamaze.com/posts');
      const data = await response.json();
      // Get only the latest 6 posts
      const latestPosts = data.posts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setPosts(latestPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id='blog'>
      <div className="st-height-b120 st-height-lg-b80" />
      <SectionHeading
        title="Latest News"
        subTitle="For One-on-One Tutouring Two slot are available from Mid April"
      />
      <div className="container">
        <div className="row">
          {posts.map((post) => (
            <div className="col-lg-4 mt-3"  key={post._id}>
              <div className="st-post st-style3">
                <Link to={`/post/${post._id}`} className="st-post-thumb st-link-hover-wrap st-zoom">
                  <img
                    className="st-zoom-in"
                    src={`https://usmlebackend.backendamaze.com/${post.image}`}
                    alt={post.title} style={{height: '220px'}}
                  />
                  <span className="st-link-hover">
                    <i><Icon icon="fa6-solid:link" /></i>
                  </span>
                </Link>
                <div className="st-post-info">
                  <h2 className="st-post-title">
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                  </h2>
                  <div className="st-post-meta">
                    <span className="st-post-date">{formatDate(post.createdAt)}</span>
                    <span>
                      Posted by:
                      <Link className="st-post-avatar">
                        <span className="st-post-avatar-text">
                          {post.authorId?.name || 'Anonymous'}
                        </span>
                      </Link>
                    </span>
                  </div>
                  <div
                    className="st-post-text"
                    dangerouslySetInnerHTML={{
                      __html: truncateContent(post.content)
                    }}
                  />

                </div>
                <div className="st-post-footer">
                  <Link to={`/post/${post._id}`} className="st-btn st-style2 st-color1 st-size-medium">
                    Read More
                  </Link>
                </div>
              </div>
              <div className="st-height-b0 st-height-lg-b30" />
            </div>
          ))}
        </div>
      </div>
      <div className="st-height-b120 st-height-lg-b80" />
    </section>
  );
};

export default Post;
