import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Heart, MessageSquare, Sparkles, CheckCircle, MapPin, Briefcase, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';

export const ProfileModal = ({ profile, onClose, onSelectChatUser }) => {
  const { user, token } = useContext(AuthContext);
  const [interestSent, setInterestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendInterest = async () => {
    if (!user) {
      alert('Please log in or switch persona to send interest');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/${profile._id}/interest`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInterestSent(true);
      } else {
        alert(data.error || 'Failed to send interest');
      }
    } catch (err) {
      console.error('Error sending interest:', err);
    } finally {
      setLoading(false);
    }
  };

  const candidateName = profile.user ? profile.user.name : 'Candidate';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{candidateName}, {profile.age}</h3>
            <span className="badge badge-match"><Sparkles size={12} /> {profile.matchScore || 85}% Match</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Gallery */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {profile.photos && profile.photos.length > 0 ? (
            profile.photos.map((url, idx) => (
              <img key={idx} src={url} alt="Candidate photo" style={{ width: '180px', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            ))
          ) : (
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500" alt="Candidate" style={{ width: '180px', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          )}
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>About Candidate</h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            "{profile.bio || 'No detailed bio provided yet.'}"
          </p>
        </div>

        {/* Key Attributes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Religion & Caste</div>
            <div style={{ fontWeight: 600 }}>{profile.religion} ({profile.caste || 'General'})</div>
          </div>

          <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Occupation & Income</div>
            <div style={{ fontWeight: 600 }}>{profile.occupation} (${(profile.annualIncome/1000).toFixed(0)}k/yr)</div>
          </div>

          <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Education</div>
            <div style={{ fontWeight: 600 }}>{profile.education}</div>
          </div>

          <div style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location & Height</div>
            <div style={{ fontWeight: 600 }}>{profile.city}, {profile.country} ({profile.heightCm} cm)</div>
          </div>
        </div>

        {/* Partner Preferences */}
        {profile.partnerPreferences && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Partner Match Criteria</h4>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div><strong>Age Range:</strong> {profile.partnerPreferences.minAge || 21} - {profile.partnerPreferences.maxAge || 40} yrs</div>
              <div><strong>Religions:</strong> {profile.partnerPreferences.religions ? profile.partnerPreferences.religions.join(', ') : 'Any'}</div>
              <div><strong>Min Annual Income:</strong> ${((profile.partnerPreferences.minIncome || 0)/1000).toFixed(0)}k/yr</div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button 
            onClick={() => {
              onClose();
              if (profile.user && onSelectChatUser) onSelectChatUser(profile.user._id);
            }}
            className="btn btn-secondary"
          >
            <MessageSquare size={16} /> Send Direct Message
          </button>

          <button 
            onClick={handleSendInterest} 
            disabled={interestSent || loading}
            className="btn btn-primary"
          >
            <Heart size={16} fill={interestSent ? 'white' : 'none'} />
            {interestSent ? 'Interest Sent 💖' : 'Express Interest'}
          </button>
        </div>
      </div>
    </div>
  );
};
