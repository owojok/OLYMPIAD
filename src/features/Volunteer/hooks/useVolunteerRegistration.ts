import { useState, useEffect, useMemo } from 'react';

export interface RegisteredVolunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  timestamp: string;
}

export const INITIAL_REGISTERED_VOLUNTEERS: RegisteredVolunteer[] = [
  { id: 'reg-init-1', fullName: 'Isreal Awolusi', phone: '08109001253', email: 'isreal.awolusi@gmail.com', timestamp: '06/19/2026 11:45 AM' },
  { id: 'reg-init-2', fullName: 'Iliya David Gideon', phone: '08138466049', email: 'gideon.david@gmail.com', timestamp: '06/19/2026 11:45 AM' },
  { id: 'reg-init-3', fullName: 'Nanchin Isaac Dawam', phone: '09030549833', email: 'dawam.nanchin@gmail.com', timestamp: '06/19/2026 11:45 AM' },
  { id: 'reg-init-4', fullName: 'DANJUMA RICHARD', phone: '08101437988', email: 'richard.danjuma@gmail.com', timestamp: '06/19/2026 11:45 AM' },
  { id: 'reg-init-5', fullName: 'Musa G Yohanna', phone: '09032943213', email: 'yohanna.musa@gmail.com', timestamp: '06/19/2026 11:45 AM' }
];

export const useVolunteerRegistration = () => {
  const [registeredVolunteers, setRegisteredVolunteers] = useState<RegisteredVolunteer[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_registered_volunteers');
      if (stored) {
        setRegisteredVolunteers(JSON.parse(stored));
      } else {
        setRegisteredVolunteers(INITIAL_REGISTERED_VOLUNTEERS);
      }
    } catch (e) {
      console.error('Failed to load registered volunteers from localStorage', e);
      setRegisteredVolunteers(INITIAL_REGISTERED_VOLUNTEERS);
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
