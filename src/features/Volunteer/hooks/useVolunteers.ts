import { useState, useEffect, useMemo } from 'react';
import { VOLUNTEER_ROLES } from '../../../data/eventData';
import type { VolunteerTeam } from '../../../data/eventData';

export const useVolunteers = () => {
  const [roles, setRoles] = useState<VolunteerTeam[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load baseline on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_volunteer_allocations');
      if (stored) {
        setRoles(JSON.parse(stored));
      } else {
        setRoles(VOLUNTEER_ROLES);
      }
    } catch (e) {
      console.error('Failed to load volunteer roles from localStorage', e);
      setRoles(VOLUNTEER_ROLES);
    }
  }, []);

  const updateRoleCount = (name: string, value: string) => {
    const numericVal = parseInt(value, 10);
    if (value.trim() === '') {
      setValidationError('Count cannot be empty.');
    } else if (isNaN(numericVal)) {
      setValidationError('Please enter a valid number.');
    } else if (numericVal < 0) {
      setValidationError('Count cannot be negative.');
    } else {
      setValidationError(null);
    }

    const nextRoles = roles.map((role) => {
      if (role.name === name) {
        return {
          ...role,
          count: isNaN(numericVal) || numericVal < 0 ? role.count : numericVal
        };
      }
      return role;
    });

    setRoles(nextRoles);

    // Save only if valid
    if (!isNaN(numericVal) && numericVal >= 0) {
      try {
        localStorage.setItem('so_volunteer_allocations', JSON.stringify(nextRoles));
      } catch (e) {
        console.error('Failed to save volunteer roles to localStorage', e);
      }
    }
  };

  const totalVolunteers = useMemo(() => {
    return roles.reduce((acc, curr) => acc + curr.count, 0);
  }, [roles]);

  const resetRoles = () => {
    setRoles(VOLUNTEER_ROLES);
    setValidationError(null);
    try {
      localStorage.setItem('so_volunteer_allocations', JSON.stringify(VOLUNTEER_ROLES));
    } catch (e) {
      console.error('Failed to reset volunteer roles in localStorage', e);
    }
  };

  return {
    roles,
    totalVolunteers,
    updateRoleCount,
    resetRoles,
    validationError
  };
};
export default useVolunteers;
