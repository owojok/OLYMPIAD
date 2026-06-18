import { useState, useEffect, useMemo } from 'react';

export interface CommitteeMember {
  id: string;
  name: string;
  role: 'Overall Lead' | 'Sub-Lead' | 'Member';
  assignedTask: string;
}

export const TOURNAMENT_TASKS = [
  'Overall Tournament Coordination',
  'Sub-Lead Operations & Oversight',
  'School Accreditation & Welcome Desk',
  'Judges Liaison & Score Compilation',
  'Lab Setup & Safety Officer',
  'Logistics, Signage & Runners',
  'Catering Coordinator',
  'First Aid Support Officer',
  'Security Liaison & Evacuation Coordinator',
  'Media, Photography & PR',
  'Command Center Communications',
  'VIP Hospitality Coordinator',
  'Unassigned'
];

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  { id: 'cm-01', name: 'Prof. Sarah Benjamin Lwahas', role: 'Overall Lead', assignedTask: 'Overall Tournament Coordination' },
  { id: 'cm-02', name: 'Naomi Embaga', role: 'Sub-Lead', assignedTask: 'Sub-Lead Operations & Oversight' },
  { id: 'cm-03', name: 'Yakubu Gomos', role: 'Member', assignedTask: 'Unassigned' },
  { id: 'cm-04', name: 'Alfa, Eseoghene Sarah', role: 'Member', assignedTask: 'School Accreditation & Welcome Desk' },
  { id: 'cm-05', name: 'Stanley Ishaku Jampak', role: 'Member', assignedTask: 'Judges Liaison & Score Compilation' },
  { id: 'cm-06', name: 'Ibrahim Isah', role: 'Member', assignedTask: 'Lab Setup & Safety Officer' },
  { id: 'cm-07', name: 'Agnes Longshal', role: 'Member', assignedTask: 'Logistics, Signage & Runners' },
  { id: 'cm-08', name: 'Jenifer Dalut', role: 'Member', assignedTask: 'Catering Coordinator' },
  { id: 'cm-09', name: 'Ameh James Ojo', role: 'Member', assignedTask: 'First Aid Support Officer' },
  { id: 'cm-10', name: 'Turaki Umar', role: 'Member', assignedTask: 'Security Liaison & Evacuation Coordinator' },
  { id: 'cm-11', name: 'Magdalene Gongden', role: 'Member', assignedTask: 'Media, Photography & PR' },
  { id: 'cm-12', name: 'David Sunday Davou', role: 'Member', assignedTask: 'Command Center Communications' },
  { id: 'cm-13', name: 'Tabitha Nansel Yemtet', role: 'Member', assignedTask: 'VIP Hospitality Coordinator' },
  { id: 'cm-14', name: 'Umar Othman Fatima', role: 'Member', assignedTask: 'School Accreditation & Welcome Desk' },
  { id: 'cm-15', name: 'Owojori Olawumi Damilare', role: 'Member', assignedTask: 'Logistics, Signage & Runners' }
];

export const useCommittee = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);

  // Load from localStorage or set defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_committee_members');
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        setMembers(INITIAL_COMMITTEE);
      }
    } catch (e) {
      console.error('Failed to load committee members from localStorage', e);
      setMembers(INITIAL_COMMITTEE);
    }
  }, []);

  const saveToStorage = (updatedMembers: CommitteeMember[]) => {
    try {
      localStorage.setItem('so_committee_members', JSON.stringify(updatedMembers));
    } catch (e) {
      console.error('Failed to save committee members to localStorage', e);
    }
  };

  const reassignTask = (memberId: string, task: string) => {
    setMembers((prev) => {
      const updated = prev.map((m) =>
        m.id === memberId ? { ...m, assignedTask: task } : m
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const resetAssignments = () => {
    setMembers(INITIAL_COMMITTEE);
    try {
      localStorage.setItem('so_committee_members', JSON.stringify(INITIAL_COMMITTEE));
    } catch (e) {
      console.error('Failed to reset committee assignments in localStorage', e);
    }
  };

  const stats = useMemo(() => {
    const total = members.length;
    const assigned = members.filter((m) => m.assignedTask !== 'Unassigned').length;
    const unassigned = total - assigned;

    return {
      total,
      assigned,
      unassigned
    };
  }, [members]);

  return {
    members,
    reassignTask,
    resetAssignments,
    tasks: TOURNAMENT_TASKS,
    stats
  };
};

export default useCommittee;
