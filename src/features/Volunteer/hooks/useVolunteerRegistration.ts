import { useState, useEffect, useMemo } from 'react';

export interface RegisteredVolunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  timestamp: string;
}

export const useVolunteerRegistration = () => {
  const [registeredVolunteers, setRegisteredVolunteers] = useState<RegisteredVolunteer[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_registered_volunteers');
      if (stored) {
        setRegisteredVolunteers(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load registered volunteers from localStorage', e);
    }
  }, []);

  const saveToStorage = (updatedList: RegisteredVolunteer[]) => {
    try {
      localStorage.setItem('so_registered_volunteers', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save registered volunteers to localStorage', e);
    }
  };

  const registerVolunteer = (fullName: string, phone: string, email: string) => {
    const newReg: RegisteredVolunteer = {
      id: `reg-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setRegisteredVolunteers((prev) => {
      const next = [...prev, newReg];
      saveToStorage(next);
      return next;
    });
  };

  const deleteRegistration = (id: string) => {
    setRegisteredVolunteers((prev) => {
      const next = prev.filter((item) => item.id !== id);
      saveToStorage(next);
      return next;
    });
  };

  const clearRegistrations = () => {
    setRegisteredVolunteers([]);
    try {
      localStorage.setItem('so_registered_volunteers', JSON.stringify([]));
    } catch (e) {
      console.error('Failed to reset registered volunteers in localStorage', e);
    }
  };

  const stats = useMemo(() => {
    return {
      totalRegistered: registeredVolunteers.length
    };
  }, [registeredVolunteers]);

  return {
    registeredVolunteers,
    registerVolunteer,
    deleteRegistration,
    clearRegistrations,
    stats
  };
};

export default useVolunteerRegistration;
