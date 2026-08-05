import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, DollarSign, CheckCircle, XCircle, Sparkles, AlertCircle } from 'lucide-react';

export const BookingsList = () => {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-verified"><CheckCircle size={12} /> Confirmed</span>;
      case 'completed':
        return <span className="badge badge-match" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>Completed</span>;
      case 'cancelled':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Event Booking Tracker</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {user?.role === 'vendor' ? 'Manage incoming event service requests' : 'Track your active matrimonial event bookings & vendor confirmations'}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={32} style={{ marginBottom: '1rem', color: '#f43f5e' }} />
          <p>Fetching booking records from MongoDB...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ margin: '0 auto 1rem auto', color: 'var(--text-dim)' }} />
          <p>No event bookings found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {b.vendor ? b.vendor.businessName : 'Event Service Provider'}
                  </h3>
                  {getStatusBadge(b.status)}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <div>📅 Date: <strong style={{ color: 'var(--text-main)' }}>{b.eventDate}</strong></div>
                  <div>🎉 Type: <strong style={{ color: '#a5b4fc' }}>{b.eventType}</strong></div>
                  <div>👥 Guests: <strong style={{ color: 'var(--text-main)' }}>{b.guestCount}</strong></div>
                  <div>👤 Client: <strong style={{ color: 'var(--text-main)' }}>{b.user ? b.user.name : 'Client'}</strong></div>
                </div>

                {b.selectedServices && b.selectedServices.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Services: {b.selectedServices.join(', ')}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Cost</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>${b.totalAmount.toLocaleString()}</div>
                </div>

                {/* Status Action Buttons */}
                {user?.role === 'vendor' && b.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} className="btn btn-db" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                      Accept
                    </button>
                    <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>
                      Reject
                    </button>
                  </div>
                )}

                {user?.role === 'user' && b.status === 'pending' && (
                  <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
