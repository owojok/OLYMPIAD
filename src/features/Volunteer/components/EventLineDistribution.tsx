import React from 'react';
import { VENUE_DATA } from '../../../data/eventData';
import type { RegisteredVolunteer } from '../hooks/useVolunteerRegistration';
import { MapPin } from 'lucide-react';

interface EventLineDistributionProps {
  registeredVolunteers: RegisteredVolunteer[];
}

export const EventLineDistribution: React.FC<EventLineDistributionProps> = ({ registeredVolunteers }) => {
  // Group volunteers by assigned location room ID for Shift 1 (B) and Shift 2 (C)
  const assignmentsByRoom = React.useMemo(() => {
    const mapB: { [roomId: string]: RegisteredVolunteer[] } = {};
    const mapC: { [roomId: string]: RegisteredVolunteer[] } = {};
    
    registeredVolunteers.forEach((vol) => {
      if (vol.assignedEventB) {
        if (!mapB[vol.assignedEventB]) {
          mapB[vol.assignedEventB] = [];
        }
        mapB[vol.assignedEventB].push(vol);
      }
      if (vol.assignedEventC) {
        if (!mapC[vol.assignedEventC]) {
          mapC[vol.assignedEventC] = [];
        }
        mapC[vol.assignedEventC].push(vol);
      }
    });
    return { mapB, mapC };
  }, [registeredVolunteers]);

  // Flatten active rooms/locations from VENUE_DATA, sorting Labs, Workshops, and Classrooms first
  const activeRooms = React.useMemo(() => {
    const labsList: { id: string; name: string; type: string; allocation: string; facultyName: string }[] = [];
    const othersList: { id: string; name: string; type: string; allocation: string; facultyName: string }[] = [];
    VENUE_DATA.forEach((faculty) => {
      faculty.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          if (room.status === 'active') {
            const item = {
              id: room.id,
              name: room.name,
              type: room.type,
              allocation: room.allocation,
              facultyName: faculty.name
            };
            const isLab = room.type.toLowerCase().includes('lab') || 
                          room.type.toLowerCase().includes('workshop') || 
                          room.type.toLowerCase().includes('classroom');
            if (isLab) {
              labsList.push(item);
            } else {
              othersList.push(item);
            }
          }
        });
      });
    });
    return [...labsList, ...othersList];
  }, []);

  const isDivisionC = (allocation: string) => {
    return allocation.toLowerCase().includes('division c') || allocation.toLowerCase().includes('div c') || allocation.includes('(Division C)');
  };

  const isDivisionB = (allocation: string) => {
    return allocation.toLowerCase().includes('division b') || allocation.toLowerCase().includes('div b') || allocation.includes('(Division B)');
  };

  const stats = React.useMemo(() => {
    let covered = 0;
    activeRooms.forEach((room) => {
      const assignedB = assignmentsByRoom.mapB[room.id] || [];
      const assignedC = assignmentsByRoom.mapC[room.id] || [];
      
      const isDivB = isDivisionB(room.allocation) || room.allocation.includes('(Division B)');
      const isDivC = isDivisionC(room.allocation) || room.allocation.includes('(Division C)');
      
      let isRoomCovered = false;
      if (isDivB) {
        isRoomCovered = assignedB.length > 0;
      } else if (isDivC) {
        isRoomCovered = assignedC.length > 0;
      } else {
        // Shared rooms require staffing on both shifts to be fully covered
        isRoomCovered = assignedB.length > 0 && assignedC.length > 0;
      }
      
      if (isRoomCovered) covered++;
    });
    return {
      total: activeRooms.length,
      covered,
      uncovered: activeRooms.length - covered,
      percent: activeRooms.length > 0 ? Math.round((covered / activeRooms.length) * 100) : 0
    };
  }, [activeRooms, assignmentsByRoom]);

  return (
    <div className="event-line-distribution-panel glass-panel" style={{ padding: 24, marginTop: 24 }}>
      <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3>Competition Station Volunteer Distribution</h3>
        <span className="badge badge-primary">Dynamic Shift Allocation</span>
      </div>
      <p className="panel-desc">
        Track volunteer deployment across shifts. Division B (Shift 1) and Division C (Shift 2) run sequentially, allowing volunteers to cover events in both categories.
      </p>

      {/* Distribution Stats Row */}
      <div className="volunteer-quick-stats" style={{ marginBottom: 24 }}>
        <div className="quick-stat-item">
          <span className="label">Active Stations</span>
          <span className="value">{stats.total} Venues</span>
        </div>
        <div className="quick-stat-item">
          <span className="label">Fully Staffed</span>
          <span className="value" style={{ color: 'var(--color-success)' }}>{stats.covered} Covered</span>
        </div>
        <div className="quick-stat-item">
          <span className="label">Unstaffed Shifts</span>
          <span className="value" style={{ color: stats.uncovered > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
            {stats.uncovered} Alert{stats.uncovered !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="quick-stat-item">
          <span className="label">Coverage Rate</span>
          <span className="value">{stats.percent}% Staffed</span>
        </div>
      </div>

      {/* Timeline Event Grid */}
      <div className="event-distribution-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {activeRooms.map((room) => {
          const assignedB = assignmentsByRoom.mapB[room.id] || [];
          const assignedC = assignmentsByRoom.mapC[room.id] || [];
          
          const isDivB = isDivisionB(room.allocation) || room.allocation.includes('(Division B)') || room.id === 'VET-101' || room.id === 'WALK-1';
          const isDivC = isDivisionC(room.allocation) || room.allocation.includes('(Division C)') || room.id === 'VET-102' || room.id === 'WALK-2';
          const isShared = !isDivB && !isDivC;

          const hasBVolunteers = assignedB.length > 0;
          const hasCVolunteers = assignedC.length > 0;

          let isCovered = false;
          if (isDivB) {
            isCovered = hasBVolunteers;
          } else if (isDivC) {
            isCovered = hasCVolunteers;
          } else {
            isCovered = hasBVolunteers && hasCVolunteers;
          }

          return (
            <div 
              key={room.id} 
              className={`glass-card ${isCovered ? 'covered-border' : 'uncovered-border'}`} 
              style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="shift-time" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--color-primary)' }}>
                    {room.id}
                  </span>
                  {isDivB ? (
                    <span className="badge badge-info" style={{ fontSize: '9px', padding: '1px 6px' }}>Div B Only</span>
                  ) : isDivC ? (
                    <span className="badge badge-danger" style={{ fontSize: '9px', padding: '1px 6px' }}>Div C Only</span>
                  ) : (
                    <span className="badge badge-primary" style={{ fontSize: '9px', padding: '1px 6px' }}>Shared (B & C)</span>
                  )}
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700 }}>{room.name}</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 550, minHeight: '38px' }}>
                  {room.allocation}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12 }}>
                  <MapPin size={12} style={{ flexShrink: 0 }} /> <span>{room.facultyName}</span>
                </div>
              </div>

              <div>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Shift 1 (Div B) */}
                  {(isDivB || isShared) && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Shift 1 (Div B Morning)</span>
                        {hasBVolunteers ? (
                          <span className="badge badge-success" style={{ padding: '2px 4px', fontSize: '8px' }}>Staffed ({assignedB.length})</span>
                        ) : (
                          <span className="badge badge-danger" style={{ padding: '2px 4px', fontSize: '8px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>Unstaffed</span>
                        )}
                      </div>
                      {hasBVolunteers && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {assignedB.map((vol) => (
                            <span 
                              key={vol.id} 
                              className="info-chip" 
                              style={{ 
                                fontSize: '0.72rem', 
                                padding: '1px 4px', 
                                borderRadius: 4, 
                                background: 'var(--bg-input)', 
                                border: '1px solid var(--border-color)', 
                                color: 'var(--text-primary)',
                                fontWeight: 550 
                              }}
                            >
                              {vol.fullName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shift 2 (Div C) */}
                  {(isDivC || isShared) && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Shift 2 (Div C Afternoon)</span>
                        {hasCVolunteers ? (
                          <span className="badge badge-success" style={{ padding: '2px 4px', fontSize: '8px' }}>Staffed ({assignedC.length})</span>
                        ) : (
                          <span className="badge badge-danger" style={{ padding: '2px 4px', fontSize: '8px', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>Unstaffed</span>
                        )}
                      </div>
                      {hasCVolunteers && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {assignedC.map((vol) => (
                            <span 
                              key={vol.id} 
                              className="info-chip" 
                              style={{ 
                                fontSize: '0.72rem', 
                                padding: '1px 4px', 
                                borderRadius: 4, 
                                background: 'var(--bg-input)', 
                                border: '1px solid var(--border-color)', 
                                color: 'var(--text-primary)',
                                fontWeight: 550 
                              }}
                            >
                              {vol.fullName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default EventLineDistribution;
