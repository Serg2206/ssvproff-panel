
# 🔐 SSVproff Panel

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Serg2206/ssvproff-panel?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Serg2206/ssvproff-panel/ci-backend.yml?branch=main&label=backend&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/Serg2206/ssvproff-panel/ci-frontend.yml?branch=main&label=frontend&style=flat-square)
![GitHub](https://img.shields.io/github/license/Serg2206/ssvproff-panel?style=flat-square)
![CodeQL](https://img.shields.io/github/actions/workflow/status/Serg2206/ssvproff-panel/codeql.yml?branch=main&label=CodeQL&style=flat-square)

**Локальная панель управления для работы с rclone, presign-ссылками, восстановлением файлов и выполнением PowerShell команд.**

---

## 📖 Описание

**SSVproff Panel** — это веб-приложение для локального использования, которое предоставляет удобный интерфейс для:

- 🔗 Генерации presign-ссылок на файлы в облаке
- 📦 Восстановления файлов из облачного хранилища
- ⬆️ Загрузки файлов в облако
- 📊 Просмотра отчётов о выполненных действиях
- 🔨 Выполнения безопасных PowerShell команд из whitelist

**Важно:** Панель работает только на `localhost` и предназначена для личного использования. Не размещайте её в публичном доступе.

---

## 🚀 Быстрый старт

### Требования

- **Python 3.9+**
- **Node.js 18+** и **npm**
- **rclone** (установлен и настроен)
- **PowerShell** (для выполнения команд)

### Установка

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/Serg2206/ssvproff-panel.git
   cd ssvproff-panel
   ```

2. **Настройте Backend:**

   ```bash
   cd panel/backend
   
   # Создайте виртуальное окружение
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # или
   venv\Scripts\activate  # Windows
   
   # Установите зависимости
   pip install -r requirements.txt
   
   # Создайте .env файл на основе .env.example
   cp .env.example .env
   # Отредактируйте .env и установите свои значения
   ```

3. **Настройте Frontend:**

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. **Запустите панель:**

   **Windows:**
   ```powershell
   .\start_panel.ps1
   ```

   **Linux/macOS:**
   ```bash
   cd panel/backend
   source venv/bin/activate
   python main.py
   ```

5. **Откройте в браузере:**

   ```
   http://localhost:8000
   ```

   Введите пароль из `.env` файла (`APP_PASSWORD`).

---

## 🎯 Основные возможности

### 1. Presign Links (Presign-ссылки)

Генерация временных ссылок для доступа к файлам в облаке.

- Указываете путь к файлу в облаке
- Выбираете срок действия ссылки (1 час - 7 дней)
- Получаете готовую ссылку для скачивания

### 2. Restore (Восстановление файлов)

Восстановление файлов из облачного хранилища на локальный диск.

- Указываете путь в облаке (источник)
- Указываете путь на локальном диске (назначение)
- Файлы копируются с помощью rclone

### 3. Upload (Загрузка файлов)

Загрузка файлов из локального диска в облако.

- Выбираете файл через браузер
- Указываете путь в облаке (назначение)
- Файл загружается через rclone

### 4. Report (Отчёты)

Просмотр логов всех действий, выполненных через панель.

- Логи в формате JSON Lines (`.log`) и CSV (`.csv`)
- Отображение времени, пользователя, действия, статуса

### 5. Flows (Выполнение команд)

Выполнение безопасных PowerShell команд из whitelist.

- Только команды из `flows/SSVproff.ps1`
- Отображение вывода команды в реальном времени
- Логирование всех выполненных команд

---

## 🔒 Безопасность

### Основные принципы

- ✅ **Только localhost** — панель работает только на `127.0.0.1`
- ✅ **Аутентификация** — доступ по паролю (`APP_PASSWORD`)
- ✅ **Whitelist команд** — выполняются только команды из `flows/SSVproff.ps1`
- ✅ **Логирование** — все действия записываются в лог
- ✅ **Без публичного доступа** — не используйте панель в интернете

### Файлы с секретами (не коммитьте!)

Убедитесь, что эти файлы **не попадают** в Git:

- `panel/backend/.env` — пароли и секреты
- `panel/backend/ui_actions.log` — логи действий
- `panel/backend/ui_actions.csv` — логи в CSV
- `panel/frontend/dist/` — сборка frontend

Эти файлы уже добавлены в `.gitignore`.

### Рекомендации

1. **Используйте сильные пароли:**
   - `APP_PASSWORD` — минимум 16 символов
   - `APP_SECRET` — генерируйте через `openssl rand -hex 32`

2. **Не публикуйте панель:**
   - Не запускайте на `0.0.0.0` (только `127.0.0.1`)
   - Не открывайте порт 8000 в интернет

3. **Обновляйте зависимости:**
   - Следите за Dependabot alerts
   - Регулярно обновляйте `requirements.txt` и `package.json`

4. **Проверяйте команды:**
   - Добавляйте в `flows/SSVproff.ps1` только проверенные команды
   - Избегайте команд с прямым доступом к системе

---

## 📁 Структура проекта

```
ssvproff-panel/
├── .github/                 # CI/CD и шаблоны
│   ├── workflows/           # GitHub Actions
│   └── ISSUE_TEMPLATE/      # Шаблоны issue
├── panel/
│   ├── backend/             # FastAPI приложение
│   │   ├── main.py          # Точка входа
│   │   ├── requirements.txt # Python зависимости
│   │   ├── .env.example     # Пример конфигурации
│   │   └── services/        # Бизнес-логика
│   └── frontend/            # React приложение
│       ├── src/             # Исходники
│       ├── package.json     # Node зависимости
│       └── vite.config.ts   # Конфигурация Vite
├── flows/
│   └── SSVproff.ps1         # PowerShell команды (whitelist)
├── start_panel.ps1          # Скрипт запуска (Windows)
├── README.md                # Этот файл
├── CONTRIBUTING.md          # Правила контрибуции
├── SECURITY.md              # Политика безопасности
└── LICENSE                  # MIT License
```

---

## 🛠️ Разработка

### Запуск в режиме разработки

**Backend:**
```bash
cd panel/backend
source venv/bin/activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend:**
```bash
cd panel/frontend
npm run dev
```

Frontend будет доступен на `http://localhost:5173` (Vite dev server).

### Проверка кода

**Backend:**
```bash
cd panel/backend
pytest
pylint main.py services/*.py
```

**Frontend:**
```bash
cd panel/frontend
npm run lint
npm run typecheck
```

### Создание PR

1. Создайте ветку: `git checkout -b feature/my-feature`
2. Внесите изменения
3. Закоммитьте: `git commit -m "feat: добавлена новая функция"`
4. Создайте PR через GitHub

Подробнее — см. [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📋 CI/CD

### GitHub Actions Workflows

- **Backend CI** — проверка Python кода, запуск FastAPI
- **Frontend CI** — сборка React, проверка TypeScript
- **CodeQL** — анализ безопасности (еженедельно)
- **Release Drafter** — автосборка changelog

### Dependabot

Автоматические обновления зависимостей (еженедельно):
- Python (pip)
- Node.js (npm)

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT License**.

См. [LICENSE](LICENSE) для деталей.

---

## 📞 Контакты

**Автор:** [@Serg2206](https://github.com/Serg2206)

**Issues:** [GitHub Issues](https://github.com/Serg2206/ssvproff-panel/issues)

**Pull Requests:** [GitHub PRs](https://github.com/Serg2206/ssvproff-panel/pulls)

---

## ⭐ Благодарности

- [FastAPI](https://fastapi.tiangolo.com/) — современный Python веб-фреймворк
- [React](https://react.dev/) — библиотека для построения UI
- [Vite](https://vitejs.dev/) — быстрый сборщик frontend
- [rclone](https://rclone.org/) — Swiss Army Knife для облачных хранилищ

---

**Сделано с ❤️ для безопасной работы с облачными хранилищами**
