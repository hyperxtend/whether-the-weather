import { render } from '@testing-library/react';
import React from 'react';
import WeatherBackgroundApp from './component';

// Mock the Date object to control day/night scenarios
let mockDate;
const originalDate = global.Date;

beforeEach(() => {
  mockDate = jest.fn();
  global.Date = class extends Date {
    constructor() {
      super();
      return mockDate.apply(this, arguments);
    }
    getTime() {
      return 1586300400000; // April 8, 2020 12:00:00 GMT - noon time
    }
  };
});

afterEach(() => {
  global.Date = originalDate;
});

describe('WeatherBackgroundApp', () => {
  test('renders without crashing', () => {
    render(<WeatherBackgroundApp weatherData={null} />);
    // If it renders without throwing, the test passes
  });

  test('renders with default styling when no weather data is provided', () => {
    const { container } = render(<WeatherBackgroundApp weatherData={null} />);
    const backgroundElement = container.querySelector('.weather-background');
    expect(backgroundElement).toBeInTheDocument();
  });

  test('applies correct background style for Clear day', () => {
    const weatherData = {
      weather: 'Clear',
      sunrise: 1586260800, // Earlier than current mock time
      sunset: 1586307600, // Later than current mock time
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const backgroundElement = container.querySelector('.weather-background');

    expect(backgroundElement).toHaveStyle({
      background: 'linear-gradient(160deg, #54C8FF, #91E2FF, #54C8FF)',
    });
  });

  test('applies correct background style for Clear night', () => {
    // Make our mocked time be after sunset
    mockDate.mockImplementation(() => ({
      getTime: () => 1586310000000, // After sunset
    }));

    const weatherData = {
      weather: 'Clear',
      sunrise: 1586260800, // Morning time
      sunset: 1586307600, // Evening time (before our mocked time)
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const backgroundElement = container.querySelector('.weather-background');

    expect(backgroundElement).toHaveStyle({
      background: 'linear-gradient(160deg, #1A1A2E, #16213E, #0F3460)',
    });
  });

  test('applies correct background style for Rain day', () => {
    const weatherData = {
      weather: 'Rain',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const backgroundElement = container.querySelector('.weather-background');

    expect(backgroundElement).toHaveStyle({
      background: 'linear-gradient(160deg, #34AADC, #007AFF, #5AC8FA)',
    });
  });

  test('renders cloud elements for Clouds weather', () => {
    const weatherData = {
      weather: 'Clouds',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const cloudElements = container.querySelectorAll('.cloud');

    expect(cloudElements.length).toBe(5); // Based on your component's count for clouds
  });

  test('renders rain elements for Rain weather', () => {
    const weatherData = {
      weather: 'Rain',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const rainElements = container.querySelectorAll('.raindrop');

    expect(rainElements.length).toBe(50); // Based on your component's count for rain
  });

  test('renders snow elements for Snow weather', () => {
    const weatherData = {
      weather: 'Snow',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const snowElements = container.querySelectorAll('.snowflake');

    expect(snowElements.length).toBe(40); // Based on your component's count for snow
  });

  test('renders lightning and rain for Thunderstorm weather', () => {
    const weatherData = {
      weather: 'Thunderstorm',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const lightningElements = container.querySelectorAll('.lightning');
    const rainElements = container.querySelectorAll('.raindrop');

    expect(lightningElements.length).toBe(3);
    expect(rainElements.length).toBe(30);
  });

  test('renders drizzle elements for Drizzle weather', () => {
    const weatherData = {
      weather: 'Drizzle',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const drizzleElements = container.querySelectorAll('.drizzle-drop');

    expect(drizzleElements.length).toBe(30);
  });

  test('handles unknown weather type gracefully', () => {
    const weatherData = {
      weather: 'Unknown',
      sunrise: 1586260800,
      sunset: 1586307600,
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );

    // Should default to the default background style
    const backgroundElement = container.querySelector('.weather-background');
    expect(backgroundElement).toBeInTheDocument();

    // No weather elements should be rendered for unknown type
    const allWeatherElements = container.querySelectorAll(
      '.cloud, .raindrop, .snowflake, .lightning, .drizzle-drop, .star, .sun'
    );
    expect(allWeatherElements.length).toBe(0);
  });

  test('defaults to daytime when no sunrise/sunset data is provided', () => {
    const weatherData = {
      weather: 'Clear',
      // No sunrise or sunset times
    };

    const { container } = render(
      <WeatherBackgroundApp weatherData={weatherData} />
    );
    const backgroundElement = container.querySelector('.weather-background');

    // Should use day style for Clear
    expect(backgroundElement).toHaveStyle({
      background: 'linear-gradient(160deg, #54C8FF, #91E2FF, #54C8FF)',
    });
  });
});
