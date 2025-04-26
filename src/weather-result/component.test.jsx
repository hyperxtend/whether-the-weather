import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Weather from './component';

describe('Weather Component', () => {
  // Save original Date implementation
  const originalDate = global.Date;

  afterEach(() => {
    // Restore original Date after each test
    global.Date = originalDate;
  });

  test('renders nothing when weatherAttributes is empty', () => {
    const { container } = render(
      <Weather weatherAttributes={{}} isLoading={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders loading spinner when isLoading is true', () => {
    const { container } = render(
      <Weather weatherAttributes={{}} isLoading={true} />
    );
    expect(container.querySelector('.spinner-container')).toBeInTheDocument();
  });

  test('renders error message when error is present', () => {
    const weatherAttributes = {
      error: 'City not found',
    };
    render(<Weather weatherAttributes={weatherAttributes} isLoading={false} />);

    expect(screen.getByText('City not found')).toBeInTheDocument();
    expect(screen.getByText('Please try another location')).toBeInTheDocument();
  });

  test('renders weather data correctly', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'few clouds',
      temp: 15.5,
      weather: 'Clouds',
      icon: '02d',
    };

    render(<Weather weatherAttributes={weatherAttributes} isLoading={false} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('GB')).toBeInTheDocument();
    expect(screen.getByText('Clouds')).toBeInTheDocument();
    expect(screen.getByText('few clouds')).toBeInTheDocument();
    expect(screen.getByText('16°C')).toBeInTheDocument(); // 15.5 rounded to 16
    expect(screen.getByAltText('weather-icon')).toHaveAttribute(
      'src',
      'http://openweathermap.org/img/w/02d.png'
    );
  });

  test('applies correct weather background for clear sky', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'clear sky',
      temp: 20,
      weather: 'Clear',
      icon: '01d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('clear-sky');
  });

  test('applies correct weather background for cloudy sky', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'scattered clouds',
      temp: 18,
      weather: 'Clouds',
      icon: '03d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('cloudy-sky');
  });

  test('applies correct weather background for rainy sky', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'light rain',
      temp: 14,
      weather: 'Rain',
      icon: '10d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('rainy-sky');
  });

  test('applies correct weather background for drizzle', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'light drizzle',
      temp: 13,
      weather: 'Drizzle',
      icon: '09d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('rainy-sky');
  });

  test('applies correct weather background for thunderstorm', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'thunderstorm with rain',
      temp: 16,
      weather: 'Thunderstorm',
      icon: '11d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('storm-sky');
  });

  test('applies correct weather background for snow', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'light snow',
      temp: -2,
      weather: 'Snow',
      icon: '13d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('snowy-sky');
  });

  test('applies correct weather background for mist', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'mist',
      temp: 10,
      weather: 'Mist',
      icon: '50d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('misty-sky');
  });

  test('applies correct weather background for fog', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'fog',
      temp: 9,
      weather: 'Fog',
      icon: '50d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('misty-sky');
  });

  test('applies correct weather background for haze', () => {
    const weatherAttributes = {
      city: 'Beijing',
      country: 'CN',
      description: 'haze',
      temp: 22,
      weather: 'Haze',
      icon: '50d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('hazy-sky');
  });

  test('applies correct weather background for smoke', () => {
    const weatherAttributes = {
      city: 'Delhi',
      country: 'IN',
      description: 'smoke',
      temp: 28,
      weather: 'Smoke',
      icon: '50d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('hazy-sky');
  });

  test('applies default weather background for unknown weather', () => {
    const weatherAttributes = {
      city: 'Unknown',
      country: 'XX',
      description: 'strange weather',
      temp: 20,
      weather: 'Unknown',
      icon: '50d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass(
      'default-weather'
    );
  });

  test('applies day-time class during day hours', () => {
    // Mock date to be midday
    global.Date = class extends Date {
      // eslint-disable-next-line no-useless-constructor
      constructor() {
        super();
      }
      getHours() {
        return 12; // midday
      }
    };

    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'clear sky',
      temp: 20,
      weather: 'Clear',
      icon: '01d',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('day-time');
  });

  test('applies night-time class during night hours', () => {
    // Mock date to be midnight
    global.Date = class extends Date {
      // eslint-disable-next-line no-useless-constructor
      constructor() {
        super();
      }
      getHours() {
        return 23; // 11pm
      }
    };

    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'clear sky',
      temp: 20,
      weather: 'Clear',
      icon: '01n',
    };

    const { container } = render(
      <Weather weatherAttributes={weatherAttributes} isLoading={false} />
    );

    expect(container.querySelector('.weather-card')).toHaveClass('night-time');
  });

  test('rounds temperature correctly', () => {
    const weatherAttributes = {
      city: 'London',
      country: 'GB',
      description: 'clear sky',
      temp: 20.4,
      weather: 'Clear',
      icon: '01d',
    };

    render(<Weather weatherAttributes={weatherAttributes} isLoading={false} />);
    expect(screen.getByText('20°C')).toBeInTheDocument();

    // Test rounding up
    const weatherAttributes2 = {
      ...weatherAttributes,
      temp: 20.5,
    };

    render(
      <Weather weatherAttributes={weatherAttributes2} isLoading={false} />
    );
    expect(screen.getByText('21°C')).toBeInTheDocument();
  });
});
