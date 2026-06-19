import { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Calendar, 
  MapPin, 
  Users, 
  CheckSquare, 
  ShieldAlert, 
  Menu, 
  Search, 
  Sun, 
  Moon,
  Sparkles,
  X,
  GraduationCap,
  Award,
  UserCheck
} from 'lucide-react';
import { DashboardView } from './features/Dashboard';
import { ScheduleView } from './features/Schedule';
import { VenueView, useVenues } from './features/VenueMap';
import { VolunteerView, useVolunteers, useVolunteerRegistration, VolunteerRegisterForm } from './features/Volunteer';
import { ChecklistView } from './features/Checklist';
import { BudgetView } from './features/Budget';
import { EmergencyView } from './features/Emergency';
import { SchoolsView, useSchools } from './features/Schools';
import { JudgesView, useJudges } from './features/Judges';
import { PlanningCommitteeView, useCommittee } from './features/PlanningCommittee';
import { TIMELINE_EVENTS, VENUE_DATA, MATERIAL_CHECKLISTS, CONTACT_LIST, PARTICIPATING_SCHOOLS } from './data/eventData';
import './App.css';

interface SearchResult {
  category: 'Schedule' | 'Venue' | 'Checklist' | 'Contact' | 'School' | 'Judge' | 'Committee';
  title: string;
  subtitle: string;
  tab: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<string>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const schoolHook = useSchools();
  const judgeHook = useJudges();
  const venueHook = useVenues();
  const volunteerHook = useVolunteers();
  const committeeHook = useCommittee();
  const registrationHook = useVolunteerRegistration();

