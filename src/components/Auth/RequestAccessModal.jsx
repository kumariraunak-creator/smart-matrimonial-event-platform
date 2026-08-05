import React, { useState } from 'react';
import { X, ShieldAlert, Send, CheckCircle } from 'lucide-react';

export const RequestAccessModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: 'Password123!',
          role,
          phone,
          requestReason: reason
        })
      });

      const data = await res.json();
      if (data.success || data.status === 'pending_approval') {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit access request');
      }
    } catch (err) {
      console.error('Access request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 210 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert color="#f59e0b" size={22} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Request Platform Access</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>Access Request Submitted!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your access request has been sent to the Admin queue for verification. Once approved by an Administrator, you will be able to log in.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rahul Sharma" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="rahul@example.com" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone Number</label>
              <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 019-2834" />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requested Account Type</label>
              <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">👤 Candidate / Matrimonial Client</option>
                <option value="vendor">💐 Event Service Vendor</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reason for Requesting Access</label>
              <textarea className="form-input" rows={3} value={reason} onChange={e => setReason(e.target.value)} required placeholder="Briefly state your purpose (e.g. Looking for matrimonial partner / offering photography services)..." />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-gold" style={{ flex: 2 }}>
                <Send size={16} /> {loading ? 'Submitting...' : 'Submit Request for Admin Approval'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
