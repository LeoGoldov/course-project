// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
      const response = await axios.put('/api/auth/profile/', formData);
      setMessage('Профиль успешно обновлён!');
      // обновляем данные пользователя
      window.location.reload();
    } catch (err) {
      setMessage('Ошибка при обновлении');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: '12px',
      color: 'white'
    }}>
      <h2>👤 Личный кабинет</h2>
      <p><strong>Имя пользователя:</strong> {user.username}</p>

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

      <hr style={{ margin: '20px 0', borderColor: 'rgba(255,255,255,0.2)' }} />

      <h3>📊 Мои команды</h3>
      <p style={{ color: '#aaa' }}>Здесь будут ваши команды (скоро)</p>
    </div>
  );
}

export default Profile;