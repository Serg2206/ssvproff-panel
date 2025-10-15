
import { useState } from 'react';
import { api } from '../api';

export const Flows = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!command) {
      setError('Введите команду');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    const { data, error: apiError } = await api.executeFlow(command);

    setLoading(false);

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setOutput(data.output);
    }
  };

  return (
    <div className="component-container">
      <h2 className="component-title">🔨 Flows</h2>
      <p>Выполнение безопасных PowerShell команд из whitelist.</p>

      <div className="alert alert-info">
        <strong>⚠️ Важно:</strong> Выполняются только команды из файла{' '}
        <code>flows/SSVproff.ps1</code>. Произвольный код не выполняется.
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Команда PowerShell</label>
        <input
          type="text"
          className="form-input"
          placeholder="Get-Date"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
      </div>

      <button
        className="button button-primary"
        onClick={handleExecute}
        disabled={loading}
      >
        {loading ? 'Выполнение...' : '🔨 Выполнить команду'}
      </button>

      {output && (
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Вывод команды</label>
          <textarea
            className="form-textarea"
            value={output}
            readOnly
            style={{ minHeight: '200px', fontFamily: 'monospace' }}
          />
        </div>
      )}
    </div>
  );
};
