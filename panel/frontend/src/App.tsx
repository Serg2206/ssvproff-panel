
import { useState } from 'react';
import { Presign } from './components/Presign';
import { Restore } from './components/Restore';
import { Upload } from './components/Upload';
import { Report } from './components/Report';
import { Flows } from './components/Flows';

type Tab = 'presign' | 'restore' | 'upload' | 'report' | 'flows';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('presign');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 SSVproff Panel</h1>
        <p className="app-subtitle">Панель управления облачным хранилищем</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'presign' ? 'active' : ''}`}
          onClick={() => setActiveTab('presign')}
        >
          🔗 Presign Links
        </button>
        <button
          className={`nav-button ${activeTab === 'restore' ? 'active' : ''}`}
          onClick={() => setActiveTab('restore')}
        >
          📦 Restore
        </button>
        <button
          className={`nav-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          ⬆️ Upload
        </button>
        <button
          className={`nav-button ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          📊 Report
        </button>
        <button
          className={`nav-button ${activeTab === 'flows' ? 'active' : ''}`}
          onClick={() => setActiveTab('flows')}
        >
          🔨 Flows
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'presign' && <Presign />}
        {activeTab === 'restore' && <Restore />}
        {activeTab === 'upload' && <Upload />}
        {activeTab === 'report' && <Report />}
        {activeTab === 'flows' && <Flows />}
      </main>

      <footer className="app-footer">
        <p>SSVproff Panel v0.2.0 | Сделано с ❤️ для безопасной работы с облачными хранилищами</p>
      </footer>
    </div>
  );
}

export default App;
