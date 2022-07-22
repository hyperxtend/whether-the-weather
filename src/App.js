import React from 'react';
import './App.css';
// Import my different components from their files
import Tiles from './header';
import InitialMessage from './initial-message';
import SearchInput from './search-input';
import Weather from './weather-result';
// Exports & returns class component to be rendered with it functionality
const App = () => {
  const [weatherAttributes, setWeatherAttributes] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  // Function that fetches API for weather as a JSON file, taking the city as an arguement
  const isEmpty = Object.keys(weatherAttributes).length === 0;
  return (
    <div className="site-container">
      <Tiles />
      <SearchInput
        setIsLoading={setIsLoading}
        setWeatherAttributes={setWeatherAttributes}
      />
      {!isEmpty ? (
        <Weather weatherAttributes={weatherAttributes} isLoading={isLoading} />
      ) : (
        <InitialMessage />
      )}
    </div>
  );
};
export default App;
