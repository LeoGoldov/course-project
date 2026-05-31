// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import TeamList from './pages/TeamList';
import CreateTeam from './pages/CreateTeam';
import EditTeam from './pages/EditTeam';
import TeamDetail from './pages/TeamDetail';

// frontend/src/App.js (добавить обёртку с классом)
function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="content-wrapper">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',

      }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', color: 'white',  marginLeft: '40%' }}>
          Resume-Web
        </Link>
        {isAuthenticated ? (
          <div>
            <span style={{ marginRight: '15px' }}>Привет, {user?.username}!</span>
            <button onClick={logout}>Выйти</button>
          </div>
        ) : (
          <Link to="/login">
            <button>Войти</button>
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
      <Route path="/teams/:id" element={
  <Layout>
    <TeamDetail />
  </Layout>
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