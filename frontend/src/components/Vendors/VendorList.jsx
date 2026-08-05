import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Sparkles, CheckCircle, Tag, Layers } from 'lucide-react';
import { VendorDetailModal } from './VendorDetailModal';

export const VendorList = ({ onSelectChatUser }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pricingTierFilter, setPricingTierFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (pricingTierFilter) params.append('pricingTier', pricingTierFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/vendors?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setVendors(data.data);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [categoryFilter, pricingTierFilter, search]);

  const categories = [
    { id: '', label: 'All Services' },
    { id: 'Decorator', label: '💐 Decorators' },
    { id: 'Caterer', label: '🍽️ Caterers' },
    { id: 'Photographer', label: '📸 Photographers' },
    { id: 'Lawyer', label: '⚖️ Lawyers' },
    { id: 'Venue', label: '🏰 Venues' }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Verified Matrimonial Event Vendors</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse top-rated Decorators, Caterers, Photographers, Lawyers, and Venues</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`btn ${categoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search vendors by name, service or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '160px' }}
          value={pricingTierFilter}
          onChange={(e) => setPricingTierFilter(e.target.value)}
        >
          <option value="">All Pricing Tiers</option>
          <option value="Budget">Budget</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Luxury">Luxury</option>
        </select>
      </div>

      {/* Vendor Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={32} style={{ marginBottom: '1rem', color: '#6366f1' }} />
          <p>Querying verified vendors from database...</p>
        </div>
      ) : vendors.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No vendors found for this category or filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {vendors.map((v) => (
            <div
              key={v._id}
              className="glass-panel glass-panel-hover"
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
              onClick={() => setSelectedVendor(v)}
            >
              {/* Portfolio Cover Image */}
              <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '200px', background: '#0f172a' }}>
                <img
                  src={v.portfolioImages && v.portfolioImages.length > 0 ? v.portfolioImages[0] : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600'}
                  alt={v.businessName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div className="badge badge-role" style={{ position: 'absolute', top: '12px', left: '12px', backdropFilter: 'blur(8px)' }}>
                  {v.category}
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} fill="#f59e0b" /> {v.rating} ({v.reviewCount})
                </div>
              </div>

              {/* Business Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{v.businessName}</h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <MapPin size={14} color="#10b981" /> {v.city} • Tier: <strong style={{ color: '#a5b4fc' }}>{v.pricingTier}</strong>
                </p>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
                  {v.description}
                </p>

                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
                  Starting from ${v.startingPrice} {v.category === 'Caterer' ? '/ plate' : ''}
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{v.packages ? v.packages.length : 0} Service Packages</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1' }}>View Packages & Book &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSelectChatUser={onSelectChatUser}
        />
      )}
    </div>
  );
};
