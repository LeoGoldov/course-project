// frontend/src/pages/MyTeams.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyTeams, useDeleteTeam } from '../hooks/useTeamsQuery';
import { useNotification } from '../contexts/NotificationContext';

function MyTeams() {

  const { data: teams, isLoading, refetch } = useMyTeams();
  const deleteTeam = useDeleteTeam();
  const [deletingId, setDeletingId] = useState(null);
  const { addNotification } = useNotification();
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить команду?')) return;
    setDeletingId(id);
    try {
      await deleteTeam.mutateAsync(id);
      addNotification(' Команда удалена', 'info');
      refetch();
    } catch (err) {
      addNotification(' Ошибка при удалении', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h3>📋 Мои команды</h3>

      {!teams || teams.length === 0 ? (
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
              <strong>{team.title}</strong>
            </Link>

            <div style={{ marginTop: '8px', color: '#ddd' }}>
              <div>Статус: {team.is_published ? '✅ Опубликована' : '📥 Снята с публикации'}</div>
              <div>👁️ Просмотров: {team.views}</div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <Link to={`/teams/${team.id}/edit`}>
                <button style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  ✏️ Редактировать
                </button>
              </Link>
              <button
                onClick={() => handleDelete(team.id)}
                disabled={deletingId === team.id}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {deletingId === team.id ? 'Удаление...' : '🗑️ Удалить'}
              </button>
            </div>
          </div>
        ))
      )}

      <Link to="/teams/create">
        <button style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ➕ Создать новую команду
        </button>
      </Link>
    </div>
  );
}

export default MyTeams;