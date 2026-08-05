import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MatrimonialList } from './components/Matrimonial/MatrimonialList';
import { VendorList } from './components/Vendors/VendorList';
import { BookingsList } from './components/Bookings/BookingsList';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { DatabaseInspectorModal } from './components/DatabaseInspector/DatabaseInspectorModal';
import { ChatDrawer } from './components/Communication/ChatDrawer';
import { NotificationsModal } from './components/Communication/NotificationsModal';
import { AuthModal } from './components/Auth/AuthModal';
import { RequestAccessModal } from './components/Auth/RequestAccessModal';

const MainContent = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('matrimonial'); // 'matrimonial' | 'vendors' | 'bookings' | 'admin'
  const [showDbInspector, setShowDbInspector] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRequestAccessModal, setShowRequestAccessModal] = useState(false);

  const handleOpenChatWithUser = (userId) => {
    setChatTargetUser(userId);
    setShowChat(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDatabaseInspector={() => setShowDbInspector(true)}
        onOpenChat={() => setShowChat(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenRequestAccessModal={() => setShowRequestAccessModal(true)}
        unreadNotifsCount={1}
      />

      <main className="app-container" style={{ flex: 1 }}>
        {/* Hero Section on main view */}
        <Hero onOpenDatabaseInspector={() => setShowDbInspector(true)} />

        {/* View Switcher Pages */}
        {activeTab === 'matrimonial' && (
          <MatrimonialList onSelectChatUser={handleOpenChatWithUser} />
        )}

        {activeTab === 'vendors' && (
          <VendorList onSelectChatUser={handleOpenChatWithUser} />
        )}

        {activeTab === 'bookings' && (
          <BookingsList />
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminDashboard onOpenDatabaseInspector={() => setShowDbInspector(true)} />
        )}
      </main>

      {/* Modals & Drawers */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showRequestAccessModal && (
        <RequestAccessModal onClose={() => setShowRequestAccessModal(false)} />
      )}

      {showDbInspector && (
        <DatabaseInspectorModal onClose={() => setShowDbInspector(false)} />
      )}

      {showChat && (
        <ChatDrawer
          onClose={() => {
            setShowChat(false);
            setChatTargetUser(null);
          }}
          targetUserId={chatTargetUser}
        />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.75rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: '3rem',
        background: 'rgba(11, 15, 25, 0.7)'
      }}>
        <div>© 2026 UnityMatrimony & Event Services Platform. Built with React (Vite), Express.js, & MongoDB Core.</div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
