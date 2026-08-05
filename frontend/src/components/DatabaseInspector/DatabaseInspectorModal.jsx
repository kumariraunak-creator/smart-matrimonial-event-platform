import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Database, Table, Play, Trash2, RefreshCw, FileText, CheckCircle, Search } from 'lucide-react';

export const DatabaseInspectorModal = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [selectedModel, setSelectedModel] = useState('User');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryFilter, setQueryFilter] = useState('{}');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'er' | 'query'

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/db-explorer/collections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCollections(data.collections);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  const fetchRecords = async (modelName) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/db-explorer/records/${modelName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchRecords(selectedModel);
  }, [selectedModel]);

  const handleExecuteQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/db-explorer/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          modelName: selectedModel,
          filter: queryFilter,
          limit: 30
        })
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        alert(data.error || 'Query failed');
      }
    } catch (err) {
      alert('Invalid JSON query format');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm(`Delete document ID ${id}?`)) return;
    try {
      const res = await fetch(`/api/admin/db-explorer/records/${selectedModel}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords(selectedModel);
        fetchCollections();
      }
    } catch (err) {
      console.error('Delete document error:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Modal Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database color="#10b981" size={24} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>MongoDB Live Schema & Query Explorer</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Core Database Component Inspection Console</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setViewMode('table')} className={`btn ${viewMode === 'table' ? 'btn-db' : 'btn-secondary'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <Table size={14} /> Data Grid
            </button>
            <button onClick={() => setViewMode('query')} className={`btn ${viewMode === 'query' ? 'btn-db' : 'btn-secondary'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <Play size={14} /> Query Console
            </button>
            <button onClick={() => setViewMode('er')} className={`btn ${viewMode === 'er' ? 'btn-db' : 'btn-secondary'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <FileText size={14} /> ER Diagram
            </button>
            <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', marginLeft: '0.5rem' }}><X size={20} /></button>
          </div>
        </div>

        {/* Main Console Split Area */}
        <div style={{ display: 'flex', flex: 1, gap: '1rem', overflow: 'hidden' }}>
          {/* Left Sidebar: Collections List */}
          <div style={{ width: '220px', background: '#0f172a', borderRadius: 'var(--radius-md)', padding: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Collections ({collections.length}):
            </div>
            {collections.map((col) => (
              <button
                key={col.modelName}
                onClick={() => setSelectedModel(col.modelName)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  background: selectedModel === col.modelName ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  border: selectedModel === col.modelName ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                  color: selectedModel === col.modelName ? '#10b981' : 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'left'
                }}
              >
                <span>{col.modelName}</span>
                <span className="badge" style={{ background: '#1e293b', fontSize: '0.7rem' }}>{col.documentCount}</span>
              </button>
            ))}
          </div>

          {/* Right Main Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {viewMode === 'er' && (
              <div style={{ background: '#0f172a', borderRadius: 'var(--radius-md)', padding: '1.5rem', flex: 1, border: '1px solid var(--border-color)', overflowY: 'auto', fontSize: '0.85rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#10b981', marginBottom: '1rem' }}>MongoDB Schema Entity-Relationship Map</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                    <strong style={{ color: '#f43f5e' }}>Users Collection (Central Auth & Roles)</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fields: _id, name, email, password, role ('user'|'vendor'|'admin'), status</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                    <strong style={{ color: '#6366f1' }}>Profiles Collection (1:1 with Users)</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fields: _id, user (FK), age, gender, religion, occupation, partnerPreferences, matchCriteria</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                    <strong style={{ color: '#f59e0b' }}>Vendors Collection (1:1 with Users for Vendors)</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fields: _id, user (FK), businessName, category, pricingTier, packages, rating</div>
                  </div>

                  <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                    <strong style={{ color: '#10b981' }}>Bookings Collection (Relates Users & Vendors)</strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Fields: _id, user (FK), vendor (FK), eventDate, totalAmount, status</div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'query' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflow: 'hidden' }}>
                <div style={{ background: '#0f172a', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <label style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
                    MongoDB Query JSON Filter for collection '{selectedModel}':
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={queryFilter}
                      onChange={(e) => setQueryFilter(e.target.value)}
                      placeholder='{"age": {"$gte": 25}}'
                      style={{ fontFamily: 'monospace' }}
                    />
                    <button onClick={handleExecuteQuery} className="btn btn-db">
                      <Play size={16} /> Execute Query
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, background: '#0f172a', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-color)', overflowY: 'auto' }}>
                  <pre style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#10b981' }}>
                    {JSON.stringify(records, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {viewMode === 'table' && (
              <div style={{ flex: 1, background: '#0f172a', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Viewing Collection: <strong style={{ color: '#10b981' }}>{selectedModel}</strong> ({records.length} records loaded)
                  </span>
                  <button onClick={() => fetchRecords(selectedModel)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    <RefreshCw size={12} /> Refresh Data
                  </button>
                </div>

                <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
                  {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading documents...</div>
                  ) : records.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No documents found in collection.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.5rem' }}>Document ID</th>
                          <th style={{ padding: '0.5rem' }}>Fields Preview</th>
                          <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r) => (
                          <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#f43f5e' }}>{r._id}</td>
                            <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)', maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {JSON.stringify(r)}
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <button onClick={() => handleDeleteRecord(r._id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Delete Document">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
