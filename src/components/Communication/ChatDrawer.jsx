import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { X, Send, User, MessageSquare } from 'lucide-react';

export const ChatDrawer = ({ onClose, targetUserId }) => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeContactId, setActiveContactId] = useState(targetUserId || null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
        if (!activeContactId && data.data.length > 0) {
          setActiveContactId(data.data[0].user._id);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const fetchMessages = async (contactId) => {
    if (!contactId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchConversations();
  }, [token]);

  useEffect(() => {
    if (activeContactId) fetchMessages(activeContactId);
  }, [activeContactId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newText || !activeContactId) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeContactId,
          content: newText
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewText('');
        fetchMessages(activeContactId);
        fetchConversations();
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      width: '420px',
      maxWidth: '100vw',
      background: '#1e293b',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-glow)',
      zIndex: 105,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} color="#f43f5e" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Direct Chat & Inquiries</h3>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}><X size={18} /></button>
      </div>

      {/* Conversations List Horizontal Pill Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: '#0f172a' }}>
        {conversations.map((c) => (
          <button
            key={c.user._id}
            onClick={() => setActiveContactId(c.user._id)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: activeContactId === c.user._id ? '#f43f5e' : '#1e293b',
              color: 'white',
              whiteSpace: 'nowrap'
            }}
          >
            {c.user.name}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>Loading chat history...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>No messages yet. Send a message to start conversation!</div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender && m.sender._id.toString() === user?.id?.toString();
            return (
              <div
                key={m._id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: isMe ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : '#0f172a',
                  color: 'white',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <div>{m.content}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.7, textAlign: 'right', marginTop: '0.2rem' }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Send Box */}
      <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', background: '#0f172a' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Type your message..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.85rem' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
