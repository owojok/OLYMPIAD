import React, { useState } from 'react';
import type { useVolunteerRegistration } from '../hooks/useVolunteerRegistration';
import { 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Plus
} from 'lucide-react';
import './VolunteerRegisterForm.css';

interface VolunteerRegisterFormProps {
  registrationHook: ReturnType<typeof useVolunteerRegistration>;
}

export const VolunteerRegisterForm: React.FC<VolunteerRegisterFormProps> = ({ registrationHook }) => {
  const { registerVolunteer } = registrationHook;

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() === '' || phone.trim() === '' || email.trim() === '') return;

    registerVolunteer(fullName, phone, email);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setSubmitted(false);
  };

  return (
    <div className="public-register-container animate-fade-in">
      <div className="public-register-card glass-panel animate-scale-in">
        <div className="card-header">
          <div className="logo-badge">
            <Sparkles size={24} className="sparkle-icon" />
          </div>
          <h2>SO NIGERIA 2026</h2>
          <span className="subtitle">Plateau State Tournament · Jos</span>
        </div>

        {submitted ? (
          <div className="success-state animate-fade-in">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={56} className="success-icon" />
            </div>
            <h3>Registration Complete!</h3>
            <p>
              Thank you, <strong>{fullName}</strong>. Your details have been logged into the Jos Tournament Command Center roster.
            </p>
            <div className="success-notice">
              The planning committee will review your application and send your designated role assignment and shift schedules via email/SMS shortly.
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleReset} style={{ marginTop: 24, gap: 6 }}>
              <Plus size={16} /> Register Another Staff
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-info">
              <h3>Volunteer Sign-Up</h3>
              <p>Join the tournament operations team. Complete the form below to register your profile.</p>
            </div>

            <div className="form-group">
              <label htmlFor="reg-fullname">Full Name *</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number *</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="e.g. +234 803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="e.g. yourname@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary submit-btn" style={{ marginTop: 8 }}>
              Submit Registration <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>
          </form>
        )}
      </div>

      <div className="public-register-footer">
        Science Olympiad Nigeria · University of Jos Command Center © 2026
      </div>
    </div>
  );
};

export default VolunteerRegisterForm;
