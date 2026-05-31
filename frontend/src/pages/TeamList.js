// frontend/src/pages/TeamList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const url = searchTerm
      ? `/api/teams/?page=${currentPage}&search=${searchTerm}`
      : `/api/teams/?page=${currentPage}`;

    axios.get(url)
      .then(response => {
        const data = response.data;
        setTeams(Array.isArray(data) ? data : (data.results || []));
        setTotalPages(Math.ceil((data.count || 0) / 10));
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  }, [currentPage, searchTerm]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка команд...</div>;

  return (
    <div style={{ padding: '20px' }}>
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

      {/* Поиск */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Поиск по названию или описанию..."
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
            borderRadius: '4px',
            fontSize: '16px'
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
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    <strong style={{ fontSize: '18px' }}>{team.title}</strong>
                  </Link>

                  {user && team.captain_name === user.username && (
                    <Link to={`/teams/${team.id}/edit`}>
                      <button style={{
                        padding: '5px 10px',
                        backgroundColor: '#ffc107',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        ✏️ Редактировать
                      </button>
                    </Link>
                  )}
                </div>

                <div style={{ marginTop: '8px', color: '#666' }}>
                  <div>Стек: <strong>{team.stack_title || 'не указан'}</strong></div>
                  <div>Капитан: <strong>{team.captain_name}</strong></div>
                  <div>👁️ Просмотров: {team.views}</div>
                  <div>📅 Дата: {new Date(team.created_at).toLocaleDateString()}</div>
                </div>
                <hr style={{ marginTop: '10px', border: 'none', borderTop: '1px solid #eee' }} />
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '30px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Назад
              </button>

              <span style={{ fontSize: '16px' }}>
                Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === totalPages ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
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