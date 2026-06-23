import { useState, useEffect, useMemo } from 'react';

export interface RegisteredVolunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  timestamp: string;
  assignedTeam?: string;
  assignedEventB?: string; // Division B / Shift 1
  assignedEventC?: string; // Division C / Shift 2
}

export const INITIAL_REGISTERED_VOLUNTEERS: RegisteredVolunteer[] = [
  { id: 'reg-init-1', fullName: 'Isreal Awolusi', phone: '08109001253', email: 'isreal.awolusi@gmail.com', timestamp: '06/19/2026 11:45 AM', assignedTeam: 'Registration Team', assignedEventB: 'VET-109', assignedEventC: 'VET-109' },
  { id: 'reg-init-2', fullName: 'Patience Mark', phone: '08031112222', email: 'patience.mark@gmail.com', timestamp: '06/19/2026 11:45 AM', assignedTeam: 'Registration Team', assignedEventB: 'VET-109', assignedEventC: 'VET-109' },
  { id: 'reg-init-3', fullName: 'Nanchin Isaac Dawam', phone: '09030549833', email: 'dawam.nanchin@gmail.com', timestamp: '06/19/2026 11:45 AM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-201', assignedEventC: 'VET-203' },
  { id: 'reg-init-4', fullName: 'DANJUMA RICHARD', phone: '08101437988', email: 'richard.danjuma@gmail.com', timestamp: '06/19/2026 11:45 AM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-201', assignedEventC: 'VET-203' },
  { id: 'reg-init-5', fullName: 'Musa G Yohanna', phone: '09032943213', email: 'yohanna.musa@gmail.com', timestamp: '06/19/2026 11:45 AM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-202', assignedEventC: 'VET-301' },
  { id: 'reg-init-6', fullName: 'Nonyerem Agatha Asadu', phone: '08067248861', email: 'nonyerem.asadu@gmail.com', timestamp: '06/19/2026 11:55 AM', assignedTeam: 'Registration Team', assignedEventB: 'VET-108', assignedEventC: 'VET-102' },
  { id: 'reg-init-7', fullName: 'Grace Ochanya Agene', phone: '09069208659', email: 'grace.agene@gmail.com', timestamp: '06/19/2026 11:55 AM', assignedTeam: 'Registration Team', assignedEventB: 'VET-108', assignedEventC: 'VET-102' },
  { id: 'reg-init-8', fullName: 'Wisdom Chijioke Chidera', phone: '08123332173', email: 'wisdom.chidera@gmail.com', timestamp: '06/19/2026 12:45 PM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-202', assignedEventC: 'VET-301' },
  { id: 'reg-init-9', fullName: 'Maleka Bitrus', phone: '0813 605 3551', email: 'bitrus.maleka@gmail.com', timestamp: '06/19/2026 12:45 PM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-302', assignedEventC: 'VET-302' },
  { id: 'reg-init-10', fullName: 'Bwefuk Isaac Wang', phone: '07065486696', email: 'bwefuk.wang@gmail.com', timestamp: '06/20/2026 03:20 PM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-302', assignedEventC: 'VET-302' },
  { id: 'reg-init-11', fullName: 'Esther Enuwa Eyimonye', phone: '07063776975', email: 'esther.eyimonye@gmail.com', timestamp: '06/20/2026 03:20 PM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-303', assignedEventC: 'VET-303' },
  { id: 'reg-init-12', fullName: 'John Meshach Moses', phone: '08085275586', email: 'john.moses@gmail.com', timestamp: '06/20/2026 03:20 PM', assignedTeam: 'Lab Assistants', assignedEventB: 'VET-303', assignedEventC: 'VET-303' },
  { id: 'reg-init-13', fullName: 'Winifred Ojima Zakari', phone: '08115306430', email: 'winifred.zakari@gmail.com', timestamp: '06/20/2026 03:20 PM', assignedTeam: 'Ushers & Guides', assignedEventB: 'VET-107', assignedEventC: 'VET-107' },
  { id: 'reg-init-14', fullName: 'Abdulsalam Adesina Ayoade', phone: '08077662984', email: 'abdulsalam.ayoade@gmail.com', timestamp: '06/20/2026 03:20 PM', assignedTeam: 'Ushers & Guides', assignedEventB: 'VET-107', assignedEventC: 'VET-107' },
  { id: 'reg-init-15', fullName: 'Michael Eka Emmanuel', phone: '08060536556', email: 'michael.emmanuel@gmail.com', timestamp: '06/23/2026 01:38 AM', assignedTeam: 'Command Center', assignedEventB: 'VET-103', assignedEventC: 'VET-103' },
  { id: 'reg-init-16', fullName: 'Azaachia Jennifer inyaregh', phone: '09039355869', email: 'jennifer.azaachia@gmail.com', timestamp: '06/23/2026 01:38 AM', assignedTeam: 'First Aid Support', assignedEventB: 'VET-105', assignedEventC: 'VET-105' }
];

