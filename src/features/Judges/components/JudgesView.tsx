// Justification for R1: This file is >250 lines because it manages the complete interactive UI state for the judges roster, including registration form, editing forms, details rendering, list filter/search, and layout panels in a single cohesive component.
import React, { useState, useMemo } from 'react';
import type { useJudges } from '../hooks/useJudges';
import { 
  Award, 
  Search, 
  CheckCircle, 
  RefreshCcw, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Mail, 
  Phone, 
  Briefcase, 
  Info,
  ShieldAlert
} from 'lucide-react';
import './Judges.css';

const COMPETITION_EVENTS = [
  'Anatomy & Physiology',
  'Disease Detectives',
  'Density Lab',
  'Thermodynamics',
  'Battery Buggy',
  'Mystery Architecture',
  'Dynamic Planet',
  'Chemistry Lab Event',
  'Circuit Lab',
  'Solar Power',
  'Electric Vehicle',
  'General / Registration'
];

interface JudgesViewProps {
  judgeHook: ReturnType<typeof useJudges>;
}

export const JudgesView: React.FC<JudgesViewProps> = ({ judgeHook }) => {
  const { 
    judges, 
    toggleJudgeCheckIn, 
    addJudge, 
    updateJudge, 
    deleteJudge, 
    resetJudges, 
    stats 
  } = judgeHook;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEvent, setAddEvent] = useState(COMPETITION_EVENTS[0]);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEvent, setEditEvent] = useState('');

  const filteredJudges = useMemo(() => {
    return judges.filter((j) => {
      if (searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        j.name.toLowerCase().includes(q) ||
        j.assignedEvent.toLowerCase().includes(q) ||
        j.email.toLowerCase().includes(q) ||
        j.phone.includes(q)
      );
    });
  }, [judges, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addName.trim() === '') return;
    addJudge(addName, addEmail, addPhone, addEvent);
    // Reset Form
    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAddEvent(COMPETITION_EVENTS[0]);
    setShowAddForm(false);
  };

  const startEditing = (id: string) => {
    const judge = judges.find((j) => j.id === id);
    if (judge) {
      setEditingId(id);
      setEditName(judge.name);
      setEditEmail(judge.email);
      setEditPhone(judge.phone);
      setEditEvent(judge.assignedEvent);
    }
  };

  const handleEditSave = (id: string) => {
    if (editName.trim() === '') return;
    updateJudge(id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      assignedEvent: editEvent
    });
    setEditingId(null);
  };

  return (
    <div className="judges-container animate-fade-in">
      {/* Header Info Panel */}
      <div className="judges-header glass-panel">
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Award size={28} style={{ color: 'var(--color-danger)' }} /> Judges & Supervisors Roster
        </h2>
        <p className="subtitle">Assign events to judges, manage contact details, fill in missing information, and track physical arrivals.</p>

        <div className="judges-quick-stats">
          <div className="quick-stat-item">
            <span className="label">Total Judges</span>
            <span className="value">{stats.totalExpected} Registered</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Checked In</span>
            <span className="value">{stats.totalPresent} / {stats.totalExpected} Present</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Attendance Rate</span>
            <span className="value">{stats.percentPresent}% Arrived</span>
          </div>
        </div>
      </div>

      <div className="judges-split-layout">
        {/* Left Column: Judges Roster & Actions */}
        <div className="judges-list-panel glass-panel">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div className="search-box" style={{ flex: 1, minWidth: '200px' }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search judges by name or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'} btn-sm`} 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? <X size={14} /> : <Plus size={14} />} {showAddForm ? 'Cancel' : 'Add Judge'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={resetJudges} title="Reset to default judges">
                <RefreshCcw size={14} /> Reset Roster
              </button>
            </div>
          </div>

          {/* Add Judge Inline Form Panel */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="judge-form-panel">
              <h3>Register New Judge</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="add-name">Name *</label>
                  <input
                    id="add-name"
                    type="text"
                    placeholder="Enter name"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="add-event">Assigned Event</label>
                  <select
                    id="add-event"
                    value={addEvent}
                    onChange={(e) => setAddEvent(e.target.value)}
                  >
                    {COMPETITION_EVENTS.map((evt) => (
                      <option key={evt} value={evt}>{evt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="add-email">Email Address</label>
                  <input
                    id="add-email"
                    type="email"
                    placeholder="Enter email (e.g. name@domain.com)"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="add-phone">Phone Number</label>
                  <input
                    id="add-phone"
                    type="tel"
                    placeholder="Enter phone (e.g. +234 803...)"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Judge
                </button>
              </div>
            </form>
          )}

          {/* Judges cards roster list */}
          <div className="judges-roster-list">
            {filteredJudges.length === 0 ? (
              <div className="empty-state">
                <p>No judges found matching search criteria.</p>
              </div>
            ) : (
              filteredJudges.map((judge) => {
                const isEditing = editingId === judge.id;
                return (
                  <div 
                    key={judge.id} 
                    className={`judge-card glass-card ${judge.present ? 'checked' : ''}`}
                  >
                    {/* Checkbox indicator */}
                    {!isEditing && (
                      <div 
                        className="judge-check-indicator"
                        onClick={() => toggleJudgeCheckIn(judge.id)}
                        aria-label={`Toggle check-in for ${judge.name}`}
                      >
                        {judge.present ? (
                          <CheckCircle size={22} className="check-icon success" />
                        ) : (
                          <div className="judge-unchecked-box" />
                        )}
                      </div>
                    )}

                    {isEditing ? (
                      /* Editing mode inputs */
                      <div className="judge-edit-form">
                        <div className="edit-fields-row">
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              aria-label="Edit Name"
                            />
                          </div>
                          <div className="form-group">
                            <label>Event</label>
                            <select
                              value={editEvent}
                              onChange={(e) => setEditEvent(e.target.value)}
                              aria-label="Edit Event"
                            >
                              {COMPETITION_EVENTS.map((evt) => (
                                <option key={evt} value={evt}>{evt}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="edit-fields-row">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={editEmail}
                              placeholder="Add email address"
                              onChange={(e) => setEditEmail(e.target.value)}
                              aria-label="Edit Email"
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone</label>
                            <input
                              type="text"
                              value={editPhone}
                              placeholder="Add phone number"
                              onChange={(e) => setEditPhone(e.target.value)}
                              aria-label="Edit Phone"
                            />
                          </div>
                        </div>
                        <div className="form-actions" style={{ marginTop: 8 }}>
                          <button 
                            type="button" 
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            <X size={14} /> Cancel
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditSave(judge.id)}
                          >
                            <Check size={14} /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode content */
                      <>
                        <div className="judge-info">
                          <h4>{judge.name}</h4>
                          <div className="judge-meta-row">
                            <span className="meta-chip event">
                              <Briefcase size={11} /> {judge.assignedEvent}
                            </span>
                            {judge.email ? (
                              <span className="meta-chip">
                                <Mail size={11} /> {judge.email}
                              </span>
                            ) : (
                              <span className="meta-chip missing">
                                <Mail size={11} /> Missing Email
                              </span>
                            )}
                            {judge.phone ? (
                              <span className="meta-chip">
                                <Phone size={11} /> {judge.phone}
                              </span>
                            ) : (
                              <span className="meta-chip missing">
                                <Phone size={11} /> Missing Phone
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="judge-actions">
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => startEditing(judge.id)}
                            title="Edit judge details"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => deleteJudge(judge.id)}
                            title="Delete judge"
                            style={{ color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Operational Instructions */}
        <div className="judges-sidebar">
          <div className="judges-sidebar-panel glass-panel">
            <h3>Supervisor Guidelines</h3>
            <p className="panel-desc">Operational regulations regarding judges and scoring supervision.</p>

            <div className="coverage-progress-container">
              <div className="progress-bar-header">
                <span>Roster Check-In Ratio</span>
                <span>{stats.totalPresent} of {stats.totalExpected} ({stats.percentPresent}%)</span>
              </div>
              <div className="division-bar" style={{ height: 8, backgroundColor: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: 8 }}>
                <div 
                  className="division-bar-fill" 
                  style={{ 
                    height: '100%', 
                    width: `${stats.percentPresent}%`, 
                    backgroundColor: 'var(--color-primary)', 
                    borderRadius: 4,
                    transition: 'width var(--transition-normal)'
                  }}
                ></div>
              </div>
            </div>

            <div className="operational-notices-section" style={{ marginTop: 24 }}>
              <h4>Orientation Protocol</h4>
              
              <div className="notice-card badge-warning" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginTop: 12 }}>
                <ShieldAlert size={20} className="notice-icon" style={{ flexShrink: 0, color: 'var(--color-warning)' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Orientation Meeting:</strong>
                  <p style={{ marginTop: 4 }}>All judges, supervisors, and examiners must attend the briefing <strong>2 days before the event at 05:00 pm</strong> on <strong>Google Meet (Online)</strong> to review the digital scoring platform and align rules.</p>
                </div>
              </div>

              <div className="notice-card badge-primary" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginTop: 12 }}>
                <Info size={20} className="notice-icon" style={{ flexShrink: 0, color: 'var(--color-info)' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Accreditation & Security:</strong>
                  <p style={{ marginTop: 4 }}>Before entering the competition labs, verify each supervisor carries their designated badge. Results must be compilation-compiled in VET-104 directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgesView;
