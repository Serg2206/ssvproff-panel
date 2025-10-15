
/**
 * API клиент для SSVproff Panel Backend.
 */

const API_BASE = '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

/**
 * Базовый метод для выполнения API запросов.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.detail || 'Ошибка сервера' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Неизвестная ошибка' };
  }
}

/**
 * API методы.
 */
export const api = {
  /**
   * Генерация presign-ссылки.
   */
  generatePresign: async (path: string, expiresIn: number) => {
    return request<{ url: string; expires_in: number }>('/presign', {
      method: 'POST',
      body: JSON.stringify({ path, expires_in: expiresIn }),
    });
  },

  /**
   * Восстановление файла.
   */
  restoreFile: async (sourcePath: string, destinationPath: string) => {
    return request<{ status: string; output: string }>('/restore', {
      method: 'POST',
      body: JSON.stringify({
        source_path: sourcePath,
        destination_path: destinationPath,
      }),
    });
  },

  /**
   * Загрузка файла.
   */
  uploadFile: async (file: File, destination: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', destination);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.detail || 'Ошибка загрузки' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Ошибка загрузки' };
    }
  },

  /**
   * Получение отчёта.
   */
  getReport: async () => {
    return request<{ logs: any[] }>('/report');
  },

  /**
   * Выполнение PowerShell команды.
   */
  executeFlow: async (command: string) => {
    return request<{ status: string; output: string }>('/flows', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },
};
