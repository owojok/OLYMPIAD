import { useState, useEffect, useMemo } from 'react';
import { PARTICIPATING_SCHOOLS } from '../../../data/eventData';

export interface SchoolCheckInDetails {
  schoolId: string;
  studentNames: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  timestamp: string;
}

export const useSchools = () => {
  const [checkInRecords, setCheckInRecords] = useState<Record<string, SchoolCheckInDetails>>({});

  // Load from local storage, with migration path
  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem('so_schools_records');
      if (storedRecords) {
        setCheckInRecords(JSON.parse(storedRecords));
      } else {
        // Fallback/Migration: check if old checkedInIds array exists
        const oldStored = localStorage.getItem('so_schools_present');
        if (oldStored) {
          const ids: string[] = JSON.parse(oldStored);
          const migratedRecords: Record<string, SchoolCheckInDetails> = {};
          ids.forEach((id) => {
            migratedRecords[id] = {
              schoolId: id,
              studentNames: 'Registered Student Group',
              teacherName: 'Coach Assigned',
              teacherEmail: '',
              teacherPhone: '',
              timestamp: new Date().toLocaleTimeString(),
            };
          });
          setCheckInRecords(migratedRecords);
          localStorage.setItem('so_schools_records', JSON.stringify(migratedRecords));
        }
      }
    } catch (e) {
      console.error('Failed to load school check-in records from localStorage', e);
    }
  }, []);

  const saveToStorage = (records: Record<string, SchoolCheckInDetails>) => {
    try {
      localStorage.setItem('so_schools_records', JSON.stringify(records));
      // Keep so_schools_present array in sync for backward compatibility (e.g. tests or simple queries)
      localStorage.setItem('so_schools_present', JSON.stringify(Object.keys(records)));
    } catch (e) {
      console.error('Failed to save school check-in records to localStorage', e);
    }
  };

  const checkInSchool = (
    id: string,
    studentNames: string,
    teacherName: string,
    teacherEmail: string,
    teacherPhone: string
  ) => {
    setCheckInRecords((prev) => {
      const nextRecords = {
        ...prev,
        [id]: {
          schoolId: id,
          studentNames: studentNames.trim(),
          teacherName: teacherName.trim(),
          teacherEmail: teacherEmail.trim(),
          teacherPhone: teacherPhone.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
      saveToStorage(nextRecords);
      return nextRecords;
    });
  };

  const updateCheckInDetails = (
    id: string,
    studentNames: string,
    teacherName: string,
    teacherEmail: string,
    teacherPhone: string
  ) => {
    setCheckInRecords((prev) => {
      if (!prev[id]) return prev;
      const nextRecords = {
        ...prev,
        [id]: {
          ...prev[id],
          studentNames: studentNames.trim(),
          teacherName: teacherName.trim(),
          teacherEmail: teacherEmail.trim(),
          teacherPhone: teacherPhone.trim(),
        },
      };
      saveToStorage(nextRecords);
      return nextRecords;
    });
  };

  const checkOutSchool = (id: string) => {
    setCheckInRecords((prev) => {
      const nextRecords = { ...prev };
      delete nextRecords[id];
      saveToStorage(nextRecords);
      return nextRecords;
    });
  };

  const isCheckedIn = (id: string) => {
    return !!checkInRecords[id];
  };

  const getCheckInDetails = (id: string) => {
    return checkInRecords[id] || null;
  };

  const stats = useMemo(() => {
    const schoolsB = PARTICIPATING_SCHOOLS.filter((s) => s.division === 'B');
    const schoolsC = PARTICIPATING_SCHOOLS.filter((s) => s.division === 'C');

    const presentIds = Object.keys(checkInRecords);
    const presentB = schoolsB.filter((s) => presentIds.includes(s.id)).length;
    const presentC = schoolsC.filter((s) => presentIds.includes(s.id)).length;

    const totalExpected = PARTICIPATING_SCHOOLS.length;
    const totalPresent = presentIds.length;
    const percentPresent = totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0;

    return {
      totalExpected,
      totalPresent,
      percentPresent,
      expectedB: schoolsB.length,
      presentB,
      expectedC: schoolsC.length,
      presentC,
    };
  }, [checkInRecords]);

  const resetCheckIns = () => {
    setCheckInRecords({});
    try {
      localStorage.setItem('so_schools_records', JSON.stringify({}));
      localStorage.setItem('so_schools_present', JSON.stringify([]));
    } catch (e) {
      console.error('Failed to reset school check-in records in localStorage', e);
    }
  };

  return {
    schools: PARTICIPATING_SCHOOLS,
    checkInSchool,
    updateCheckInDetails,
    checkOutSchool,
    isCheckedIn,
    getCheckInDetails,
    stats,
    resetCheckIns,
  };
};

export default useSchools;
