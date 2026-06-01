#  Банк резюме команд разработчиков

Курсовой проект по ТРПО | Траектория В | СКФУ 2026

## Функционал
- ✅ JWT авторизация
- ✅ CRUD операции с командами
- ✅ Пагинация и поиск
- ✅ Real-time комментарии (WebSocket)
- ✅ Разграничение прав (капитан vs обычный пользователь)

## Технологии
- Django + DRF + Channels
- React + React Router + Axios
- WebSocket

## Запуск
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm start



🔗 API Эндпоинты
Метод	Эндпоинт	Описание
POST	/api/auth/register/	Регистрация
POST	/api/auth/login/	Вход
GET	/api/teams/	Список команд
POST	/api/teams/	Создание команды
GET	/api/teams/{id}/	Детали команды
PATCH	/api/teams/{id}/	Обновление
DELETE	/api/teams/{id}/	Удаление
WS	ws://localhost:8000/ws/teams/{id}/	WebSocket для комментариев
