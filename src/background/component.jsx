import React, { useEffect, useState } from 'react';
import './component.css';

const WeatherBackgroundApp = ({ weatherData }) => {
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    if (weatherData && weatherData.weather) {
      // Determine day or night based on sunrise and sunset times
      const currentTime = new Date().getTime() / 1000; // convert to seconds
      const isDayTime = weatherData.sunrise && weatherData.sunset 
        ? currentTime >= weatherData.sunrise && currentTime <= weatherData.sunset
        : true; // Default to daytime if no sunrise/sunset data
      
      setIsDaytime(isDayTime);
      
      // Set background based on weather condition and time of day
      const weatherMain = weatherData.weather;
      setBackgroundStyle(getWeatherBackgroundStyle(weatherMain, isDayTime));
    }
  }, [weatherData]);

  const getWeatherBackgroundStyle = (weatherMain, isDaytime) => {
    const dayStyles = {
      'Clear': { 
        background: 'linear-gradient(180deg, #87CEEB, #E0F6FF, #87CEEB)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'black'
      },
      'Clouds': { 
        background: 'linear-gradient(160deg, #B0C4DE, #A9A9A9, #778899)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white' 
      },
      'Rain': { 
        background: 'linear-gradient(160deg, #6495ED, #4682B4, #5F9EA0)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white' 
      },
      'Snow': { 
        background: 'linear-gradient(160deg, #F0F8FF, #B0E0E6, #E6E6FA)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'black' 
      },
      'Thunderstorm': { 
        background: 'linear-gradient(160deg, #4682B4, #483D8B, #5F9EA0)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white' 
      },
      'Drizzle': { 
        background: 'linear-gradient(160deg, #87CEFA, #B0C4DE, #4682B4)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white' 
      },
      'default': { 
        background: 'linear-gradient(160deg, #87CEFA, #4169E1, #1E90FF)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white' 
      }
    };

    const nightStyles = {
      'Clear': {
        background: 'radial-gradient(circle at center, #1a1121 0%, #0d1a2b 100%)',
        backgroundSize: '100% 100%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      },
      'Clouds': {
        background: 'linear-gradient(160deg, #2F4F4F, #708090, #474747)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      },
      'Rain': {
        background: 'linear-gradient(160deg, #000033, #191970, #00004D)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      },
      'Snow': {
        background: 'linear-gradient(160deg, #E6E6E6, #D3D3D3, #A9A9A9)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'black'
      },
      'Thunderstorm': {
        background: 'linear-gradient(160deg, #000000, #2F4F4F, #191970)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      },
      'Drizzle': {
        background: 'linear-gradient(160deg, #00008B, #191970, #000033)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      },
      'default': {
        background: 'linear-gradient(160deg, #000033, #191970, #00004D)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white'
      }
    };

    return isDaytime 
      ? (dayStyles[weatherMain] || dayStyles['default'])
      : (nightStyles[weatherMain] || nightStyles['default']);
  };

  return (
    <div 
      className={`weather-background ${!isDaytime && weatherData?.weather === 'Clear' ? 'clear-stars' : ''}`}
      style={{
        ...backgroundStyle,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
};

export default WeatherBackgroundApp;