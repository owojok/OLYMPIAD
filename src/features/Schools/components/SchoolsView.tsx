// Justification for R1: This file is >250 lines because it manages the complete interactive UI state for school accreditation, check-in forms, division tabs, search filters, and layout panels in a single cohesive component.
import React, { useState, useMemo } from 'react';
import type { useSchools } from '../hooks/useSchools';
import { 
  Search, 
  CheckCircle, 
  RefreshCcw, 
  Info, 
  ClipboardCheck, 
  User, 
  Users, 
  Mail, 
  Phone, 
  Edit2, 
  Trash2, 
  Clock, 
  X, 
  Check 
} from 'lucide-react';
import './Schools.css';

interface SchoolsViewProps {
  schoolHook: ReturnType<typeof useSchools>;
}

export const SchoolsView: React.FC<SchoolsViewProps> = ({ schoolHook }) => {
  const { 
    schools, 
    checkInSchool, 
    updateCheckInDetails, 
    checkOutSchool, 
    isCheckedIn, 
    getCheckInDetails, 
    stats, 
    resetCheckIns 
  } = schoolHook;

  const [activeDivTab, setActiveDivTab] = useState<'B' | 'C'>('B');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for active check-in form / edit form
  const [activeFormSchoolId, setActiveFormSchoolId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form field states
  const [studentNames, setStudentNames] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');

  // Filter schools by active division and search query
  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      if (school.division !== activeDivTab) return false;
      if (searchQuery.trim() !== '') {
        return school.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [schools, activeDivTab, searchQuery]);

  const divTitle = activeDivTab === 'B' ? 'Division B (JSS / Junior)' : 'Division C (SSS / Senior)';
  const divStats = activeDivTab === 'B' 
    ? { present: stats.presentB, expected: stats.expectedB }
    : { present: stats.presentC, expected: stats.expectedC };

  const divPercent = divStats.expected > 0 ? Math.round((divStats.present / divStats.expected) * 100) : 0;

  const handleOpenCheckIn = (schoolId: string) => {
    const details = getCheckInDetails(schoolId);
    if (details) {
      // Editing checked in school
      setStudentNames(details.studentNames);
      setTeacherName(details.teacherName);
      setTeacherEmail(details.teacherEmail);
      setTeacherPhone(details.teacherPhone);
      setIsEditing(true);
    } else {
      // Checking in new
      setStudentNames('');
      setTeacherName('');
      setTeacherEmail('');
      setTeacherPhone('');
      setIsEditing(false);
    }
    setActiveFormSchoolId(schoolId);
  };

  const handleFormSubmit = (e: React.FormEvent, schoolId: string) => {
    e.preventDefault();
    if (studentNames.trim() === '' || teacherName.trim() === '') return;

    if (isEditing) {
      updateCheckInDetails(schoolId, studentNames, teacherName, teacherEmail, teacherPhone);
    } else {
      checkInSchool(schoolId, studentNames, teacherName, teacherEmail, teacherPhone);
    }

    setActiveFormSchoolId(null);
    setIsEditing(false);
  };

  return (
    <div className="schools-container animate-fade-in">
      <div className="schools-header glass-panel">
        <h2 className="text-gradient">School Accreditation & Check-In</h2>
        <p className="subtitle">Track school arrivals in real-time. Log student delegations, accompanying coaches, and emergency contacts.</p>

        <div className="schools-quick-stats">
          <div className="quick-stat-item">
            <span className="label">Total Attendance</span>
            <span className="value">{stats.totalPresent} / {stats.totalExpected} Present</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Division B Present</span>
            <span className="value">{stats.presentB} / {stats.expectedB}</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Division C Present</span>
            <span className="value">{stats.presentC} / {stats.expectedC}</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Accreditation Rate</span>
            <span className="value">{stats.percentPresent}% Arrived</span>
          </div>
        </div>
      </div>

      <div className="schools-split-layout">
        {/* School list column */}
        <div className="schools-list-panel glass-panel">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="div-selectors">
              <button 
                className={`div-select-btn ${activeDivTab === 'B' ? 'active' : ''}`}
                onClick={() => {
                  setActiveDivTab('B');
                  setSearchQuery('');
                  setActiveFormSchoolId(null);
                }}
              >
                Division B (JSS)
              </button>
              <button 
                className={`div-select-btn ${activeDivTab === 'C' ? 'active' : ''}`}
                onClick={() => {
                  setActiveDivTab('C');
                  setSearchQuery('');
                  setActiveFormSchoolId(null);
                }}
              >
                Division C (SSS)
              </button>
            </div>
            
            <button className="btn btn-secondary btn-sm" onClick={resetCheckIns} title="Reset all checked-in schools">
              <RefreshCcw size={14} /> Clear Roster
            </button>
          </div>

          <div className="school-search-bar-row" style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${divTitle} schools...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="schools-roster-list">
            {filteredSchools.length === 0 ? (
              <div className="empty-state">
                <p>No schools found matching search query.</p>
              </div>
            ) : (
              filteredSchools.map((school) => {
                const checked = isCheckedIn(school.id);
                const details = getCheckInDetails(school.id);
                const isFormOpen = activeFormSchoolId === school.id;

                return (
                  <div key={school.id} className="school-card-wrapper">
                    <div 
                      className={`school-check-card glass-card ${checked ? 'checked' : ''} ${isFormOpen ? 'form-active' : ''}`}
                      onClick={() => !isFormOpen && handleOpenCheckIn(school.id)}
                    >
                      <div className="school-check-indicator">
                        {checked ? (
                          <CheckCircle size={22} className="check-icon success" />
                        ) : (
                          <div className="school-unchecked-box" />
                        )}
                      </div>
                      
                      <div className="school-details">
                        <h4>{school.name}</h4>
                        <span className="school-badge-label">
                          {school.division === 'B' ? 'Junior Secondary' : 'Senior Secondary'}
                        </span>
                        
                        {checked && details && !isFormOpen && (
                          <div className="school-logged-meta animate-fade-in" style={{ marginTop: 8 }}>
                            <div className="meta-badge-row">
                              <span className="info-chip"><Users size={11} /> <strong>Delegation:</strong> {details.studentNames}</span>
                              <span className="info-chip"><User size={11} /> <strong>Teacher:</strong> {details.teacherName}</span>
                              {details.teacherEmail && <span className="info-chip"><Mail size={11} /> {details.teacherEmail}</span>}
                              {details.teacherPhone && <span className="info-chip"><Phone size={11} /> {details.teacherPhone}</span>}
                              <span className="info-chip time"><Clock size={11} /> {details.timestamp}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {checked && !isFormOpen && (
                        <div className="school-card-actions" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="btn btn-secondary btn-xs"
                            onClick={() => handleOpenCheckIn(school.id)}
                            title="Edit details"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-xs"
                            onClick={() => checkOutSchool(school.id)}
                            title="Remove accreditation"
                            style={{ color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expandable Check-in / Edit Form */}
                    {isFormOpen && (
                      <form onSubmit={(e) => handleFormSubmit(e, school.id)} className="school-checkin-form glass-card">
                        <h3>{isEditing ? 'Edit Accreditation Details' : 'Accredit School Delegation'}</h3>
                        <div className="school-form-grid">
                          <div className="form-group">
                            <label htmlFor={`students-${school.id}`}>Accompanying Student Delegation *</label>
                            <input
                              id={`students-${school.id}`}
                              type="text"
                              placeholder="e.g. Samuel J., Grace P., Bala M."
                              value={studentNames}
                              onChange={(e) => setStudentNames(e.target.value)}
                              required
                              autoFocus
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`teacher-${school.id}`}>Accompanying Teacher *</label>
                            <input
                              id={`teacher-${school.id}`}
                              type="text"
                              placeholder="Name of teacher / chaperone"
                              value={teacherName}
                              onChange={(e) => setTeacherName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`email-${school.id}`}>Teacher Email</label>
                            <input
                              id={`email-${school.id}`}
                              type="email"
                              placeholder="Chaperone email"
                              value={teacherEmail}
                              onChange={(e) => setTeacherEmail(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor={`phone-${school.id}`}>Teacher Phone Number</label>
                            <input
                              id={`phone-${school.id}`}
                              type="tel"
                              placeholder="e.g. +234 803 123..."
                              value={teacherPhone}
                              onChange={(e) => setTeacherPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setActiveFormSchoolId(null);
                              setIsEditing(false);
                            }}
                          >
                            <X size={14} /> Cancel
                          </button>
                          <button type="submit" className="btn btn-primary btn-sm">
                            <Check size={14} /> {isEditing ? 'Save Details' : 'Accredit Team'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Info column */}
        <div className="schools-sidebar">
          <div className="attendance-report-panel glass-panel">
            <h3>{divTitle} Report</h3>
            <p className="panel-desc">Real-time attendance metrics for the current selection.</p>

            <div className="division-progress-container">
              <div className="progress-bar-header">
                <span>Accredited Ratio</span>
                <span>{divStats.present} of {divStats.expected} ({divPercent}%)</span>
              </div>
              <div className="division-bar" style={{ height: 8, backgroundColor: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div 
                  className="division-bar-fill" 
                  style={{ 
                    height: '100%', 
                    width: `${divPercent}%`, 
                    backgroundColor: activeDivTab === 'B' ? 'var(--color-info)' : 'var(--color-danger)', 
                    borderRadius: 4,
                    transition: 'width var(--transition-normal)'
                  }}
                ></div>
              </div>
            </div>

            <div className="operational-notices-section" style={{ marginTop: 24 }}>
              <h4>Logistics & Late Protocol</h4>
              <div className="notice-card badge-warning" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginTop: 12 }}>
                <Info size={20} className="notice-icon" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Late Arrival Notice:</strong>
                  <p style={{ marginTop: 4 }}>Registered teams checking in after 09:15 am (Division B) or 01:15 pm (Division C) must be redirected to the <strong>Registration Overflow Desk</strong> in <strong>Room NAT-101</strong>.</p>
                </div>
              </div>
              
              <div className="notice-card badge-primary" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginTop: 12 }}>
                <ClipboardCheck size={20} className="notice-icon" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Souvenir & Badge Rule:</strong>
                  <p style={{ marginTop: 4 }}>Verify photo releases and collect signed emergency contact forms from coaches before issuing color-coded ID badges (<strong>BLUE</strong> for JSS, <strong>RED</strong> for SSS).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SchoolsView;
