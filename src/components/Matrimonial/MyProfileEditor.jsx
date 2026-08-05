import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Save, Image, Sparkles } from 'lucide-react';

export const MyProfileEditor = ({ onClose }) => {
  const { user, profile, token, refreshMe } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    avatar: '',
    gender: 'female',
    age: 26,
    religion: 'Hindu',
    caste: 'General',
    motherTongue: 'English',
    maritalStatus: 'Never Married',
    occupation: 'Software Engineer',
    annualIncome: 90000,
    education: 'Bachelor of Science',
    city: 'San Francisco',
    heightCm: 168,
    bio: '',
    minAge: 23,
    maxAge: 32,
    minIncome: 70000
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      avatar: user?.avatar || profile?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      gender: profile?.gender || 'female',
      age: profile?.age || 26,
      religion: profile?.religion || 'Hindu',
      caste: profile?.caste || 'General',
      motherTongue: profile?.motherTongue || 'English',
      maritalStatus: profile?.maritalStatus || 'Never Married',
      occupation: profile?.occupation || 'Software Engineer',
      annualIncome: profile?.annualIncome || 90000,
      education: profile?.education || 'Bachelor of Science',
      city: profile?.city || 'San Francisco',
      heightCm: profile?.heightCm || 168,
      bio: profile?.bio || '',
      minAge: profile?.partnerPreferences?.minAge || 23,
      maxAge: profile?.partnerPreferences?.maxAge || 32,
      minIncome: profile?.partnerPreferences?.minIncome || 70000
    });
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        avatar: formData.avatar,
        gender: formData.gender,
        age: Number(formData.age),
        religion: formData.religion,
        caste: formData.caste,
        motherTongue: formData.motherTongue,
        maritalStatus: formData.maritalStatus,
        occupation: formData.occupation,
        annualIncome: Number(formData.annualIncome),
        education: formData.education,
        city: formData.city,
        heightCm: Number(formData.heightCm),
        bio: formData.bio,
        partnerPreferences: {
          minAge: Number(formData.minAge),
          maxAge: Number(formData.maxAge),
          minIncome: Number(formData.minIncome),
          religions: [formData.religion]
        }
      };

      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        await refreshMe();
        onClose();
      } else {
        alert(data.error || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Profile & Profile Picture</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Profile Picture Upload / URL Preview Box */}
          <div style={{ background: '#0b0f19', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f43f5e', background: '#151d30' }}>
              <img src={formData.avatar} alt="Profile Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Image size={16} /> Profile Picture Image URL:
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender</label>
              <select className="form-input" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age</label>
              <input type="number" className="form-input" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Religion</label>
              <input type="text" className="form-input" value={formData.religion} onChange={e => setFormData({ ...formData, religion: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Occupation</label>
              <input type="text" className="form-input" value={formData.occupation} onChange={e => setFormData({ ...formData, occupation: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Annual Income ($)</label>
              <input type="number" className="form-input" value={formData.annualIncome} onChange={e => setFormData({ ...formData, annualIncome: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Education</label>
              <input type="text" className="form-input" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>City</label>
              <input type="text" className="form-input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Height (cm)</label>
              <input type="number" className="form-input" value={formData.heightCm} onChange={e => setFormData({ ...formData, heightCm: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bio / Personal Statement</label>
            <textarea className="form-input" rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell prospective matches about yourself..." />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#f43f5e', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Partner Preference Criteria</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min Partner Age</label>
                <input type="number" className="form-input" value={formData.minAge} onChange={e => setFormData({ ...formData, minAge: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Partner Age</label>
                <input type="number" className="form-input" value={formData.maxAge} onChange={e => setFormData({ ...formData, maxAge: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min Partner Income ($)</label>
                <input type="number" className="form-input" value={formData.minIncome} onChange={e => setFormData({ ...formData, minIncome: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile & Photo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
