import { useState, useEffect, useMemo } from 'react';

export interface CommitteeMember {
  id: string;
  name: string;
  role: 'Overall Lead' | 'Sub-Lead' | 'Member';
  assignedTask: string;
  email?: string;
  avatar?: string;
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
  'Lab 1 - Tabitha Chemistry',
  'Lab 2 - Iliya Biology',
  'Lab 3 - Jennifer Chemistry',
  'Lab 4 - Ibrahim Lab',
  'Lab 5 - Davou Lab',
  'Lab 6 - Turaki Lab',
  'Unassigned'
];

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    id: 'cm-01',
    name: 'Prof. Sarah Lawhas',
    role: 'Overall Lead',
    assignedTask: 'Overall Tournament Coordination',
    email: 'Lwahass@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773239690/images/v1773239689935-815948672.jpg'
  },
  {
    id: 'cm-02',
    name: 'Naomi Embaga',
    role: 'Sub-Lead',
    assignedTask: 'Sub-Lead Operations & Oversight',
    email: 'Embagan@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773266000/images/v1773265999899-14019636.jpg'
  },
  {
    id: 'cm-03',
    name: 'Yakubu Gomos',
    role: 'Member',
    assignedTask: 'Unassigned',
    email: 'GomosY@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773265481/images/v1773265479418-681469916.jpg'
  },
  {
    id: 'cm-04',
    name: 'Alfa Eseoghene Sarah',
    role: 'Member',
    assignedTask: 'School Accreditation & Welcome Desk',
    email: 'SarahA@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263451/images/v1773263451295-619310173.jpg'
  },
  {
    id: 'cm-05',
    name: 'Stanley Ishaku Jampak',
    role: 'Member',
    assignedTask: 'Judges Liaison & Score Compilation',
    email: 'Ishakus@unijos.edu.ng'
  },
  {
    id: 'cm-06',
    name: 'Ibrahim Isah',
    role: 'Member',
    assignedTask: 'Lab 4 - Ibrahim Lab',
    email: 'Ibrahim@unijos.edu.ng'
  },
  {
    id: 'cm-07',
    name: 'Admin User',
    role: 'Member',
    assignedTask: 'Logistics, Signage & Runners',
    email: 'admin@advancement.org'
  },
  {
    id: 'cm-08',
    name: 'Jenifer Dalut',
    role: 'Member',
    assignedTask: 'Lab 3 - Jennifer Chemistry',
    email: 'JenifferA@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263287/images/v177326328602-754328793.jpg'
  },
  {
    id: 'cm-09',
    name: 'Ameh James Ojo',
    role: 'Member',
    assignedTask: 'First Aid Support Officer',
    email: 'Amehj@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263800/images/v1773263800508-803934211.jpg'
  },
  {
    id: 'cm-10',
    name: 'Turaki Umar',
    role: 'Member',
    assignedTask: 'Lab 6 - Turaki Lab',
    email: 'Trurakih@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263436/images/v1773263436494-648549821.jpg'
  },
  {
    id: 'cm-11',
    name: 'Magdalene Gongden',
    role: 'Member',
    assignedTask: 'Media, Photography & PR',
    email: 'Magdalene@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263393/images/v1773263393141-926342392.jpg'
  },
  {
    id: 'cm-12',
    name: 'David Sunday Davou',
    role: 'Member',
    assignedTask: 'Lab 5 - Davou Lab',
    email: 'Davoud@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263340/images/v1773263339962-123681223.jpg'
  },
  {
    id: 'cm-13',
    name: 'Tabitha Yemtet',
    role: 'Member',
    assignedTask: 'Lab 1 - Tabitha Chemistry',
    email: 'Yemtett@unijos.edu.ng',
    avatar: 'https://res.cloudinary.com/ddrnyntl9/image/upload/v1773263411/images/v1773263410675-485841937.jpg'
  },
  {
    id: 'cm-14',
    name: 'Umar Othman Fatima',
    role: 'Member',
    assignedTask: 'School Accreditation & Welcome Desk',
    email: 'Fatimaf@unijos.edu.ng'
  },
  {
    id: 'cm-15',
    name: 'Olawumi Damilare Owojori',
    role: 'Member',
    assignedTask: 'Logistics, Signage & Runners',
    email: 'Owojorio@unijos.edu.ng'
  },
  {
    id: 'cm-16',
    name: 'Iliya David Gideon',
    role: 'Member',
    assignedTask: 'Lab 2 - Iliya Biology',
    email: 'IliyaD@unijos.edu.ng'
  },
  {
    id: 'cm-17',
    name: 'Agnes Longshal',
    role: 'Member',
    assignedTask: 'Logistics, Signage & Runners',
    email: 'AgnesL@unijos.edu.ng'
  }
];

export const useCommittee = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);

  // Load from localStorage or set defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_committee_members');
      if (stored) {
        const parsed = JSON.parse(stored) as CommitteeMember[];
        // Merge stored task/role assignments with initial details to ensure emails and avatars are populated
        const merged = INITIAL_COMMITTEE.map(initial => {
          const match = parsed.find(p => p.id === initial.id);
          if (!match) return initial;

          // Migrate old placeholder tasks to the new specific lab assignments
          let assignedTask = match.assignedTask;
          if (initial.id === 'cm-13' && assignedTask === 'VIP Hospitality Coordinator') {
            assignedTask = 'Lab 1 - Tabitha Chemistry';
          } else if (initial.id === 'cm-08' && assignedTask === 'Catering Coordinator') {
            assignedTask = 'Lab 3 - Jennifer Chemistry';
          } else if (initial.id === 'cm-06' && assignedTask === 'Lab Setup & Safety Officer') {
            assignedTask = 'Lab 4 - Ibrahim Lab';
          } else if (initial.id === 'cm-12' && (assignedTask === 'Command Center Communications' || assignedTask === 'Lab 5 - Davou Lab (No Access)')) {
            assignedTask = 'Lab 5 - Davou Lab';
          } else if (initial.id === 'cm-10' && (assignedTask === 'Security Liaison & Evacuation Coordinator' || assignedTask === 'Lab 6 - Turaki Lab (No Access)')) {
            assignedTask = 'Lab 6 - Turaki Lab';
          }

          return {
            ...initial,
            assignedTask,
            role: match.role
          };
        });
        if (parsed.length < INITIAL_COMMITTEE.length) {
          localStorage.setItem('so_committee_members', JSON.stringify(merged));
        }
        setMembers(merged);
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
