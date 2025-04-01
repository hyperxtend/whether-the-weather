import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import './component.css';

const SearchInput = ({ setWeatherAttributes, setIsLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);

  // OpenWeather API key
  const API_KEY = '16a73ca4ce28ad2078b712e85c777b69';

  // City list for prediction (normally this would come from a larger API or database)
  // This is a limited list for demonstration
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

  // Update predictions based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filteredCities = popularCities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPredictions(filteredCities.slice(0, 5)); // Limit to top 5 matches
      setShowPredictions(filteredCities.length > 0);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [searchTerm]);

  // Fetch weather data for the selected city
  const getWeather = async (city) => {
    setIsLoading(true);
    try {
      const APIcall = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${API_KEY}`
      );
      const response = await APIcall.json();

      // Check if there is an error message for not being able to find the city
      if (response.cod === '404') {
        setWeatherAttributes({
          error: "Couldn't find that city!",
          cod: '404',
        });
        setIsLoading(false);
        return;
      }

      // Sets each attribute of weather to the specified object key in JSON file
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

  // Handle selection of a prediction
  const handlePredictionSelect = (city) => {
    setSearchTerm(city);
    setShowPredictions(false);
    getWeather(city);
  };

  return (
    <div className="search-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (searchTerm.trim()) {
            getWeather(searchTerm);
          }
        }}
      >
        <InputGroup className="form-container">
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter your city..."
            autoComplete="off"
            className="search-input"
          />
          <Button type="submit" variant="outline-secondary">
            Search
          </Button>
        </InputGroup>
      </form>

      {/* Predictive search dropdown */}
      {showPredictions && (
        <ListGroup className="predictions-container">
          {predictions.map((city, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handlePredictionSelect(city)}
              className="prediction-item"
            >
              {city}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchInput;
