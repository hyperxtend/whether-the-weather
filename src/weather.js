import React from 'react';
// Functional component that displays/writes all the weather attributes from the JSON file  
const Weather = (props) => {
	return(
		<div id="foreCast">

		{props.country && props.city && <p><h3 className="weatherAspects">Location 🌐: {props.city}, {props.country}</h3> •Lattitude: {props.lat}° <br/> •Longitude: {props.lon}°</p>}
		{<p><h3 className="weatherAspects">Conditions ⛱️:</h3><p>{props.weather}, {props.descrip} </p> </p>} 
		{props.temp && <p><h3 className="weatherAspects">Tempreture 🌡️:  {props.temp} °F</h3> •Max: {props.max} °F <br/> •Min: {props.min} °F</p>}
		{props.humidity && <p><h3 className="weatherAspects">Humimidity 💧: {props.humidity} %</h3></p>}
		{<p><h3 className="weatherAspects">Wind 🌪️:</h3> Wind Speed: {props.windSpeed} knots <br/> Wind Direction: {props.windDir} °</p>}
	
		</div>
		)
		
};
// Exports this file to be used in main App component
export default Weather;