import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVenues } from './useVenues';
import { VENUE_DATA } from '../../../data/eventData';

describe('useVenues hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default venue data', () => {
    const { result } = renderHook(() => useVenues());

    expect(result.current.venues).toHaveLength(VENUE_DATA.length);
    expect(result.current.venues[0].name).toBe(VENUE_DATA[0].name);
    expect(result.current.venues[0].floors[0].rooms[0].name).toBe(VENUE_DATA[0].floors[0].rooms[0].name);
  });

  it('should rename a major venue faculty', () => {
    const { result } = renderHook(() => useVenues());
    const facultyIdx = 0;
    const nextName = 'Renamed Faculty of Vet';

    act(() => {
      result.current.renameFaculty(facultyIdx, nextName);
    });

    expect(result.current.venues[facultyIdx].name).toBe(nextName);

    // Verify localStorage persistence
    const stored = localStorage.getItem('so_venues_data');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)[facultyIdx].name).toBe(nextName);
  });

  it('should rename a specific room inside a venue', () => {
    const { result } = renderHook(() => useVenues());
    const targetRoomId = VENUE_DATA[0].floors[0].rooms[0].id; // VET-101
    const nextRoomName = 'New Desk Area 101';

    act(() => {
      result.current.renameRoom(targetRoomId, nextRoomName);
    });

    // Verify change inside hook state
    const firstRoom = result.current.venues[0].floors[0].rooms[0];
    expect(firstRoom.id).toBe(targetRoomId);
    expect(firstRoom.name).toBe(nextRoomName);

    // Verify other rooms remain untouched
    const secondRoom = result.current.venues[0].floors[0].rooms[1];
    expect(secondRoom.name).toBe(VENUE_DATA[0].floors[0].rooms[1].name);

    // Verify localStorage persistence
    const stored = localStorage.getItem('so_venues_data');
    expect(JSON.parse(stored!)[0].floors[0].rooms[0].name).toBe(nextRoomName);
  });

  it('should reset all customized venue names back to defaults', () => {
    const { result } = renderHook(() => useVenues());
    
    act(() => {
      result.current.renameFaculty(0, 'Temporary Faculty');
      result.current.renameRoom(VENUE_DATA[0].floors[0].rooms[0].id, 'Temporary Room');
    });

    expect(result.current.venues[0].name).toBe('Temporary Faculty');

    act(() => {
      result.current.resetVenues();
    });

    expect(result.current.venues[0].name).toBe(VENUE_DATA[0].name);
    expect(result.current.venues[0].floors[0].rooms[0].name).toBe(VENUE_DATA[0].floors[0].rooms[0].name);
  });
});
