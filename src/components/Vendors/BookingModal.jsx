import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Calendar, DollarSign, Users, CheckSquare, Sparkles } from 'lucide-react';

export const BookingModal = ({ vendor, onClose, onSuccess }) => {
  const { user, token } = useContext(AuthContext);

  const [eventType, setEventType] = useState('Wedding');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState(150);
  const [selectedServices, setSelectedServices] = useState([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Dynamic price calculation
  const calculateTotal = () => {
    let base = vendor.startingPrice || 1000;
    if (vendor.category === 'Caterer') {
      base = base * guestCount;
    }
    // Add packages
    if (vendor.packages) {
      selectedServices.forEach(pkgName => {
        const found = vendor.packages.find(p => p.name === pkgName);
        if (found) base += found.price;
      });
    }
    return base;
  };

  const handlePackageToggle = (pkgName) => {
    if (selectedServices.includes(pkgName)) {
      setSelectedServices(selectedServices.filter(s => s !== pkgName));
    } else {
      setSelectedServices([...selectedServices, pkgName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in or switch persona to make a booking');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        vendorId: vendor._id,
        eventType,
        eventDate,
        guestCount: Number(guestCount),
        selectedServices,
        totalAmount: calculateTotal(),
        notes
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert('Booking request submitted successfully! Vendor has been notified.');
        onSuccess();
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = calculateTotal();

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Book Event with {vendor.businessName}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure your event requirements & estimated cost</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Event Type</label>
              <select className="form-input" value={eventType} onChange={e => setEventType(e.target.value)}>
                <option value="Wedding">Wedding Ceremony</option>
                <option value="Engagement">Engagement</option>
                <option value="Reception">Reception Feast</option>
                <option value="Pre-Wedding Legal">Pre-Wedding Legal Consultation</option>
                <option value="Photo Shoot">Couple Photo Shoot</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Event Date</label>
              <input type="date" className="form-input" value={eventDate} onChange={e => setEventDate(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Guest Count ({guestCount} guests)</label>
            <input 
              type="range" 
              min="20" 
              max="1000" 
              step="10" 
              value={guestCount} 
              onChange={e => setGuestCount(e.target.value)}
              style={{ width: '100%', accentColor: '#f43f5e', margin: '0.5rem 0' }} 
            />
          </div>

          {/* Package Selector Checklist */}
          {vendor.packages && vendor.packages.length > 0 && (
            <div>
              <label style={{ fontSize: '0.85rem', color: '#a5b4fc', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                Select Packages to Include:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {vendor.packages.map((pkg, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes(pkg.name)}
                        onChange={() => handlePackageToggle(pkg.name)}
                        style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                      />
                      <span>{pkg.name}</span>
                    </div>
                    <strong style={{ color: '#10b981' }}>+${pkg.price}</strong>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Special Notes / Themes</label>
            <textarea className="form-input" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Color preferences, timing details, special instructions..." />
          </div>

          {/* Price Summary Box */}
          <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Booking Total:</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>${totalCost.toLocaleString()}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              Includes base service + packages
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-db">
              <Sparkles size={16} /> {submitting ? 'Submitting...' : 'Confirm & Request Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
