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
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        paddingBottom: '10px',
      }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '28px', color: 'white',  paddingLeft: '20px',  fontFamily: "'Old Standard TT', serif"}}>
          Resume-Web
        </Link>
        {isAuthenticated ? (
          <div>
            <Link to="/profile" style={{ color: 'white', marginRight: '15px' }}>Личный кабинет</Link>
            <span style={{ color: 'white', marginRight: '15px' }}>Привет, {user?.username}!</span>
            <button onClick={logout} style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Выйти</button>
          </div>
        ) : (
          <Link to="/login">
            <button style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Войти</button>
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
        isAuthenticated ? <Navigate to="/" /> : <Login onSuccess={() => window.location.href = '/'} />
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