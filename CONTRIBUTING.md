
# 🤝 Правила контрибуции

Спасибо за интерес к проекту **SSVproff Panel**!

Мы рады любым улучшениям: исправлениям ошибок, новым функциям, улучшению документации.

---

## 📋 Оглавление

- [Как начать](#как-начать)
- [Процесс разработки](#процесс-разработки)
- [Стиль кода](#стиль-кода)
- [Создание Pull Request](#создание-pull-request)
- [Сообщения о проблемах](#сообщения-о-проблемах)
- [Code Review](#code-review)

---

## 🚀 Как начать

### 1. Fork репозитория

Нажмите кнопку **Fork** в правом верхнем углу страницы репозитория.

### 2. Клонируйте свой fork

```bash
git clone https://github.com/ВАШ_USERNAME/ssvproff-panel.git
cd ssvproff-panel
```

### 3. Настройте upstream

```bash
git remote add upstream https://github.com/Serg2206/ssvproff-panel.git
git fetch upstream
```

### 4. Создайте ветку для изменений

```bash
git checkout -b feature/my-awesome-feature
```

Используйте префиксы:
- `feature/` — новые функции
- `fix/` — исправления ошибок
- `docs/` — изменения в документации
- `refactor/` — рефакторинг кода
- `test/` — добавление тестов

---

## 🛠️ Процесс разработки

### Backend (Python)

1. **Создайте виртуальное окружение:**

   ```bash
   cd panel/backend
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate  # Windows
   ```

2. **Установите зависимости:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Создайте `.env` файл:**

   ```bash
   cp .env.example .env
   # Отредактируйте .env
   ```

4. **Запустите сервер:**

   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Проверка кода (перед коммитом):**

   ```bash
   # Форматирование
   black main.py services/*.py
   
   # Линтер
   pylint main.py services/*.py
   
   # Тесты (если есть)
   pytest
   ```

### Frontend (React + TypeScript)

1. **Установите зависимости:**

   ```bash
   cd panel/frontend
   npm install
   ```

2. **Запустите dev-сервер:**

   ```bash
   npm run dev
   ```

   Frontend доступен на `http://localhost:5173`.

3. **Проверка кода (перед коммитом):**

   ```bash
   # Линтер
   npm run lint
   
   # Проверка типов
   npm run typecheck
   
   # Сборка (для проверки)
   npm run build
   ```

---

## 📏 Стиль кода

### Python (Backend)

- **Форматирование:** [Black](https://github.com/psf/black) (строка 88 символов)
- **Линтер:** [Pylint](https://pylint.org/)
- **Импорты:** `isort` (группировка по категориям)
- **Docstrings:** Google Style

**Пример:**

```python
"""
Модуль для работы с rclone.
"""

from pathlib import Path
from typing import Optional

def execute_rclone_command(command: str) -> Optional[str]:
    """
    Выполняет команду rclone.
    
    Args:
        command: Команда rclone для выполнения.
        
    Returns:
        Вывод команды или None при ошибке.
    """
    # Реализация...
```

### TypeScript (Frontend)

- **Форматирование:** Prettier (встроен в Vite)
- **Линтер:** ESLint
- **Стиль:** Functional Components + Hooks
- **Импорты:** Относительные (`./`, `../`)

**Пример:**

```typescript
import React, { useState } from 'react';
import { api } from '../api';

interface PresignProps {
  onSuccess: () => void;
}

export const Presign: React.FC<PresignProps> = ({ onSuccess }) => {
  const [path, setPath] = useState('');
  
  const handleGenerate = async () => {
    // Реализация...
  };
  
  return (
    <div className="presign-component">
      {/* UI */}
    </div>
  );
};
```

### Commit Messages (Conventional Commits)

Используем формат [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` — новая функция
- `fix:` — исправление ошибки
- `docs:` — изменения в документации
- `style:` — форматирование кода (без изменения логики)
- `refactor:` — рефакторинг (без изменения API)
- `test:` — добавление/изменение тестов
- `chore:` — изменения в сборке, CI/CD, зависимостях

**Примеры:**

```
feat(backend): добавлена поддержка S3 presign links

fix(frontend): исправлено отображение ошибок в Upload компоненте

docs(readme): обновлена секция Quick Start

refactor(auth): упрощена логика проверки паролей

chore(deps): обновлены зависимости FastAPI до 0.108.0
```

---

## 🔄 Создание Pull Request

### 1. Синхронизируйтесь с upstream

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Закоммитьте изменения

```bash
git add .
git commit -m "feat(backend): добавлена новая функция X"
```

### 3. Отправьте в свой fork

```bash
git push origin feature/my-awesome-feature
```

### 4. Создайте PR на GitHub

1. Перейдите в свой fork на GitHub
2. Нажмите **"Compare & pull request"**
3. Заполните шаблон PR (см. `.github/pull_request_template.md`)
4. Убедитесь, что:
   - ✅ Все CI checks проходят
   - ✅ Нет конфликтов с `main`
   - ✅ Описание PR полное и понятное

---

## 🐛 Сообщения о проблемах

### Баг-репорт

Используйте шаблон [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md).

**Что включить:**
- Описание проблемы
- Шаги для воспроизведения
- Ожидаемое поведение
- Скриншоты (если применимо)
- Версия Python/Node.js, OS

### Запрос функции

Используйте шаблон [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md).

**Что включить:**
- Описание желаемой функции
- Обоснование (зачем это нужно)
- Примеры использования
- Альтернативы (если рассматривали)

---

## 👀 Code Review

### Что проверяем

- **Функциональность:** Код работает и решает задачу
- **Стиль:** Соответствие стандартам проекта
- **Безопасность:** Нет уязвимостей или утечек данных
- **Производительность:** Код эффективен
- **Тесты:** Есть тесты для новой функциональности
- **Документация:** Обновлена документация (если нужно)

### Как оставлять комментарии

- Будьте конструктивны и уважительны
- Объясняйте *почему*, а не только *что* нужно изменить
- Предлагайте альтернативы
- Отмечайте хорошие решения (не только проблемы!)

**Примеры:**

✅ **Хороший комментарий:**
> Здесь возможна race condition при параллельных запросах. Предлагаю использовать `asyncio.Lock()` для синхронизации.

❌ **Плохой комментарий:**
> Тут баг. Исправь.

---

## 📌 Дополнительные правила

### Что **НЕ** делать

- ❌ Коммитить секреты (пароли, ключи, токены)
- ❌ Коммитить файлы с логами (`*.log`, `*.csv`)
- ❌ Коммитить сборку (`panel/frontend/dist/`)
- ❌ Изменять `.env` файлы (только `.env.example`)
- ❌ Создавать огромные PR (>500 строк) без обсуждения

### Что **МОЖНО** делать

- ✅ Задавать вопросы в Issues
- ✅ Предлагать улучшения в Discussions
- ✅ Исправлять опечатки в документации
- ✅ Добавлять тесты
- ✅ Улучшать существующий код

---

## 🙏 Благодарности

Каждый вклад важен! Спасибо за помощь в развитии проекта.

---

**Если есть вопросы — создайте [Discussion](https://github.com/Serg2206/ssvproff-panel/discussions) или напишите [@Serg2206](https://github.com/Serg2206).**
