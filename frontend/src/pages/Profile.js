// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MyTeams from './MyTeams';

function Profile() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('teams');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Загрузка избранного
  useEffect(() => {
    if (user) {
      axios.get('/api/favorites/')
        .then(response => {
          const favs = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setFavorites(favs);
        })
        .catch(err => console.error('Ошибка загрузки избранного:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone
      };

      await axios.patch('/api/auth/profile/', dataToSend);
      setMessage('Профиль успешно обновлён!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Ошибка:', err.response?.data);
      setMessage('Ошибка при обновлении');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: '12px',
      color: 'white'
    }}>
      <h2>👤 Личный кабинет</h2>
      <p><strong>Имя пользователя:</strong> {user.username}</p>

      {/* Кнопки переключения вкладок */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'teams' ? '#007bff' : 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📋 Мои команды
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'favorites' ? '#007bff' : 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ❤️ Избранное ({favorites.length})
        </button>
      </div>

      {/* Вкладка "Мои команды" */}
      {activeTab === 'teams' && (
        <div style={{ marginBottom: '30px' }}>
          <MyTeams />
        </div>
      )}

      {/* Вкладка "Избранное" */}
      {activeTab === 'favorites' && (
        <div style={{ marginBottom: '30px' }}>
          <h3>❤️ Избранные команды</h3>
          {favorites.length === 0 ? (
            <p>У вас пока нет избранных команд. Добавьте их на главной странице.</p>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} style={{
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}>
                <Link to={`/teams/${fav.team}`} style={{ color: '#ffc107', textDecoration: 'none' }}>
                  <strong>{fav.team_title}</strong>
                </Link>
                <div style={{ marginTop: '8px', color: '#ddd' }}>
                  <div>Стек: {fav.team_stack || 'не указан'}</div>
                  <div>Капитан: {fav.team_captain}</div>
                  <div>👁️ Просмотров: {fav.team_views}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <hr style={{ margin: '20px 0', borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Редактирование профиля */}
      <h3>✏️ Редактирование профиля</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Имя:</label><br />
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Фамилия:</label><br />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Телефон:</label><br />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>О себе:</label><br />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none' }}
          />
        </div>

        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: message.includes('успешно') ? '#28a745' : '#dc3545',
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>

        <button type="button" onClick={logout} style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Выйти из аккаунта
        </button>
      </form>
    </div>
  );
}

export default Profile;