// src/App.jsx
import { useState } from 'react';
import './App.css';
import WrestlerTable from './components/WrestlerTable';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [showLogos, setShowLogos] = useState(false); // optional toggle for template logos

  return (
    <>
      {/* Optional Vite/React logos at the top */}
      {showLogos && (
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      )}

      <header>
        <h1>Wrestler Tracker</h1>
      </header>

      <main>
        <WrestlerTable />
      </main>
    </>
  );
}

export default App;
