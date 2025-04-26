import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import SearchInput from './component';

// Mock fetch
global.fetch = jest.fn();

describe('SearchInput Component', () => {
  const mockSetWeatherAttributes = jest.fn();
  const mockSetIsLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup fetch mock to return successful response
    fetch.mockResolvedValue({
      json: async () => ({
        name: 'London',
        main: {
          temp: 15,
          temp_max: 17,
          temp_min: 13,
          humidity: 60,
        },
        coord: {
          lat: 51.51,
          lon: -0.13,
        },
        wind: {
          speed: 4.1,
          deg: 270,
        },
        sys: {
          country: 'GB',
          sunrise: 1586324905,
          sunset: 1586374130,
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
      }),
    });
  });

  test('renders search input correctly', () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    // Check if the search input exists
    expect(
      screen.getByPlaceholderText('Search for a city...')
    ).toBeInTheDocument();

    // Check if the search button exists
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('updates search term when typing', () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(searchInput, { target: { value: 'London' } });

    expect(searchInput.value).toBe('London');
  });

  test('shows clear button when search term is entered', () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Clear button should not be visible initially
    expect(
      screen.queryByRole('button', { name: 'Clear search' })
    ).not.toBeInTheDocument();

    // Enter text in search input
    fireEvent.change(searchInput, { target: { value: 'London' } });

    // Clear button should now be visible
    expect(
      screen.getByRole('button', { name: 'Clear search' })
    ).toBeInTheDocument();
  });

  test('clears search term when clear button is clicked', () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Enter text in search input
    fireEvent.change(searchInput, { target: { value: 'London' } });
    expect(searchInput.value).toBe('London');

    // Click clear button
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.click(clearButton);

    // Search input should be cleared
    expect(searchInput.value).toBe('');
  });

  test('shows predictions when typing', async () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Enter text that matches multiple cities
    fireEvent.change(searchInput, { target: { value: 'lo' } });

    // Wait for predictions to appear
    await waitFor(() => {
      // Should show "London" in predictions
      expect(screen.getByText('London')).toBeInTheDocument();
      // Should also show "Los Angeles" since it matches the input
      expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    });
  });

  test('selects city when clicking on prediction', async () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Enter text that matches multiple cities
    fireEvent.change(searchInput, { target: { value: 'lo' } });

    // Wait for predictions to appear
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    // Click on "London" prediction
    fireEvent.click(screen.getByText('London'));

    // Search input should be updated
    expect(searchInput.value).toBe('London');

    // Fetch should be called
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=London'));

    // Loading state should be managed
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  test('fetches weather data when form is submitted', async () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');
    const searchForm = searchInput.closest('form');

    // Enter city name
    fireEvent.change(searchInput, { target: { value: 'Paris' } });

    // Submit form
    fireEvent.submit(searchForm);

    // Check if fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=Paris'));

    // Wait for API call to complete
    await waitFor(() => {
      // Check that weather attributes were set with the correct data structure
      expect(mockSetWeatherAttributes).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'London',
          temp: 15,
          max: 17,
          min: 13,
          humidity: 60,
          weather: 'Clear',
          description: 'clear sky',
        })
      );

      // Loading state should be managed
      expect(mockSetIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  test('handles API error correctly', async () => {
    // Mock fetch to return error
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');
    const searchForm = searchInput.closest('form');

    // Enter city name
    fireEvent.change(searchInput, { target: { value: 'ErrorCity' } });

    // Submit form
    fireEvent.submit(searchForm);

    // Wait for API call to complete
    await waitFor(() => {
      // Error should be set in weather attributes
      expect(mockSetWeatherAttributes).toHaveBeenCalledWith({
        error: 'Error fetching weather data',
        cod: '500',
      });

      // Loading state should be managed
      expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });
  });

  test('handles 404 response correctly', async () => {
    // Mock fetch to return 404
    fetch.mockResolvedValueOnce({
      json: async () => ({
        cod: '404',
        message: 'city not found',
      }),
    });

    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');
    const searchForm = searchInput.closest('form');

    // Enter non-existent city
    fireEvent.change(searchInput, { target: { value: 'NonExistentCity' } });

    // Submit form
    fireEvent.submit(searchForm);

    // Wait for API call to complete
    await waitFor(() => {
      // Error should be set in weather attributes
      expect(mockSetWeatherAttributes).toHaveBeenCalledWith({
        error: "Couldn't find that city!",
        cod: '404',
      });
    });
  });

  test('selects prediction with Enter key', async () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Type "l" to get predictions
    fireEvent.change(searchInput, { target: { value: 'lo' } });

    // Wait for predictions to appear
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    // Press down arrow to navigate to first prediction
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });

    // Press Enter to select focused prediction
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    // Search input should be updated with selected city
    await waitFor(() => {
      expect(searchInput.value).toBe('London');
    });

    // Fetch should be called
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=London'));
  });

  test('closes predictions with Escape key', async () => {
    render(
      <SearchInput
        setWeatherAttributes={mockSetWeatherAttributes}
        setIsLoading={mockSetIsLoading}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Type "l" to get predictions
    fireEvent.change(searchInput, { target: { value: 'lo' } });

    // Wait for predictions to appear
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    // Press Escape to close predictions
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    // Predictions should be hidden
    await waitFor(() => {
      expect(screen.queryByText('London')).not.toBeInTheDocument();
    });
  });

  test('closes predictions when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside-element">Outside element</div>
        <SearchInput
          setWeatherAttributes={mockSetWeatherAttributes}
          setIsLoading={mockSetIsLoading}
        />
      </div>
    );

    const searchInput = screen.getByPlaceholderText('Search for a city...');

    // Type "lo" to get predictions
    fireEvent.change(searchInput, { target: { value: 'lo' } });

    // Wait for predictions to appear
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    // Click outside the search component
    fireEvent.mouseDown(screen.getByTestId('outside-element'));

    // Predictions should be hidden
    await waitFor(() => {
      expect(screen.queryByText('London')).not.toBeInTheDocument();
    });
  });
});