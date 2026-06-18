import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchools } from './useSchools';
import { PARTICIPATING_SCHOOLS } from '../../../data/eventData';

describe('useSchools hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no schools checked in', () => {
    const { result } = renderHook(() => useSchools());

    expect(result.current.schools).toHaveLength(PARTICIPATING_SCHOOLS.length);
    expect(result.current.stats.totalExpected).toBe(PARTICIPATING_SCHOOLS.length);
    expect(result.current.stats.totalPresent).toBe(0);
    expect(result.current.stats.percentPresent).toBe(0);
  });

  it('should check in a school with student and teacher details', () => {
    const { result } = renderHook(() => useSchools());
    const targetSchoolId = PARTICIPATING_SCHOOLS[0].id;

    expect(result.current.isCheckedIn(targetSchoolId)).toBe(false);

    // Check in school with details
    act(() => {
      result.current.checkInSchool(
        targetSchoolId,
        'Jane Doe, John Smith',
        'Mr. Yusuf',
        'yusuf@school.com',
        '+2348011112222'
      );
    });

    expect(result.current.isCheckedIn(targetSchoolId)).toBe(true);
    expect(result.current.stats.totalPresent).toBe(1);

    const details = result.current.getCheckInDetails(targetSchoolId);
    expect(details).not.toBeNull();
    expect(details!.studentNames).toBe('Jane Doe, John Smith');
    expect(details!.teacherName).toBe('Mr. Yusuf');
    expect(details!.teacherEmail).toBe('yusuf@school.com');
    expect(details!.teacherPhone).toBe('+2348011112222');

    // Check localStorage keys
    const storedRecords = localStorage.getItem('so_schools_records');
    expect(storedRecords).not.toBeNull();
    expect(JSON.parse(storedRecords!)[targetSchoolId].teacherName).toBe('Mr. Yusuf');
  });

  it('should update check-in details', () => {
    const { result } = renderHook(() => useSchools());
    const targetSchoolId = PARTICIPATING_SCHOOLS[0].id;

    act(() => {
      result.current.checkInSchool(
        targetSchoolId,
        'Jane Doe',
        'Mr. Yusuf',
        'yusuf@school.com',
        ''
      );
    });

    expect(result.current.getCheckInDetails(targetSchoolId)!.teacherPhone).toBe('');

    // Update details
    act(() => {
      result.current.updateCheckInDetails(
        targetSchoolId,
        'Jane Doe',
        'Mr. Yusuf',
        'yusuf@school.com',
        '+2348011112222'
      );
    });

    expect(result.current.getCheckInDetails(targetSchoolId)!.teacherPhone).toBe('+2348011112222');
  });

  it('should check out a school', () => {
    const { result } = renderHook(() => useSchools());
    const targetSchoolId = PARTICIPATING_SCHOOLS[0].id;

    act(() => {
      result.current.checkInSchool(
        targetSchoolId,
        'Jane Doe',
        'Mr. Yusuf',
        '',
        ''
      );
    });

    expect(result.current.isCheckedIn(targetSchoolId)).toBe(true);

    // Check out
    act(() => {
      result.current.checkOutSchool(targetSchoolId);
    });

    expect(result.current.isCheckedIn(targetSchoolId)).toBe(false);
    expect(result.current.stats.totalPresent).toBe(0);
  });

  it('should migrate old so_schools_present array format on mount', () => {
    const testSchoolId = PARTICIPATING_SCHOOLS[1].id;
    localStorage.setItem('so_schools_present', JSON.stringify([testSchoolId]));

    const { result } = renderHook(() => useSchools());

    // Verify it migrated and shows checked in
    expect(result.current.isCheckedIn(testSchoolId)).toBe(true);
    expect(result.current.stats.totalPresent).toBe(1);

    const details = result.current.getCheckInDetails(testSchoolId);
    expect(details).not.toBeNull();
    expect(details!.studentNames).toBe('Registered Student Group');
    expect(details!.teacherName).toBe('Coach Assigned');
  });

  it('should reset all records', () => {
    const { result } = renderHook(() => useSchools());
    
    act(() => {
      result.current.checkInSchool(PARTICIPATING_SCHOOLS[0].id, 'Student A', 'Teacher A', '', '');
      result.current.checkInSchool(PARTICIPATING_SCHOOLS[1].id, 'Student B', 'Teacher B', '', '');
    });

    expect(result.current.stats.totalPresent).toBe(2);

    act(() => {
      result.current.resetCheckIns();
    });

    expect(result.current.stats.totalPresent).toBe(0);
    expect(localStorage.getItem('so_schools_records')).toBe(JSON.stringify({}));
  });
});
