// frontend/src/pages/TeamList.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTeams } from '../hooks/useTeamsQuery';
import { useNotification } from '../contexts/NotificationContext';

function TeamList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const { data, isLoading, refetch } = useTeams(currentPage, searchTerm);
  const { addNotification } = useNotification();
  const wsRef = useRef(null);

  const teams = data?.teams || [];
  const totalPages = data?.totalPages || 1;

  // WebSocket для уведомлений о новых командах
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket notifications connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Notification:', data);
      if (data.type === 'new_team') {
        addNotification(`🆕 Новая команда: ${data.team_title}`, 'info');
        // Обновляем список команд
        refetch();
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [addNotification, refetch]);

  if (isLoading) return <div>Загрузка команд...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <h1>🏆 Банк резюме команд разработчиков</h1>

      {user && (
        <Link to="/teams/create">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>
            ➕ Создать команду
          </button>
        </Link>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Поиск по названию..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <h2>Доступные команды:</h2>

      {teams.length === 0 ? (
        <p>Нет опубликованных команд. Создайте первую!</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teams.map(team => (
              <li key={team.id} style={{
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                backdropFilter: 'blur(8px)'
              }}>
                <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: '#ffc107' }}>
                  <strong style={{ fontSize: '18px' }}>{team.title}</strong>
                </Link>

                <div style={{ marginTop: '8px', color: '#ddd' }}>
                  <div>Стек: <span style={{ color: '#ffc107' }}>{team.stack_title || 'не указан'}</span></div>
                  <div>Капитан: <span style={{ color: '#ffc107' }}>{team.captain_name}</span></div>
                  <div>👁️ Просмотров: <span style={{ color: '#ffc107' }}>{team.views}</span></div>
                  <div>📅 Дата: <span style={{ color: '#ffc107' }}>{new Date(team.created_at).toLocaleDateString()}</span></div>
                </div>

                {user && team.captain_name === user.username && (
                  <Link to={`/teams/${team.id}/edit`}>
                    <button style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      ✏️ Редактировать
                    </button>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                ← Назад
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TeamList;