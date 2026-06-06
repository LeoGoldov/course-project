import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCreateTeam } from '../hooks/useTeamsQuery';
import { useNotification } from '../contexts/NotificationContext';

function CreateTeam() {
  const navigate = useNavigate();
  const [techStacks, setTechStacks] = useState([]);
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stack: '',
    is_published: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
const createTeam = useCreateTeam();

  useEffect(() => {
    // Загружаем список технологий для выбора
    axios.get('/api/tech-stacks/')
      .then(response => {
        const stacks = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setTechStacks(stacks);
      })
      .catch(err => console.error('Ошибка загрузки стеков:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createTeam.mutateAsync(formData);
       addNotification('Успех! Команда успешно создана!', 'success');
      navigate('/');
    } catch (err) {
     addNotification('❌ Ошибка при создании команды', 'error');
      setError(err.response?.data?.message || 'Ошибка создания команды');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Создание новой команды</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Название команды:</label><br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Описание:</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Стек технологий:</label><br />
          <select
            name="stack"
            value={formData.stack}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Выберите стек</option>
            {techStacks.map(stack => (
              <option key={stack.id} value={stack.id}>
                {stack.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
            />
            Опубликовать сразу
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Создание...' : 'Создать команду'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ marginTop: '20px', marginLeft: '10px' }}>
          Отмена
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;