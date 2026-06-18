import { useState, useEffect } from 'react';
import { VENUE_DATA } from '../../../data/eventData';
import type { VenueLayout } from '../../../data/eventData';

export const useVenues = () => {
  const [venues, setVenues] = useState<VenueLayout[]>([]);

  // Load from localStorage or default
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_venues_data');
      if (stored) {
        setVenues(JSON.parse(stored));
      } else {
        setVenues(VENUE_DATA);
      }
    } catch (e) {
      console.error('Failed to load venue data from localStorage', e);
      setVenues(VENUE_DATA);
    }
  }, []);

  const saveToStorage = (updatedVenues: VenueLayout[]) => {
    try {
      localStorage.setItem('so_venues_data', JSON.stringify(updatedVenues));
    } catch (e) {
      console.error('Failed to save venue data to localStorage', e);
    }
  };

  const renameFaculty = (facultyIndex: number, newName: string) => {
    if (newName.trim() === '') return;
    setVenues((prev) => {
      const next = prev.map((fac, idx) =>
        idx === facultyIndex ? { ...fac, name: newName.trim() } : fac
      );
      saveToStorage(next);
      return next;
    });
  };

  const renameRoom = (roomId: string, newName: string) => {
    if (newName.trim() === '') return;
    setVenues((prev) => {
      const next = prev.map((fac) => ({
        ...fac,
        floors: fac.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.map((room) =>
            room.id === roomId ? { ...room, name: newName.trim() } : room
          ),
        })),
      }));
      saveToStorage(next);
      return next;
    });
  };

  const resetVenues = () => {
    setVenues(VENUE_DATA);
    try {
      localStorage.setItem('so_venues_data', JSON.stringify(VENUE_DATA));
    } catch (e) {
      console.error('Failed to reset venue data in localStorage', e);
    }
  };

  return {
    venues,
    renameFaculty,
    renameRoom,
    resetVenues,
  };
};

export default useVenues;
