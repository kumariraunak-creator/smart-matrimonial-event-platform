import React from 'react';
import { Heart, Shield, Sparkles, Database } from 'lucide-react';

export const Hero = ({ onOpenDatabaseInspector }) => {
  return (
    <div className="glass-panel" style={{
      padding: '2.5rem 2rem',
      marginBottom: '2.5rem',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(244, 63, 94, 0.2)',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
    }}>
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '9999px', color: '#f43f5e', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sparkles size={14} /> AI-Powered Matchmaking & Full Event Service Ecosystem
        </div>

        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
          Find Your Perfect Match & Book Verified Event Experts
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem', maxWidth: '650px' }}>
          Powered by a relational MongoDB core database architecture. Connect with verified matrimonial profiles, calculate compatibility, and hire top-rated Decorators, Caterers, Photographers, Lawyers, and Venues all in one seamless platform.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <Shield size={16} color="#10b981" /> 100% Verified Profiles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <Heart size={16} color="#f43f5e" /> Dynamic Compatibility Algorithm
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
            <Database size={16} color="#06b6d4" /> Live MongoDB Query Engine
          </div>
        </div>
      </div>
    </div>
  );
};
