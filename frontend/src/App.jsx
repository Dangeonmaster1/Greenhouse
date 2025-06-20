import React from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>🌱 Мониторинг теплиц</h1>

      <section>
        <h2>Вход</h2>
        <LoginForm />
      </section>

      <hr />

      <section>
        <h2>Регистрация</h2>
        <RegisterForm />
      </section>
    </div>
  );
}

export default App;