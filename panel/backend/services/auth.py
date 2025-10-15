
"""
Сервис аутентификации.
"""

import secrets


def verify_password(username: str, password: str, app_password: str) -> bool:
    """
    Проверка пароля пользователя.
    
    Args:
        username: Имя пользователя.
        password: Введённый пароль.
        app_password: Правильный пароль из .env.
        
    Returns:
        True, если пароль верный, иначе False.
    """
    # Используем secrets.compare_digest для защиты от timing attacks
    return secrets.compare_digest(password, app_password)


def generate_secret_key(length: int = 32) -> str:
    """
    Генерация секретного ключа.
    
    Args:
        length: Длина ключа в байтах.
        
    Returns:
        Секретный ключ в hex формате.
    """
    return secrets.token_hex(length)
