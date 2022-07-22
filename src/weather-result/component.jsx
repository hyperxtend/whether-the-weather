import React from 'react';
import { Spinner } from 'react-bootstrap';
import './styles.css';

const Weather = ({ weatherAttributes, isLoading }) => {
  const {
    city,
    country,
    description,
    temp,
    weather,
    error,
    icon,
  } = weatherAttributes;
  const isEmpty = Object.keys(weatherAttributes).length === 0;
  return (
    <>
      {!isEmpty && !error && !isLoading && (
        <div className="weather-tile-container">
          <h4>{city}</h4>
          <p>{country}</p>
          <p>{parseFloat(temp).toFixed(0)}°C</p>
          <div className="icon-container">
            <img
              alt="weather-icon"
              className="weather-icon-image"
              src={`http://openweathermap.org/img/w/${icon}.png`}
            />
            <h5>{weather}</h5>
            <p>{description}</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="info" />
        </div>
      )}
      {error && !isLoading && (
        <div className="no-city-found">
          oops sorry, couldn't find that city{' '}
        </div>
      )}
    </>
  );
};

// Exports this file to be used in main App component
export default Weather;
