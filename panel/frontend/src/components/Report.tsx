
import { useState, useEffect } from 'react';
import { api } from '../api';

interface Log {
  timestamp: string;
  user: string;
  action: string;
  details: any;
  success: boolean;
}

export const Report = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError('');

    const { data, error: apiError } = await api.getReport();

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setLogs(data.logs.reverse()); // Новые сверху
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU');
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="component-container">
      <h2 className="component-title">📊 Report</h2>
      <p>Просмотр логов всех действий, выполненных через панель.</p>

      <button className="button button-primary" onClick={loadLogs} style={{ marginBottom: '1rem' }}>
        🔄 Обновить
      </button>

      {loading && <div className="loading">Загрузка логов...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && logs.length === 0 && (
        <div className="alert alert-info">Логи пока отсутствуют</div>
      )}

      {!loading && logs.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Статус</th>
                <th>Время</th>
                <th>Пользователь</th>
                <th>Действие</th>
                <th>Детали</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{getStatusIcon(log.success)}</td>
                  <td>{formatTimestamp(log.timestamp)}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>
                    <pre style={{ fontSize: '0.85rem', margin: 0 }}>
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
