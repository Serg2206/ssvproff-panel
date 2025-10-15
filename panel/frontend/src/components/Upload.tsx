
import { useState } from 'react';
import { api } from '../api';

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !destination) {
      setError('Выберите файл и укажите путь назначения');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { data, error: apiError } = await api.uploadFile(file, destination);

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setSuccess('Файл успешно загружен!');
      setFile(null);
    }
  };

  return (
    <div className="component-container">
      <h2 className="component-title">⬆️ Upload</h2>
      <p>Загрузка файлов из локального диска в облако.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label className="form-label">Выберите файл</label>
        <input
          type="file"
          className="form-input"
          onChange={handleFileChange}
        />
        {file && (
          <div className="alert alert-info" style={{ marginTop: '0.5rem' }}>
            Выбран файл: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Путь в облаке (назначение)</label>
        <input
          type="text"
          className="form-input"
          placeholder="example/path/folder/"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <button
        className="button button-primary"
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? 'Загрузка...' : '⬆️ Загрузить файл'}
      </button>
    </div>
  );
};
