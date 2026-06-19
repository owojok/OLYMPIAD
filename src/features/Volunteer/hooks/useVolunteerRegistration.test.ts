import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVolunteerRegistration, INITIAL_REGISTERED_VOLUNTEERS } from './useVolunteerRegistration';

describe('useVolunteerRegistration Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with the default roster', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    expect(result.current.registeredVolunteers).toEqual(INITIAL_REGISTERED_VOLUNTEERS);
    expect(result.current.stats.totalRegistered).toBe(9);
  });

  it('adds a volunteer registration and persists to localStorage', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    act(() => {
      result.current.registerVolunteer('John Smith', '+234 803 123 4567', 'john@gmail.com');
    });

    expect(result.current.registeredVolunteers.length).toBe(10);
    expect(result.current.stats.totalRegistered).toBe(10);
    expect(result.current.registeredVolunteers[9].fullName).toBe('John Smith');
    expect(result.current.registeredVolunteers[9].phone).toBe('+234 803 123 4567');
    expect(result.current.registeredVolunteers[9].email).toBe('john@gmail.com');

    // Verify localStorage matches
    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(10);
    expect(stored[9].fullName).toBe('John Smith');
  });

  it('removes a volunteer registration', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    const targetId = result.current.registeredVolunteers[0].id;

    act(() => {
      result.current.deleteRegistration(targetId);
    });

    expect(result.current.registeredVolunteers.length).toBe(8);
    expect(result.current.stats.totalRegistered).toBe(8);

    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(8);
  });

  it('clears all volunteer registrations', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    expect(result.current.registeredVolunteers.length).toBe(9);

    act(() => {
      result.current.clearRegistrations();
    });

    expect(result.current.registeredVolunteers.length).toBe(0);
    expect(result.current.stats.totalRegistered).toBe(0);
  });
});
