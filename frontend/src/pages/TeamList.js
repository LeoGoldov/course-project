import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`/api/teams/?page=${currentPage}`)
      .then(response => {
        // Данные с пагинацией
        const data = response.data;
        setTeams(Array.isArray(data) ? data : (data.results || []));
        setTotalPages(Math.ceil((data.count || 0) / 10));
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  }, [currentPage]);

  if (loading) return <div>Загрузка команд...</div>;

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
                marginBottom: '15px'
              }}>
                <div>
                  <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                    <strong style={{ fontSize: '18px' }}>{team.title}</strong>
                  </Link>

                  {user && team.captain_name === user.username && (
                    <Link to={`/teams/${team.id}/edit`}>
                      <button style={{
                        marginLeft: '10px',
                        padding: '5px 10px',
                        backgroundColor: '#ffc107',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        ✏️ Редактировать
                      </button>
                    </Link>
                  )}
                </div>
                <div>Стек: {team.stack_title || 'не указан'}</div>
                <div>Капитан: {team.captain_name}</div>
                <div>Просмотров: {team.views}</div>
                <div>Дата: {new Date(team.created_at).toLocaleDateString()}</div>
                <hr />
              </li>
            ))}
          </ul>

          {/* Пагинация */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Назад
            </button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Вперёд →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TeamList;