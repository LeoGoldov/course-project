#  Банк резюме команд разработчиков

Курсовой проект по дисциплине «Технология разработки программного обеспечения»  
**Траектория В** (React SPA + WebSocket + JWT)

##  Описание проекта

Веб-приложение для поиска и публикации команд разработчиков.

### Функционал
- Регистрация и авторизация (JWT)
- Создание, просмотр, редактирование, удаление команд
- Просмотр списка команд с пагинацией
- Real-time обновление просмотров через WebSocket
- Разграничение прав (только капитан редактирует команду)

##  Технологический стек

| Компонент | Технологии |
| Backend | Django 5, Django REST Framework, JWT, Channels |
| Frontend | React 18, React Router, Axios, WebSocket |
| База данных | SQLite3 |

##  Запуск проекта

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
### Frontend
cd frontend
npm install
npm start