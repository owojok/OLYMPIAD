// Justification for R1: This file is >250 lines because it manages the complete interactive UI state for the venue map, floor filters, search queries, visual room cards grid, sidebar event visualizer, and inline renaming forms in a single cohesive component.
import React, { useState, useMemo } from 'react';
import type { useVenues } from '../hooks/useVenues';
import { TIMELINE_EVENTS, VENUE_DATA } from '../../../data/eventData';
import { 
  Search, 
  MapPin, 
  Layers, 
  Layout, 
  Clock, 
  Info, 
  Edit2, 
  Check, 
  X, 
  RefreshCcw 
} from 'lucide-react';
import './Venue.css';

interface VenueViewProps {
  venueHook: ReturnType<typeof useVenues>;
}

export const VenueView: React.FC<VenueViewProps> = ({ venueHook }) => {
  const { venues, renameFaculty, renameRoom, resetVenues } = venueHook;
  const [selectedFacultyIdx, setSelectedFacultyIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Rename editing states
  const [isEditingFaculty, setIsEditingFaculty] = useState(false);
  const [facRenameVal, setFacRenameVal] = useState('');
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [roomRenameVal, setRoomRenameVal] = useState('');

  // Fallback to static VENUE_DATA if state is not loaded yet
  const activeVenues = venues.length > 0 ? venues : VENUE_DATA;
  const currentFaculty = activeVenues[selectedFacultyIdx] || { name: '', floors: [] };

  // List of floors in the current faculty
  const floorList = useMemo(() => {
    if (!currentFaculty || !currentFaculty.floors) return ['All'];
    return ['All', ...currentFaculty.floors.map(f => f.floor)];
  }, [currentFaculty]);

  // Filtered rooms in current faculty
  const filteredFloors = useMemo(() => {
    if (!currentFaculty || !currentFaculty.floors) return [];
    return currentFaculty.floors.map(floorLayout => {
      // If floor filter is set and does not match, skip rooms
      if (selectedFloor !== 'All' && floorLayout.floor !== selectedFloor) {
        return { floor: floorLayout.floor, rooms: [] };
      }

      const filteredRooms = floorLayout.rooms.filter(room => {
        if (searchQuery.trim() === '') return true;
        const query = searchQuery.toLowerCase();
        return (
          room.name.toLowerCase().includes(query) ||
          room.id.toLowerCase().includes(query) ||
          room.allocation.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query)
        );
      });

      return {
        floor: floorLayout.floor,
        rooms: filteredRooms
      };
    }).filter(f => f.rooms.length > 0);
  }, [currentFaculty, selectedFloor, searchQuery]);

  // Find events allocated to the active room
  const activeRoomEvents = useMemo(() => {
    if (!activeRoomId) return [];
    return TIMELINE_EVENTS.filter(event => {
      return event.location.includes(activeRoomId) || event.details.some(d => d.includes(activeRoomId));
    });
  }, [activeRoomId]);

  const activeRoomDetail = useMemo(() => {
    if (!activeRoomId) return null;
    for (const f of activeVenues) {
      for (const fl of f.floors) {
        const room = fl.rooms.find(r => r.id === activeRoomId);
        if (room) return room;
      }
    }
    return null;
  }, [activeRoomId, activeVenues]);

  const handleFacRenameSave = () => {
    if (facRenameVal.trim() !== '') {
      renameFaculty(selectedFacultyIdx, facRenameVal);
      setIsEditingFaculty(false);
    }
  };

  const handleRoomRenameSave = () => {
    if (activeRoomId && roomRenameVal.trim() !== '') {
      renameRoom(activeRoomId, roomRenameVal);
      setIsEditingRoom(false);
    }
  };

  return (
    <div className="venue-container animate-fade-in">
      <div className="venue-header glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="text-gradient">Venue Allocation Map</h2>
            <p className="subtitle">Explore rooms, labs, assembly halls, emergency assembly zones, and directional pathways.</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => {
              resetVenues();
              setIsEditingFaculty(false);
              setIsEditingRoom(false);
            }} 
            title="Reset to default venue names"
          >
            <RefreshCcw size={14} /> Reset Names
          </button>
        </div>

        <div className="faculty-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {activeVenues.map((fac, idx) => {
            const isActive = selectedFacultyIdx === idx;
            return (
              <div 
                key={idx} 
                className={`faculty-tab-item ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {isActive && isEditingFaculty ? (
                  <div className="tab-rename-form" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
                    <input
                      type="text"
                      className="tab-rename-input"
                      value={facRenameVal}
                      onChange={(e) => setFacRenameVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleFacRenameSave();
                        if (e.key === 'Escape') setIsEditingFaculty(false);
                      }}
                      autoFocus
                      aria-label="Rename active venue"
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '0.85rem', 
                        borderRadius: 4, 
                        border: '1px solid var(--color-primary)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button className="btn btn-primary btn-xs" onClick={handleFacRenameSave} style={{ padding: 4 }} aria-label="Confirm rename">
                      <Check size={12} />
                    </button>
                    <button className="btn btn-secondary btn-xs" onClick={() => setIsEditingFaculty(false)} style={{ padding: 4 }} aria-label="Cancel rename">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className={`faculty-tab ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFacultyIdx(idx);
                        setSelectedFloor('All');
                        setActiveRoomId(null);
                        setIsEditingFaculty(false);
                        setIsEditingRoom(false);
                      }}
                    >
                      <Layout size={16} />
                      {fac.name}
                    </button>
                    {isActive && (
                      <button 
                        className="faculty-tab-edit-btn" 
                        onClick={() => {
                          setIsEditingFaculty(true);
                          setFacRenameVal(fac.name);
                        }}
                        title="Rename this Venue Section"
                        style={{ 
                          border: 'none', 
                          background: 'transparent', 
                          color: 'var(--text-muted)', 
                          cursor: 'pointer',
                          padding: '0 6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="venue-layout-grid">
        <div className="venue-main-panel">
          <div className="venue-controls glass-card">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search rooms, labs, or functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="floor-filters">
              <span className="filter-label"><Layers size={14} /> Floor:</span>
              <div className="floor-chips">
                {floorList.map(floor => (
                  <button
                    key={floor}
                    className={`floor-chip ${selectedFloor === floor ? 'active' : ''}`}
                    onClick={() => setSelectedFloor(floor)}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="building-map">
            {filteredFloors.length === 0 ? (
              <div className="empty-state glass-card">
                <p>No allocations match your search query in this section.</p>
              </div>
            ) : (
              filteredFloors.map(floorLayout => (
                <div key={floorLayout.floor} className="floor-section">
                  <h3 className="floor-title">{floorLayout.floor}</h3>
                  <div className="rooms-grid">
                    {floorLayout.rooms.map(room => (
                      <div
                        key={room.id}
                        className={`room-card glass-card ${room.type.toLowerCase().replace(' ', '-')} ${activeRoomId === room.id ? 'selected' : ''}`}
                        onClick={() => {
                          setActiveRoomId(room.id === activeRoomId ? null : room.id);
                          setIsEditingRoom(false);
                        }}
                      >
                        <div className="room-card-header">
                          <span className="room-id">{room.id}</span>
                          <span className="room-type-badge">{room.type}</span>
                        </div>
                        <h4 className="room-name">{room.name}</h4>
                        <p className="room-allocation">{room.allocation}</p>
                        <div className="room-card-footer">
                          <span className="status-dot-wrapper">
                            <span className={`status-dot ${room.status}`}></span>
                            {room.status === 'active' ? 'Active Use' : 'Ready'}
                          </span>
                          <span className="details-prompt">View Schedule</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar displaying active room details */}
        <div className="venue-sidebar">
          {activeRoomDetail ? (
            <div className="room-detail-panel glass-panel animate-scale-in">
              <div className="detail-header">
                <span className="room-id-lg">{activeRoomDetail.id}</span>
                
                {isEditingRoom ? (
                  <div className="room-rename-form" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0' }}>
                    <input
                      type="text"
                      className="room-rename-input"
                      value={roomRenameVal}
                      onChange={(e) => setRoomRenameVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRoomRenameSave();
                        if (e.key === 'Escape') setIsEditingRoom(false);
                      }}
                      autoFocus
                      aria-label="Rename room"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--color-primary)',
                        backgroundColor: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        flex: 1
                      }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={handleRoomRenameSave} style={{ padding: 6 }} aria-label="Confirm room rename">
                      <Check size={14} />
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingRoom(false)} style={{ padding: 6 }} aria-label="Cancel room rename">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                    <h2 style={{ margin: 0 }}>{activeRoomDetail.name}</h2>
                    <button
                      className="room-rename-edit-btn"
                      onClick={() => {
                        setIsEditingRoom(true);
                        setRoomRenameVal(activeRoomDetail.name);
                      }}
                      title="Rename Room"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
                
                <span className="room-type-badge-lg">{activeRoomDetail.type}</span>
              </div>

              <div className="detail-body">
                <div className="detail-section">
                  <h4>Function Allocation</h4>
                  <p className="alloc-text">{activeRoomDetail.allocation}</p>
                </div>

                <div className="detail-section">
                  <h4>Scheduled Events ({activeRoomEvents.length})</h4>
                  {activeRoomEvents.length === 0 ? (
                    <p className="no-events-text"><Info size={14} style={{ marginRight: 4 }} /> No specific timeline events pinned to this room ID.</p>
                  ) : (
                    <div className="room-events-list">
                      {activeRoomEvents.map(event => (
                        <div key={event.id} className="room-event-card">
                          <div className="event-time"><Clock size={12} /> {event.time.split(' (')[0]}</div>
                          <div className="event-title">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="sidebar-empty glass-panel">
              <MapPin size={36} className="map-icon" />
              <h3>Room Schedule Visualizer</h3>
              <p>Click on any room card on the map to see its details, layouts, and scheduled tournament events.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default VenueView;
