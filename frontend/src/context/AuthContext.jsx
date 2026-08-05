import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Fetch current user details whenever token changes
  const fetchMe = async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setProfile(null);
      setVendor(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setProfile(data.profile);
        setVendor(data.vendor);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching user session:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe(token);
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const switchDemoPersona = async (role) => {
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setProfile(null);
    setVendor(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      vendor,
      token,
      loading,
      login,
      register,
      switchDemoPersona,
      logout,
      refreshMe: () => fetchMe(token)
    }}>
      {children}
    </AuthContext.Provider>
  );
};
