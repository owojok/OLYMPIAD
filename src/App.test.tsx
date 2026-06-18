import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders dashboard by default', () => {
    render(<App />);
    
    // Check if the dashboard title or subtitle is rendered
    expect(screen.getByText('Science Olympiad Nigeria')).toBeInTheDocument();
    expect(screen.getByText('Jos Tournament')).toBeInTheDocument();
  });

  it('navigates to different tabs', () => {
    render(<App />);
    
    // Click on Run of Show nav button
    const scheduleNavBtn = screen.getByRole('button', { name: /run of show/i });
    fireEvent.click(scheduleNavBtn);
    
    // Verify it changed views to the schedule
    expect(screen.getByText('Interactive Run of Show')).toBeInTheDocument();
    
    // Click on Venue Allocation
    const venueNavBtn = screen.getByRole('button', { name: /venue allocation/i });
    fireEvent.click(venueNavBtn);
    expect(screen.getByText('Venue Allocation Map')).toBeInTheDocument();
  });

  it('toggles dark and light mode', () => {
    render(<App />);
    
    // Check initial state (should be dark mode by default)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    // Toggle theme button
    const themeBtn = screen.getByRole('button', { name: /toggle theme/i });
    
    fireEvent.click(themeBtn);
    // Verify it switched to light mode
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('so_theme')).toBe('light');

    // Click again
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
