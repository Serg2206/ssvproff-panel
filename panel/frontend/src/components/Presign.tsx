
import { useState } from 'react';
import { api } from '../api';

export const Presign = () => {
  const [path, setPath] = useState('');
  const [expiresIn, setExpiresIn] = useState(3600);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!path) {
      setError('Укажите путь к файлу');
      return;
    }

    setLoading(true);
    setError('');
    setUrl('');

    const { data, error: apiError } = await api.generatePresign(path, expiresIn);

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setUrl(data.url);
    }
  };

  const expiresOptions = [
    { value: 3600, label: '1 час' },
    { value: 21600, label: '6 часов' },
    { value: 86400, label: '1 день' },
    { value: 259200, label: '3 дня' },
    { value: 604800, label: '7 дней' },
  ];

  return (
    <div className="component-container">
      <h2 className="component-title">🔗 Presign Links</h2>
      <p>Генерация временных ссылок для доступа к файлам в облаке.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {url && (
        <div className="alert alert-success">
          <strong>Presign URL:</strong>
          <br />
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Путь к файлу в облаке</label>
        <input
          type="text"
          className="form-input"
          placeholder="example/path/file.txt"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Срок действия ссылки</label>
        <select
          className="form-select"
          value={expiresIn}
          onChange={(e) => setExpiresIn(Number(e.target.value))}
        >
          {expiresOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        className="button button-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Генерация...' : '🔗 Сгенерировать ссылку'}
      </button>
    </div>
  );
};
