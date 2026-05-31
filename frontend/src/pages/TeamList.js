// frontend/src/pages/TeamList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';





function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ОТЛАДКА - добавить эти две строки
  console.log('=== ОТЛАДКА TeamList ===');
  console.log('user:', user);
  console.log('user?.username:', user?.username);
  // конец отладки

  useEffect(() => {
    axios.get('/api/teams/')
      .then(response => {
        const teamsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка команд...</div>;

  return (
    <div>
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

                {/* Кнопка редактирования — только для капитана */}
                // Временно — показываем кнопку ВСЕМ авторизованным пользователям
// Правильное условие — кнопка только для капитана
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
      )}
    </div>
  );
}

export default TeamList;