// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import TeamList from './pages/TeamList';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';

function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px'
      }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', color: '#333' }}>
          🏆 Банк резюме команд разработчиков
        </Link>
        {isAuthenticated ? (
          <div>
            <span style={{ marginRight: '15px' }}>Привет, {user?.username}!</span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Выйти
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Войти
            </button>
          </Link>
        )}
      </div>
      {children}
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
      <Route path="/" element={
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
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;