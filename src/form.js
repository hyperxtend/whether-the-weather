import React from 'react';
// Functional component that accesses JSON via the inputted city 
const Form = (props) =>{
	// Use react to set the state of the city
	const [city, setCity] = React.useState("")
	return(
		// Once the form is submitted the weather with it's attributes is rendered whilst taking the "city" as an arguement
		<form onSubmit={e => {e.preventDefault(); props.loadWeather(city)}}>
			<label id="cityInp">Enter a City:</label><br/>
			{/* Sets the specified city as a value */}
			<input type="text" name="city" onChange={e => setCity(e.target.value)} className="searchBar" placeholder="City..."/>
			<button type="submit" className="searchBut">🔍</button><br/>
		</form>
		)
};
// Exports this file to be used in main App component 
export default Form;