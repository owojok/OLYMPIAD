import React from 'react';
import { useSchedule } from '../hooks/useSchedule';
import { Search, List, Calendar, MapPin, Clock, X, HelpCircle } from 'lucide-react';
import './Schedule.css';

export const ScheduleView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDivision,
    setSelectedDivision,
    selectedDay,
    setSelectedDay,
    selectedType,
    setSelectedType,
    selectedEvent,
    setSelectedEvent,
    viewMode,
    setViewMode,
    filteredEvents,
  } = useSchedule();

  const getBadgeType = (type: string) => {
    switch (type) {
      case 'competition': return 'badge-danger';
      case 'prep': return 'badge-warning';
      case 'ceremony': return 'badge-primary';
      case 'dismissal': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getDivBadge = (div: string) => {
    switch (div) {
      case 'B': return 'badge-info';
      case 'C': return 'badge-danger';
      case 'Both': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="schedule-container animate-fade-in">
      <div className="schedule-header glass-panel">
        <h2 className="text-gradient">Interactive Run of Show</h2>
        <p className="subtitle">Track real-time schedules, venue rotations, briefings, and safety lockdown checklists.</p>
        
        <div className="day-tabs">
          {['Setup', 'Day 1', 'Day 2'].map((day) => (
            <button
              key={day}
              className={`day-tab ${selectedDay === day ? 'active' : ''}`}
              onClick={() => {
                setSelectedDay(day);
                // Reset division if switching to Setup (since it is only Setup)
                if (day === 'Setup') setSelectedDivision('Setup');
                else if (selectedDivision === 'Setup') setSelectedDivision('All');
              }}
            >
              <Calendar size={16} />
              {day === 'Setup' ? 'Setup Day' : day}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-bar glass-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, location, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filters-group">
          {selectedDay !== 'Setup' && (
            <div className="filter-select">
              <label>Division:</label>
              <div className="filter-chips">
                {['All', 'B', 'C', 'Both'].map((div) => (
                  <button
                    key={div}
                    className={`chip ${selectedDivision === div ? 'active' : ''}`}
                    onClick={() => setSelectedDivision(div)}
                  >
                    {div === 'Both' ? 'Both Divisions' : div === 'All' ? 'All' : `Division ${div}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="filter-select">
            <label>Event Type:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="competition">Competition</option>
              <option value="prep">Setup / Briefing</option>
              <option value="ceremony">Ceremony</option>
              <option value="dismissal">Dismissal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="Timeline View"
            >
              <Clock size={16} /> Timeline
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={16} /> List
            </button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="empty-state glass-panel animate-scale-in">
          <HelpCircle size={48} className="empty-icon" />
          <h3>No events match your criteria</h3>
          <p>Try adjusting your search terms or filters above.</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setSearchQuery('');
              setSelectedDivision('All');
              setSelectedType('All');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="timeline-view animate-fade-in">
          <div className="timeline-line"></div>
          <div className="timeline-items">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="timeline-node" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="timeline-time-col">
                  <span className="time-text">{event.time.split(' (')[0]}</span>
                </div>
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                </div>
                <div className="timeline-card glass-card" onClick={() => setSelectedEvent(event)}>
                  <div className="card-header-row">
                    <span className={`badge ${getBadgeType(event.type)}`}>{event.type}</span>
                    {selectedDay !== 'Setup' && (
                      <span className={`badge ${getDivBadge(event.division)}`}>Div {event.division}</span>
                    )}
                  </div>
                  <h3>{event.title}</h3>
                  <div className="meta-row">
                    <span className="meta-loc"><MapPin size={14} /> {event.location}</span>
                  </div>
                  <p className="card-preview">
                    {event.details[0].substring(0, 80)}...
                  </p>
                  <span className="read-more">Click to view all {event.details.length} details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="list-view animate-fade-in">
          {filteredEvents.map((event) => (
            <div key={event.id} className="list-card glass-card" onClick={() => setSelectedEvent(event)}>
              <div className="list-card-side">
                <div className="list-time"><Clock size={14} /> {event.time.split(' (')[0]}</div>
                <div className="list-badges">
                  <span className={`badge ${getBadgeType(event.type)}`}>{event.type}</span>
                  {selectedDay !== 'Setup' && (
                    <span className={`badge ${getDivBadge(event.division)}`}>Div {event.division}</span>
                  )}
                </div>
              </div>
              <div className="list-card-main">
                <h3>{event.title}</h3>
                <div className="list-loc"><MapPin size={14} /> {event.location}</div>
                <ul className="list-details-preview">
                  {event.details.slice(0, 2).map((detail, dIdx) => (
                    <li key={dIdx}>{detail}</li>
                  ))}
                  {event.details.length > 2 && (
                    <li className="more-indicator">+{event.details.length - 2} more details...</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal Drawer */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content glass-panel animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <span className={`badge ${getBadgeType(selectedEvent.type)}`}>{selectedEvent.type}</span>
              <span className={`badge ${getDivBadge(selectedEvent.division)}`}>Division {selectedEvent.division}</span>
              <h2>{selectedEvent.title}</h2>
              <div className="modal-meta">
                <span className="meta-item"><Clock size={16} /> {selectedEvent.time}</span>
                <span className="meta-item"><MapPin size={16} /> {selectedEvent.location}</span>
              </div>
            </div>
            <div className="modal-body">
              <h3>Detailed Actions & Checklist:</h3>
              <ul className="modal-details-list">
                {selectedEvent.details.map((detail, idx) => (
                  <li key={idx} className="modal-detail-item">
                    <span className="bullet"></span>
                    <span className="text">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScheduleView;
