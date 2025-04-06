import React from 'react';
import './component.css';

const Weather = ({ weatherAttributes, isLoading }) => {
  const { city, country, description, temp, weather, error, icon } =
    weatherAttributes;

  const isEmpty = Object.keys(weatherAttributes).length === 0;

  const getWeatherBackground = () => {
    if (!weather) return 'default-weather';

    const weatherLower = weather.toLowerCase();

    if (weatherLower.includes('clear')) return 'clear-sky';
    if (weatherLower.includes('cloud')) return 'cloudy-sky';
    if (weatherLower.includes('rain') || weatherLower.includes('drizzle'))
      return 'rainy-sky';
    if (weatherLower.includes('thunderstorm')) return 'storm-sky';
    if (weatherLower.includes('snow')) return 'snowy-sky';
    if (weatherLower.includes('mist') || weatherLower.includes('fog'))
      return 'misty-sky';
    if (weatherLower.includes('haze') || weatherLower.includes('smoke'))
      return 'hazy-sky';

    return 'default-weather';
  };

  const getTimeBasedClass = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 20 ? 'day-time' : 'night-time';
  };

  const LoadingSpinner = () => (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );

  return (
    <>
      {!isEmpty && !error && !isLoading && (
        <div
          className={`weather-card ${getWeatherBackground()} ${getTimeBasedClass()}`}
        >
          <div className="weather-overlay"></div>
          <div className="weather-content">
            <div className="weather-location">
              <h1>{city}</h1>
              <h2>{country}</h2>
            </div>

            <div className="weather-temperature">
              <span>{parseFloat(temp).toFixed(0)}°C</span>
            </div>

            <div className="weather-details">
              <div className="weather-icon">
                <img
                  alt="weather-icon"
                  src={`http://openweathermap.org/img/w/${icon}.png`}
                />
              </div>
              <div className="weather-description">
                <h3>{weather}</h3>
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}

      {error && !isLoading && (
        <div className="error-message">
          <div className="error-icon">!</div>
          <p>City not found</p>
          <p className="error-details">Please try another location</p>
        </div>
      )}
    </>
  );
};

export default Weather;