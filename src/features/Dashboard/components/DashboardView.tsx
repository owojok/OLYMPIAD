import { Calendar, MapPin, Users, Activity, Sparkles, ShieldAlert, GraduationCap, Award } from 'lucide-react';
import './Dashboard.css';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  volunteerCount: number;
  presentSchools: number;
  expectedSchools: number;
  presentJudges: number;
  expectedJudges: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, 
  volunteerCount, 
  presentSchools, 
  expectedSchools,
  presentJudges,
  expectedJudges
}) => {
  return (
    <div className="dashboard-container animate-fade-in">
      <div className="welcome-banner glass-panel">
        <div className="banner-content">
          <span className="badge badge-primary">
            <Sparkles size={12} /> Plateau State Tournament 2026
          </span>
          <h1 className="text-gradient">Science Olympiad Nigeria</h1>
          <p className="subtitle">
            Welcome to the official event command center for Division B (JSS) & Division C (SSS) at the University of Jos.
          </p>
          <div className="banner-meta">
            <span className="meta-item"><Calendar size={16} /> September / October 2026 (2-Day Event)</span>
            <span className="meta-item"><MapPin size={16} /> University of Jos, Plateau State</span>
          </div>
        </div>
        <div className="banner-theme">
          <div className="theme-card">
            <div className="theme-title">Theme</div>
            <div className="theme-value">INNOVATE NOW</div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card" onClick={() => onNavigate('schedule')}>
          <div className="stat-icon-wrapper prim">
            <Calendar size={22} />
          </div>
          <div className="stat-info">
            <h3>2-Day Schedule</h3>
            <p className="stat-desc">Run of Show, Setup & Ceremonies</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => onNavigate('venues')}>
          <div className="stat-icon-wrapper info">
            <MapPin size={22} />
          </div>
          <div className="stat-info">
            <h3>2 Major Venues</h3>
            <p className="stat-desc">Vet Science & Outdoor Areas</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => onNavigate('volunteers')}>
          <div className="stat-icon-wrapper succ">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <h3>{volunteerCount} Volunteers</h3>
            <p className="stat-desc">10:1 Ratio (Target: 400 Students)</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => onNavigate('schools')}>
          <div className="stat-icon-wrapper warn">
            <GraduationCap size={22} />
          </div>
          <div className="stat-info">
            <h3>{presentSchools} / {expectedSchools} Schools</h3>
            <p className="stat-desc">Real-time Check-In Status</p>
          </div>
        </div>

        <div className="stat-card glass-card" onClick={() => onNavigate('judges')}>
          <div className="stat-icon-wrapper danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <Award size={22} />
          </div>
          <div className="stat-info">
            <h3>{presentJudges} / {expectedJudges} Judges</h3>
            <p className="stat-desc">Supervisors Checked In</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="overview-card glass-panel">
          <h2>Tournament Framework</h2>
          <p>
            The tournament spans two days. Day 1 is dedicated to intense core lab, physics, biology, and engineering workshop competitions, divided strictly into JSS (Division B) in the morning and SSS (Division C) in the afternoon. Day 2 brings all participants, VIPs, and school boards together for the closing ceremony and award presentation.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <div className="feat-bullet"></div>
              <div><strong>Division B (JSS):</strong> Day 1 Morning (9:00 am - 12:00 pm). Anatomy, Disease Detectives, Density, Thermodynamics, Battery Buggy, Mystery Architecture, and Dynamic Planet.</div>
            </div>
            <div className="feature-item">
              <div className="feat-bullet"></div>
              <div><strong>Division C (SSS):</strong> Day 1 Afternoon (1:00 pm - 4:00 pm). Chemistry Lab, Anatomy, Circuits, Solar Power, Electric Vehicle, and Dynamic Planet.</div>
            </div>
            <div className="feature-item">
              <div className="feat-bullet"></div>
              <div><strong>Day 2 Ceremony:</strong> closing presentations, trophy distribution for 1st, 2nd, 3rd places, and individual event certificates.</div>
            </div>
          </div>
        </div>

        <div className="quick-access-card glass-panel">
          <h2>Emergency Quick Action</h2>
          <p>Quick access to safety plans, rescue procedures and contact numbers for the event.</p>
          <div className="alert-box badge-danger">
            <ShieldAlert size={20} />
            <div>
              <strong>Alert Level: Normal Standby</strong>
              <p>Medical, Fire, and Security services are briefed and on standby.</p>
            </div>
          </div>
          <div className="quick-buttons">
            <button className="btn btn-danger" onClick={() => onNavigate('emergency')}>
              <Activity size={16} /> View Emergency Protocols
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('checklists')}>
              Check Materials Checklist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
