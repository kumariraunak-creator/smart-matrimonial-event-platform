import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, LogIn, UserPlus, Sparkles, Shield, Heart, User, Key, Mail, Phone, Lock } from 'lucide-react';

export const AuthModal = ({ onClose }) => {
  const { login, register, switchDemoPersona } = useContext(AuthContext);
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !signupEmail || !signupPassword) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email: signupEmail,
      password: signupPassword,
      role,
      phone
    });
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    const res = await switchDemoPersona(demoRole);
    setLoading(false);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '2.25rem' }}>
        {/* Header Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-gradient)',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)'
            }}>
              <Heart size={20} fill="white" color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Welcome to UnityMatrimony</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Join the smart matrimonial & event hub</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', background: '#0b0f19', borderRadius: 'var(--radius-md)', padding: '0.35rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: mode === 'login' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'login' ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogIn size={16} /> Sign In
          </button>

          <button
            onClick={() => { setMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.65rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: mode === 'signup' ? 'var(--primary-gradient)' : 'transparent',
              color: mode === 'signup' ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="ananya@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}>
              <LogIn size={18} /> {loading ? 'Signing In...' : 'Sign In to Account'}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="priya@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>Password (min 6 chars)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>I want to Register as:</label>
              <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">👤 Candidate / Matrimonial Client</option>
                <option value="vendor">💐 Event Service Vendor</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}>
              <UserPlus size={18} /> {loading ? 'Registering...' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Sign In Box */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            ⚡ Or 1-Click Instant Demo Sign In:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            <button type="button" onClick={() => handleQuickDemo('user')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              👤 Candidate (Ananya)
            </button>
            <button type="button" onClick={() => handleQuickDemo('vendor')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              💐 Vendor (Elena)
            </button>
            <button type="button" onClick={() => handleQuickDemo('lawyer')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              ⚖️ Lawyer (Adv. Verma)
            </button>
            <button type="button" onClick={() => handleQuickDemo('admin')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>
              🛡️ Admin Persona
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
