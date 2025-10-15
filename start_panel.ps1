
# ==============================================================================
# SSVproff Panel - Скрипт запуска (Windows)
# ==============================================================================
# Этот скрипт автоматизирует запуск SSVproff Panel на Windows.
# ==============================================================================

# Переход в директорию скрипта
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "     SSVproff Panel - Запуск" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# ==============================================================================
# 1. Проверка Python
# ==============================================================================
Write-Host "[1/5] Проверка Python..." -ForegroundColor Yellow

$PythonVersion = $null
try {
    $PythonVersion = python --version 2>&1
    Write-Host "  ✓ Python найден: $PythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python не найден!" -ForegroundColor Red
    Write-Host "  Установите Python 3.9+ с https://www.python.org/downloads/" -ForegroundColor Red
    pause
    exit 1
}

# ==============================================================================
# 2. Проверка Node.js
# ==============================================================================
Write-Host "[2/5] Проверка Node.js..." -ForegroundColor Yellow

$NodeVersion = $null
try {
    $NodeVersion = node --version 2>&1
    Write-Host "  ✓ Node.js найден: $NodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js не найден!" -ForegroundColor Red
    Write-Host "  Установите Node.js 18+ с https://nodejs.org/" -ForegroundColor Red
    pause
    exit 1
}

# ==============================================================================
# 3. Настройка Backend
# ==============================================================================
Write-Host "[3/5] Настройка Backend..." -ForegroundColor Yellow

Set-Location "panel\backend"

# Проверка .env файла
if (-not (Test-Path ".env")) {
    Write-Host "  ⚠️  Файл .env не найден!" -ForegroundColor Yellow
    Write-Host "  Создайте .env на основе .env.example" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Инструкции:" -ForegroundColor Cyan
    Write-Host "    1. Скопируйте .env.example в .env" -ForegroundColor White
    Write-Host "    2. Сгенерируйте пароль: openssl rand -base64 24" -ForegroundColor White
    Write-Host "    3. Сгенерируйте секрет: openssl rand -hex 32" -ForegroundColor White
    Write-Host "    4. Укажите имя rclone remote" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "  ✓ Файл .env найден" -ForegroundColor Green

# Проверка виртуального окружения
if (-not (Test-Path "venv")) {
    Write-Host "  Создание виртуального окружения..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "  ✓ Виртуальное окружение создано" -ForegroundColor Green
}

# Активация виртуального окружения
Write-Host "  Активация виртуального окружения..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Установка зависимостей
Write-Host "  Установка Python зависимостей..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet
Write-Host "  ✓ Зависимости установлены" -ForegroundColor Green

Set-Location "..\..\"

# ==============================================================================
# 4. Настройка Frontend
# ==============================================================================
Write-Host "[4/5] Настройка Frontend..." -ForegroundColor Yellow

Set-Location "panel\frontend"

# Установка зависимостей
if (-not (Test-Path "node_modules")) {
    Write-Host "  Установка Node зависимостей..." -ForegroundColor Yellow
    npm install
    Write-Host "  ✓ Зависимости установлены" -ForegroundColor Green
} else {
    Write-Host "  ✓ Зависимости уже установлены" -ForegroundColor Green
}

# Сборка Frontend
Write-Host "  Сборка Frontend..." -ForegroundColor Yellow
npm run build
Write-Host "  ✓ Frontend собран" -ForegroundColor Green

Set-Location "..\..\"

# ==============================================================================
# 5. Запуск панели
# ==============================================================================
Write-Host "[5/5] Запуск панели..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  ✓ SSVproff Panel запускается..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📍 URL: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  📖 API Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  🔒 Введите пароль из .env файла для доступа" -ForegroundColor White
Write-Host ""
Write-Host "  Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

Set-Location "panel\backend"
& ".\venv\Scripts\Activate.ps1"
python main.py
