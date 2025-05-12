import React from 'react';
import PostItem from './PostItem';

const PostsFeed = ({ posts, loading, error, onRefresh }) => {
  if (loading) {
    return <div className="loading-message">Loading posts from your Universal Profile...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button className="post-button" onClick={onRefresh}>Try Again</button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="empty-message">No posts yet. Be the first to share an update!</div>;
  }

  return (
    <div className="posts-feed">
      <h2 className="feed-title">Your Updates</h2>
      {posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </div>
  );
};

export default PostsFeed;
