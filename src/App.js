import React, { useEffect, useState } from 'react';
import './App.css';
// Import components
import WeatherBackgroundApp from './background';
import SearchInput from './search-input';
import Weather from './weather-result';

const App = () => {
  const [weatherAttributes, setWeatherAttributes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const APIcall = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=16a73ca4ce28ad2078b712e85c777b69`
      );
      const response = await APIcall.json();

      if (response.cod === '404') {
        setWeatherAttributes({
          error: "Couldn't find weather for this location!",
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="site-container">
      <WeatherBackgroundApp weatherData={weatherAttributes} />

      <div className="content-container">
        <SearchInput
          setIsLoading={setIsLoading}
          setWeatherAttributes={setWeatherAttributes}
        />

        <Weather weatherAttributes={weatherAttributes} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
