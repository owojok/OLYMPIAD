import { useState, useEffect, useMemo } from 'react';
import { INITIAL_JUDGES } from '../../../data/eventData';
import type { Judge } from '../../../data/eventData';

export const useJudges = () => {
  const [judges, setJudges] = useState<Judge[]>([]);

  // Load from localStorage or initialize with default judges
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_judges_roster');
      if (stored) {
        setJudges(JSON.parse(stored));
      } else {
        setJudges(INITIAL_JUDGES);
      }
    } catch (e) {
      console.error('Failed to load judges from localStorage', e);
      setJudges(INITIAL_JUDGES);
    }
  }, []);

  // Save changes to localStorage helper
  const saveToStorage = (updatedJudges: Judge[]) => {
    try {
      localStorage.setItem('so_judges_roster', JSON.stringify(updatedJudges));
    } catch (e) {
      console.error('Failed to save judges to localStorage', e);
    }
  };

  const toggleJudgeCheckIn = (id: string) => {
    setJudges((prev) => {
      const nextState = prev.map((judge) =>
        judge.id === id ? { ...judge, present: !judge.present } : judge
      );
      saveToStorage(nextState);
      return nextState;
    });
  };

  const addJudge = (name: string, email: string, phone: string, assignedEvent: string) => {
    const newJudge: Judge = {
      id: `jdg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      assignedEvent: assignedEvent.trim(),
      present: false,
    };

    setJudges((prev) => {
      const nextState = [...prev, newJudge];
      saveToStorage(nextState);
      return nextState;
    });
  };

  const updateJudge = (id: string, updatedFields: Partial<Omit<Judge, 'id'>>) => {
    setJudges((prev) => {
      const nextState = prev.map((judge) =>
        judge.id === id ? { ...judge, ...updatedFields } : judge
      );
      saveToStorage(nextState);
      return nextState;
    });
  };

  const deleteJudge = (id: string) => {
    setJudges((prev) => {
      const nextState = prev.filter((judge) => judge.id !== id);
      saveToStorage(nextState);
      return nextState;
    });
  };

  const resetJudges = () => {
    setJudges(INITIAL_JUDGES);
    try {
      localStorage.setItem('so_judges_roster', JSON.stringify(INITIAL_JUDGES));
    } catch (e) {
      console.error('Failed to reset judges in localStorage', e);
    }
  };

  const stats = useMemo(() => {
    const totalExpected = judges.length;
    const totalPresent = judges.filter((j) => j.present).length;
    const percentPresent = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

    return {
      totalExpected,
      totalPresent,
      percentPresent,
    };
  }, [judges]);

  return {
    judges,
    toggleJudgeCheckIn,
    addJudge,
    updateJudge,
    deleteJudge,
    resetJudges,
    stats,
  };
};

export default useJudges;
