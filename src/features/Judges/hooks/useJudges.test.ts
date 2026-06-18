import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJudges } from './useJudges';
import { INITIAL_JUDGES } from '../../../data/eventData';

describe('useJudges hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default judges and zero check-ins', () => {
    const { result } = renderHook(() => useJudges());

    expect(result.current.judges).toHaveLength(INITIAL_JUDGES.length);
    expect(result.current.stats.totalExpected).toBe(INITIAL_JUDGES.length);
    expect(result.current.stats.totalPresent).toBe(0);
    expect(result.current.stats.percentPresent).toBe(0);
  });

  it('should toggle a judge check-in status', () => {
    const { result } = renderHook(() => useJudges());
    const firstJudgeId = INITIAL_JUDGES[0].id;

    expect(result.current.judges[0].present).toBe(false);

    // Toggle check-in to true
    act(() => {
      result.current.toggleJudgeCheckIn(firstJudgeId);
    });

    expect(result.current.judges[0].present).toBe(true);
    expect(result.current.stats.totalPresent).toBe(1);

    // Toggle check-in back to false
    act(() => {
      result.current.toggleJudgeCheckIn(firstJudgeId);
    });

    expect(result.current.judges[0].present).toBe(false);
    expect(result.current.stats.totalPresent).toBe(0);
  });

  it('should add a new judge to the list', () => {
    const { result } = renderHook(() => useJudges());

    act(() => {
      result.current.addJudge('Test Judge', 'test@example.com', '+2348000000000', 'Chemistry Lab Event');
    });

    expect(result.current.judges).toHaveLength(INITIAL_JUDGES.length + 1);
    const addedJudge = result.current.judges[result.current.judges.length - 1];
    expect(addedJudge.name).toBe('Test Judge');
    expect(addedJudge.email).toBe('test@example.com');
    expect(addedJudge.phone).toBe('+2348000000000');
    expect(addedJudge.assignedEvent).toBe('Chemistry Lab Event');
    expect(addedJudge.present).toBe(false);
  });

  it('should update an existing judge\'s fields', () => {
    const { result } = renderHook(() => useJudges());
    const targetId = INITIAL_JUDGES[0].id;

    // Roland Hoomkwap has missing email/phone by default
    expect(result.current.judges[0].email).toBe('');

    act(() => {
      result.current.updateJudge(targetId, { email: 'roland@example.com', phone: '+2348033334444' });
    });

    expect(result.current.judges[0].email).toBe('roland@example.com');
    expect(result.current.judges[0].phone).toBe('+2348033334444');
  });

  it('should delete a judge from the list', () => {
    const { result } = renderHook(() => useJudges());
    const firstJudgeId = INITIAL_JUDGES[0].id;

    act(() => {
      result.current.deleteJudge(firstJudgeId);
    });

    expect(result.current.judges).toHaveLength(INITIAL_JUDGES.length - 1);
    expect(result.current.judges.find(j => j.id === firstJudgeId)).toBeUndefined();
  });

  it('should reset the judges roster back to defaults', () => {
    const { result } = renderHook(() => useJudges());

    // Add a judge and modify a field
    act(() => {
      result.current.addJudge('Temporary Judge', 'temp@example.com', '', 'None');
      result.current.updateJudge(INITIAL_JUDGES[0].id, { email: 'modified@example.com' });
    });

    expect(result.current.judges.length).toBe(INITIAL_JUDGES.length + 1);

    // Reset roster
    act(() => {
      result.current.resetJudges();
    });

    expect(result.current.judges).toHaveLength(INITIAL_JUDGES.length);
    expect(result.current.judges[0].email).toBe('');
  });
});
