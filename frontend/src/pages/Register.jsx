// src/pages/Register.jsx

import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>📝 Регистрация</h2>
      <RegisterForm isLoginMode={false} />
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
}

export default Register;