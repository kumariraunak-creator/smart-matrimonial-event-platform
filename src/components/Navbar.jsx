import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heart, Calendar, ShieldCheck, Database, Bell, MessageSquare, User, LogOut, Sparkles, ChevronDown, LogIn, ShieldAlert } from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenDatabaseInspector, 
  onOpenChat, 
  onOpenNotifications, 
  unreadNotifsCount, 
  onOpenAuthModal,
  onOpenRequestAccessModal
}) => {
  const { user, logout, switchDemoPersona } = useContext(AuthContext);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const handlePersonaSelect = async (role) => {
    await switchDemoPersona(role);
    setShowPersonaMenu(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 25, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.85rem 1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('matrimonial')}>
          <div style={{
            background: 'var(--primary-gradient)',
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(244, 63, 94, 0.5)'
          }}>
            <Heart color="white" size={22} fill="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Unity<span style={{ color: '#f43f5e' }}>Matrimony</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '-2px', fontWeight: 600 }}>& Event Services Platform</p>
          </div>
        </div>

        {/* Navigation Tabs (Separate Pages View) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('matrimonial')}
            className={`btn ${activeTab === 'matrimonial' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Heart size={16} fill={activeTab === 'matrimonial' ? 'white' : 'none'} /> Matrimonial Matches
          </button>
          
          <button
            onClick={() => setActiveTab('vendors')}
            className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sparkles size={16} /> Vendor Directory
          </button>

          {user && (
            <button
              onClick={() => setActiveTab('bookings')}
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Calendar size={16} /> Bookings
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <ShieldCheck size={16} /> Admin Portal
            </button>
          )}
        </nav>

        {/* Actions, User Profile Avatar & Access Request */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Database Inspector Button */}
          <button 
            onClick={onOpenDatabaseInspector} 
            className="btn btn-db"
            title="Open Live MongoDB Inspector & Query Terminal"
          >
            <Database size={16} /> MongoDB Inspector
          </button>

          {/* Request Access Button */}
          <button
            onClick={onOpenRequestAccessModal}
            className="btn btn-gold"
            title="Request Platform Access (Admin Approval Flow)"
          >
            <ShieldAlert size={16} /> Request Access
          </button>

          {/* Login / Sign Up Button */}
          <button
            onClick={onOpenAuthModal}
            className="btn btn-secondary"
            title="Open Login or Signup Modal"
          >
            <LogIn size={16} /> Login
          </button>

          {user && (
            <>
              {/* Chat Button */}
              <button 
                onClick={onOpenChat}
                className="btn btn-secondary" 
                style={{ padding: '0.65rem' }}
                title="Messages & Chat"
              >
                <MessageSquare size={18} />
              </button>

              {/* Notification Button */}
              <button 
                onClick={onOpenNotifications}
                className="btn btn-secondary" 
                style={{ padding: '0.65rem', position: 'relative' }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#f43f5e',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Logged in User Profile Avatar Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#151d30', padding: '0.25rem 0.6rem 0.25rem 0.35rem', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>{user.name.split(' ')[0]}</span>
              </div>
            </>
          )}

          {/* Quick Demo Persona Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="btn btn-secondary"
              style={{ background: 'rgba(99, 102, 241, 0.18)', borderColor: 'rgba(99, 102, 241, 0.4)', color: '#c084fc', padding: '0.5rem 0.85rem' }}
            >
              <User size={15} /> <strong style={{ textTransform: 'capitalize', color: 'white', fontSize: '0.8rem' }}>{user ? user.role : 'Guest'}</strong> <ChevronDown size={14} />
            </button>

            {showPersonaMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: '220px',
                background: '#151d30',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                zIndex: 100
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a5b4fc', padding: '0.35rem 0.5rem', textTransform: 'uppercase' }}>
                  Quick Switch Persona:
                </div>
                <button onClick={() => handlePersonaSelect('user')} style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', color: 'var(--text-main)', borderRadius: '6px' }} className="glass-panel-hover">
                  👤 Candidate User (Ananya)
                </button>
                <button onClick={() => handlePersonaSelect('vendor')} style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', color: 'var(--text-main)', borderRadius: '6px' }} className="glass-panel-hover">
                  💐 Event Vendor (Decor)
                </button>
                <button onClick={() => handlePersonaSelect('lawyer')} style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', color: 'var(--text-main)', borderRadius: '6px' }} className="glass-panel-hover">
                  ⚖️ Legal Counsel Vendor
                </button>
                <button onClick={() => handlePersonaSelect('admin')} style={{ width: '100%', textAlign: 'left', padding: '0.5rem', background: 'transparent', color: 'var(--text-main)', borderRadius: '6px' }} className="glass-panel-hover">
                  🛡️ Platform Admin
                </button>
              </div>
            )}
          </div>

          {user && (
            <button onClick={logout} className="btn btn-secondary" style={{ color: '#f43f5e', padding: '0.65rem' }} title="Log Out">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
