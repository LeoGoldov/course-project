import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  // Загрузка данных команды
  useEffect(() => {
    axios.get(`/api/teams/${id}/`)
      .then(response => {
        setTeam(response.data);
        setViews(response.data.views);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setLoading(false);
      });
  }, [id]);

  // WebSocket соединение
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/teams/${id}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Увеличиваем просмотры при открытии
      ws.send(JSON.stringify({ type: 'increment_views' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'views_updated') {
        setViews(data.views);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Удалить команду?')) return;
    try {
      await axios.delete(`/api/teams/${id}/`);
      navigate('/');
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!team) return <div>Команда не найдена</div>;

  const isCaptain = user && team.captain_name === user.username;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')}>← Назад</button>

      <h1>{team.title}</h1>

      <p><strong>Стек:</strong> {team.stack_title || 'не указан'}</p>
      <p><strong>Капитан:</strong> {team.captain_name}</p>
      <p>
        <strong>Просмотров:</strong> {views}
        {isConnected && <span style={{ color: 'green', marginLeft: '10px' }}>● Live</span>}
      </p>

      <h3>Описание:</h3>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        {team.description}
      </div>

      {isCaptain && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(`/teams/${id}/edit`)}>✏️ Редактировать</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px', background: 'red', color: 'white' }}>
            🗑️ Удалить
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;