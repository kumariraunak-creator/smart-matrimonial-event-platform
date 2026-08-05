import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Search, Filter, Heart, MapPin, Briefcase, GraduationCap, Sparkles, CheckCircle, Edit3 } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { MyProfileEditor } from './MyProfileEditor';

export const MatrimonialList = ({ onSelectChatUser }) => {
  const { user, token, profile: myProfile, refreshMe } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [religionFilter, setReligionFilter] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showMyProfileEditor, setShowMyProfileEditor] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genderFilter) params.append('gender', genderFilter);
      if (religionFilter) params.append('religion', religionFilter);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/profiles?${params.toString()}`, { headers });
      const data = await res.json();
      if (data.success) {
        setProfiles(data.data);
      }
    } catch (err) {
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [search, genderFilter, religionFilter, token]);

  return (
    <div>
      {/* Header & Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Explore Matrimonial Matches</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Profiles sorted by dynamic AI compatibility score</p>
        </div>

        {user && user.role === 'user' && (
          <button onClick={() => setShowMyProfileEditor(true)} className="btn btn-secondary" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', color: '#f43f5e' }}>
            <Edit3 size={16} /> Edit My Profile & Preferences
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, occupation, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="female">Female Candidates</option>
          <option value="male">Male Candidates</option>
        </select>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={religionFilter}
          onChange={(e) => setReligionFilter(e.target.value)}
        >
          <option value="">All Religions</option>
          <option value="Hindu">Hindu</option>
          <option value="Spiritual">Spiritual</option>
          <option value="Jain">Jain</option>
          <option value="Sikh">Sikh</option>
          <option value="Christian">Christian</option>
        </select>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={32} style={{ marginBottom: '1rem', color: '#f43f5e' }} />
          <p>Calculating database compatibility scores...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Heart size={40} style={{ margin: '0 auto 1rem auto', color: 'var(--text-dim)' }} />
          <p>No profiles match your filter criteria.</p>
        </div>
      ) : (
        <div className="grid-3">
          {profiles.map((p) => (
            <div
              key={p._id}
              className="glass-panel glass-panel-hover"
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
              onClick={() => setSelectedProfile(p)}
            >
              {/* Photo & Compatibility Badge */}
              <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', background: '#0f172a' }}>
                <img
                  src={p.photos && p.photos.length > 0 ? p.photos[0] : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'}
                  alt={p.user ? p.user.name : 'Candidate'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Dynamic Match Score Badge */}
                <div className="badge badge-match" style={{ position: 'absolute', top: '12px', right: '12px', backdropFilter: 'blur(8px)' }}>
                  <Sparkles size={12} /> {p.matchScore || 85}% Match
                </div>

                {p.verified && (
                  <div className="badge badge-verified" style={{ position: 'absolute', bottom: '12px', left: '12px', backdropFilter: 'blur(8px)' }}>
                    <CheckCircle size={12} /> Verified
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  {p.user ? p.user.name : 'Candidate'}, {p.age}
                </h3>
                
                <p style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  {p.religion} • {p.caste || 'General'} • {p.maritalStatus}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={14} color="#f43f5e" /> {p.occupation} (${(p.annualIncome/1000).toFixed(0)}k/yr)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={14} color="#6366f1" /> {p.education}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} color="#10b981" /> {p.city}, {p.country}
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "{p.bio}"
                </p>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>View Full Details & Criteria</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e' }}>Inspect Profile &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSelectChatUser={onSelectChatUser}
        />
      )}

      {/* Edit My Profile Modal */}
      {showMyProfileEditor && (
        <MyProfileEditor
          onClose={() => {
            setShowMyProfileEditor(false);
            refreshMe();
            fetchProfiles();
          }}
        />
      )}
    </div>
  );
};
