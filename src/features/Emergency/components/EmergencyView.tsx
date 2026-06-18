import React, { useState } from 'react';
import { EMERGENCY_PROTOCOLS, CONTACT_LIST } from '../../../data/eventData';
import { ShieldAlert, AlertTriangle, Phone, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import './Emergency.css';

export const EmergencyView: React.FC = () => {
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>('med');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordionId(activeAccordionId === id ? null : id);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    }).catch(err => {
      console.error('Could not copy number: ', err);
    });
  };

  return (
    <div className="emergency-container animate-fade-in">
      <div className="emergency-header glass-panel">
        <h2 className="text-gradient">Safety & Emergency Protocols</h2>
        <p className="subtitle">Operational guide manuals for incident response, evacuation points, and immediate lines of communication.</p>
        
        <div className="alert-banner badge-danger">
          <ShieldAlert size={22} className="alert-icon" />
          <div className="alert-text">
            <strong>Emergency Command Center: Room VET-103</strong>
            <p>In the event of an emergency, radio the Command Center immediately on **Channel 1** or contact the coordinators listed below.</p>
          </div>
        </div>
      </div>

      <div className="emergency-split-grid">
        {/* Step-by-Step Response Manuals Accordion */}
        <div className="protocols-panel glass-panel">
          <h3>Emergency Incident Manuals</h3>
          <p className="panel-desc">Click on a protocol heading to review exact step-by-step directives.</p>

          <div className="protocols-accordion">
            {EMERGENCY_PROTOCOLS.map((protocol) => {
              const isOpen = activeAccordionId === protocol.id;
              return (
                <div key={protocol.id} className={`accordion-item glass-card ${isOpen ? 'open' : ''}`}>
                  <button className="accordion-trigger" onClick={() => toggleAccordion(protocol.id)}>
                    <span className="trigger-title">
                      <AlertTriangle size={18} className="trigger-icon" />
                      {protocol.title}
                    </span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  {isOpen && (
                    <div className="accordion-content">
                      <ol className="step-list">
                        {protocol.steps.map((step, idx) => (
                          <li key={idx} className="step-item">
                            <span className="step-number">{idx + 1}</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clickable Emergency Contact List */}
        <div className="contacts-panel glass-panel">
          <h3>Emergency Contact Directory</h3>
          <p className="panel-desc">Click the copy button next to a number to copy it. Clinicians and security have 24-hour coverage.</p>
          
          <div className="contacts-grid">
            {CONTACT_LIST.map((contact, index) => {
              const isCopied = copiedIndex === index;
              return (
                <div key={index} className="contact-card glass-card">
                  <div className="contact-info">
                    <span className="contact-role">{contact.role}</span>
                    <span className="contact-number">{contact.number}</span>
                  </div>
                  <div className="contact-actions">
                    <a href={`tel:${contact.number}`} className="contact-call-btn" title="Call number">
                      <Phone size={14} />
                    </a>
                    <button 
                      className={`contact-copy-btn ${isCopied ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(contact.number, index)}
                      title="Copy to clipboard"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  {isCopied && <span className="copied-toast">Copied!</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmergencyView;
