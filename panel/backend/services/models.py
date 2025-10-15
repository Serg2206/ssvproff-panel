
"""
Модели данных для API.
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class PresignRequest(BaseModel):
    """Запрос на генерацию presign-ссылки."""
    
    path: str = Field(..., description="Путь к файлу в облаке")
    expires_in: int = Field(3600, description="Время жизни ссылки (секунды)", ge=60, le=604800)


class RestoreRequest(BaseModel):
    """Запрос на восстановление файла."""
    
    source_path: str = Field(..., description="Путь в облаке (источник)")
    destination_path: str = Field(..., description="Путь на локальном диске (назначение)")


class UploadRequest(BaseModel):
    """Запрос на загрузку файла."""
    
    destination: str = Field(..., description="Путь в облаке (назначение)")


class FlowRequest(BaseModel):
    """Запрос на выполнение PowerShell команды."""
    
    command: str = Field(..., description="Имя команды из whitelist")


class ActionLog(BaseModel):
    """Запись лога действия."""
    
    timestamp: str = Field(..., description="Время действия (ISO 8601)")
    user: str = Field(..., description="Имя пользователя")
    action: str = Field(..., description="Тип действия")
    details: Dict[str, Any] = Field(..., description="Детали действия")
    success: bool = Field(..., description="Успешность выполнения")
