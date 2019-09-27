import React from 'react';
import './App.css';
// Import my different components from their files
import Tiles from "./tiles.js";
import Form from "./form.js";
import Weather from "./weather.js";
// Exports & returns class component to be rendered with it functionality 
export default class App extends React.Component {
  // Function that fetches API for weather as a JSON file, taking the city as an arguement
    getWeather = async (city) => {
        const APIcall = await fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=16a73ca4ce28ad2078b712e85c777b69")
        const response = await APIcall.json();
        console.log(response)

// Checks if there is an error message for not being able to find the city 
      if( response.cod === "404" ){
        // Sets a state for the error
        this.setState({
        error: "Couldn't find that city!",
        cod: "404"
        })
          return
        }
        // Sets each attribute of weather to the specified object key in JSON file 
        this.setState({
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
            descrip: response.weather[0].description,
        });

    };

    render() {
        return (
            <div>
        <Tiles/>
        {/* Imports each of my components with their functionality */}
        <Form loadWeather={this.getWeather}/>
        {/* Error message will load if the cod = "404" - not being able find inputted city */}
        {this.state && this.state.cod === "404" ?
          <div id="error">{this.state.error}</div> :
          null}
          {/* The other aspects of the will load if theres no "404" erro */}
        {this.state && this.state.cod !== "404" ? (
        <Weather
          // Retrieves each weather attribute from objests in the JSON file
          temp={this.state.temp}
          max={this.state.max}
          min={this.state.min}
          city={this.state.city}
          country={this.state.country}
          lon={this.state.lon}
          lat={this.state.lat}
          windSpeed={this.state.windSpeed}
          windDir={this.state.windDir}
          humidity={this.state.humidity}
          weather={this.state.weather}
          descrip={this.state.descrip}
          error={this.state.error}
        />
        // If theres an error nothing will be rendered 
         ) : null}
      </div>


        )
    }
}