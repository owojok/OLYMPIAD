/**
 * Justification: This file contains the complete structured database representing the
 * Science Olympiad Nigeria — Plateau State Tournament 2026. Because it acts as the primary
 * source of truth for the app's static contents, it exceeds 250 lines to keep data centralized.
 */

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  division: 'B' | 'C' | 'Both' | 'Setup' | 'Post';
  type: 'prep' | 'competition' | 'dismissal' | 'ceremony' | 'other';
  location: string;
  details: string[];
}

export interface RoomAllocation {
  id: string;
  name: string;
  type: string;
  allocation: string;
  status: 'active' | 'inactive' | 'prep';
}

export interface FloorLayout {
  floor: string;
  rooms: RoomAllocation[];
}

export interface VenueLayout {
  name: string;
  floors: FloorLayout[];
}

export interface VolunteerTeam {
  name: string;
  count: number;
}

export interface BudgetVal {
  item: string;
  cost: number;
}

export interface RiskItem {
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface ContactItem {
  role: string;
  number: string;
}

export const VENUE_DATA: VenueLayout[] = [
  {
    name: 'Faculty of Veterinary Science',
    floors: [
      {
        floor: 'Ground Floor',
        rooms: [
          { id: 'VET-101', name: 'Room VET-101', type: 'Registration', allocation: 'Registration & Accreditation Desk (Division B)', status: 'active' },
          { id: 'VET-102', name: 'Room VET-102', type: 'Registration', allocation: 'Registration & Accreditation Desk (Division C)', status: 'active' },
          { id: 'VET-103', name: 'Room VET-103', type: 'Office', allocation: 'Volunteer Briefing Room / Command Center', status: 'active' },
          { id: 'VET-104', name: 'Room VET-104', type: 'Office', allocation: 'Judges / Scorers Room (Secure)', status: 'active' },
          { id: 'VET-105', name: 'Room VET-105', type: 'Medical', allocation: 'First Aid Station', status: 'active' },
          { id: 'VET-106', name: 'Room VET-106', type: 'Media', allocation: 'Media / ICT Room', status: 'active' },
        ]
      },
      {
        floor: 'First Floor',
        rooms: [
          { id: 'VET-201', name: 'Lab VET-201', type: 'Biology Lab', allocation: 'Division B: Anatomy & Physiology', status: 'active' },
          { id: 'VET-202', name: 'Lab VET-202', type: 'Biology Lab', allocation: 'Division B: Disease Detectives', status: 'active' },
          { id: 'VET-203', name: 'Lab VET-203', type: 'Biology Lab', allocation: 'Division C: Anatomy & Physiology', status: 'active' },
          { id: 'VET-204', name: 'Room VET-204', type: 'Rest Area', allocation: 'Supervisor Rest Area', status: 'active' },
          { id: 'VET-205', name: 'Room VET-205', type: 'Storage', allocation: 'Equipment Storage', status: 'active' },
        ]
      },
      {
        floor: 'Second Floor',
        rooms: [
          { id: 'VET-301', name: 'Lab VET-301', type: 'Chemistry Lab', allocation: 'Division C: Chemistry Lab Event', status: 'active' },
          { id: 'VET-302', name: 'Lab VET-302', type: 'Chemistry Prep', allocation: 'Chemistry Prep Room', status: 'active' },
          { id: 'VET-303', name: 'Room VET-303', type: 'Office', allocation: 'Results Compilation Room', status: 'active' },
        ]
      }
    ]
  },
  {
    name: 'Faculty of Natural Sciences',
    floors: [
      {
        floor: 'Ground Floor',
        rooms: [
          { id: 'NAT-101', name: 'Room NAT-101', type: 'Registration', allocation: 'Registration Overflow / Late Arrivals', status: 'active' },
          { id: 'NAT-102', name: 'Room NAT-102', type: 'Catering', allocation: 'Catering / Refreshment Station', status: 'active' },
          { id: 'NAT-103', name: 'Room NAT-103', type: 'Security', allocation: 'Security Office', status: 'active' },
          { id: 'NAT-104', name: 'Room NAT-104', type: 'Lost & Found', allocation: 'Lost & Found', status: 'active' },
          { id: 'NAT-H1', name: 'Hall NAT-H1', type: 'Assembly Hall', allocation: 'Assembly Hall / Opening Briefing (Division B)', status: 'active' },
          { id: 'NAT-H2', name: 'Hall NAT-H2', type: 'Assembly Hall', allocation: 'Assembly Hall / Opening Briefing (Division C)', status: 'active' },
        ]
      },
      {
        floor: 'First Floor',
        rooms: [
          { id: 'NAT-201', name: 'Lab NAT-201', type: 'Physics Lab', allocation: 'Division B: Density Lab', status: 'active' },
          { id: 'NAT-202', name: 'Lab NAT-202', type: 'Physics Lab', allocation: 'Division B: Thermodynamics', status: 'active' },
          { id: 'NAT-203', name: 'Lab NAT-203', type: 'Physics Lab', allocation: 'Division C: Circuit Lab', status: 'active' },
          { id: 'NAT-204', name: 'Lab NAT-204', type: 'Physics Lab', allocation: 'Division C: Solar Power', status: 'active' },
          { id: 'NAT-205', name: 'Room NAT-205', type: 'Calibration', allocation: 'Equipment Calibration Station', status: 'active' },
        ]
      },
      {
        floor: 'Second Floor',
        rooms: [
          { id: 'NAT-301', name: 'Workshop NAT-301', type: 'Engineering Workshop', allocation: 'Division B: Battery Buggy', status: 'active' },
          { id: 'NAT-302', name: 'Workshop NAT-302', type: 'Engineering Workshop', allocation: 'Division B: Mystery Architecture', status: 'active' },
          { id: 'NAT-303', name: 'Workshop NAT-303', type: 'Engineering Workshop', allocation: 'Division C: Electric Vehicle', status: 'active' },
          { id: 'NAT-304', name: 'Room NAT-304', type: 'Storage', allocation: 'Tools & Materials Storage', status: 'active' },
        ]
      },
      {
        floor: 'Third Floor',
        rooms: [
          { id: 'NAT-401', name: 'Room NAT-401', type: 'Classroom', allocation: 'Division B: Dynamic Planet', status: 'active' },
          { id: 'NAT-402', name: 'Room NAT-402', type: 'Classroom', allocation: 'Division C: Dynamic Planet', status: 'active' },
          { id: 'NAT-403', name: 'Room NAT-403', type: 'Office', allocation: 'Data Entry / Scoring Station', status: 'active' },
          { id: 'NAT-404', name: 'Room NAT-404', type: 'Meeting Room', allocation: 'VIP Meeting Room / Guest Reception / Coach Briefing', status: 'active' },
        ]
      }
    ]
  },
  {
    name: 'External Areas',
    floors: [
      {
        floor: 'Outdoors',
        rooms: [
          { id: 'PARK-A', name: 'Parking Lot A', type: 'Parking', allocation: 'School Buses / Staff Vehicles (Security manned)', status: 'active' },
          { id: 'PARK-B', name: 'Parking Lot B', type: 'Parking', allocation: 'VIP / Guest Parking', status: 'active' },
          { id: 'WALK-1', name: 'Walkway 1', type: 'Route', allocation: 'Division B route (marked with BLUE tape/arrows)', status: 'active' },
          { id: 'WALK-2', name: 'Walkway 2', type: 'Route', allocation: 'Division C route (marked with RED tape/arrows)', status: 'active' },
          { id: 'ASSEMBLY', name: 'Assembly Point', type: 'Safety', allocation: 'Emergency evacuation zone (both divisions)', status: 'active' },
          { id: 'FOOD-COURT', name: 'Food Court', type: 'Catering', allocation: 'Outdoor refreshment area (tented)', status: 'active' },
        ]
      }
    ]
  }
];

export const TIMELINE_EVENTS: ScheduleEvent[] = [
  // 2 Days Before Event (Online)
  {
    id: 'setup-00',
    time: '05:00 pm (2 Days Before Event)',
    title: 'Judges, Supervisors & Examiners Orientation (Online)',
    division: 'Setup',
    type: 'prep',
    location: 'Google Meet',
    details: [
      'Judges, supervisors & examiners briefing on Google Meet (online)',
      'Scoring platform walk-through & digital interface training',
      'Rules alignment and event-specific questions session'
    ]
  },
  // Setup Day
  {
    id: 'setup-01',
    time: '02:00 pm — 06:00 pm (Setup Day)',
    title: 'Pre-Event Venue Setup',
    division: 'Setup',
    type: 'prep',
    location: 'All Venues',
    details: [
      'Venue access granted to setup team',
      'Signage installation (directional arrows, room labels, banners)',
      'Lab equipment testing & calibration',
      'Furniture arrangement (desks, chairs, judging tables)',
      'Audio-visual equipment setup in all halls',
      'Wi-Fi/network testing in all rooms',
      'First aid stations stocked',
      'Security walk-through'
    ]
  },
  {
    id: 'setup-02',
    time: '04:00 pm (Setup Day)',
    title: 'Volunteer Briefing & Roles',
    division: 'Setup',
    type: 'prep',
    location: 'Command Center (VET-103)',
    details: [
      'Volunteer briefing & role assignment',
      'Walk-through of all routes',
      'Radio/communication device testing',
      'Emergency procedure review',
      'Refreshment station setup'
    ]
  },
  {
    id: 'setup-03',
    time: '05:00 pm (Setup Day)',
    title: 'Volunteer Lead Orientation & Final Prep',
    division: 'Setup',
    type: 'prep',
    location: 'Command Center (VET-103)',
    details: [
      'Volunteer lead orientation & shift briefing in Room VET-103',
      'Physical route walk-through & final placements check',
      'Equipment final check in all competition rooms',
      'Photography of setup for reference'
    ]
  },
  {
    id: 'setup-04',
    time: '06:00 pm (Setup Day)',
    title: 'Security Lockdown',
    division: 'Setup',
    type: 'other',
    location: 'All Venues',
    details: [
      'Security lockdown',
      'Final sweep of all venues',
      'Key handover to night security'
    ]
  },
  // Day 1 Div B
  {
    id: 'day1-b-01',
    time: '07:00 am (Day 1)',
    title: 'Core Team Arrival & Venue Activation',
    division: 'B',
    type: 'prep',
    location: 'Command Center',
    details: [
      'Core Team Arrival: Event Director, Venue Coordinators, Security Lead, Medical Officer, ICT Lead, Volunteer Coordinator',
      'Venue Activation: All labs unlocked, lights on, audio checked, registration stocked, refreshments ready, security manned',
      'Communication Check: Radio channels 1-5 checked, WhatsApp confirmation, emergency contacts verified'
    ]
  },
  {
    id: 'day1-b-02',
    time: '07:30 am (Day 1)',
    title: 'Staff & Volunteer Arrival',
    division: 'B',
    type: 'prep',
    location: 'VET-103 & VET-104',
    details: [
      'Volunteer Briefing: Sign-in at VET-103, badge/t-shirt distribution, role confirmation, route checks, radios distributed',
      'Supervisor Briefing: Sign-in at VET-104, equipment verification, scoring materials collection, lab-specific briefing',
      'Catering Arrival: Water stations filled, snack packs prepared, lunch prep begins'
    ]
  },
  {
    id: 'day1-b-03',
    time: '08:00 am (Day 1)',
    title: 'Final Setup Check & Liaisons Ready',
    division: 'B',
    type: 'prep',
    location: 'All Venues',
    details: [
      'Event Director walk-through, signage verification, clean restroom check, parking attendants active, first aid ready',
      'School Liaison Team: Contact list verified, bus arrival tracking begins, parking team positioned'
    ]
  },
  {
    id: 'day1-b-04',
    time: '08:30 am (Day 1)',
    title: 'School Buses & Teams Arrival',
    division: 'B',
    type: 'prep',
    location: 'Parking Lot A & Entrance Gates',
    details: [
      'Buses arrive at Parking Lot A, guided by parking attendants. Drivers briefed on schedule & parking rules',
      'Welcome Team active at Gates 1 & 2 (4 volunteers per gate) providing directional guidance'
    ]
  },
  {
    id: 'day1-b-05',
    time: '09:00 am (Day 1)',
    title: 'Event Start — Registration & Accreditation',
    division: 'B',
    type: 'other',
    location: 'Room VET-101',
    details: [
      'Accreditation: Queue by school, verify team lists, issue color-coded (BLUE) student ID badges, issue coach badges',
      'Materials: Hand out printed schedules, collect emergency forms, and photo releases',
      'Late Arrival: After 09:15 am, check in at NAT-101 (overflow), liaison phone calls, log in report',
      'Staffing: 4 registration volunteers, 2 queue management, 4 directional guides (Total: 10)'
    ]
  },
  {
    id: 'day1-b-06',
    time: '09:15 am (Day 1)',
    title: 'Registration Wind-down & Assembly',
    division: 'B',
    type: 'prep',
    location: 'Hall NAT-H1',
    details: [
      'Registration desk transitions to info point; report missing schools to Director',
      'Students escorted to Assembly Hall NAT-H1, seated by school in pre-marked rows with 4 ushers',
      'Catering & Security final head counts and coverage checks'
    ]
  },
  {
    id: 'day1-b-07',
    time: '09:30 am (Day 1)',
    title: 'Opening & Teacher Briefings',
    division: 'B',
    type: 'ceremony',
    location: 'Hall NAT-H1 & Room NAT-404',
    details: [
      'Opening Briefing (NAT-H1): Welcomes, house rules, safety exits briefing, competition format overview, Q&A (5 mins)',
      'Teacher/Coach Briefing (NAT-404): Parallel session outlining viewing areas, refreshment schedule, Day 2 info'
    ]
  },
  {
    id: 'day1-b-08',
    time: '09:45 am (Day 1)',
    title: 'Competition Briefing & Volunteer Placements',
    division: 'B',
    type: 'prep',
    location: 'Hall NAT-H1',
    details: [
      'Format & rotation system explanation, time limits (20-25 mins) per station, scoring guidelines',
      'Volunteers final station check-ins via radio'
    ]
  },
  {
    id: 'day1-b-09',
    time: '10:00 am — 12:00 pm (Day 1)',
    title: 'Competition Session (Division B)',
    division: 'B',
    type: 'competition',
    location: 'Labs & Workshops',
    details: [
      'Rotation system active: Groups divide, guided by volunteers through 20-minute rounds with 5-minute transitions',
      'Biology Lab (VET-201/202): Anatomy & Physiology, Disease Detectives. Capacity: 20, 2 Judges, 4 Volunteers, microscopes',
      'Physics Lab (NAT-201/202): Density Lab, Thermodynamics. Capacity: 20, 2 Judges, 4 Volunteers, balances/thermometers',
      'Engineering Workshop (NAT-301/302): Battery Buggy, Mystery Architecture. Capacity: 15, 2 Judges, 4 Volunteers, motors/batteries',
      'Management Sciences (NAT-401): Dynamic Planet. Capacity: 25, 2 Judges, 3 Volunteers, maps/data sheets',
      'Continuous Operations: Water/snacks, escorted toilet breaks, first aid on standby, real-time score compilation'
    ]
  },
  {
    id: 'day1-b-10',
    time: '12:00 pm (Day 1)',
    title: 'Division B Dismissal & Transition Prep',
    division: 'B',
    type: 'dismissal',
    location: 'Hall NAT-H1',
    details: [
      'Students assemble at NAT-H1, return borrowed equipment, badges collected/gifted, bus loading begins',
      'Venue Reset: Labs cleaned & restocked, sensors recalibrated, scores compiled & locked, volunteer break'
    ]
  },
  // Day 1 Div C
  {
    id: 'day1-c-01',
    time: '12:00 pm — 12:30 pm (Day 1)',
    title: 'Lunch Break & Transition',
    division: 'C',
    type: 'prep',
    location: 'All Venues',
    details: [
      'Volunteer, supervisor, and judges lunch (staggered 15-min shifts)',
      'Transition: Division B materials cleared, Division C supplies deployed, room layouts updated',
      'Briefing: Refresher on SSS-level criteria and emergency protocols'
    ]
  },
  {
    id: 'day1-c-02',
    time: '12:30 pm (Day 1)',
    title: 'School Buses Arrival (Division C)',
    division: 'C',
    type: 'prep',
    location: 'Parking Lot A & Gates',
    details: [
      'Division C schools unload under supervision; welcome teams active at Gates 1 & 2'
    ]
  },
  {
    id: 'day1-c-03',
    time: '01:00 pm (Day 1)',
    title: 'Registration & Accreditation (Division C)',
    division: 'C',
    type: 'other',
    location: 'Room VET-102',
    details: [
      'Accreditation: Verify teams, issue color-coded (RED) ID badges, schedules, and collect emergency sheets',
      'Late arrivals processed at NAT-101'
    ]
  },
  {
    id: 'day1-c-04',
    time: '01:15 pm (Day 1)',
    title: 'Registration Wind-down & Assembly',
    division: 'C',
    type: 'prep',
    location: 'Hall NAT-H2',
    details: [
      'Students register and transition to Assembly Hall NAT-H2, ushered by volunteers'
    ]
  },
  {
    id: 'day1-c-05',
    time: '01:30 pm (Day 1)',
    title: 'Opening & Teacher Briefings (Division C)',
    division: 'C',
    type: 'ceremony',
    location: 'Hall NAT-H2 & Room NAT-404',
    details: [
      'Opening Briefing (NAT-H2): Welcomes, house rules, safety exits, SSS competition rules overview, Q&A',
      'Teacher/Coach Briefing (NAT-404): Viewing spots, catering schedules, emergency procedures'
    ]
  },
  {
    id: 'day1-c-06',
    time: '01:45 pm (Day 1)',
    title: 'Format Briefing & Placement',
    division: 'C',
    type: 'prep',
    location: 'Hall NAT-H2',
    details: [
      'Rotation sequence detailed, group guides assigned, volunteers complete final radio checks'
    ]
  },
  {
    id: 'day1-c-07',
    time: '02:00 pm — 04:00 pm (Day 1)',
    title: 'Competition Session (Division C)',
    division: 'C',
    type: 'competition',
    location: 'Labs & Workshops',
    details: [
      'Rotation active: 20-25 minute rounds with 5-minute moves',
      'Biology Lab (VET-203): Anatomy & Physiology. Capacity: 20, 2 Judges, 3 Volunteers, advanced specimens',
      'Chemistry Lab (VET-301): Chemistry Lab Event. Capacity: 20, 2 Judges, 3 Volunteers, glassware/chemicals. Chemical Safety Officer on duty',
      'Physics Lab (NAT-203/204): Circuit Lab, Solar Power. Capacity: 20, 2 Judges, 4 Volunteers, boards/multimeters',
      'Management Sciences (NAT-402): Dynamic Planet. Capacity: 25, 2 Judges, 3 Volunteers, advanced data sets',
      'Engineering Workshop (NAT-303): Electric Vehicle. Capacity: 15, 2 Judges, 3 Volunteers, motors/chassis. 30-min rounds',
      'Continuous Operations: Catering, medical standby, score submissions and verification'
    ]
  },
  {
    id: 'day1-c-08',
    time: '04:00 pm (Day 1)',
    title: 'Division C Competition Ends & Security Sweep',
    division: 'C',
    type: 'dismissal',
    location: 'Hall NAT-H2',
    details: [
      'Assemble at NAT-H2, return materials, collection of badges, bus boarding under usher guidance',
      'Secure: Labs locked, equipment inventoried, final scores compiled, tie-breakers verified in room VET-104'
    ]
  },
  {
    id: 'day1-c-09',
    time: '05:00 pm (Day 1)',
    title: 'Day 1 Wrap-up & Lockdown',
    division: 'C',
    type: 'other',
    location: 'Command Center',
    details: [
      'Core team debrief: Issues logged, Day 2 prep checklists, keys returned to security, building lockdown'
    ]
  },
  // Day 2
  {
    id: 'day2-01',
    time: '07:00 am (Day 2)',
    title: 'Ceremony Setup & Prize Verification',
    division: 'Both',
    type: 'prep',
    location: 'Hall NAT-H1',
    details: [
      'Dignitary area setup: Stage, podium, backdrop, banners, seating arrangements for VIPs and media',
      'Prize Audit: Trophies, medals, and certificates verified and ordered by category on table'
    ]
  },
  {
    id: 'day2-02',
    time: '08:00 am (Day 2)',
    title: 'Staff, Security & Media Placements',
    division: 'Both',
    type: 'prep',
    location: 'Hall NAT-H1 & Parking Lot B',
    details: [
      'Volunteer briefings: Usings, VIP escorts, backstage cue, security guards on gate duty',
      'Media desk: Press kits, cameras, tripods set, live stream links initialized'
    ]
  },
  {
    id: 'day2-03',
    time: '09:00 am (Day 2)',
    title: 'Arrivals & Registration',
    division: 'Both',
    type: 'prep',
    location: 'Hall NAT-H1 & NAT-404',
    details: [
      'Schools arrive and ushered to designated school rows in Hall NAT-H1',
      'VIPs arrive, escorted to VIP Meeting Room (NAT-404) for tea and program briefings'
    ]
  },
  {
    id: 'day2-04',
    time: '10:00 am — 12:00 pm (Day 2)',
    title: 'Closing Ceremony & Prize Giving',
    division: 'Both',
    type: 'ceremony',
    location: 'Hall NAT-H1',
    details: [
      'Opening (10:00-10:30): Processional music, MC welcome, prayer, anthem, dignitaries introduction, VC speech',
      'Keynote (10:30-10:45): Guest speaker address & interactive Q&A',
      'Highlights (10:45-11:00): Video montage of Day 1, Event Director remarks, sponsors recognition',
      'Prize Distribution (11:00-11:45): Trophy & medals for 3rd, 2nd, 1st for Division B then Division C. Individual certificates',
      'Closing (11:45-12:00): Overall champions announced, vote of thanks, closing prayer, recessional'
    ]
  },
  {
    id: 'day2-05',
    time: '12:00 pm — 12:30 pm (Day 2)',
    title: 'Post-Ceremony Media & Photos',
    division: 'Both',
    type: 'other',
    location: 'Hall NAT-H1',
    details: [
      'Photo sessions with trophies, media interviews, certificate pickups, and school dismissal'
    ]
  },
  {
    id: 'day2-06',
    time: '12:30 pm — 02:00 pm (Day 2)',
    title: 'Venue Restoration & Team Debrief',
    division: 'Both',
    type: 'other',
    location: 'All Venues',
    details: [
      'Dismantling stage, returning furniture to original positions, final cleaning sweep, keys return',
      'Debrief: Lessons learned logged, budget balance sheet finalized, reports sent to Science Olympiad Nigeria'
    ]
  }
];

export const VOLUNTEER_ROLES: VolunteerTeam[] = [
  { name: 'Registration Team', count: 5 },
  { name: 'Ushers & Guides', count: 8 },
  { name: 'Lab Assistants', count: 10 },
  { name: 'Runners & Logistics', count: 5 },
  { name: 'Catering & Refreshment', count: 4 },
  { name: 'Security Assistants', count: 3 },
  { name: 'Media & Photography', count: 2 },
  { name: 'First Aid Support', count: 2 },
  { name: 'Command Center', count: 1 }
];

export const VOLUNTEER_TRAINING = [
  { id: 'vt-1', title: 'Session 1: Orientation', details: 'Event overview & mission, role training, venue walk-through, emergency protocols, communication' },
  { id: 'vt-2', title: 'Session 2: Practical Drills', details: 'Mock registrations, lab safety drill, evacuation practice, radio communication trial, customer service guidelines' },
  { id: 'vt-3', title: 'Session 3: Final Briefing', details: 'Final role checks, schedule reviews, contact lists distribution, badge/uniform collection, shifts assignment' }
];

export const MATERIAL_CHECKLISTS: { [category: string]: string[] } = {
  'Registration Desk': [
    'Master school list (printed ×3)',
    'Student ID badge blanks (BLUE for B, RED for C)',
    'Badge printer & backup',
    'Lanyards',
    'Schedule handouts (Division B ×200, Division C ×200)',
    'Pens, markers, highlighters',
    'Clipboards',
    'Emergency contact forms',
    'Sign-in sheets',
    'Name tags for volunteers',
    'Lost & found log book'
  ],
  'Lab Equipment (Per Lab)': [
    'Event-specific equipment (see event list)',
    'Backup equipment (20% extra)',
    'Safety equipment (goggles, gloves, lab coats)',
    'First aid kit',
    'Fire extinguisher',
    'Spill kit',
    'Waste disposal bins',
    'Timer/stopwatch',
    'Scoring sheets (printed × sessions needed)',
    'Clipboards',
    'Pens (black, red)',
    'Calculator',
    'Water station'
  ],
  'Command Center': [
    'Master schedule (large print)',
    'Contact list (all personnel)',
    'Incident report forms',
    'Backup power (generator)',
    'Printer & paper',
    'Laptop 2',
    'Whiteboard & markers',
    'Clock (synchronized)'
  ],
  'Catering': [
    'Snack packs (500)',
    'Trash bins with liners',
    'Napkins',
  ],
  'Media/Photography': [
    'Cameras (2 professional + 1 backup)',
    'Memory cards (extra)',
    'Batteries & chargers',
    'Tripods',
    'Lighting equipment',
    'Interview backdrop',
    'Press kits',
    'Social media access credentials'
  ],
  'Ceremony & Hall Logistics': [
    'Hall permission (signed document)',
    'Chairs for all (students & audience)',
    'Sound system',
    'High table setup',
    'Chairs and table',
    'P.A system'
  ]
};

export const INITIAL_BUDGET: BudgetVal[] = [
  { item: 'Venue Rental (2 days)', cost: 150000 },
  { item: 'Equipment & Materials', cost: 300000 },
  { item: 'Volunteer Refreshment & Lunch', cost: 80000 },
  { item: 'Student Refreshment', cost: 100000 },
  { item: 'Prizes (Trophies, Medals, Certificates)', cost: 200000 },
  { item: 'Printing (Schedules, Badges)', cost: 50000 },
  { item: 'Signage & Banners', cost: 80000 },
  { item: 'Audio-Visual Rental', cost: 120000 },
  { item: 'Security Services', cost: 60000 },
  { item: 'Medical Support', cost: 40000 },
  { item: 'Catering (Day 2 Ceremony)', cost: 150000 },
  { item: 'Media & Photography', cost: 80000 },
  { item: 'Transportation (if needed)', cost: 50000 },
  { item: 'Contingency (10%)', cost: 146000 }
];

export const RISK_MATRIX: RiskItem[] = [
  { risk: 'Equipment failure', likelihood: 'Medium', impact: 'High', mitigation: 'Backup equipment; technician on-site' },
  { risk: 'Student injury', likelihood: 'Low', impact: 'High', mitigation: 'First aid stations; medical officer' },
  { risk: 'Overcrowding', likelihood: 'Medium', impact: 'Medium', mitigation: 'Capacity limits; crowd control' },
  { risk: 'Power outage', likelihood: 'Low', impact: 'High', mitigation: 'Generator backup; battery-powered equipment' },
  { risk: 'Bad weather', likelihood: 'Low', impact: 'Medium', mitigation: 'Indoor venues; rain plan for outdoor' },
  { risk: 'Late school arrival', likelihood: 'High', impact: 'Low', mitigation: 'Buffer time; overflow registration' },
  { risk: 'Volunteer no-show', likelihood: 'Medium', impact: 'Medium', mitigation: 'Over-recruit; shift flexibility' },
  { risk: 'Data loss', likelihood: 'Low', impact: 'High', mitigation: 'Cloud backup; paper backup scores' },
  { risk: 'Security breach', likelihood: 'Low', impact: 'High', mitigation: 'Security personnel; access control' },
  { risk: 'Catering shortage', likelihood: 'Low', impact: 'Medium', mitigation: 'Over-order; backup supplier' }
];

export const CONTACT_LIST: ContactItem[] = [
  { role: 'University Security', number: '+234 803 123 4567' },
  { role: 'University Health Centre', number: '+234 805 987 6543' },
  { role: 'Fire Service', number: '112' },
  { role: 'Police', number: '+234 809 333 4444' },
  { role: 'Ambulance', number: '112' },
  { role: 'Event Director', number: '+234 703 555 1212' },
  { role: 'Volunteer Coordinator', number: '+234 812 777 8888' },
  { role: 'Venue Manager (Vet)', number: '+234 802 444 5555' },
  { role: 'Venue Manager (Nat Sci)', number: '+234 816 666 7777' }
];

export const EMERGENCY_PROTOCOLS = [
  {
    id: 'med',
    title: 'Medical Emergency',
    steps: [
      'First responder (nearest volunteer) assesses the situation.',
      'Radio call to Command Center: "MEDICAL EMERGENCY [location]"',
      'Medical Officer responds immediately with emergency medical kit.',
      'If serious: Call University Health Services / 112 for ambulance dispatch.',
      'Isolate the area and clear the crowd to allow room to work.',
      'Document the incident details in the log book.',
      'Notify parents or teachers of the student via the school liaison.',
      'Continue the event if safe, or pause if necessary.'
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    steps: [
      'Nearest person activates the fire alarm pull station.',
      'Evacuate the building via the nearest marked emergency exit.',
      'Assemble at the designated Assembly Point (External outdoor complex).',
      'Roll call is performed by volunteer team leaders using team lists.',
      'Notify the Fire Service (112) immediately.',
      'Do NOT re-enter the building until official clearance is given by security.'
    ]
  },
  {
    id: 'sec',
    title: 'Security Incident',
    steps: [
      'Alert nearest university security personnel or police.',
      'Make a radio call to the Command Center describing the situation.',
      'Security Lead assesses the threat and coordinates responses.',
      'Isolate the incident area and secure students in classrooms if needed.',
      'Document and write a formal report.',
      'Notify local police if criminal activity is confirmed.'
    ]
  },
  {
    id: 'mis',
    title: 'Missing Person',
    steps: [
      'Report missing person details to the Command Center immediately.',
      'Identify the last known location, time, and photo/description.',
      'Deploy volunteer search teams to designated sectors.',
      'Perform a PA announcement (if appropriate for the environment).',
      'Check restrooms, lost & found, parking lots, and external gates.',
      'Notify parents/teachers after 15 minutes of unsuccessful search.',
      'Review security camera footage if available at the security office.'
    ]
  },
  {
    id: 'eq',
    title: 'Equipment Failure',
    steps: [
      'Report equipment failure to the Lab Supervisor immediately.',
      'Attempt to retrieve and configure backup equipment (20% extra available).',
      'If unresolvable: Pause event timing, move students to backup station.',
      'Document the incident for post-event review.',
      'Adjust rotation timing schedules if delays exceed 5 minutes.'
    ]
  }
];

export const POST_EVENT_CHECKLIST = {
  'Immediate (Within 24 Hours)': [
    'Venue restoration complete',
    'All equipment returned/secured',
    'Keys returned to authorities',
    'Incident reports filed',
    'Lost & found items logged',
    'Volunteer thank you messages sent',
    'Media compilation started'
  ],
  'Short-Term (Within 1 Week)': [
    'Financial reconciliation complete',
    'Sponsor thank you letters sent',
    'School feedback surveys sent',
    'Volunteer feedback collected',
    'Photo/video editing complete',
    'Press release issued',
    'Social media content published'
  ],
  'Long-Term (Within 1 Month)': [
    'Final report to Science Olympiad Nigeria',
    'Lessons learned document',
    'Budget finalization',
    'Archive all materials',
    'Plan next year\'s improvements',
    'Recognition for outstanding volunteers'
  ]
};

export interface School {
  id: string;
  name: string;
  division: 'B' | 'C';
}

export const PARTICIPATING_SCHOOLS: School[] = [
  // Division C
  { id: 'sch-c-1', name: 'GSS Anglo Jos', division: 'C' },
  { id: 'sch-c-2', name: 'GSS Kwata-zawan, Jos', division: 'C' },
  { id: 'sch-c-3', name: 'GSS Nassawa -Gwong C, Jos', division: 'C' },
  { id: 'sch-c-4', name: 'GSS Kabong, Jos', division: 'C' },
  { id: 'sch-c-5', name: 'GSS Gwong, Jos', division: 'C' },
  { id: 'sch-c-6', name: 'GSS Lamingo, Jos', division: 'C' },
  { id: 'sch-c-7', name: 'GSS Utan, Jos', division: 'C' },
  { id: 'sch-c-8', name: 'Government Science School, Kure, Jos', division: 'C' },
  { id: 'sch-c-9', name: 'GSS Kufang', division: 'C' },
  { id: 'sch-c-10', name: 'GSS Nyango-Gyel', division: 'C' },
  { id: 'sch-c-11', name: 'GSS Vwang', division: 'C' },
  { id: 'sch-c-12', name: 'Government College Jos', division: 'C' },
  { id: 'sch-c-13', name: 'GSS Wang, Jos', division: 'C' },
  { id: 'sch-c-14', name: 'GSS West of Mines, Jos', division: 'C' },
  { id: 'sch-c-15', name: 'GSS Gyel, Jos (South)', division: 'C' },
  { id: 'sch-c-16', name: 'GSS Kyan Rikkos, Jos', division: 'C' },
  { id: 'sch-c-17', name: 'GSS Rot-Norong, Jos', division: 'C' },
  // Division B
  { id: 'sch-b-1', name: 'GJSS Hwolshe, Jos', division: 'B' },
  { id: 'sch-b-2', name: 'GJSS Hei-Rayfield Jos', division: 'B' },
  { id: 'sch-b-3', name: 'GJSS N/Gwong, Jos', division: 'B' },
  { id: 'sch-b-4', name: 'GJSS Utan, Jos', division: 'B' },
  { id: 'sch-b-5', name: 'GJSS Chwel-nyap, Jos', division: 'B' },
  { id: 'sch-b-6', name: 'Government Science School, Kure (Junior)', division: 'B' },
  { id: 'sch-b-7', name: 'GSS Nyango-Gyel (Junior)', division: 'B' },
  { id: 'sch-b-8', name: 'GSS Kuru (Junior), Jos', division: 'B' },
  { id: 'sch-b-9', name: 'GSS West of Mines (Junior)', division: 'B' },
  { id: 'sch-b-10', name: 'GJSS Hwak-Kuru, Jos', division: 'B' }
];

export interface Judge {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedEvent: string;
  present: boolean;
}

export const INITIAL_JUDGES: Judge[] = [
  { id: 'jdg-1', name: 'Roland Hoomkwap', email: '', phone: '', assignedEvent: 'Anatomy & Physiology', present: false },
  { id: 'jdg-2', name: 'Dr. Olusegun Osibajo', email: 'Olusegunoshibanjo@gmail.com', phone: '234 805 543 8564', assignedEvent: 'Disease Detectives', present: false },
  { id: 'jdg-3', name: 'Nkup Jude Yunzoom', email: 'nkup1989@gmail.com', phone: '', assignedEvent: 'Chemistry Lab Event', present: false },
  { id: 'jdg-4', name: 'Lokta Danladi Solomon', email: 'loktasolomon@gmail.com', phone: '', assignedEvent: 'Density Lab', present: false },
  { id: 'jdg-5', name: 'Stephen Morgark', email: '', phone: '', assignedEvent: 'Circuit Lab', present: false },
  { id: 'jdg-6', name: 'Dr. Eyiaromi Ademileke Folorounsho', email: 'adefire4life@gmail.com', phone: '234 806 532 1030', assignedEvent: 'Thermodynamics', present: false }
];
