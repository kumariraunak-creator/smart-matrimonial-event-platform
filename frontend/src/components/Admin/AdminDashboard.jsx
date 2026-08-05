import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Users, ShieldCheck, CheckCircle, XCircle, DollarSign, Calendar, Star, Database, BarChart2, TrendingUp, PieChart, ShieldAlert, UserCheck } from 'lucide-react';

export const AdminDashboard = ({ onOpenDatabaseInspector }) => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('access_requests'); // 'access_requests' | 'analytics' | 'vendors' | 'users'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const statsRes = await fetch('/api/admin/stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const revRes = await fetch('/api/admin/analytics/revenue-by-category', { headers });
      const revData = await revRes.json();
      if (revData.success) setRevenueByCategory(revData.data);

      const demoRes = await fetch('/api/admin/analytics/demographics', { headers });
      const demoData = await demoRes.json();
      if (demoData.success) setDemographics(demoData.demographics || []);

      const topRes = await fetch('/api/admin/analytics/top-vendors', { headers });
      const topData = await topRes.json();
      if (topData.success) setTopVendors(topData.data || []);

      const usersRes = await fetch('/api/admin/users', { headers });
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.data);

      const vendorsRes = await fetch('/api/admin/vendors', { headers });
      const vendorsData = await vendorsRes.json();
      if (vendorsData.success) setVendors(vendorsData.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const handleVerifyVendor = async (vendorId, status) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ verificationStatus: status })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Vendor verification error:', err);
    }
  };

  const handleToggleUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('User status update error:', err);
    }
  };

  const pendingAccessUsers = users.filter(u => u.status === 'pending_approval');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Platform Administration & Access Approval Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approve user access requests, verify service vendors, and monitor platform metrics</p>
        </div>

        <button onClick={onOpenDatabaseInspector} className="btn btn-db">
          <Database size={16} /> Open MongoDB Inspector
        </button>
      </div>

      {/* Metrics Cards Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 800 }}>Pending Access Requests</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{pendingAccessUsers.length}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Users</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.totalUsers}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Matrimonial Profiles</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f43f5e' }}>{stats.totalProfiles}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Vendors</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366f1' }}>{stats.totalVendors}</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>${stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('access_requests')} className={`btn ${activeTab === 'access_requests' ? 'btn-gold' : 'btn-secondary'}`}>
          <ShieldAlert size={16} /> Access Requests Queue ({pendingAccessUsers.length})
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}>
          <BarChart2 size={16} /> MongoDB Analytics
        </button>
        <button onClick={() => setActiveTab('vendors')} className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}>
          Vendor Approvals ({vendors.length})
        </button>
        <button onClick={() => setActiveTab('users')} className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}>
          User Moderation ({users.length})
        </button>
      </div>

      {/* PENDING ACCESS REQUESTS QUEUE (ADMIN APPROVAL MANDATE) */}
      {activeTab === 'access_requests' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f59e0b' }}>Restricted Platform Access Requests</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Only approved users gain full access to search candidates and book event services.</p>
          </div>

          {pendingAccessUsers.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <UserCheck size={40} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700 }}>No pending access requests right now. All requested accounts are processed!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingAccessUsers.map((u) => (
                <div key={u._id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email} • Phone: {u.phone}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '0.2rem' }}>
                        Requested Role: <strong style={{ textTransform: 'capitalize' }}>{u.role}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        Reason: "{u.requestReason || 'Matrimonial matching access request'}"
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleToggleUserStatus(u._id, 'active')} className="btn btn-db" style={{ padding: '0.5rem 1rem' }}>
                      <CheckCircle size={16} /> Approve Access
                    </button>
                    <button onClick={() => handleToggleUserStatus(u._id, 'suspended')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', color: '#ef4444' }}>
                      <XCircle size={16} /> Reject Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADVANCED MONGO AGGREGATION ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} /> Revenue Aggregation by Vendor Category ($lookup + $group)
            </h3>

            <div className="grid-3">
              {revenueByCategory.map((cat) => (
                <div key={cat._id} style={{ background: '#0b0f19', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 700 }}>{cat._id || 'Uncategorized'}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>${cat.totalRevenue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Bookings: {cat.bookingCount} • Avg Value: ${Math.round(cat.avgBookingValue).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PieChart size={18} /> Profile Demographics Aggregation
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {demographics.map((d) => (
                  <div key={d._id} style={{ background: '#0b0f19', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textTransform: 'capitalize', fontWeight: 700 }}>{d._id} Candidates</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Avg Age: <strong style={{ color: 'white' }}>{Math.round(d.avgAge)} yrs</strong> • Avg Income: <strong style={{ color: '#10b981' }}>${Math.round(d.avgIncome/1000)}k/yr</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} /> Top Rated Vendors Aggregation ($project + $sort)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topVendors.map((v) => (
                  <div key={v._id} style={{ background: '#0b0f19', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{v.businessName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.category} • {v.city}</div>
                    </div>
                    <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem' }}>
                      ⭐ {v.rating} ({v.reviewCount})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Approvals Table */}
      {activeTab === 'vendors' && (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Business Name</th>
                <th style={{ padding: '0.75rem' }}>Category</th>
                <th style={{ padding: '0.75rem' }}>City</th>
                <th style={{ padding: '0.75rem' }}>Price Tier</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.businessName}</td>
                  <td style={{ padding: '0.75rem', color: '#a5b4fc' }}>{v.category}</td>
                  <td style={{ padding: '0.75rem' }}>{v.city}</td>
                  <td style={{ padding: '0.75rem' }}>{v.pricingTier}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${v.verificationStatus === 'verified' ? 'badge-verified' : ''}`} style={{ textTransform: 'capitalize' }}>
                      {v.verificationStatus}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {v.verificationStatus !== 'verified' ? (
                      <button onClick={() => handleVerifyVendor(v._id, 'verified')} className="btn btn-db" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        Approve Vendor
                      </button>
                    ) : (
                      <button onClick={() => handleVerifyVendor(v._id, 'pending')} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}>
                        Revoke Approval
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Moderation Table */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>User Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}><span className="badge badge-role">{u.role}</span></td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.status === 'active' ? 'badge-verified' : ''}`} style={{ color: u.status === 'suspended' || u.status === 'pending_approval' ? '#f59e0b' : '' }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {u.status === 'pending_approval' ? (
                      <button onClick={() => handleToggleUserStatus(u._id, 'active')} className="btn btn-db" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        Approve Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.status === 'active' ? 'suspended' : 'active')}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: u.status === 'active' ? '#ef4444' : '#10b981' }}
                      >
                        {u.status === 'active' ? 'Suspend User' : 'Activate User'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
