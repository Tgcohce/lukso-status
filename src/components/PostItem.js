import React from 'react';

const PostItem = ({ post }) => {
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="post-item">
      {post.author && (
        <p className="post-author">Posted by: {formatAddress(post.author)}</p>
      )}
      <p className="post-text">{post.text}</p>
      <p className="post-timestamp">{formatDate(post.timestamp)}</p>
    </div>
  );
};

export default PostItem;
