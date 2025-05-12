import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { fetchPosts } from '../utils/luksoService';
import PostsFeed from './PostsFeed';
import { useUpProvider } from '../utils/upProviderContext';
import '../styles/ProfileViewer.css';

const ProfileViewer = () => {
  const { address } = useParams();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileAddress, setProfileAddress] = useState(address);

  // Effect to load posts when address changes in URL or state
  useEffect(() => {
    if (address && address !== profileAddress) {
      setProfileAddress(address);
    }
    
    if (profileAddress) {
      loadProfilePosts(profileAddress);
    }
  }, [address, profileAddress]);

  const loadProfilePosts = async (address) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedPosts = await fetchPosts(address);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error loading profile posts:', err);
      setError('Failed to load posts from this profile. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const formAddress = e.target.elements.profileAddress.value.trim();
    if (formAddress) {
      // Use React Router history to navigate
      history.push(`/profile/${formAddress}`);
      // The address will be updated via the useEffect when the URL changes
    }
  };

  return (
    <div className="profile-viewer">
      <div className="profile-viewer-header">
        <h2>Universal Profile Microblog</h2>
        <Link to="/app" className="home-link">Back to Home</Link>
      </div>

      <form className="profile-address-form" onSubmit={handleAddressSubmit}>
        <input 
          type="text" 
          name="profileAddress" 
          placeholder="Enter Universal Profile address" 
          defaultValue={profileAddress}
          className="profile-address-input"
        />
        <button type="submit" className="view-profile-button">View Profile</button>
      </form>

      {profileAddress && (
        <div className="profile-info-card">
          <div className="profile-avatar">
            {profileAddress.substring(2, 4).toUpperCase()}
          </div>
          <div className="profile-details">
            <h3>Universal Profile</h3>
            <div className="profile-address">{profileAddress}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="posts-container">
          <h3 className="posts-header">Posts from this Universal Profile</h3>
          {posts.length > 0 ? (
            <PostsFeed posts={posts} onRefresh={() => loadProfilePosts(profileAddress)} />
          ) : (
            <p className="no-posts-message">No posts found for this profile.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileViewer;
