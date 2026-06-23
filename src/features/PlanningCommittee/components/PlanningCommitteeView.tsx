import React, { useState, useMemo } from 'react';
import type { useCommittee } from '../hooks/useCommittee';
import { 
  Users, 
  Search, 
  RefreshCcw, 
  Briefcase, 
  Info, 
  ShieldAlert, 
  Award, 
  UserCheck 
} from 'lucide-react';
import './PlanningCommittee.css';

const MemberAvatar: React.FC<{ 
  avatar?: string; 
  name: string; 
  isLead: boolean; 
  isSubLead: boolean; 
}> = ({ avatar, name, isLead, isSubLead }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`member-avatar ${isLead ? 'lead' : isSubLead ? 'sublead' : ''}`}>
      {avatar && !hasError ? (
        <img 
          src={avatar} 
          alt={name} 
          className="member-avatar-img"
          onError={() => setHasError(true)}
        />
      ) : (
        isLead ? <Award size={18} /> : isSubLead ? <UserCheck size={18} /> : <Users size={16} />
      )}
    </div>
  );
};

interface PlanningCommitteeViewProps {
  committeeHook: ReturnType<typeof useCommittee>;
}

export const PlanningCommitteeView: React.FC<PlanningCommitteeViewProps> = ({ committeeHook }) => {
  const { members, reassignTask, resetAssignments, tasks, stats } = committeeHook;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter members by query
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      if (searchQuery.trim() === '') return true;
      const query = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.assignedTask.toLowerCase().includes(query) ||
        (member.email ? member.email.toLowerCase().includes(query) : false)
      );    });
  }, [members, searchQuery]);

  return (
    <div className="committee-container animate-fade-in">
      {/* Header Info Panel */}
      <div className="committee-header glass-panel">
        <h2 className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={28} style={{ color: 'var(--color-primary)' }} /> Planning Committee & Task Assignment
        </h2>
        <p className="subtitle">
          Manage advancement office staff tournament planning committee members. Allocate responsibilities and monitor task coverage.
        </p>

        <div className="committee-quick-stats">
          <div className="quick-stat-item">
            <span className="label">Committee Size</span>
            <span className="value">{stats.total} Staff</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Assigned Roles</span>
            <span className="value">{stats.assigned} Members</span>
          </div>
          <div className="quick-stat-item">
            <span className="label">Unassigned/Available</span>
            <span className="value" style={{ color: stats.unassigned > 0 ? 'var(--color-warning)' : 'inherit' }}>
              {stats.unassigned} Members
            </span>
          </div>
        </div>
      </div>

      <div className="committee-split-layout">
        {/* Main Panel */}
        <div className="committee-list-panel glass-panel">
          <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div className="search-box" style={{ flex: 1, minWidth: '240px' }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search committee by name, role or task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="btn btn-secondary btn-sm" onClick={resetAssignments} title="Reset all task assignments to default">
              <RefreshCcw size={14} /> Reset Tasks
            </button>
          </div>

          <div className="committee-grid">
            {filteredMembers.length === 0 ? (
              <div className="empty-state">
                <p>No planning committee members found matching your search query.</p>
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isLead = member.role === 'Overall Lead';
                const isSubLead = member.role === 'Sub-Lead';
                const isUnassigned = member.assignedTask === 'Unassigned';

                return (
                  <div 
                    key={member.id} 
                    className={`member-card glass-card ${isLead ? 'lead-card' : ''} ${isSubLead ? 'sublead-card' : ''} ${isUnassigned ? 'unassigned' : ''}`}
                  >
                    <div className="member-info-row">
                      <div className="member-avatar-col">
                        <MemberAvatar 
                          avatar={member.avatar} 
                          name={member.name} 
                          isLead={isLead} 
                          isSubLead={isSubLead} 
                        />
                      </div>
                      
                      <div className="member-details-col">
                        <div className="name-role-line" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <h4>{member.name}</h4>
                          <span className={`role-badge ${member.role.toLowerCase().replace(' ', '-')}`}>
                            {member.role}
                          </span>
                        </div>
                        {member.email && (
                          <span className="member-email" title={member.email}>
                            {member.email}
                          </span>
                        )}
                        
                        <div className="task-selector-wrapper" style={{ marginTop: 12 }}>
                          <label htmlFor={`task-select-${member.id}`} className="task-label">
                            <Briefcase size={12} style={{ marginRight: 4 }} /> Assigned Task:
                          </label>
                          <select
                            id={`task-select-${member.id}`}
                            className={`task-select ${isUnassigned ? 'unassigned-select' : ''}`}
                            value={member.assignedTask}
                            onChange={(e) => reassignTask(member.id, e.target.value)}
                            aria-label={`Assign task to ${member.name}`}
                          >
                            {tasks.map((task) => (
                              <option key={task} value={task}>
                                {task}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Instructions Sidebar */}
        <div className="committee-sidebar">
          <div className="committee-sidebar-panel glass-panel">
            <h3>Staff & Committee Rules</h3>
            <p className="panel-desc">Operational instructions regarding advancement office coordinators.</p>

            <div className="committee-notices" style={{ marginTop: 16 }}>
              <div className="notice-card badge-primary" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <Award size={20} className="notice-icon" style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Leadership Hierarchy:</strong>
                  <p style={{ marginTop: 4 }}>
                    <strong>Prof. Sarah Lawhas</strong> is the overall lead for all planning operations. All operational reports and escalations should channel through <strong>Naomi Embaga</strong> (Sub-lead).
                  </p>
                </div>
              </div>

              <div className="notice-card badge-warning" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <ShieldAlert size={20} className="notice-icon" style={{ flexShrink: 0, color: 'var(--color-warning)' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Task Delegation Rule:</strong>
                  <p style={{ marginTop: 4 }}>
                    Each volunteer team category must have at least one committee member assigned as coordinator. If tasks are changed, verify the checklists and volunteer portal overlap is maintained.
                  </p>
                </div>
              </div>

              <div className="notice-card badge-info" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 8 }}>
                <Info size={20} className="notice-icon" style={{ flexShrink: 0, color: 'var(--color-info)' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Unassigned Policy:</strong>
                  <p style={{ marginTop: 4 }}>
                    Certain members (such as <strong>Yakubu Gomos</strong>) might be reserved for external relations or special advisory duties and thus are designated <strong>Unassigned</strong> from core tournament operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningCommitteeView;
