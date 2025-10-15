
import { useState } from 'react';
import { api } from '../api';

export const Restore = () => {
  const [sourcePath, setSourcePath] = useState('');
  const [destinationPath, setDestinationPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRestore = async () => {
    if (!sourcePath || !destinationPath) {
      setError('Заполните оба поля');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { data, error: apiError } = await api.restoreFile(sourcePath, destinationPath);

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setSuccess('Файл успешно восстановлен!');
    }
  };

  return (
    <div className="component-container">
      <h2 className="component-title">📦 Restore</h2>
      <p>Восстановление файлов из облачного хранилища на локальный диск.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label className="form-label">Путь в облаке (источник)</label>
        <input
          type="text"
          className="form-input"
          placeholder="example/path/file.txt"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Путь на локальном диске (назначение)</label>
        <input
          type="text"
          className="form-input"
          placeholder="C:\Users\User\Documents\file.txt"
          value={destinationPath}
          onChange={(e) => setDestinationPath(e.target.value)}
        />
      </div>

      <button
        className="button button-primary"
        onClick={handleRestore}
        disabled={loading}
      >
        {loading ? 'Восстановление...' : '📦 Восстановить файл'}
      </button>
    </div>
  );
};
