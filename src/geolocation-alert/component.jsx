import React from 'react';
import './component.css';

const GeolocationAlert = ({ onClose }) => {
  return (
    <div className="geolocation-alert-container">
      <div className="geolocation-alert-card">
        <div className="geolocation-alert-header">
          <div className="geolocation-alert-icon-wrapper">
            <svg className="geolocation-alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="geolocation-alert-title-wrapper">
            <h3 className="geolocation-alert-title">Location Access</h3>
          </div>
        </div>
        
        <div className="geolocation-alert-content">
          <p className="geolocation-alert-message">
            To show your local weather, we need access to your location. Please enable location services for this website in your browser settings.
          </p>
          
          <div className="geolocation-alert-buttons">
            <button 
              onClick={onClose} 
              className="geolocation-alert-button geolocation-alert-button-secondary"
            >
              Maybe Later
            </button>
            <button 
              onClick={() => window.open('https://support.google.com/chrome/answer/142065', '_blank')}
              className="geolocation-alert-button geolocation-alert-button-primary"
            >
              How to Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeolocationAlert;