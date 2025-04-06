import React, { useEffect, useState } from 'react';

const WeatherBackgroundApp = ({ weatherData }) => {
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [weatherIcons, setWeatherIcons] = useState([]);

  useEffect(() => {
    if (weatherData && weatherData.weather) {
      // Determine day or night based on sunrise and sunset times
      const currentTime = new Date().getTime() / 1000; // convert to seconds
      const isDayTime =
        weatherData.sunrise && weatherData.sunset
          ? currentTime >= weatherData.sunrise &&
            currentTime <= weatherData.sunset
          : true; // Default to daytime if no sunrise/sunset data

      // Set background based on weather condition and time of day
      const weatherMain = weatherData.weather;
      setBackgroundStyle(getWeatherBackgroundStyle(weatherMain, isDayTime));

      // Generate appropriate weather icons
      setWeatherIcons(generateWeatherIcons(weatherMain, isDayTime));
    }
  }, [weatherData]);

  const generateWeatherIcons = (weatherMain, isDaytime) => {
    const icons = [];

    switch (weatherMain) {
      case 'Clear':
        // For clear day, add sun rays or stars at night
        if (isDaytime) {
          icons.push({ type: 'sun', count: 1 });
        } else {
          icons.push({ type: 'stars', count: 50 });
        }
        break;
      case 'Clouds':
        icons.push({ type: 'clouds', count: 5 });
        break;
      case 'Rain':
        icons.push({ type: 'rain', count: 50 });
        break;
      case 'Snow':
        icons.push({ type: 'snow', count: 40 });
        break;
      case 'Thunderstorm':
        icons.push({ type: 'lightning', count: 3 });
        icons.push({ type: 'rain', count: 30 });
        break;
      case 'Drizzle':
        icons.push({ type: 'drizzle', count: 30 });
        break;
      default:
        break;
    }

    return icons;
  };

  const getWeatherBackgroundStyle = (weatherMain, isDaytime) => {
    // iOS-inspired color schemes
    const dayStyles = {
      Clear: {
        background: 'linear-gradient(160deg, #54C8FF, #91E2FF, #54C8FF)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: '#333333',
      },
      Clouds: {
        background: 'linear-gradient(160deg, #DCDCDC, #E8E8E8, #B8B8B8)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: '#333333',
      },
      Rain: {
        background: 'linear-gradient(160deg, #34AADC, #007AFF, #5AC8FA)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Snow: {
        background: 'linear-gradient(160deg, #F0F0F0, #D4F1F9, #E1E1E1)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: '#333333',
      },
      Thunderstorm: {
        background: 'linear-gradient(160deg, #4A4A4A, #5856D6, #34495E)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Drizzle: {
        background: 'linear-gradient(160deg, #87CEFA, #5AC8FA, #34AADC)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      default: {
        background: 'linear-gradient(160deg, #5AC8FA, #007AFF, #54C8FF)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
    };

    const nightStyles = {
      Clear: {
        background: 'linear-gradient(160deg, #1A1A2E, #16213E, #0F3460)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Clouds: {
        background: 'linear-gradient(160deg, #2C3E50, #34495E, #2C3E50)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Rain: {
        background: 'linear-gradient(160deg, #0A1931, #150E56, #0A043C)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Snow: {
        background: 'linear-gradient(160deg, #2B4865, #256D85, #2B4865)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Thunderstorm: {
        background: 'linear-gradient(160deg, #0A0A0A, #301B70, #000000)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      Drizzle: {
        background: 'linear-gradient(160deg, #151E3D, #1C2541, #151E3D)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
      default: {
        background: 'linear-gradient(160deg, #1F1D36, #3F3351, #1F1D36)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        color: 'white',
      },
    };

    return isDaytime
      ? dayStyles[weatherMain] || dayStyles['default']
      : nightStyles[weatherMain] || nightStyles['default'];
  };

  // Render different weather elements
  const renderWeatherElements = () => {
    return weatherIcons.map((iconSet, index) => {
      switch (iconSet.type) {
        case 'sun':
          return (
            <div key={`sun-${index}`} className="sun-container">
              <div className="sun" />
              <div className="sun-rays" />
            </div>
          );
        case 'stars':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ));
        case 'clouds':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`cloud-${i}`}
              className="cloud"
              style={{
                top: `${10 + Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.7 + Math.random() * 0.3,
                transform: `scale(${0.5 + Math.random() * 1.5})`,
                animationDuration: `${30 + Math.random() * 60}s`,
              }}
            />
          ));
        case 'rain':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`rain-${i}`}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 1}s`,
              }}
            />
          ));
        case 'snow':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`snow-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 8}s`,
              }}
            />
          ));
        case 'lightning':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`lightning-${i}`}
              className="lightning"
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ));
        case 'drizzle':
          return Array.from({ length: iconSet.count }).map((_, i) => (
            <div
              key={`drizzle-${i}`}
              className="drizzle-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ));
        default:
          return null;
      }
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
          }
          
          @keyframes float {
            0% { transform: translateX(0); }
            50% { transform: translateX(10px); }
            100% { transform: translateX(0); }
          }
          
          @keyframes rain {
            0% { transform: translateY(-10px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes snow {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            80% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          
          @keyframes flash {
            0% { opacity: 0; }
            25% { opacity: 1; }
            30% { opacity: 0; }
            35% { opacity: 0.8; }
            40% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: white;
            border-radius: 50%;
            animation: twinkle 2s ease-in-out infinite;
          }
          
          .cloud {
            position: absolute;
            width: 100px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            animation: float 30s linear infinite;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .cloud:before {
            content: '';
            position: absolute;
            width: 50px;
            height: 50px;
            top: -20px;
            left: 15px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
          }
          
          .cloud:after {
            content: '';
            position: absolute;
            width: 60px;
            height: 60px;
            top: -25px;
            right: 15px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
          }
          
          .raindrop {
            position: absolute;
            top: -20px;
            width: 3px;
            height: 20px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.7));
            border-radius: 0 0 5px 5px;
            animation: rain 1s linear infinite;
          }
          
          .snowflake {
            position: absolute;
            top: -10px;
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            opacity: 0.8;
            animation: snow 6s linear infinite;
          }
          
          .lightning {
            position: absolute;
            top: 0;
            width: 5px;
            height: 100px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0));
            animation: flash 6s infinite;
            transform: rotate(5deg);
            filter: drop-shadow(0 0 10px white);
          }
          
          .drizzle-drop {
            position: absolute;
            top: -20px;
            width: 2px;
            height: 10px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.5));
            border-radius: 0 0 5px 5px;
            opacity: 0.6;
            animation: rain 2s linear infinite;
          }
        `}
      </style>
      <div
        className="weather-background"
        style={{
          ...backgroundStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          overflow: 'hidden',
          transition: 'background 0.5s ease',
        }}
      >
        {renderWeatherElements()}
      </div>
    </>
  );
};

export default WeatherBackgroundApp;
