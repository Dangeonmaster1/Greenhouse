// src/pages/Login.jsx

import React from 'react';
import RegisterForm from '../components/RegisterForm'; // или LoginForm
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>🔐 Вход</h2>
      <RegisterForm isLoginMode={true} />
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
}

export default Login;