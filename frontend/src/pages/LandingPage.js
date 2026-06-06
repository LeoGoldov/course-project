// frontend/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const { isAuthenticated } = useAuth();

  // Если уже авторизован, показываем кнопку перехода на главную
  if (isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}> Resume-Web</h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px' }}>
          Вы уже авторизованы! Добро пожаловать обратно.
        </p>
        <Link to="/teams">
          <button style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            Перейти к командам →
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '56px', marginBottom: '20px' }}> Resume-Web</h1>
      <p style={{ fontSize: '22px', marginBottom: '16px', maxWidth: '600px' }}>
        Банк резюме IT-команд
      </p>
      <p style={{ fontSize: '16px', marginBottom: '40px', maxWidth: '500px', opacity: 0.9 }}>
        Платформа, где команды разработчиков публикуют свои профили,
        а работодатели находят готовые IT-команды под свои проекты.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/teams">
          <button style={{
            padding: '14px 32px',
            fontSize: '16px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: 'bold'
          }}>
            🔍 Смотреть команды
          </button>
        </Link>
        <Link to="/login">
          <button style={{
            padding: '14px 32px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontWeight: 'bold'
          }}>
             Войти / Регистрация
          </button>
        </Link>
      </div>

      <div style={{
        marginTop: '60px',
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '800px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
          <h3 style={{ marginBottom: '8px' }}>Для команд</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Публикуйте свой профиль, находите заказчиков</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
          <h3 style={{ marginBottom: '8px' }}>Для работодателей</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Ищите готовые команды под свои проекты</p>
        </div>
        <div style={{ textAlign: 'center', maxWidth: '200px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
          <h3 style={{ marginBottom: '8px' }}>Real-time общение</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Комментарии обновляются мгновенно</p>
        </div>
      </div>
      <footer style={{
        marginTop: '60px',
        fontSize: '12px',
        opacity: 0.7
      }}>
        © 2026 Resume-Web. Курсовой проект по ТРПО. СКФУ
      </footer>
    </div>
  );
}

export default LandingPage;