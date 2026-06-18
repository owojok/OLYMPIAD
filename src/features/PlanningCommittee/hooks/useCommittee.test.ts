import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommittee } from './useCommittee';

describe('useCommittee Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with baseline committee members', () => {
    const { result } = renderHook(() => useCommittee());

    expect(result.current.members.length).toBe(15);
    
    const lead = result.current.members.find(m => m.role === 'Overall Lead');
    expect(lead?.name).toBe('Prof. Sarah Benjamin Lwahas');
    expect(lead?.assignedTask).toBe('Overall Tournament Coordination');

    const subLead = result.current.members.find(m => m.role === 'Sub-Lead');
    expect(subLead?.name).toBe('Naomi Embaga');
    expect(subLead?.assignedTask).toBe('Sub-Lead Operations & Oversight');

    const unassigned = result.current.members.find(m => m.name === 'Yakubu Gomos');
    expect(unassigned?.assignedTask).toBe('Unassigned');
  });

  it('reassigns tasks and persists them to localStorage', () => {
    const { result } = renderHook(() => useCommittee());

    // Trigger state loading
    act(() => {});

    const targetMember = result.current.members.find(m => m.name === 'Yakubu Gomos')!;
    
    act(() => {
      result.current.reassignTask(targetMember.id, 'Catering Coordinator');
    });

    const updatedMember = result.current.members.find(m => m.name === 'Yakubu Gomos')!;
    expect(updatedMember.assignedTask).toBe('Catering Coordinator');

    // Verify localStorage matches
    const stored = JSON.parse(localStorage.getItem('so_committee_members') || '[]');
    const storedMember = stored.find((m: any) => m.name === 'Yakubu Gomos');
    expect(storedMember.assignedTask).toBe('Catering Coordinator');
  });

  it('calculates stats dynamically', () => {
    const { result } = renderHook(() => useCommittee());
    act(() => {});

    expect(result.current.stats.total).toBe(15);
    expect(result.current.stats.assigned).toBe(14); // 14 assigned, Yakubu Gomos is unassigned
    expect(result.current.stats.unassigned).toBe(1);

    const targetMember = result.current.members.find(m => m.name === 'Yakubu Gomos')!;
    
    act(() => {
      result.current.reassignTask(targetMember.id, 'Catering Coordinator');
    });

    expect(result.current.stats.assigned).toBe(15);
    expect(result.current.stats.unassigned).toBe(0);
  });

  it('resets assignments to baseline values', () => {
    const { result } = renderHook(() => useCommittee());
    act(() => {});

    const targetMember = result.current.members.find(m => m.name === 'Yakubu Gomos')!;
    act(() => {
      result.current.reassignTask(targetMember.id, 'Catering Coordinator');
    });

    expect(result.current.members.find(m => m.name === 'Yakubu Gomos')?.assignedTask).toBe('Catering Coordinator');

    act(() => {
      result.current.resetAssignments();
    });

    expect(result.current.members.find(m => m.name === 'Yakubu Gomos')?.assignedTask).toBe('Unassigned');
  });
});
