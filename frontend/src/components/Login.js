// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', password2: '' });
  const { login, register } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(registerData);
    if (result.success) {
      setIsRegistering(false);
      setError('Регистрация успешна! Теперь войдите.');
    } else {
      setError(JSON.stringify(result.error));
    }
  };

  if (isRegistering) {
    return (
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <input placeholder="Имя пользователя" value={registerData.username} onChange={e => setRegisterData({...registerData, username: e.target.value})} required /><br/>
          <input placeholder="Email" type="email" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} required /><br/>
          <input placeholder="Пароль" type="password" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} required /><br/>
          <input placeholder="Подтвердите пароль" type="password" value={registerData.password2} onChange={e => setRegisterData({...registerData, password2: e.target.value})} required /><br/>
          <button type="submit">Зарегистрироваться</button>
          <button type="button" onClick={() => setIsRegistering(false)}>Назад к входу</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required /><br/>
        <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
        <button type="submit">Войти</button>
        <button type="button" onClick={() => setIsRegistering(true)}>Зарегистрироваться</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Login;