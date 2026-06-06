// frontend/src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {notifications.map(notif => (
        <div key={notif.id} style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: notif.type === 'success' ? '#28a745' : notif.type === 'error' ? '#dc3545' : '#17a2b8',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: notif.id !== notifications[0]?.id ? '10px' : 0,
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {notif.message}
          <button onClick={() => removeNotification(notif.id)} style={{
            marginLeft: '10px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}>×</button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};