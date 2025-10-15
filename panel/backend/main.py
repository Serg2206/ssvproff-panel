
"""
SSVproff Panel - Backend
FastAPI приложение для управления rclone, presign-ссылками и PowerShell командами.
"""

import os
import json
import csv
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import secrets

from services.rclone import RcloneService
from services.auth import verify_password
from services.models import (
    PresignRequest,
    RestoreRequest,
    UploadRequest,
    FlowRequest,
    ActionLog,
)

# Загрузка переменных окружения
load_dotenv()

# Конфигурация
APP_PASSWORD = os.getenv("APP_PASSWORD", "password")
APP_SECRET = os.getenv("APP_SECRET", secrets.token_hex(32))
RCLONE_REMOTE = os.getenv("RCLONE_REMOTE", "remote")
ALLOWED_FLOWS_DIR = Path(os.getenv("ALLOWED_FLOWS_DIR", "../../flows"))
LOG_FILE = Path("ui_actions.log")
CSV_FILE = Path("ui_actions.csv")

# Инициализация FastAPI
app = FastAPI(
    title="SSVproff Panel API",
    description="API для управления облачным хранилищем через rclone",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Инициализация сервисов
security = HTTPBasic()
rclone = RcloneService(RCLONE_REMOTE)

# Монтирование статических файлов frontend
frontend_dist = Path("../frontend/dist")
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")


# ============================================================================
# Аутентификация
# ============================================================================


def get_current_user(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    """
    Проверка аутентификации пользователя.
    
    Args:
        credentials: Учётные данные пользователя.
        
    Returns:
        Имя пользователя.
        
    Raises:
        HTTPException: Если аутентификация не прошла.
    """
    if not verify_password(credentials.username, credentials.password, APP_PASSWORD):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный пароль",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# ============================================================================
# Логирование действий
# ============================================================================


def log_action(user: str, action: str, details: dict, success: bool) -> None:
    """
    Логирование действия пользователя.
    
    Args:
        user: Имя пользователя.
        action: Тип действия.
        details: Детали действия.
        success: Успешность выполнения.
    """
    log_entry = ActionLog(
        timestamp=datetime.now().isoformat(),
        user=user,
        action=action,
        details=details,
        success=success,
    )
    
    # Запись в JSONL файл
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry.dict(), ensure_ascii=False) + "\n")
    
    # Запись в CSV файл
    csv_exists = CSV_FILE.exists()
    with open(CSV_FILE, "a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["timestamp", "user", "action", "details", "success"],
        )
        if not csv_exists:
            writer.writeheader()
        writer.writerow({
            "timestamp": log_entry.timestamp,
            "user": log_entry.user,
            "action": log_entry.action,
            "details": json.dumps(log_entry.details, ensure_ascii=False),
            "success": log_entry.success,
        })


# ============================================================================
# API Endpoints
# ============================================================================


@app.get("/")
async def root():
    """Главная страница - возврат Frontend."""
    if frontend_dist.exists():
        return FileResponse(str(frontend_dist / "index.html"))
    return {"message": "SSVproff Panel API v0.2.0"}


@app.get("/api/health")
async def health_check():
    """Проверка здоровья API."""
    return {"status": "ok", "version": "0.2.0"}


@app.post("/api/presign")
async def generate_presign(
    request: PresignRequest,
    user: str = Depends(get_current_user),
):
    """
    Генерация presign-ссылки на файл.
    
    Args:
        request: Запрос с путём к файлу и временем жизни.
        user: Имя пользователя (из auth).
        
    Returns:
        Presign URL.
    """
    try:
        presign_url = rclone.generate_presign(request.path, request.expires_in)
        log_action(
            user,
            "presign",
            {"path": request.path, "expires_in": request.expires_in},
            True,
        )
        return {"url": presign_url, "expires_in": request.expires_in}
    except Exception as e:
        log_action(
            user,
            "presign",
            {"path": request.path, "error": str(e)},
            False,
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/restore")
async def restore_file(
    request: RestoreRequest,
    user: str = Depends(get_current_user),
):
    """
    Восстановление файла из облака на локальный диск.
    
    Args:
        request: Запрос с путями источника и назначения.
        user: Имя пользователя (из auth).
        
    Returns:
        Статус операции.
    """
    try:
        result = rclone.restore_file(request.source_path, request.destination_path)
        log_action(
            user,
            "restore",
            {"source": request.source_path, "destination": request.destination_path},
            True,
        )
        return {"status": "success", "output": result}
    except Exception as e:
        log_action(
            user,
            "restore",
            {"source": request.source_path, "error": str(e)},
            False,
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    destination: str = "",
    user: str = Depends(get_current_user),
):
    """
    Загрузка файла в облако.
    
    Args:
        file: Загружаемый файл.
        destination: Путь в облаке (назначение).
        user: Имя пользователя (из auth).
        
    Returns:
        Статус операции.
    """
    try:
        # Сохранение временного файла
        temp_path = Path(f"/tmp/{file.filename}")
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        # Загрузка в облако
        result = rclone.upload_file(str(temp_path), destination)
        
        # Удаление временного файла
        temp_path.unlink()
        
        log_action(
            user,
            "upload",
            {"filename": file.filename, "destination": destination},
            True,
        )
        return {"status": "success", "output": result}
    except Exception as e:
        log_action(
            user,
            "upload",
            {"filename": file.filename, "error": str(e)},
            False,
        )
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/report")
async def get_report(user: str = Depends(get_current_user)):
    """
    Получение отчёта о действиях.
    
    Args:
        user: Имя пользователя (из auth).
        
    Returns:
        Список действий из лога.
    """
    try:
        if not LOG_FILE.exists():
            return {"logs": []}
        
        logs = []
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                logs.append(json.loads(line.strip()))
        
        return {"logs": logs[-100:]}  # Последние 100 записей
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/flows")
async def execute_flow(
    request: FlowRequest,
    user: str = Depends(get_current_user),
):
    """
    Выполнение PowerShell команды из whitelist.
    
    Args:
        request: Запрос с именем команды.
        user: Имя пользователя (из auth).
        
    Returns:
        Вывод команды.
    """
    try:
        # Чтение whitelist команд
        flow_file = ALLOWED_FLOWS_DIR / "SSVproff.ps1"
        if not flow_file.exists():
            raise HTTPException(status_code=404, detail="Файл команд не найден")
        
        # Простая проверка наличия команды в файле
        with open(flow_file, "r", encoding="utf-8") as f:
            content = f.read()
            if request.command not in content:
                raise HTTPException(
                    status_code=403,
                    detail="Команда не найдена в whitelist",
                )
        
        # Выполнение команды (заглушка - реальное выполнение требует subprocess)
        result = f"Выполнение команды: {request.command}"
        
        log_action(
            user,
            "flow",
            {"command": request.command},
            True,
        )
        return {"status": "success", "output": result}
    except HTTPException:
        raise
    except Exception as e:
        log_action(
            user,
            "flow",
            {"command": request.command, "error": str(e)},
            False,
        )
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Запуск приложения
# ============================================================================


if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Запуск SSVproff Panel...")
    print(f"📍 URL: http://127.0.0.1:8000")
    print(f"📖 Документация API: http://127.0.0.1:8000/docs")
    print(f"🔒 Используйте пароль из .env файла для доступа")
    
    uvicorn.run(
        app,
        host="127.0.0.1",  # Только localhost!
        port=8000,
        log_level="info",
    )
