// frontend/src/pages/TeamDetail.js
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
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

  // Загрузка комментариев
  useEffect(() => {
    axios.get(`/api/comments/?team=${id}`)
      .then(response => {
        const commentsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setComments(commentsData);
      })
      .catch(err => console.error('Ошибка загрузки комментариев:', err));
  }, [id]);

  // WebSocket соединение
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/teams/${id}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'increment_views' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'views_updated') {
        setViews(data.views);
      } else if (data.type === 'new_comment') {
        // Оптимистичное обновление: добавляем комментарий сразу
        setComments(prev => [...prev, data.comment]);
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

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    // Оптимистичное обновление: добавляем временный комментарий
    const tempComment = {
      id: Date.now(),
      text: newComment,
      author_name: user.username,
      created_at: 'Отправка...'
    };
    setComments(prev => [...prev, tempComment]);

    // Отправляем через WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'new_comment',
        text: newComment,
        user_id: user.id
      }));
    } else {
      // Fallback: через REST API
      axios.post('/api/comments/', {
        team: parseInt(id),
        text: newComment
      }).then(response => {
        setComments(prev => [...prev.filter(c => c.id !== tempComment.id), response.data]);
      }).catch(err => {
        console.error('Ошибка:', err);
        setComments(prev => prev.filter(c => c.id !== tempComment.id));
      });
    }

    setNewComment('');
  };

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')}>← Назад</button>

      <h1>{team.title}</h1>

      <p><strong>Стек:</strong> {team.stack_title || 'не указан'}</p>
      <p><strong>Капитан:</strong> {team.captain_name}</p>
      <p>
        <strong>👁️ Просмотров:</strong> {views}
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

      {/* Комментарии */}
      <div style={{ marginTop: '30px' }}>
        <h3>💬 Комментарии ({comments.length})</h3>

        <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          {comments.length === 0 ? (
            <p>Нет комментариев. Будьте первым!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{
                borderBottom: '1px solid #eee',
                padding: '10px 0'
              }}>
                <strong>{comment.author_name}</strong>
                <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>
                  {comment.created_at}
                </span>
                <p style={{ margin: '5px 0 0 0' }}>{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Форма добавления комментария */}
        {user ? (
          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button type="submit" disabled={!newComment.trim()}>
              Отправить
            </button>
          </form>
        ) : (
          <p style={{ color: '#888' }}>Войдите, чтобы оставить комментарий</p>
        )}
      </div>
    </div>
  );
}

export default TeamDetail;