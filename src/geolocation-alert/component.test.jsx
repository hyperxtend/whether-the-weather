import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import GeolocationAlert from './component';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('GeolocationAlert Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockOpen.mockClear();
  });

  test('renders without crashing', () => {
    render(<GeolocationAlert onClose={() => {}} />);
    expect(screen.getByText('Location Access')).toBeInTheDocument();
  });

  test('renders correct title and message', () => {
    render(<GeolocationAlert onClose={() => {}} />);

    // Check for title
    expect(screen.getByText('Location Access')).toBeInTheDocument();

    // Check for message content
    expect(
      screen.getByText(
        'To show your local weather, we need access to your location. Please enable location services for this website in your browser settings.'
      )
    ).toBeInTheDocument();
  });

  test('renders both buttons with correct text', () => {
    render(<GeolocationAlert onClose={() => {}} />);

    expect(screen.getByText('Maybe Later')).toBeInTheDocument();
    expect(screen.getByText('How to Enable')).toBeInTheDocument();
  });

  test('calls onClose when "Maybe Later" button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<GeolocationAlert onClose={mockOnClose} />);

    const maybeLaterButton = screen.getByText('Maybe Later');
    fireEvent.click(maybeLaterButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('opens help page when "How to Enable" button is clicked', () => {
    render(<GeolocationAlert onClose={() => {}} />);

    const howToEnableButton = screen.getByText('How to Enable');
    fireEvent.click(howToEnableButton);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledWith(
      'https://support.google.com/chrome/answer/142065',
      '_blank'
    );
  });

  test('includes proper CSS classes for styling', () => {
    const { container } = render(<GeolocationAlert onClose={() => {}} />);

    // Check for container class
    expect(
      container.querySelector('.geolocation-alert-container')
    ).toBeInTheDocument();

    // Check for card class
    expect(
      container.querySelector('.geolocation-alert-card')
    ).toBeInTheDocument();

    // Check button classes
    const buttons = container.querySelectorAll('.geolocation-alert-button');
    expect(buttons.length).toBe(2);
    expect(
      container.querySelector('.geolocation-alert-button-primary')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.geolocation-alert-button-secondary')
    ).toBeInTheDocument();
  });

  test('renders the location SVG icon', () => {
    const { container } = render(<GeolocationAlert onClose={() => {}} />);

    // Check for SVG element
    const svg = container.querySelector('svg.geolocation-alert-icon');
    expect(svg).toBeInTheDocument();

    // Verify it has the location path
    const path = svg.querySelector('path');
    expect(path).toBeInTheDocument();
  });
});
