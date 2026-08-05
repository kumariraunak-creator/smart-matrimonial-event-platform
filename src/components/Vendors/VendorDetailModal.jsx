import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Star, Calendar, MessageSquare, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { BookingModal } from './BookingModal';

export const VendorDetailModal = ({ vendor, onClose, onSelectChatUser }) => {
  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // New Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/vendor/${vendor._id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [vendor._id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in or switch persona to post a review');
      return;
    }
    if (!newComment) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          vendorId: vendor._id,
          rating: Number(newRating),
          comment: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewComment('');
        fetchReviews();
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error adding review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{vendor.businessName}</h3>
              <span className="badge badge-verified"><CheckCircle size={12} /> Verified</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Category: <strong style={{ color: '#a5b4fc' }}>{vendor.category}</strong> • City: {vendor.city}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {/* Portfolio Showcase */}
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
          {vendor.portfolioImages && vendor.portfolioImages.length > 0 ? (
            vendor.portfolioImages.map((img, i) => (
              <img key={i} src={img} alt="Portfolio" style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            ))
          ) : (
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" alt="Portfolio" style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
          )}
        </div>

        {/* Overview */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Business Description</h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {vendor.description}
          </p>
        </div>

        {/* Available Packages */}
        {vendor.packages && vendor.packages.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Service Packages & Pricing</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {vendor.packages.map((pkg, idx) => (
                <div key={idx} style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700 }}>{pkg.name}</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pkg.description}</p>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                    ${pkg.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#f59e0b', textTransform: 'uppercase' }}>Customer Reviews & Ratings</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" /> Average: {vendor.rating} / 5 ({reviews.length} reviews)
            </span>
          </div>

          {/* Add Review Form */}
          {user && (
            <form onSubmit={handleAddReview} style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px dashed var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your Rating:</span>
                <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={newRating} onChange={e => setNewRating(e.target.value)}>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                  <option value={3}>⭐⭐⭐ 3 Stars</option>
                  <option value={2}>⭐⭐ 2 Stars</option>
                  <option value={1}>⭐ 1 Star</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Write your review experience..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button type="submit" disabled={submittingReview} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  Post
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {reviews.map((r) => (
              <div key={r._id} style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ color: '#a5b4fc' }}>{r.user ? r.user.name : 'Client'}</strong>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{'⭐'.repeat(r.rating)}</span>
                </div>
                <p style={{ color: 'var(--text-muted)' }}>"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button 
            onClick={() => {
              onClose();
              if (vendor.user && onSelectChatUser) onSelectChatUser(vendor.user._id);
            }} 
            className="btn btn-secondary"
          >
            <MessageSquare size={16} /> Contact Vendor
          </button>

          <button 
            onClick={() => setShowBookingModal(true)} 
            className="btn btn-primary"
          >
            <Calendar size={16} /> Book Event Services
          </button>
        </div>

        {showBookingModal && (
          <BookingModal
            vendor={vendor}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => {
              setShowBookingModal(false);
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};
