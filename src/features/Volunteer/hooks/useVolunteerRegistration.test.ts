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
    expect(result.current.stats.totalRegistered).toBe(16);
  });

  it('adds a volunteer registration and persists to localStorage', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    act(() => {
      result.current.registerVolunteer('John Smith', '+234 803 123 4567', 'john@gmail.com');
    });

    expect(result.current.registeredVolunteers.length).toBe(17);
    expect(result.current.stats.totalRegistered).toBe(17);
    expect(result.current.registeredVolunteers[16].fullName).toBe('John Smith');
    expect(result.current.registeredVolunteers[16].phone).toBe('+234 803 123 4567');
    expect(result.current.registeredVolunteers[16].email).toBe('john@gmail.com');

    // Verify localStorage matches
    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(17);
    expect(stored[16].fullName).toBe('John Smith');
  });

  it('removes a volunteer registration', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    const targetId = result.current.registeredVolunteers[0].id;

    act(() => {
      result.current.deleteRegistration(targetId);
    });

    expect(result.current.registeredVolunteers.length).toBe(15);
    expect(result.current.stats.totalRegistered).toBe(15);

    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored.length).toBe(15);
  });

  it('clears all volunteer registrations', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    expect(result.current.registeredVolunteers.length).toBe(16);

    act(() => {
      result.current.clearRegistrations();
    });

    expect(result.current.registeredVolunteers.length).toBe(0);
    expect(result.current.stats.totalRegistered).toBe(0);
  });

  it('assigns a team to a registered volunteer and persists it', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    const targetId = result.current.registeredVolunteers[0].id;

    act(() => {
      result.current.assignTeam(targetId, 'Competition Judges Assistant');
    });

    expect(result.current.registeredVolunteers[0].assignedTeam).toBe('Competition Judges Assistant');

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored[0].assignedTeam).toBe('Competition Judges Assistant');
  });

  it('assigns Shift 1 and Shift 2 events to a registered volunteer and persists it', () => {
    const { result } = renderHook(() => useVolunteerRegistration());
    act(() => {});

    const targetId = result.current.registeredVolunteers[0].id;

    act(() => {
      result.current.assignEventB(targetId, 'VET-201');
      result.current.assignEventC(targetId, 'VET-203');
    });

    expect(result.current.registeredVolunteers[0].assignedEventB).toBe('VET-201');
    expect(result.current.registeredVolunteers[0].assignedEventC).toBe('VET-203');

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem('so_registered_volunteers') || '[]');
    expect(stored[0].assignedEventB).toBe('VET-201');
    expect(stored[0].assignedEventC).toBe('VET-203');
  });
});
