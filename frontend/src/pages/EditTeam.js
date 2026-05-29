// frontend/src/pages/EditTeam.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [techStacks, setTechStacks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stack: '',
    is_published: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Загружаем список технологий
    axios.get('/api/tech-stacks/')
      .then(response => {
        const stacks = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setTechStacks(stacks);
      })
      .catch(console.error);

    // Загружаем данные команды
    axios.get(`/api/teams/${id}/`)
      .then(response => {
        setFormData({
          title: response.data.title,
          description: response.data.description,
          stack: response.data.stack?.id || '',
          is_published: response.data.is_published
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Команда не найдена');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`/api/teams/${id}/`, formData);
      navigate(`/`);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка сохранения');
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Редактирование команды</h1>

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
            Опубликовано
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={saving} style={{ marginTop: '20px' }}>
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ marginTop: '20px', marginLeft: '10px' }}>
          Отмена
        </button>
      </form>
    </div>
  );
}

export default EditTeam;