// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import TeamList from './pages/TeamList';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';
import TeamDetail from './pages/TeamDetail';
import Profile from './pages/Profile';
import { NotificationProvider } from './contexts/NotificationContext';
import LandingPage from './pages/LandingPage';

function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="content-wrapper">
      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  padding: '15px 30px',
  background: 'linear-gradient(135deg, rgba(25, 25, 35, 0.95) 0%, rgba(45, 45, 65, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
}}>
  <Link to="/teams" style={{
    textDecoration: 'none',
    fontSize: '26px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '1px'
  }}>
     Resume-Web
  </Link>

  {isAuthenticated ? (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/profile" style={{
        color: '#fff',
        textDecoration: 'none',
        padding: '8px 20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '30px',
        transition: 'all 0.3s ease',
        fontSize: '15px',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}>
         Личный кабинет
      </Link>
      <button onClick={logout} style={{
        background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.8), rgba(200, 35, 51, 0.9))',
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
         Выйти
      </button>
    </div>
  ) : (
    <Link to="/login">
      <button style={{
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        color: 'white',
        border: 'none',
        padding: '8px 25px',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
         Войти
      </button>
    </Link>
  )}
</div>

      {/* КОНТЕНТ С ОТСТУПАМИ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>;

  return (
    <Routes>
      <Route path="/login" element={
  isAuthenticated ? <Navigate to="/teams" /> : <Login onSuccess={() => window.location.href = '/teams'} />
} />
      <Route path="/" element={<LandingPage />} />

      <Route path="/teams" element={
  <Layout>
    <TeamList />
  </Layout>
} />
      <Route path="/teams/create" element={
        isAuthenticated ? (
          <Layout>
            <CreateTeam />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/teams/:id/edit" element={
        isAuthenticated ? (
          <Layout>
            <EditTeam />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/teams/:id" element={
        <Layout>
          <TeamDetail />
        </Layout>
      } />
      <Route path="/profile" element={
        isAuthenticated ? (
          <Layout>
            <Profile />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;