export const useVolunteerRegistration = () => {
  const [registeredVolunteers, setRegisteredVolunteers] = useState<RegisteredVolunteer[]>([]);

  // Load from localStorage on mount and merge/migrate missing default records idempotently
  useEffect(() => {
    try {
      const stored = localStorage.getItem('so_registered_volunteers');
      if (stored) {
        const rawParsed = JSON.parse(stored) as RegisteredVolunteer[];
        const parsed = rawParsed.map(vol => ({
          ...vol,
          assignedTeam: vol.assignedTeam || 'Ushers & Guides',
          assignedEventB: vol.assignedEventB || 'VET-107',
          assignedEventC: vol.assignedEventC || 'VET-107'
        }));
        const hasAgnesAsVolunteer = parsed.some(vol => vol.fullName.toLowerCase() === 'agnes longshal');
        const hasIliyaAsVolunteer = parsed.some(vol => vol.fullName.toLowerCase() === 'iliya david gideon');
        const hasLegacyNatEvent = parsed.some(vol => vol.assignedEventB?.startsWith('NAT-') || vol.assignedEventC?.startsWith('NAT-'));
        const parsedDefaults = parsed.filter(vol => vol.id.startsWith('reg-init-'));
        const needsAssignmentMigration = hasAgnesAsVolunteer || hasIliyaAsVolunteer || hasLegacyNatEvent || 
          parsedDefaults.length !== INITIAL_REGISTERED_VOLUNTEERS.length ||
          INITIAL_REGISTERED_VOLUNTEERS.some(
            (init) => {
              const match = parsed.find((vol) => vol.fullName.toLowerCase() === init.fullName.toLowerCase() || vol.phone === init.phone);
              return match && (!match.assignedEventB || !match.assignedEventC || match.assignedTeam !== init.assignedTeam);
            }
          );

        if (needsAssignmentMigration) {
          // Remove Iliya and Agnes, rewrite default entries, and clean up NAT events for custom signups
          const filteredParsed = parsed.filter(vol => {
            const name = vol.fullName.toLowerCase();
            return name !== 'iliya david gideon' && name !== 'agnes longshal';
          });
          const customSignups = filteredParsed.filter(vol => !vol.id.startsWith('reg-init-')).map(vol => {
            return {
              ...vol,
              assignedTeam: vol.assignedTeam || 'Ushers & Guides',
              assignedEventB: (vol.assignedEventB?.startsWith('NAT-') || !vol.assignedEventB) ? 'VET-103' : vol.assignedEventB,
              assignedEventC: (vol.assignedEventC?.startsWith('NAT-') || !vol.assignedEventC) ? 'VET-103' : vol.assignedEventC
            };
          });
          const migrated = [...INITIAL_REGISTERED_VOLUNTEERS, ...customSignups];
          setRegisteredVolunteers(migrated);
          localStorage.setItem('so_registered_volunteers', JSON.stringify(migrated));
        } else {
          // Standard merge missing check
          const missingDefaults = INITIAL_REGISTERED_VOLUNTEERS.filter(
            (init) => !parsed.some((vol) => vol.fullName.toLowerCase() === init.fullName.toLowerCase() || vol.phone === init.phone)
          );
          if (missingDefaults.length > 0) {
            const merged = [...parsed, ...missingDefaults];
            setRegisteredVolunteers(merged);
            localStorage.setItem('so_registered_volunteers', JSON.stringify(merged));
          } else {
            setRegisteredVolunteers(parsed);
          }
        }
      } else {
        setRegisteredVolunteers(INITIAL_REGISTERED_VOLUNTEERS);
        localStorage.setItem('so_registered_volunteers', JSON.stringify(INITIAL_REGISTERED_VOLUNTEERS));
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
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedTeam: 'Ushers & Guides', // Default role to ensure no unassigned role (R11)
      assignedEventB: 'VET-107',       // Default Shift B room
      assignedEventC: 'VET-107'        // Default Shift C room
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

  const assignTeam = (id: string, team: string) => {
    console.log(`[Volunteer] Assigning team to volunteer ${id}: ${team}`);
    setRegisteredVolunteers((prev) => {
      const next = prev.map((vol) => vol.id === id ? { ...vol, assignedTeam: team } : vol);
      saveToStorage(next);
      return next;
    });
  };

  const assignEventB = (id: string, eventB: string) => {
    console.log(`[Volunteer] Assigning Shift 1 (B) event to volunteer ${id}: ${eventB}`);
    setRegisteredVolunteers((prev) => {
      const next = prev.map((vol) => vol.id === id ? { ...vol, assignedEventB: eventB } : vol);
      saveToStorage(next);
      return next;
    });
  };

  const assignEventC = (id: string, eventC: string) => {
    console.log(`[Volunteer] Assigning Shift 2 (C) event to volunteer ${id}: ${eventC}`);
    setRegisteredVolunteers((prev) => {
      const next = prev.map((vol) => vol.id === id ? { ...vol, assignedEventC: eventC } : vol);
      saveToStorage(next);
      return next;
    });
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
    assignTeam,
    assignEventB,
    assignEventC,
    stats
  };
};

export default useVolunteerRegistration;
