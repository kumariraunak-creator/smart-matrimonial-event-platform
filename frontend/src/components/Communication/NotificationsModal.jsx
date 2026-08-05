import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Bell, Heart, Calendar, CheckCircle } from 'lucide-react';

export const NotificationsModal = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([
    { _id: '1', title: 'New Matrimonial Interest Received! 💖', message: 'Rohan Mehta expressed interest in your profile.', createdAt: new Date() },
    { _id: '2', title: 'Booking Confirmed 🎉', message: 'Royal Blooms Floral & Decor confirmed your wedding setup.', createdAt: new Date() }
  ]);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 105 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} color="#f43f5e" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Activity Notifications</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{ background: '#0f172a', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
