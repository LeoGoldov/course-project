// frontend/src/pages/MyTeams.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function MyTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get('/api/teams/my_teams/')
        .then(response => {
          const teamsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setTeams(teamsData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Ошибка:', err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить команду?')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/teams/${id}/`);
      setTeams(teams.filter(team => team.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: '12px',
      color: 'white'
    }}>
      <h2>📋 Мои команды</h2>

      {teams.length === 0 ? (
        <p>У вас пока нет команд. <Link to="/teams/create" style={{ color: '#ffc107' }}>Создать первую команду</Link></p>
      ) : (
        teams.map(team => (
          <div key={team.id} style={{
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>
            <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: '#ffc107' }}>
              <strong style={{ fontSize: '18px' }}>{team.title}</strong>
            </Link>

            <div style={{ marginTop: '8px', color: '#ddd' }}>
              <div>Стек: {team.stack_title || 'не указан'}</div>
              <div>👁️ Просмотров: {team.views}</div>
              <div>📅 Дата: {new Date(team.created_at).toLocaleDateString()}</div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <Link to={`/teams/${team.id}/edit`}>
                <button style={{
                  marginRight: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  ✏️ Редактировать
                </button>
              </Link>
              <button
                onClick={() => handleDelete(team.id)}
                disabled={deleting === team.id}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {deleting === team.id ? 'Удаление...' : '🗑️ Удалить'}
              </button>
            </div>
          </div>
        ))
      )}

      <Link to="/teams/create">
        <button style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ➕ Создать новую команду
        </button>
      </Link>
    </div>
  );
}

export default MyTeams;