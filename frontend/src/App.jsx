// frontend/src/App.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import './App.css';

// Страницы
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>🌱 Мониторинг теплиц</h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer>
          <nav>
            <ul>
              <li><a href="/login">Вход</a></li>
              <li><a href="/register">Регистрация</a></li>
              <li><a href="/dashboard">Мои теплицы</a></li>
            </ul>
          </nav>
          <p>© 2025 Greenhouse Monitor</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;