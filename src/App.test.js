import React from 'react';
import ReactDOM from 'react-dom';
import{App, APIcall, response, getWeather} from './App';

// Tests function that checkes if my fetch API function works properly
test.todo("APIcall"), done => {
	function callBack(data){
		expect(data).toBe("response").toMatchSnapshot();
		done();
}
	callBack()
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
	}



