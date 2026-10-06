# Практическая работа №3 — Bootstrap 5 + JavaScript

## Требования
- Любой современный браузер
- Локальный HTTP-сервер (fetch не работает по file://)

## Запуск
```bash
python -m http.server 8000
# затем открыть http://localhost:8000
```

## Структура
- `index.html` — разметка, подключение Bootstrap 5 (CDN, bundle)
- `js/app.js` — загрузка JSON, рендер, валидация, 3 обработчика
- `css/custom.css` — собственные стили
- `data/dashboard.json` — метрики и строки таблицы
- `data/notifications.json` — тексты уведомлений
- `assets/` — svg-изображения

## Bootstrap-компоненты
Navbar (collapse), Grid (container/row/col), Cards, Table (responsive),
Modal, Accordion, Toast.

## Что делает Bootstrap JS
Управляет показом и скрытием компонентов через data-атрибуты и API:
`bootstrap.Modal`, `bootstrap.Toast`, `bootstrap.Collapse`.

## Что делает app.js
1. `fetch()` двух JSON-файлов из `data/`.
2. `renderCards()` и `renderActions()` — преобразование данных в DOM.
3. Три собственных обработчика:
   - `input` — живая валидация полей;
   - `submit` — проверка формы, `savedCount++`, toast;
   - `keydown` (Ctrl+T) — переключение фона.
4. Программный вызов `bootstrap.Toast.getOrCreateInstance(...)`.
5. Программное закрытие modal через `bootstrap.Modal.getOrCreateInstance(...)`.

## Сценарий проверки
1. 375px — navbar сворачивается, таблица без прокрутки страницы.
2. 1440px — 4 карточки в ряд.
3. Открыть «Добавить запись», отправить пустую форму → ошибки, toast
   «Проверьте обязательные поля».
4. Заполнить корректно → toast со счётчиком, modal закрывается.
5. Console — без ошибок.
