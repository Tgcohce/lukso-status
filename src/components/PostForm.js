import React, { useState } from 'react';
import { createPost } from '../utils/luksoService';
import { useUpProvider } from '../utils/upProviderContext';

const MAX_CHARS = 280;

const PostForm = ({ account, onPostSuccess }) => {
  const [postText, setPostText] = useState('');
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleTextChange = (e) => {
    // Limit input to MAX_CHARS
    if (e.target.value.length <= MAX_CHARS) {
      setPostText(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postText.trim() || !account) return;
    
    setStatus('loading');
    setStatusMessage('Posting to your Universal Profile...');
    
    try {
      await createPost(account, postText.trim());
      setStatus('success');
      setStatusMessage('Post successfully stored on your Universal Profile!');
      setPostText('');
      
      // Notify parent component to refresh posts
      if (onPostSuccess) {
        onPostSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        if (status === 'success') {
          setStatus(null);
          setStatusMessage('');
        }
      }, 3000);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setStatus('error');
      setStatusMessage('Failed to store post. Please try again.');
    }
  };

  const remainingChars = MAX_CHARS - postText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <textarea
          className="post-textarea"
          value={postText}
          onChange={handleTextChange}
          placeholder="What's on your mind?"
          disabled={!account || status === 'loading'}
        />
        
        <div className={`char-counter ${remainingChars < 20 ? 'limit' : ''}`}>
          {remainingChars} characters remaining
        </div>
        
        {status && (
          <div className={`status-message ${status}`}>
            {statusMessage}
          </div>
        )}
        
        <button 
          type="submit" 
          className="post-button"
          disabled={!account || !postText.trim() || status === 'loading' || isOverLimit}
        >
          {status === 'loading' ? 'Posting...' : 'Post Update'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
