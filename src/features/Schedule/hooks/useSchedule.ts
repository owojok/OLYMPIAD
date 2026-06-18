import { useState, useMemo } from 'react';
import { TIMELINE_EVENTS } from '../../../data/eventData';
import type { ScheduleEvent } from '../../../data/eventData';

export const useSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('Day 1');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS.filter((event) => {
      // 1. Day Filter
      const eventId = event.id;
      if (selectedDay === 'Setup' && !eventId.startsWith('setup')) return false;
      if (selectedDay === 'Day 1' && !eventId.startsWith('day1')) return false;
      if (selectedDay === 'Day 2' && !eventId.startsWith('day2')) return false;

      // 2. Division Filter (B, C, Setup, Post, Both)
      if (selectedDivision !== 'All') {
        if (event.division !== selectedDivision && event.division !== 'Both') {
          return false;
        }
      }

      // 3. Type Filter
      if (selectedType !== 'All' && event.type !== selectedType) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesLocation = event.location.toLowerCase().includes(query);
        const matchesDetails = event.details.some(d => d.toLowerCase().includes(query));
        const matchesTime = event.time.toLowerCase().includes(query);
        return matchesTitle || matchesLocation || matchesDetails || matchesTime;
      }

      return true;
    });
  }, [searchQuery, selectedDivision, selectedDay, selectedType]);

  return {
    searchQuery,
    setSearchQuery,
    selectedDivision,
    setSelectedDivision,
    selectedDay,
    setSelectedDay,
    selectedType,
    setSelectedType,
    selectedEvent,
    setSelectedEvent,
    viewMode,
    setViewMode,
    filteredEvents,
  };
};
