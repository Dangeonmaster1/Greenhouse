import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm({ isLoginMode = false }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLoginMode
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка');
            }

            if (isLoginMode) {
                localStorage.setItem('token', data.token);
                setMessage('✅ Вход выполнен!');
                setTimeout(() => navigate('/dashboard'), 1000);
            } else {
                setMessage('✅ Регистрация успешна!');
                setTimeout(() => navigate('/login'), 1000);
            }

            setError('');

        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Логин:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%' }}>
                    {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
                </button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default RegisterForm;