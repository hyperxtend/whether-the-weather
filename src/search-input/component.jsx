import React from 'react';
import './styles.css';
import { InputGroup, Form, Button } from 'react-bootstrap';
// Functional component that accesses JSON via the inputted city
const SearchInput = ({ setWeatherAttributes, setIsLoading }) => {
  // Use react to set the state of the city
  const [city, setCity] = React.useState('');
  const getWeather = async () => {
    setIsLoading(true);
    const APIcall = await fetch(
      'http://api.openweathermap.org/data/2.5/weather?q=' +
        city +
        '&units=metric' +
        '&APPID=16a73ca4ce28ad2078b712e85c777b69'
    );
    const response = await APIcall.json();
    // Checks if there is an error message for not being able to find the city
    if (response.cod === '404') {
      // Sets a state for the error
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
    };
    setWeatherAttributes(weatherResponse);
    setIsLoading(false);
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        getWeather(city);
      }}
    >
      <InputGroup className="form-container">
        {/* Sets the specified city as a value */}
        <Form.Control
          type="text"
          name="city"
          onChange={(e) => {
            if (e.target.value.length > 0) {
              setCity(e.target.value);
            }
          }}
          placeholder="Enter your city..."
        />
        <Button type="submit" variant="outline-secondary">
          Search
        </Button>
      </InputGroup>
    </form>
  );
};
// Exports this file to be used in main App component
export default SearchInput;
