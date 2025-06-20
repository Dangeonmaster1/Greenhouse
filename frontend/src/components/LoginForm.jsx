import React, { useState } from 'react';

function LoginForm() {
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

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            localStorage.setItem('token', data.token);
            setMessage('✅ Вход выполнен успешно!');
            setError('');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);

        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            {/* <h2>Вход</h2> */}
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
                <button type="submit" style={{ width: '100%' }}>Войти</button>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p><a href="/register">Нет аккаунта? Зарегистрируйтесь</a></p>
            </form>
        </div>
    );
}

export default LoginForm;