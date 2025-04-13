import { MapPin, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import './component.css';

const SearchInput = ({ setWeatherAttributes, setIsLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const API_KEY = '16a73ca4ce28ad2078b712e85c777b69';

  const popularCities = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Berlin',
    'Moscow',
    'Sydney',
    'Beijing',
    'Los Angeles',
    'Chicago',
    'Toronto',
    'Mumbai',
    'Dubai',
    'Rome',
    'Madrid',
    'Amsterdam',
    'San Francisco',
    'Miami',
    'Boston',
    'Seattle',
    'Austin',
    'Atlanta',
    'Denver',
    'Phoenix',
    'Cairo',
    'Cape Town',
    'Rio de Janeiro',
    'Buenos Aires',
    'Mexico City',
    'Bangkok',
    'Seoul',
    'Shanghai',
    'Hong Kong',
    'Singapore',
    'Jakarta',
    'Manila',
    'Stockholm',
    'Vienna',
    'Prague',
    'Budapest',
    'Warsaw',
    'Athens',
    'Istanbul',
    'Dublin',
    'Oslo',
  ];

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update predictions based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredCities = popularCities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPredictions(filteredCities.slice(0, 6));
      setShowPredictions(filteredCities.length > 0);
      setFocusedIndex(-1);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [searchTerm]);

  const getWeather = async (city) => {
    setIsLoading(true);
    try {
      const APIcall = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
      );
      const response = await APIcall.json();

      if (response.cod === '404') {
        setWeatherAttributes({
          error: "Couldn't find that city!",
          cod: '404',
        });
        setIsLoading(false);
        return;
      }

      const weatherResponse = {
        temp: response.main.temp,
        max: response.main.temp_max,
        min: response.main.temp_min,
        city: response.name,
        lat: response.coord.lat,
        lon: response.coord.lon,
        windSpeed: response.wind.speed,
        windDir: response.wind.deg,
        country: response.sys.country,
        humidity: response.main.humidity,
        weather: response.weather[0].main,
        description: response.weather[0].description,
        icon: response.weather[0].icon,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
      };

      setWeatherAttributes(weatherResponse);
      setShowPredictions(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherAttributes({
        error: 'Error fetching weather data',
        cod: '500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionSelect = (city) => {
    setSearchTerm(city);
    setShowPredictions(false);
    getWeather(city);
  };

  const handleKeyDown = (e) => {
    if (showPredictions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : predictions.length - 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        handlePredictionSelect(predictions[focusedIndex]);
      } else if (e.key === 'Escape') {
        setShowPredictions(false);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current.focus();
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (searchTerm.trim()) {
            getWeather(searchTerm);
          }
        }}
      >
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.length > 1 && predictions.length > 0) {
                setShowPredictions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            autoComplete="off"
            className="search-input"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

          <button type="submit" className="search-button" aria-label="Search">
            <Search size={20} />
          </button>
        </div>
      </form>

      {showPredictions && (
        <div className="predictions-container">
          {predictions.map((city, index) => (
            <div
              key={index}
              onClick={() => handlePredictionSelect(city)}
              className={`prediction-item ${
                index === focusedIndex ? 'prediction-item-focused' : ''
              }`}
            >
              <div className="prediction-icon">
                <MapPin size={16} />
              </div>
              <span className="prediction-text">{city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
