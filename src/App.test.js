import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';

// Mock child components
jest.mock('./background', () => {
  return jest.fn(({ weatherData }) => (
    <div
      data-testid="mock-background"
      data-weather={JSON.stringify(weatherData)}
    >
      Background Mock
    </div>
  ));
});

jest.mock('./geolocation-alert', () => {
  return jest.fn(({ onClose }) => (
    <div data-testid="geolocation-alert">
      Location Alert Mock
      <button onClick={onClose} data-testid="close-alert">
        Close
      </button>
    </div>
  ));
});

jest.mock('./search-input', () => {
  return jest.fn(({ setIsLoading, setWeatherAttributes }) => (
    <div data-testid="search-input">
      Search Input Mock
      <button
        data-testid="trigger-search"
        onClick={() => {
          setIsLoading(true);
          setTimeout(() => {
            setWeatherAttributes({
              city: 'Test City',
              temp: 20,
              weather: 'Clear',
            });
            setIsLoading(false);
          }, 100);
        }}
      >
        Search
      </button>
    </div>
  ));
});

jest.mock('./weather-result', () => {
  return jest.fn(({ weatherAttributes, isLoading }) => (
    <div data-testid="weather-result" data-loading={isLoading}>
      Weather Result Mock: {weatherAttributes.city || 'No data'}
    </div>
  ));
});

// Mock fetch for API calls
global.fetch = jest.fn();

describe('App Component', () => {
  const mockGeolocation = {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
  };

  const mockNavigator = {
    geolocation: mockGeolocation,
  };

  const successfulGeolocationResponse = {
    coords: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  };

  const mockWeatherResponse = {
    main: {
      temp: 15,
      temp_max: 17,
      temp_min: 13,
      humidity: 80,
    },
    name: 'New York',
    coord: {
      lat: 40.7128,
      lon: -74.006,
    },
    wind: {
      speed: 5.5,
      deg: 180,
    },
    sys: {
      country: 'US',
      sunrise: 1619161200,
      sunset: 1619210280,
    },
    weather: [
      {
        main: 'Clouds',
        description: 'scattered clouds',
        icon: '03d',
      },
    ],
  };

  beforeEach(() => {
    // Setup navigator mock
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
    });

    // Setup fetch mock
    global.fetch.mockReset();
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockWeatherResponse),
    });

    // Reset geolocation mock
    mockGeolocation.getCurrentPosition.mockReset();
  });

  test('renders the app structure correctly', () => {
    render(<App />);

    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('weather-result')).toBeInTheDocument();
    expect(screen.queryByTestId('geolocation-alert')).not.toBeInTheDocument();
  });

  test('requests geolocation on mount', () => {
    render(<App />);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  test('fetches weather data when geolocation succeeds', async () => {
    // Setup geolocation mock to call success callback
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(successfulGeolocationResponse);
    });

    render(<App />);

    await waitFor(() => {
      const backgroundProps = JSON.parse(
        screen.getByTestId('mock-background').dataset.weather
      );
      expect(backgroundProps.city).toBe('New York');
    });
  });

  test('shows error alert when geolocation permission is denied', async () => {
    // Setup geolocation mock to call error callback with permission denied
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('geolocation-alert')).toBeInTheDocument();
    });
  });

  test('closes location alert when close button is clicked', async () => {
    // Setup geolocation mock to call error callback with permission denied
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1 });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('geolocation-alert')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('close-alert');
    userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('geolocation-alert')).not.toBeInTheDocument();
    });
  });

  test('processes API response correctly', async () => {
    // Setup geolocation mock to call success callback
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(successfulGeolocationResponse);
    });

    render(<App />);

    await waitFor(() => {
      const backgroundProps = JSON.parse(
        screen.getByTestId('mock-background').dataset.weather
      );
      expect(backgroundProps).toEqual(
        expect.objectContaining({
          temp: 15,
          max: 17,
          min: 13,
          city: 'New York',
          lat: 40.7128,
          lon: -74.006,
          windSpeed: 5.5,
          windDir: 180,
          country: 'US',
          humidity: 80,
          weather: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
          sunrise: 1619161200,
          sunset: 1619210280,
        })
      );
    });
  });

  test('handles API error correctly', async () => {
    // Setup geolocation mock to call success callback
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(successfulGeolocationResponse);
    });

    // Setup fetch mock to reject
    global.fetch.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching weather:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('handles 404 API response correctly', async () => {
    // Setup geolocation mock to call success callback
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(successfulGeolocationResponse);
    });

    // Setup fetch mock to return 404
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ cod: '404' }),
    });

    render(<App />);

    await waitFor(() => {
      const backgroundProps = JSON.parse(
        screen.getByTestId('mock-background').dataset.weather
      );
      expect(backgroundProps).toEqual(
        expect.objectContaining({
          error: "Couldn't find weather for this location!",
          cod: '404',
        })
      );
    });
  });

  test('updates weather data from search input', async () => {
    render(<App />);

    // Click the mocked search button
    const searchButton = screen.getByTestId('trigger-search');
    act(() => {
      userEvent.click(searchButton);
    });

    // Check loading state
    expect(screen.getByTestId('weather-result').dataset.loading).toBe('true');

    // Wait for the mock search to complete
    await waitFor(() => {
      expect(screen.getByTestId('weather-result').dataset.loading).toBe(
        'false'
      );
    });

    // Check updated data
    await waitFor(() => {
      const backgroundProps = JSON.parse(
        screen.getByTestId('mock-background').dataset.weather
      );
      expect(backgroundProps.city).toBe('Test City');
      expect(backgroundProps.temp).toBe(20);
      expect(backgroundProps.weather).toBe('Clear');
    });
  });

  test('handles browser without geolocation', () => {
    // Remove geolocation from navigator
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
    });

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<App />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Geolocation is not supported by this browser.'
    );

    consoleSpy.mockRestore();
  });
});
