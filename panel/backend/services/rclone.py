
"""
Сервис для работы с rclone.
"""

import subprocess
from pathlib import Path
from typing import Optional


class RcloneService:
    """Сервис для выполнения команд rclone."""
    
    def __init__(self, remote_name: str, rclone_path: str = "rclone"):
        """
        Инициализация сервиса rclone.
        
        Args:
            remote_name: Имя удалённого хранилища в rclone.
            rclone_path: Путь к rclone бинарному файлу.
        """
        self.remote_name = remote_name
        self.rclone_path = rclone_path
    
    def _run_command(self, args: list) -> str:
        """
        Выполнение команды rclone.
        
        Args:
            args: Аргументы команды.
            
        Returns:
            Вывод команды.
            
        Raises:
            RuntimeError: Если команда завершилась с ошибкой.
        """
        try:
            result = subprocess.run(
                [self.rclone_path] + args,
                capture_output=True,
                text=True,
                check=True,
                timeout=300,  # 5 минут
            )
            return result.stdout
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Ошибка rclone: {e.stderr}")
        except subprocess.TimeoutExpired:
            raise RuntimeError("Команда rclone превысила таймаут")
    
    def generate_presign(self, path: str, expires_in: int = 3600) -> str:
        """
        Генерация presign-ссылки на файл.
        
        Args:
            path: Путь к файлу в облаке.
            expires_in: Время жизни ссылки в секундах.
            
        Returns:
            Presign URL.
        """
        # Команда для генерации presign URL (зависит от типа облака)
        # Для S3: rclone link remote:path
        # Для других: может потребоваться другая команда
        remote_path = f"{self.remote_name}:{path}"
        
        # Заглушка - реальная реализация зависит от типа облака
        return f"https://example.com/presign/{path}?expires={expires_in}"
    
    def restore_file(self, source_path: str, destination_path: str) -> str:
        """
        Восстановление файла из облака на локальный диск.
        
        Args:
            source_path: Путь в облаке (источник).
            destination_path: Путь на локальном диске (назначение).
            
        Returns:
            Вывод команды rclone.
        """
        remote_path = f"{self.remote_name}:{source_path}"
        args = ["copy", remote_path, destination_path, "-P"]
        return self._run_command(args)
    
    def upload_file(self, local_path: str, destination_path: str) -> str:
        """
        Загрузка файла в облако.
        
        Args:
            local_path: Путь к локальному файлу.
            destination_path: Путь в облаке (назначение).
            
        Returns:
            Вывод команды rclone.
        """
        remote_path = f"{self.remote_name}:{destination_path}"
        args = ["copy", local_path, remote_path, "-P"]
        return self._run_command(args)
    
    def list_files(self, path: str = "") -> list:
        """
        Получение списка файлов в облаке.
        
        Args:
            path: Путь в облаке.
            
        Returns:
            Список файлов.
        """
        remote_path = f"{self.remote_name}:{path}"
        args = ["lsf", remote_path]
        output = self._run_command(args)
        return [line.strip() for line in output.splitlines() if line.strip()]
