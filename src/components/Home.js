import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ConnectButton from './ConnectButton';
import PostForm from './PostForm';
import PostsFeed from './PostsFeed';
import { fetchPosts } from '../utils/luksoService';
import { useUpProvider } from '../utils/upProviderContext';
import '../styles/Home.css';

const Home = () => {
  const { account, connect, disconnect, isConnecting, isGridEnvironment } = useUpProvider();
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [copied, setCopied] = useState(false);

  // Load posts when account is connected
  useEffect(() => {
    if (account) {
      loadPosts();
    } else {
      setPosts([]);
    }
  }, [account]);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    
    try {
      // Use the connect function from the UP Provider context
      await connect();
      
      // If we're still here, the connection was successful
      console.log('Successfully connected to Universal Profile');
    } catch (err) {
      console.error('Error connecting to LUKSO:', err);
      setError('Failed to connect. Please make sure you have the LUKSO Browser Extension installed.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (isGridEnvironment) {
        // If in Grid environment, use the UP Provider
        await disconnect();
      } else {
        // Otherwise just clear the local state
        setPosts([]);
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  const loadPosts = async () => {
    if (!account) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedPosts = await fetchPosts(account);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchAddress && searchAddress.trim()) {
      // Use React Router history to navigate instead of direct URL manipulation
      history.push(`/profile/${searchAddress.trim()}`);
    }
  };

  return (
    <div className="home">
      <header className="app-header">
        <h1 className="app-title">UP Micro-Blog</h1>
        <p className="app-subtitle">Share your thoughts on LUKSO's The Grid</p>
        <ConnectButton 
          account={account}
          connecting={connecting}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          error={error}
        />
      </header>
      
      <div className="profile-search">
        <h3>Search Universal Profiles</h3>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text" 
            placeholder="Enter Universal Profile address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">View Profile</button>
        </form>
      </div>

      {account && (
        <>
          <div className="profile-info">
            <p>Connected Universal Profile:</p>
            <p className="address">{account}</p>
            <div className="profile-actions">
              <Link to={`/profile/${account}`} className="view-profile-link">
                View Public Profile Page
              </Link>
              
              <div className="embed-container">
                <button 
                  className={`embed-button ${copied ? 'copied' : ''}`}
                  onClick={() => {
                    const profileUrl = `${window.location.origin}${window.location.pathname}#/profile/${account}`;
                    navigator.clipboard.writeText(profileUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 3000);
                  }}
                >
                  {copied ? 'URL Copied!' : 'Copy URL for The Grid'}
                </button>
                <p className="embed-info">Copy this URL to embed in LUKSO's The Grid</p>
              </div>
            </div>
          </div>
          
          <PostForm account={account} onPostSuccess={loadPosts} />
          
          <PostsFeed 
            posts={posts} 
            loading={loading} 
            error={error} 
            onRefresh={loadPosts} 
          />
        </>
      )}

      {!account && (
        <div className="browse-profiles">
          <h3>Browse Profiles</h3>
          <p>You can view any Universal Profile's microblog posts without connecting:</p>
          <Link to="/profile" className="browse-profiles-button">
            Browse Profiles
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
