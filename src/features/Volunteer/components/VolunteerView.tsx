/**
 * Justification: This component manages the complete volunteer portal views, including
 * interactive role allocations, training track checklist, event shifts assignments,
 * the new event line distribution timeline, and the registered staff roster table.
 * It exceeds 250 lines to keep the dashboard view code centralized.
 */

import React from 'react';
import { VOLUNTEER_TRAINING, VENUE_DATA } from '../../../data/eventData';
import { useVolunteerChecklist } from '../hooks/useVolunteerChecklist';
import type { useVolunteers } from '../hooks/useVolunteers';
import type { useVolunteerRegistration } from '../hooks/useVolunteerRegistration';
import { EventLineDistribution } from './EventLineDistribution';
import { Clock, Award, CheckCircle, RefreshCcw, AlertCircle, ShieldAlert, Trash2 } from 'lucide-react';
import './Volunteer.css';

interface VolunteerViewProps {
  volunteerHook: ReturnType<typeof useVolunteers>;
  registrationHook: ReturnType<typeof useVolunteerRegistration>;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({ volunteerHook, registrationHook }) => {
  const { completedSessions, toggleSession, progressPercent } = useVolunteerChecklist();
  const { roles, totalVolunteers, updateRoleCount, resetRoles, validationError } = volunteerHook;

  // Flatten active rooms/locations from VENUE_DATA
  const activeRooms = React.useMemo(() => {
    const roomsList: { id: string; name: string; allocation: string }[] = [];
    VENUE_DATA.forEach((faculty) => {
      faculty.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          if (room.status === 'active') {
            roomsList.push({
              id: room.id,
              name: room.name,
              allocation: room.allocation
            });
          }
        });
      });
    });
    return roomsList;
  }, []);

  // Filter rooms for Shift 1 (B / Morning): Exclude Division C only rooms
  const shift1Rooms = React.useMemo(() => {
    return activeRooms.filter(
      (room) =>
        !room.allocation.toLowerCase().includes('division c') &&
        !room.allocation.toLowerCase().includes('div c') &&
        room.id !== 'VET-102' &&
        room.id !== 'WALK-2'
    );
  }, [activeRooms]);

  // Filter rooms for Shift 2 (C / Afternoon): Exclude Division B only rooms
  const shift2Rooms = React.useMemo(() => {
    return activeRooms.filter(
      (room) =>
        !room.allocation.toLowerCase().includes('division b') &&
        !room.allocation.toLowerCase().includes('div b') &&
        room.id !== 'VET-101' &&
        room.id !== 'WALK-1'
    );
  }, [activeRooms]);

  const getRatioStatus = () => {
    if (totalVolunteers < 40) {
      return {
        badgeClass: 'badge-danger',
        text: `Below Target: Current allocation is ~${Math.round(400 / (totalVolunteers || 1))}:1 ratio. Need ${40 - totalVolunteers} more to maintain standard 10:1 ratio.`
      };
    } else if (totalVolunteers === 40) {
      return {
        badgeClass: 'badge-success',
        text: 'Optimal: Roster matches the target 10:1 student-to-volunteer ratio safety standards.'
      };
    } else {
      return {
        badgeClass: 'badge-info',
        text: `Extended Coverage: Current roster of ${totalVolunteers} exceeds baseline requirement.`
      };
    }
  };

  const statusInfo = getRatioStatus();

  return (
    <div className="volunteer-container animate-fade-in">
      <div className="volunteer-header glass-panel">
        <h2 className="text-gradient">Volunteer Management Portal</h2>
        <p className="subtitle">
          Oversee volunteer distribution ratios (10:1 target ratio), training sessions, and shift schedules.
        </p>

        <div className="volunteer-quick-stats">
          <div className="quick-stat-item">
            <span className="label">Total Roster Count</span>
            <span className="value">{totalVolunteers} Staff</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Target Student Ratio</span>
            <span className="value">10 : 1 (JSS/SSS)</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Training Status</span>
            <span className="value">{progressPercent}% Done</span>
          </div>
        </div>

        <div className={`ratio-alert-banner ${statusInfo.badgeClass}`} style={{ marginTop: 16, display: 'flex', gap: 12, padding: 12, borderRadius: 8, alignItems: 'center' }}>
          <ShieldAlert size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{statusInfo.text}</span>
        </div>
      </div>

      <div className="volunteer-split-grid">
        <div className="volunteer-roles-panel glass-panel">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3>Volunteer Roles & Team Breakdown</h3>
            <button className="btn btn-secondary btn-sm" onClick={resetRoles} title="Reset to original baseline">
              <RefreshCcw size={14} /> Reset Baseline
            </button>
          </div>
          <p className="panel-desc">Reallocate staff counts across teams. Changes persist locally.</p>
          
          {validationError && (
            <div className="alert-box badge-danger" style={{ margin: '0 0 16px 0', padding: '10px 12px' }}>
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          <div className="roles-progress-list">
            {roles.map((role) => {
              // Calculate percent of total
              const percent = totalVolunteers > 0 ? Math.round((role.count / totalVolunteers) * 100) : 0;
              return (
                <div key={role.name} className="role-progress-item">
                  <div className="role-progress-labels">
                    <span className="role-name">{role.name}</span>
                    <div className="role-controls-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="role-adjust-controls">
                        <button 
                          className="btn-adjust" 
                          onClick={() => updateRoleCount(role.name, String(Math.max(0, role.count - 1)))}
                          title="Decrease"
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          value={role.count} 
                          onChange={(e) => updateRoleCount(role.name, e.target.value)}
                          className="role-input"
                        />
                        <button 
                          className="btn-adjust" 
                          onClick={() => updateRoleCount(role.name, String(role.count + 1))}
                          title="Increase"
                        >
                          +
                        </button>
                      </div>
                      <span className="role-count" style={{ width: '45px', textAlign: 'right' }}>({percent}%)</span>
                    </div>
                  </div>
                  <div className="role-progress-bar-container">
                    <div 
                      className="role-progress-bar-fill" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="volunteer-training-panel glass-panel">
          <h3>Interactive Training Tracker</h3>
          <p className="panel-desc">Click training sessions once completed. Toggles state in Local Storage.</p>
          
          <div className="training-overall-progress">
            <div className="progress-bar-header">
              <span>Overall Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="training-bar">
              <div className="training-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="training-list">
            {VOLUNTEER_TRAINING.map((session) => {
              const isChecked = completedSessions.includes(session.id);
              return (
                <div 
                  key={session.id} 
                  className={`training-card-item glass-card ${isChecked ? 'completed' : ''}`}
                  onClick={() => toggleSession(session.id)}
                >
                  <div className="checkbox-col">
                    <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                      {isChecked && <CheckCircle size={16} />}
                    </div>
                  </div>
                  <div className="training-info">
                    <h4>{session.title}</h4>
                    <p>{session.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="volunteer-shifts-panel glass-panel">
        <h3>Shift & Roster Assignments</h3>
        <p className="panel-desc">Roster splits between shifts to ensure continuous event coverage.</p>
        
        <div className="table-responsive">
          <table className="shifts-table">
            <thead>
              <tr>
                <th>Shift ID</th>
                <th>Time Range</th>
                <th>Focus Division</th>
                <th>Coverage Allocation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Shift 1</strong></td>
                <td><span className="shift-time"><Clock size={12} /> 7:30 am — 12:00 pm (Day 1)</span></td>
                <td><span className="badge badge-info">Division B</span></td>
                <td>Registration, welcome desk, biology/physics lab guides, morning catering</td>
              </tr>
              <tr>
                <td><strong>Shift 2</strong></td>
                <td><span className="shift-time"><Clock size={12} /> 12:00 pm — 4:00 pm (Day 1)</span></td>
                <td><span className="badge badge-danger">Division C</span></td>
                <td>Chemistry lab assistants, physics guides, vehicle workshop, venue sweep</td>
              </tr>
              <tr>
                <td><strong>Shift 3</strong></td>
                <td><span className="shift-time"><Clock size={12} /> 7:00 am — 2:00 pm (Day 2)</span></td>
                <td><span className="badge badge-primary">Ceremony</span></td>
                <td>VIP ushers, stage layout assistants, media support, venue restoration</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="shift-notes badge-info" style={{ marginTop: 16, display: 'flex', gap: 8, padding: 12, borderRadius: 8 }}>
          <Award size={20} />
          <div>
            <strong> Roster Notes:</strong> 5 Core Overlap volunteers are assigned to work *both* shifts on Day 1 for continuous operational logic, while the remaining 35 volunteers are split evenly.
          </div>
        </div>
      </div>

      {/* Visual Event Line distribution graph section */}
      <EventLineDistribution registeredVolunteers={registrationHook.registeredVolunteers} />

      {/* Registered Staff Roster Section */}
      <div className="volunteer-registrations-panel glass-panel" style={{ marginTop: 24 }}>
        <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3>Registered Staff Roster ({registrationHook.registeredVolunteers.length})</h3>
          {registrationHook.registeredVolunteers.length > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={registrationHook.clearRegistrations} style={{ color: 'var(--color-danger)' }} title="Clear all registrations">
              <RefreshCcw size={14} /> Clear Roster
            </button>
          )}
        </div>
        <p className="panel-desc">Roster of volunteers who registered through the public sign-up link. Assign tasks and roles in operations accordingly.</p>

        {registrationHook.registeredVolunteers.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No volunteer registrations received yet. Share the sign-up link to collect registrations.</p>
            <div style={{ marginTop: 12, fontSize: '0.85rem' }}>
              <strong>Public Link:</strong> <code style={{ background: 'var(--bg-input)', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-color)' }}>{window.location.origin + window.location.pathname + '#/register'}</code>
            </div>
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '450px', overflowY: 'auto' }}>
            <table className="shifts-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Email Address</th>
                  <th>Team Assignment</th>
                  <th>Shift 1 (Div B)</th>
                  <th>Shift 2 (Div C)</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrationHook.registeredVolunteers.map((vol) => (
                  <tr key={vol.id}>
                    <td><strong>{vol.fullName}</strong></td>
                    <td><span className="shift-time">{vol.phone}</span></td>
                    <td>{vol.email}</td>
                    <td>
                      <select
                        value={vol.assignedTeam || (roles[0] && roles[0].name) || ''}
                        onChange={(e) => {
                          registrationHook.assignTeam(vol.id, e.target.value);
                        }}
                      >
                        {roles.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={vol.assignedEventB || (shift1Rooms[0] && shift1Rooms[0].id) || ''}
                        onChange={(e) => {
                          registrationHook.assignEventB(vol.id, e.target.value);
                        }}
                        style={{ maxWidth: '170px' }}
                      >
                        {shift1Rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.id} · {room.allocation}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={vol.assignedEventC || (shift2Rooms[0] && shift2Rooms[0].id) || ''}
                        onChange={(e) => {
                          registrationHook.assignEventC(vol.id, e.target.value);
                        }}
                        style={{ maxWidth: '170px' }}
                      >
                        {shift2Rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.id} · {room.allocation}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-xs" 
                        onClick={() => registrationHook.deleteRegistration(vol.id)}
                        title="Remove volunteer"
                        style={{ color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default VolunteerView;
