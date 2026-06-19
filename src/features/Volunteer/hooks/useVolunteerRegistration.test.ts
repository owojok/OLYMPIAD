import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVolunteerRegistration } from './useVolunteerRegistration';

describe('useVolunteerRegistration Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty roster', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    expect(result.current.registeredVolunteers).toEqual([]);
    expect(result.current.stats.totalRegistered).toBe(0);
  });

  it('adds a volunteer registration and persists to localStorage', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    act(() => {
      result.current.registerVolunteer('John Smith', '+234 803 123 4567', 'john@gmail.com');
    });

    expect(result.current.registeredVolunteers.length).toBe(1);
    expect(result.current.stats.totalRegistered).toBe(1);
    expect(result.current.registeredVolunteers[0].fullName).toBe('John Smith');
    expect(result.current.registeredVolunteers[0].phone).toBe('+234 803 123 4567');
    expect(result.current.registeredVolunteers[0].email).toBe('john@gmail.com');

    // Verify localStorage matches
    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].fullName).toBe('John Smith');
  });

  it('removes a volunteer registration', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    act(() => {
      result.current.registerVolunteer('John Smith', '+234 803 123 4567', 'john@gmail.com');
    });

    const targetId = result.current.registeredVolunteers[0].id;

    act(() => {
      result.current.deleteRegistration(targetId);
    });

    expect(result.current.registeredVolunteers.length).toBe(0);
    expect(result.current.stats.totalRegistered).toBe(0);

    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(0);
  });

  it('clears all volunteer registrations', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    act(() => {
      result.current.registerVolunteer('John Smith', '+234 803 123 4567', 'john@gmail.com');
      result.current.registerVolunteer('Alice Doe', '+234 809 333 4444', 'alice@gmail.com');
    });

    expect(result.current.registeredVolunteers.length).toBe(2);

    act(() => {
      result.current.clearRegistrations();
    });

    expect(result.current.registeredVolunteers.length).toBe(0);
    expect(result.current.stats.totalRegistered).toBe(0);
  });
});