  // Listen for hash routing (e.g., #/register) for public volunteer sign-up
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/register') {
        setActiveTab('register');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (activeTab !== 'register' && window.location.hash === '#/register') {
      window.location.hash = '';
    }
  }, [activeTab]);

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('so_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setGlobalSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('so_theme', nextTheme);
  };

  // Perform Global Search across all models
  useEffect(() => {
    if (globalSearch.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = globalSearch.toLowerCase();
    const results: SearchResult[] = [];

    // 1. Search Timeline Events
    TIMELINE_EVENTS.forEach(event => {
      if (event.title.toLowerCase().includes(query) || event.location.toLowerCase().includes(query)) {
        results.push({
          category: 'Schedule',
          title: event.title,
          subtitle: `${event.time.split(' (')[0]} · ${event.location}`,
          tab: 'schedule'
        });
      }
    });

    // 2. Search Rooms / Venues
    const activeSearchVenues = venueHook.venues.length > 0 ? venueHook.venues : VENUE_DATA;
    activeSearchVenues.forEach(faculty => {
      faculty.floors.forEach(floor => {
        floor.rooms.forEach(room => {
          if (room.name.toLowerCase().includes(query) || room.id.toLowerCase().includes(query) || room.allocation.toLowerCase().includes(query)) {
            results.push({
              category: 'Venue',
              title: `${room.id}: ${room.name}`,
              subtitle: `${faculty.name} · ${room.allocation}`,
              tab: 'venues'
            });
          }
        });
      });
    });

    // 3. Search Checklists
    Object.entries(MATERIAL_CHECKLISTS).forEach(([cat, items]) => {
      items.forEach(item => {
        if (item.toLowerCase().includes(query)) {
          results.push({
            category: 'Checklist',
            title: item,
            subtitle: `In ${cat} Materials`,
            tab: 'checklists'
          });
        }
      });
    });

    // 4. Search Emergency Contacts
    CONTACT_LIST.forEach(contact => {
      if (contact.role.toLowerCase().includes(query) || contact.number.includes(query)) {
        results.push({
          category: 'Contact',
          title: contact.role,
          subtitle: contact.number,
          tab: 'emergency'
        });
      }
    });

    // 5. Search Participating Schools
    PARTICIPATING_SCHOOLS.forEach(school => {
      if (school.name.toLowerCase().includes(query)) {
        results.push({
          category: 'School',
          title: school.name,
          subtitle: `Division ${school.division} Participating School`,
          tab: 'schools'
        });
      }
    });

    // 6. Search Judges
    judgeHook.judges.forEach(judge => {
      if (judge.name.toLowerCase().includes(query) || judge.assignedEvent.toLowerCase().includes(query)) {
        results.push({
          category: 'Judge',
          title: judge.name,
          subtitle: `Assigned: ${judge.assignedEvent}`,
          tab: 'judges'
        });
      }
    });

    // 7. Search Committee Members
    committeeHook.members.forEach(member => {
      if (member.name.toLowerCase().includes(query) || member.assignedTask.toLowerCase().includes(query)) {
        results.push({
          category: 'Committee',
          title: member.name,
          subtitle: `${member.role} · ${member.assignedTask}`,
          tab: 'committee'
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit to top 8
  }, [globalSearch, judgeHook.judges, venueHook.venues, committeeHook.members]);

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    setGlobalSearch('');
    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onNavigate={(tab) => setActiveTab(tab)} 
            volunteerCount={volunteerHook.totalVolunteers}
            presentSchools={schoolHook.stats.totalPresent}
            expectedSchools={schoolHook.stats.totalExpected}
            presentJudges={judgeHook.stats.totalPresent}
            expectedJudges={judgeHook.stats.totalExpected}
          />
        );
      case 'schedule':
        return <ScheduleView />;
      case 'venues':
        return <VenueView venueHook={venueHook} />;
      case 'volunteers':
        return <VolunteerView volunteerHook={volunteerHook} registrationHook={registrationHook} />;
      case 'checklists':
        return <ChecklistView />;
      case 'schools':
        return <SchoolsView schoolHook={schoolHook} />;
      case 'judges':
        return <JudgesView judgeHook={judgeHook} />;
      case 'committee':
        return <PlanningCommitteeView committeeHook={committeeHook} />;
      case 'budget':
        return <BudgetView />;
      case 'emergency':
        return <EmergencyView />;
      default:
        return (
          <DashboardView 
            onNavigate={(tab) => setActiveTab(tab)} 
            volunteerCount={volunteerHook.totalVolunteers} 
            presentSchools={schoolHook.stats.totalPresent}
            expectedSchools={schoolHook.stats.totalExpected}
            presentJudges={judgeHook.stats.totalPresent}
            expectedJudges={judgeHook.stats.totalExpected}
          />
        );
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layout size={18} /> },
    { id: 'schedule', label: 'Run of Show', icon: <Calendar size={18} /> },
    { id: 'venues', label: 'Venue Allocation', icon: <MapPin size={18} /> },
    { id: 'volunteers', label: 'Volunteer Portal', icon: <Users size={18} /> },
    { id: 'judges', label: 'Judges Roster', icon: <Award size={18} /> },
    { id: 'checklists', label: 'Checklist Center', icon: <CheckSquare size={18} /> },
    { id: 'schools', label: 'Schools check-in', icon: <GraduationCap size={18} /> },
    { id: 'committee', label: 'Committee Tasks', icon: <UserCheck size={18} /> },
    { id: 'emergency', label: 'Emergency Hub', icon: <ShieldAlert size={18} /> }
  ];

  if (activeTab === 'register') {
    return <VolunteerRegisterForm registrationHook={registrationHook} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Nav */}
      <aside className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Sparkles className="logo-icon" size={24} />
          <div>
            <h2>SO NIGERIA 26</h2>
            <span>Jos Tournament</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          Science Olympiad Nigeria<br />
          Plateau State © 2026
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Open sidebar">
              <Menu size={22} />
            </button>
            <span className="topbar-title">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="topbar-right">
            {/* Global Search */}
            <div className="global-search-container" ref={searchRef}>
              <div className="global-search-bar">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Global Search..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
                {globalSearch && (
                  <button className="clear-btn" onClick={() => setGlobalSearch('')} style={{ position: 'static', padding: '0 4px' }} aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {searchResults.length > 0 && (
                <div className="search-results-overlay glass-panel animate-scale-in">
                  <div className="search-section-header">Matches Found ({searchResults.length})</div>
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="search-result-item"
                      onClick={() => handleResultClick(result.tab)}
                    >
                      <div className="result-title">{result.title}</div>
                      <div className="result-meta">
                        <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 4px', marginRight: '6px' }}>
                          {result.category}
                        </span>
                        {result.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {globalSearch && searchResults.length === 0 && (
                <div className="search-results-overlay glass-panel">
                  <div className="no-results">No results found for "{globalSearch}"</div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <section className="app-content">
          {renderActiveView()}
        </section>
      </main>
    </div>
  );
}

export default App;
