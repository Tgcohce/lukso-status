import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/GridLanding.css';

const GridLanding = () => {

  return (
    <div className="grid-landing">
      <div className="landing-container">
        <div className="landing-header">
          <div className="logo-container">
            <span className="logo-icon">📝</span>
            <h1>UP Micro-Blog</h1>
          </div>
          <p className="tagline">Share your thoughts on the LUKSO blockchain</p>
        </div>

        <div className="landing-content">
          <div className="feature-section">
            <div className="feature">
              <div className="feature-icon">💬</div>
              <h3>Post Updates</h3>
              <p>Share short text updates stored directly on your Universal Profile</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔍</div>
              <h3>Discover Profiles</h3>
              <p>Search and view posts from any Universal Profile on the network</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>On-Chain Storage</h3>
              <p>All data stored using LSP0 ERC725Account standard</p>
            </div>
          </div>

          <div className="embed-section">
            <h2>Add to Your Grid</h2>
            <p>Connect your Universal Profile to get a shareable URL for The Grid</p>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <p>Launch the app and connect your Universal Profile</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Copy your personalized URL for The Grid</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Add it to your Universal Profile on The Grid</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <Link to="/app" className="cta-button">
              Launch App
            </Link>
          </div>
        </div>

        <div className="landing-footer">
          <p>Built for LUKSO's Nexus Hackathon</p>
          <div className="tech-stack">
            <span>React</span>
            <span>LSP0</span>
            <span>ERC725Y</span>
            <span>UP Provider</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridLanding;
