import { useState, useEffect } from 'react';
import { VOLUNTEER_TRAINING } from '../../../data/eventData';

export const useVolunteerChecklist = () => {
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_volunteer_training');
      if (stored) {
        setCompletedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load volunteer training state from localStorage', e);
    }
  }, []);

  const toggleSession = (id: string) => {
    const nextState = completedSessions.includes(id)
      ? completedSessions.filter((sId) => sId !== id)
      : [...completedSessions, id];

    setCompletedSessions(nextState);
    try {
      localStorage.setItem('so_volunteer_training', JSON.stringify(nextState));
    } catch (e) {
      console.error('Failed to save volunteer training state to localStorage', e);
    }
  };

  const progressPercent = Math.round(
    (completedSessions.length / VOLUNTEER_TRAINING.length) * 100
  );

  return {
    completedSessions,
    toggleSession,
    progressPercent
  };
};
export default useVolunteerChecklist;
